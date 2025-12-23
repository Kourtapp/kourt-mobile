import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';

export type PublicCourtData = {
    // Step 1: Location Permission (Permissions handled by OS)
    // Step 2: Location Verification (Assuming verified boolean or address)
    // Step 2: Location Verification
    address?: string; // Full address string

    // Step 3: Basic Info
    name: string;
    sports: string[]; // Changed from 'type'
    quantity: number;
    floorTypes: string[]; // Changed from single string

    // Step 4: Details
    lighting: string | null;
    cover: string | null;
    access: string | null;
    amenities: string[];

    // Step 5: Location Pin & Address Details
    latitude?: number;
    longitude?: number;
    cep?: string;
    number?: string;
    district?: string;
    city?: string;
    state?: string;
    reference?: string;

    // Step 7 & 8: Photos
    mandatoryPhotos: {
        general?: string;
        net?: string;
        floor?: string;
    };
    optionalPhotos: Record<string, string>; // Changed to Record for easier management
};

type PublicCourtContextType = {
    data: PublicCourtData;
    updateData: (updates: Partial<PublicCourtData>) => void;
    submitCourt: () => Promise<{ success: boolean; courtId?: string; error?: string }>;
    isSubmitting: boolean;
};

const defaultData: PublicCourtData = {
    name: '',
    sports: [],
    quantity: 1,
    floorTypes: [],
    lighting: null,
    cover: null,
    access: null,
    amenities: [],
    mandatoryPhotos: {},
    optionalPhotos: {},
};

const PublicCourtContext = createContext<PublicCourtContextType | undefined>(undefined);

// Helper to upload image from local URI
async function uploadCourtImage(localUri: string, courtId: string, imageType: string): Promise<string | null> {
    try {
        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(localUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Get file extension
        const extension = localUri.split('.').pop() || 'jpg';
        const fileName = `${courtId}/${imageType}_${Date.now()}.${extension}`;

        // Convert base64 to blob
        const response = await fetch(`data:image/${extension};base64,${base64}`);
        const blob = await response.blob();

        // Upload to Supabase storage
        const result = await uploadFile('court-images', fileName, blob, { upsert: true });
        return result.publicUrl;
    } catch (error) {
        console.error(`[uploadCourtImage] Error uploading ${imageType}:`, error);
        return null;
    }
}

export function PublicCourtProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<PublicCourtData>(defaultData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateData = (updates: Partial<PublicCourtData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const submitCourt = async (): Promise<{ success: boolean; courtId?: string; error?: string }> => {
        setIsSubmitting(true);

        try {
            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return { success: false, error: 'Você precisa estar logado para cadastrar uma quadra' };
            }

            // Validate required fields
            if (!data.name || !data.city || !data.address) {
                return { success: false, error: 'Preencha todos os campos obrigatórios' };
            }

            // Create court first to get ID for image uploads
            const courtInsert = {
                name: data.name,
                address: data.address || '',
                city: data.city || '',
                state: data.state,
                neighborhood: data.district,
                latitude: data.latitude,
                longitude: data.longitude,
                sport: data.sports[0] || 'Beach Tennis', // Primary sport
                sports: data.sports,
                amenities: data.amenities,
                type: 'public',
                is_free: true,
                is_active: false, // Pending review
                is_verified: false,
                created_by: user.id,
                description: data.reference ? `Referência: ${data.reference}` : null,
            };

            const { data: court, error: insertError } = (await supabase
                .from('courts')
                .insert(courtInsert as any)
                .select()
                .single()) as any;

            if (insertError) {
                console.error('[submitCourt] Insert error:', insertError);
                return { success: false, error: 'Erro ao cadastrar quadra. Tente novamente.' };
            }

            // Upload images
            const imageUrls: string[] = [];

            // Upload mandatory photos
            if (data.mandatoryPhotos.general) {
                const url = await uploadCourtImage(data.mandatoryPhotos.general, court.id, 'general');
                if (url) imageUrls.push(url);
            }
            if (data.mandatoryPhotos.net) {
                const url = await uploadCourtImage(data.mandatoryPhotos.net, court.id, 'net');
                if (url) imageUrls.push(url);
            }
            if (data.mandatoryPhotos.floor) {
                const url = await uploadCourtImage(data.mandatoryPhotos.floor, court.id, 'floor');
                if (url) imageUrls.push(url);
            }

            // Upload optional photos
            for (const [key, uri] of Object.entries(data.optionalPhotos)) {
                if (uri) {
                    const url = await uploadCourtImage(uri, court.id, key);
                    if (url) imageUrls.push(url);
                }
            }

            // Update court with image URLs
            if (imageUrls.length > 0) {
                await ((supabase
                    .from('courts') as any)
                    .update({
                        images: imageUrls,
                        cover_image: imageUrls[0],
                    })
                    .eq('id', court.id));
            }

            // Also create a contribution record for gamification
            try {
                await supabase
                    .from('community_contributions')
                    .insert({
                        user_id: user.id,
                        court_id: court.id,
                        contribution_type: 'court_submission',
                        status: 'pending',
                    } as any);
            } catch {
                // Ignore if table doesn't exist
            }

            return { success: true, courtId: court.id };
        } catch (error: any) {
            console.error('[submitCourt] Error:', error);
            return { success: false, error: error.message || 'Erro inesperado' };
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PublicCourtContext.Provider value={{ data, updateData, submitCourt, isSubmitting }}>
            {children}
        </PublicCourtContext.Provider>
    );
}
export default PublicCourtProvider;

export function usePublicCourt() {
    const context = useContext(PublicCourtContext);
    if (context === undefined) {
        throw new Error('usePublicCourt must be used within a PublicCourtProvider');
    }
    return context;
}
