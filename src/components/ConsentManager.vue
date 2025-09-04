<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ConsentService, type ConsentPreferences } from '../services/ConsentService';

const showManager = ref(false);
const analyticsConsent = ref(false);
const adsConsent = ref(false);

let unsubscribe: (() => void) | null = null;

onMounted(() => {
    // Load current consent preferences
    const consent = ConsentService.getConsent();
    if (consent) {
        analyticsConsent.value = consent.analytics;
        adsConsent.value = consent.ads;
    }

    // Subscribe to consent changes
    unsubscribe = ConsentService.onConsentChange((consent: ConsentPreferences | null) => {
        if (consent) {
            analyticsConsent.value = consent.analytics;
            adsConsent.value = consent.ads;
        }
    });
});

onUnmounted(() => {
    if (unsubscribe) {
        unsubscribe();
    }
});

const openManager = () => {
    showManager.value = true;
};

const closeManager = () => {
    showManager.value = false;
};

const savePreferences = () => {
    ConsentService.setConsent({
        analytics: analyticsConsent.value,
        ads: adsConsent.value,
    });
    showManager.value = false;
};

const resetConsent = () => {
    if (
        confirm(
            'Are you sure you want to reset your consent preferences? This will show the consent banner again.',
        )
    ) {
        ConsentService.resetConsent();
        analyticsConsent.value = false;
        adsConsent.value = false;
        showManager.value = false;
    }
};
</script>

<template>
    <footer class="container">
        <small class="trademark">&#169; 2025 Codewald</small>
        <!-- Trigger button -->
        <button
            type="button"
            class="consent-manager-trigger"
            @click="openManager"
            title="Manage cookie preferences">
            🍪 Cookie Settings
        </button>

        <small><a href="/privacy">Privacy Policy</a></small>

        <!-- Modal overlay -->
        <div v-if="showManager" class="consent-manager-overlay" @click="closeManager">
            <div class="consent-manager-modal" @click.stop>
                <div class="consent-manager-header">
                    <h3>Cookie & Privacy Settings</h3>
                    <button
                        type="button"
                        class="close-button"
                        @click="closeManager"
                        aria-label="Close">
                        ×
                    </button>
                </div>

                <div class="consent-manager-content">
                    <p>
                        Manage your cookie preferences for this website. You can enable or disable
                        different types of cookies below.
                    </p>

                    <div class="consent-options">
                        <div class="consent-option">
                            <label class="consent-checkbox">
                                <input type="checkbox" v-model="analyticsConsent" />
                                <span class="checkmark"></span>
                                <div class="consent-text">
                                    <strong>Analytics Cookies</strong>
                                    <small
                                        >Help us understand how visitors interact with our website
                                        by collecting and reporting information anonymously.</small
                                    >
                                </div>
                            </label>
                        </div>

                        <div class="consent-option">
                            <label class="consent-checkbox">
                                <input type="checkbox" v-model="adsConsent" />
                                <span class="checkmark"></span>
                                <div class="consent-text">
                                    <strong>Advertising Cookies</strong>
                                    <small
                                        >Used to show you relevant advertisements and measure the
                                        effectiveness of our advertising campaigns.</small
                                    >
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="consent-manager-actions">
                    <button type="button" class="secondary" @click="resetConsent">
                        Reset Preferences
                    </button>
                    <button type="button" class="secondary" @click="closeManager">Cancel</button>
                    <button type="button" @click="savePreferences">Save Preferences</button>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.trademark {
    margin-right: 1rem;
    font-size: 0.8rem;
    color: var(--pico-muted-color);
}

.consent-manager-trigger {
    background: none;
    border: none;
    color: var(--pico-muted-color);
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    margin: 0;
    margin-right: 1rem;
}

.consent-manager-trigger:hover {
    color: var(--pico-color);
}

.consent-manager-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
}

.consent-manager-modal {
    background: var(--pico-background-color);
    border: 1px solid var(--pico-muted-border-color);
    border-radius: var(--pico-border-radius);
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.consent-manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--pico-muted-border-color);
}

.consent-manager-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--pico-muted-color);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-button:hover {
    color: var(--pico-color);
}

.consent-manager-content {
    padding: 1rem;
}

.consent-manager-content p {
    margin: 0 0 1rem 0;
    color: var(--pico-muted-color);
    font-size: 0.9rem;
    line-height: 1.4;
}

.consent-options {
    margin: 1rem 0;
}

.consent-option {
    margin-bottom: 1rem;
}

.consent-option:last-child {
    margin-bottom: 0;
}

.consent-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--pico-border-radius);
    transition: background-color 0.2s ease;
}

.consent-checkbox:hover {
    background: var(--pico-muted-border-color);
}

.consent-checkbox input[type='checkbox'] {
    margin: 0;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 2px;
}

.consent-text {
    flex: 1;
}

.consent-text strong {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--pico-color);
}

.consent-text small {
    color: var(--pico-muted-color);
    line-height: 1.3;
}

.consent-manager-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding: 1rem;
    border-top: 1px solid var(--pico-muted-border-color);
}

.consent-manager-actions button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    min-width: auto;
}

.consent-manager-actions button:last-child {
    background: var(--pico-primary);
    color: var(--pico-primary-inverse);
}

.consent-manager-actions button:last-child:hover {
    background: var(--pico-primary-hover);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .consent-manager-overlay {
        padding: 0.5rem;
    }

    .consent-manager-actions {
        flex-direction: column;
    }

    .consent-manager-actions button {
        width: 100%;
    }
}
</style>
