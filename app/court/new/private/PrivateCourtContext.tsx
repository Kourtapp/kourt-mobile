import React, { createContext, useContext, useState, ReactNode } from 'react';

import { courtService } from '../../../../services/courtService';
import { ImageService } from '../../../../services/imageService';
import { supabase } from '../../../../services/supabase';
import { useRouter } from 'expo-router';

export type PrivateCourtData = {
    // Step 1: Privacy Type (Condo vs House)
    privacyType: 'condo' | 'house' | null;
    // Court Category: residential, arena, condo
    courtCategory: 'residential' | 'arena' | 'condo' | null;

    // Step 2: Information
    name: string; // e.g., "Quadra do Condomínio X"
    accessCode?: string; // Optional invite code

    // Step 3: Location
    address: string;
    number: string;
    cep: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;

    // Step 4: Amenities
    amenities: string[];

    // Step 5: Photos
    photos: string[];

    // Step 2.5: Structure (New)
    capacity: number;
    courtCount: number;
    benches: number;
    restrooms: number;

    // Step 6: Description
    highlights: string[];
    description: string;

    // Step 7: Pricing & Settings
    reservationType: 'approve_first_5' | 'instant';
    firstGuestType: 'any' | 'experienced';
    priceWeekday: number;
    weekendIncreasePercent: number; // 0-100
    discounts: {
        newListing: boolean;
        lastMinute: boolean;
        weekly: boolean;
        monthly: boolean;
    };

    // Step 8: Documents
    cpf: string;
    documentPhoto: string | null;

    // Step 9: Safety & Host Info
    safety: {
        camera: boolean;
        noiseMonitor: boolean;
        weapons: boolean;
    };
    hostAddress: {
        country: string;
        address: string;
        apt: string;
        neighborhood: string;
        city: string;
        state: string;
        cep: string;
    };
    isCompany: boolean | null;
};

const defaultData: PrivateCourtData = {
    privacyType: null,
    courtCategory: null,
    name: '',
    address: '',
    number: '',
    cep: '',
    city: '',
    state: '',
    latitude: undefined,
    longitude: undefined,
    amenities: [],
    photos: [],
    highlights: [],
    capacity: 1,
    courtCount: 1,
    benches: 0,
    restrooms: 0,
    description: '',
    reservationType: 'approve_first_5',
    firstGuestType: 'any',
    priceWeekday: 180,
    weekendIncreasePercent: 10,
    discounts: {
        newListing: true,
        lastMinute: false,
        weekly: false,
        monthly: false,
    },
    cpf: '',
    documentPhoto: null,
    safety: {
        camera: false,
        noiseMonitor: false,
        weapons: false,
    },
    hostAddress: {
        country: 'Brasil',
        address: '',
        apt: '',
        neighborhood: '',
        city: '',
        state: '',
        cep: '',
    },
    isCompany: null,
};

type PrivateCourtContextType = {
    data: PrivateCourtData;
    updateData: (updates: Partial<PrivateCourtData>) => void;
    submitCourt: () => Promise<void>;
};

const PrivateCourtContext = createContext<PrivateCourtContextType | undefined>(undefined);

// ... (existing types)

export function PrivateCourtProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<PrivateCourtData>(defaultData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();

    const updateData = (updates: Partial<PrivateCourtData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const uploadPhotos = async (photos: string[]) => {
        const uploadedUrls: string[] = [];
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Usuario não autenticado');

        for (const uri of photos) {
            try {
                // 1. Process image (compress/resize)
                const processed = await ImageService.processForUpload(uri);

                // 2. Create unique path
                const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

                // 3. Create blob from URI
                const response = await fetch(processed.uri);
                const blob = await response.blob();

                // 4. Upload to Supabase Storage
                const { error } = await supabase
                    .storage
                    .from('courts')
                    .upload(filename, blob, {
                        contentType: 'image/webp',
                        upsert: false
                    });

                if (error) throw error;

                // 5. Get Public URL
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('courts')
                    .getPublicUrl(filename);

                uploadedUrls.push(publicUrl);
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error);
                // Continue uploading others or throw? Lets continue specifically for this MVP
            }
        }
        return uploadedUrls;
    };

    const submitCourt = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        console.log("Iniciando envio da quadra...", data);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario não logado');

            // 1. Upload Photos first
            const uploadedImages = await uploadPhotos(data.photos);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _uploadedDocument = data.documentPhoto ? (await uploadPhotos([data.documentPhoto]))[0] : null;

            // 2. Prepare DB Payload
            // Mapping PrivateCourtData to Database 'courts' table
            // Note: Some fields might need casting or might be missing in DB schema.
            // We map what we can.
            const dbPayload = {
                name: data.name,
                description: data.description,
                address: data.address, // Full address line
                city: data.city,
                state: data.state,
                country: 'Brasil', // Default
                sport: 'tennis', // Default or need to add to context
                type: 'private',

                // Structure
                amenities: data.amenities,
                images: uploadedImages,
                cover_image: uploadedImages[0] || null,

                // Location (Supabase expects standard columns, we might need a stored proc for PostGIS 'location' column if used)
                latitude: data.latitude,
                longitude: data.longitude,

                // Pricing
                price_per_hour: data.priceWeekday,
                weekend_price_per_hour: Math.round(data.priceWeekday * (1 + data.weekendIncreasePercent / 100)),

                // Meta
                owner_id: user.id,
                is_active: true, // Auto-activate for now? Or false for approval
                is_verified: false,

                // Fields that don't map directly to 'courts' table might be stored in a separate 'court_details' table or JSONB
                // For this MVP, we ignore what doesn't fit or assumes schema update.
            };

            console.log("Enviando para o banco:", dbPayload);

            // 3. Call Service
            await courtService.createCourt(dbPayload);

            console.log("Quadra criada com sucesso!");

            // 4. Reset & Redirect
            setData(defaultData); // Clear form
            // router.replace('/court/success'); // Or similar
            alert('Quadra publicada com sucesso!');

        } catch (error) {
            console.error('Erro ao publicar quadra:', error);
            alert('Erro ao publicar quadra. Verifique sua conexão e tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PrivateCourtContext.Provider value={{ data, updateData, submitCourt }}>
            {children}
        </PrivateCourtContext.Provider>
    );
}
export default PrivateCourtProvider;

export function usePrivateCourt() {
    const context = useContext(PrivateCourtContext);
    if (context === undefined) {
        throw new Error('usePrivateCourt must be used within a PrivateCourtProvider');
    }
    return context;
}
