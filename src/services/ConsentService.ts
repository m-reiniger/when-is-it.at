export interface ConsentPreferences {
    analytics: boolean;
    ads: boolean;
    timestamp: number;
}

export class ConsentService {
    private static readonly CONSENT_KEY = 'when-is-it-consent';
    private static readonly CONSENT_VERSION = '1.0';

    private static consent: ConsentPreferences | null = null;
    private static listeners: Array<(consent: ConsentPreferences | null) => void> = [];

    /**
     * Initialize consent service and load existing consent from localStorage
     */
    static initialize(): void {
        this.loadConsent();
    }

    /**
     * Check if user has given consent for analytics
     */
    static hasAnalyticsConsent(): boolean {
        return this.consent?.analytics ?? false;
    }

    /**
     * Check if user has given consent for ads
     */
    static hasAdsConsent(): boolean {
        return this.consent?.ads ?? false;
    }

    /**
     * Check if user has made any consent decision
     */
    static hasConsentDecision(): boolean {
        return this.consent !== null;
    }

    /**
     * Get current consent preferences
     */
    static getConsent(): ConsentPreferences | null {
        return this.consent;
    }

    /**
     * Set consent preferences
     */
    static setConsent(preferences: Partial<ConsentPreferences>): void {
        this.consent = {
            analytics: preferences.analytics ?? false,
            ads: preferences.ads ?? false,
            timestamp: Date.now(),
        };

        this.saveConsent();
        this.initializeTracking();
        this.notifyListeners();
    }

    /**
     * Accept all consent options
     */
    static acceptAll(): void {
        this.setConsent({
            analytics: true,
            ads: true,
        });
    }

    /**
     * Decline all consent options
     */
    static declineAll(): void {
        this.setConsent({
            analytics: false,
            ads: false,
        });
    }

    /**
     * Reset consent (for testing or user request)
     */
    static resetConsent(): void {
        this.consent = null;
        localStorage.removeItem(this.CONSENT_KEY);
        this.notifyListeners();
    }

    /**
     * Subscribe to consent changes
     */
    static onConsentChange(callback: (consent: ConsentPreferences | null) => void): () => void {
        this.listeners.push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Load consent from localStorage
     */
    private static loadConsent(): void {
        try {
            const stored = localStorage.getItem(this.CONSENT_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Check if consent is not too old (optional: 1 year expiry)
                const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
                if (parsed.timestamp > oneYearAgo) {
                    this.consent = parsed;
                } else {
                    // Consent expired, remove it
                    localStorage.removeItem(this.CONSENT_KEY);
                }
            }
        } catch (error) {
            console.warn('Failed to load consent preferences:', error);
            localStorage.removeItem(this.CONSENT_KEY);
        }
    }

    /**
     * Save consent to localStorage
     */
    private static saveConsent(): void {
        try {
            if (this.consent) {
                localStorage.setItem(this.CONSENT_KEY, JSON.stringify(this.consent));
            }
        } catch (error) {
            console.warn('Failed to save consent preferences:', error);
        }
    }

    /**
     * Initialize tracking services based on consent
     */
    private static initializeTracking(): void {
        if (!this.consent) return;

        // Initialize Google Analytics if consent is given
        if (
            this.consent.analytics &&
            typeof window !== 'undefined' &&
            'initializeGoogleAnalytics' in window
        ) {
            (window as { initializeGoogleAnalytics: () => void }).initializeGoogleAnalytics();
        }

        // Initialize Google Ads if consent is given
        if (this.consent.ads && typeof window !== 'undefined' && 'initializeGoogleAds' in window) {
            (window as { initializeGoogleAds: () => void }).initializeGoogleAds();
        }
    }

    /**
     * Notify all listeners of consent changes
     */
    private static notifyListeners(): void {
        this.listeners.forEach((callback) => {
            try {
                callback(this.consent);
            } catch (error) {
                console.warn('Error in consent listener:', error);
            }
        });
    }
}
