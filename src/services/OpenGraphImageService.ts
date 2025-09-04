import type { EventDetails } from '@/types';
import { DynamicImageGenerator } from './DynamicImageGenerator';

export class OpenGraphImageService {
    private static readonly BASE_URL = 'https://when-is-it.at';

    /**
     * Generate a dynamic Open Graph image URL for an event
     */
    static generateEventImageUrl(event: EventDetails): string {
        // Use the dynamic image generator to create a data URL
        return DynamicImageGenerator.generateEventImageDataURL(event);
    }

    /**
     * Generate Open Graph image URL for home page
     */
    static generateHomeImageUrl(): string {
        return DynamicImageGenerator.generateHomeImageDataURL();
    }

    /**
     * Generate Open Graph image URL for add event page
     */
    static generateAddEventImageUrl(): string {
        return DynamicImageGenerator.generateHomeImageDataURL(); // Use home image for now
    }

    /**
     * Create a canvas-based dynamic image (for future implementation)
     */
    static async generateDynamicImage(event: EventDetails): Promise<string> {
        // This would be implemented with HTML5 Canvas or a server-side image generator
        // For now, return the default image
        return this.generateEventImageUrl(event);
    }
}
