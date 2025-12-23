import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import { gamificationService } from '@/services/gamificationService';

export type PostMatchData = {
    // Step 1: Photos
    photos: string[];
    hasWatermark: boolean;

    // Step 2: Sport & Location
    sport: string;
    courtId?: string;
    courtName?: string;
    date: Date;
    startTime: string;
    duration: string; // '30min', '1h', '1h30', '2h'

    // Step 3: Result
    result: 'win' | 'loss' | 'draw';
    sets: { myScore: number; oppScore: number }[];
    teammates: string[]; // user IDs
    opponents: string[]; // user IDs

    // Step 4: Metrics
    intensity: number; // 1-5
    effort: number; // 1-5
    mood: 'sad' | 'neutral' | 'happy' | 'star';
    aces: number;
    errors: number;
    notes: string;

    // Watch data (optional)
    watchData?: {
        avgHeartRate: number;
        calories: number;
        distance: number;
    };
};

const defaultData: PostMatchData = {
    photos: [],
    hasWatermark: true,
    sport: 'beachtennis',
    date: new Date(),
    startTime: '18:00',
    duration: '1h',
    result: 'win',
    sets: [{ myScore: 6, oppScore: 4 }],
    teammates: [],
    opponents: [],
    intensity: 3,
    effort: 4,
    mood: 'happy',
    aces: 0,
    errors: 0,
    notes: '',
};

type PostMatchContextType = {
    data: PostMatchData;
    updateData: (updates: Partial<PostMatchData>) => void;
    submitMatch: () => Promise<{ success: boolean; matchId?: string; error?: string }>;
    isSubmitting: boolean;
    resetData: () => void;
};

const PostMatchContext = createContext<PostMatchContextType | undefined>(undefined);

async function uploadMatchPhoto(localUri: string, matchId: string, index: number): Promise<string | null> {
    try {
        const base64 = await FileSystem.readAsStringAsync(localUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const extension = localUri.split('.').pop() || 'jpg';
        const fileName = `matches/${matchId}/photo_${index}_${Date.now()}.${extension}`;

        const response = await fetch(`data:image/${extension};base64,${base64}`);
        const blob = await response.blob();

        const { error } = await supabase.storage
            .from('match-images')
            .upload(fileName, blob, { upsert: true });

        if (error) {
            console.error('[uploadMatchPhoto] Error:', error);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from('match-images')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (error) {
        console.error('[uploadMatchPhoto] Exception:', error);
        return null;
    }
}

export function PostMatchProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<PostMatchData>(defaultData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateData = (updates: Partial<PostMatchData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const resetData = () => {
        setData(defaultData);
    };

    const submitMatch = async (): Promise<{ success: boolean; matchId?: string; error?: string }> => {
        setIsSubmitting(true);

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return { success: false, error: 'Você precisa estar logado' };
            }

            // Calculate total score
            const myTotal = data.sets.reduce((sum, set) => sum + set.myScore, 0);
            const oppTotal = data.sets.reduce((sum, set) => sum + set.oppScore, 0);

            // Create match record
            const matchInsert = {
                created_by: user.id,
                sport: data.sport,
                court_id: data.courtId || null,
                match_date: data.date.toISOString().split('T')[0],
                start_time: data.startTime,
                duration_minutes: data.duration === '30min' ? 30 :
                                  data.duration === '1h' ? 60 :
                                  data.duration === '1h30' ? 90 : 120,
                result: data.result,
                my_score: myTotal,
                opponent_score: oppTotal,
                sets_data: data.sets,
                intensity: data.intensity,
                effort: data.effort,
                mood: data.mood,
                aces: data.aces,
                unforced_errors: data.errors,
                notes: data.notes || null,
                watch_data: data.watchData || null,
                status: 'completed',
            };

            const { data: match, error: insertError } = await supabase
                .from('matches')
                .insert(matchInsert as any)
                .select()
                .single();

            if (insertError) {
                console.error('[submitMatch] Insert error:', insertError);
                return { success: false, error: 'Erro ao registrar partida' };
            }

            // Upload photos
            if (data.photos.length > 0) {
                const photoUrls: string[] = [];
                for (let i = 0; i < data.photos.length; i++) {
                    const url = await uploadMatchPhoto(data.photos[i], match.id, i);
                    if (url) photoUrls.push(url);
                }

                if (photoUrls.length > 0) {
                    await supabase
                        .from('matches')
                        .update({ images: photoUrls } as any)
                        .eq('id', match.id);
                }
            }

            // Add match players
            const players = [
                { match_id: match.id, user_id: user.id, team: 'home', is_creator: true },
                ...data.teammates.map(id => ({ match_id: match.id, user_id: id, team: 'home', is_creator: false })),
                ...data.opponents.map(id => ({ match_id: match.id, user_id: id, team: 'away', is_creator: false })),
            ];

            if (players.length > 1) {
                await supabase
                    .from('match_players')
                    .insert(players as any);
            }

            // Award XP (gamification)
            try {
                await gamificationService.onMatchRegistered({ match_id: match.id });
                await gamificationService.onMatchCompleted(data.result);
            } catch (xpError) {
                // Ignore XP errors - don't fail the match registration
                console.log('[submitMatch] XP award failed:', xpError);
            }

            return { success: true, matchId: match.id };
        } catch (error: any) {
            console.error('[submitMatch] Error:', error);
            return { success: false, error: error.message || 'Erro inesperado' };
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PostMatchContext.Provider value={{ data, updateData, submitMatch, isSubmitting, resetData }}>
            {children}
        </PostMatchContext.Provider>
    );
}

export function usePostMatch() {
    const context = useContext(PostMatchContext);
    if (context === undefined) {
        throw new Error('usePostMatch must be used within a PostMatchProvider');
    }
    return context;
}
