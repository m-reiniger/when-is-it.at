<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ConsentService, type ConsentPreferences } from '../services/ConsentService';

const showBanner = ref(false);
const showDetails = ref(false);
const analyticsConsent = ref(false);
const adsConsent = ref(false);

let unsubscribe: (() => void) | null = null;

onMounted(() => {
    // Initialize the consent service first
    ConsentService.initialize();

    // Check if user has already made a consent decision
    if (!ConsentService.hasConsentDecision()) {
        showBanner.value = true;
    }

    // Subscribe to consent changes
    unsubscribe = ConsentService.onConsentChange((consent: ConsentPreferences | null) => {
        if (consent) {
            showBanner.value = false;
        }
    });
});

onUnmounted(() => {
    if (unsubscribe) {
        unsubscribe();
    }
});

const acceptAll = () => {
    ConsentService.acceptAll();
    showBanner.value = false;
};

const acceptSelected = () => {
    ConsentService.setConsent({
        analytics: analyticsConsent.value,
        ads: adsConsent.value,
    });
    showBanner.value = false;
};

const declineAll = () => {
    ConsentService.declineAll();
    showBanner.value = false;
};

const toggleDetails = () => {
    showDetails.value = !showDetails.value;
};
</script>

<template>
    <div v-if="showBanner" class="consent-banner">
        <div class="consent-content">
            <div class="consent-header">
                <h3>🍪 Cookie & Privacy Consent</h3>
                <p>
                    We use cookies and similar technologies to improve your experience on our site,
                    analyze usage, and show you relevant ads. You can choose which types of cookies
                    to allow.
                    <br />
                    <a href="/privacy" target="_blank" rel="noopener noreferrer"
                        >Learn more in our Privacy Policy</a
                    >
                </p>
            </div>

            <div v-if="showDetails" class="consent-details">
                <div class="consent-option">
                    <label class="consent-checkbox">
                        <input
                            type="checkbox"
                            v-model="analyticsConsent"
                            :checked="analyticsConsent" />
                        <span class="checkmark"></span>
                        <div class="consent-text">
                            <strong>Analytics Cookies</strong>
                            <small
                                >Help us understand how visitors interact with our website by
                                collecting and reporting information anonymously.</small
                            >
                        </div>
                    </label>
                </div>

                <div class="consent-option">
                    <label class="consent-checkbox">
                        <input type="checkbox" v-model="adsConsent" :checked="adsConsent" />
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

            <div class="consent-actions">
                <button type="button" class="secondary" @click="declineAll">Decline All</button>

                <button type="button" class="secondary" @click="toggleDetails">
                    {{ showDetails ? 'Hide Details' : 'Customize' }}
                </button>

                <button v-if="showDetails" type="button" @click="acceptSelected">
                    Accept Selected
                </button>

                <button type="button" @click="acceptAll">Accept All</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.consent-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--pico-background-color);
    border-top: 1px solid var(--pico-muted-border-color);
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 1rem;
    max-height: 80vh;
    overflow-y: auto;
}

.consent-content {
    max-width: 575px;
    margin: 0 auto;
}

.consent-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: var(--pico-color);
}

.consent-header p {
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: var(--pico-muted-color);
    line-height: 1.4;
}

.consent-header a {
    color: var(--pico-primary);
    text-decoration: underline;
}

.consent-header a:hover {
    color: var(--pico-primary-hover);
}

.consent-details {
    margin: 1rem 0;
    padding: 1rem;
    background: var(--pico-card-background-color);
    border: 1px solid var(--pico-muted-border-color);
    border-radius: var(--pico-border-radius);
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

.consent-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.consent-actions button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    min-width: auto;
}

.consent-actions button:last-child {
    background: var(--pico-primary);
    color: var(--pico-primary-inverse);
}

.consent-actions button:last-child:hover {
    background: var(--pico-primary-hover);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .consent-banner {
        padding: 0.75rem;
    }

    .consent-actions {
        flex-direction: column;
    }

    .consent-actions button {
        width: 100%;
    }

    .consent-checkbox {
        align-items: flex-start;
    }

    .consent-text {
        font-size: 0.9rem;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .consent-banner {
        background: var(--pico-background-color);
        border-top-color: var(--pico-muted-border-color);
    }

    .consent-details {
        background: var(--pico-card-background-color);
        border-color: var(--pico-muted-border-color);
    }
}
</style>
