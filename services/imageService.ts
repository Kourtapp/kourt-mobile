import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { logger } from '../utils/logger';

interface ProcessedImage {
    uri: string;
    width: number;
    height: number;
    size: number; // Approximate size in bytes
}

const MAX_DIMENSION = 1080;
const COMPRESSION_QUALITY = 0.7; // Balance between quality and size

export const ImageService = {
    /**
     * Compresses and resizes an image before upload.
     * Converts to WebP for maximum space saving.
     */
    async processForUpload(uri: string): Promise<ProcessedImage> {
        try {
            logger.log(`[ImageService] Processing ${uri}...`);

            // 1. Resize and Compress
            const result = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: MAX_DIMENSION } }], // Maintain aspect ratio
                {
                    compress: COMPRESSION_QUALITY,
                    format: ImageManipulator.SaveFormat.WEBP
                }
            );

            // 2. Get File Info (Size)
            const fileInfo = await FileSystem.getInfoAsync(result.uri);
            const size = fileInfo.exists ? fileInfo.size : 0;

            logger.log(`[ImageService] Processed: ${size} bytes (WebP)`);

            return {
                uri: result.uri,
                width: result.width,
                height: result.height,
                size: size || 0
            };
        } catch (error) {
            logger.error('[ImageService] Error processing image:', error);
            throw error;
        }
    },

    /**
     * Estimates cost savings for the Chief Financial Officer dashboard ;)
     */
    estimateSavings(originalSize: number, newSize: number) {
        const savedBytes = originalSize - newSize;
        const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);
        return { savedBytes, savedPercent };
    }
};
