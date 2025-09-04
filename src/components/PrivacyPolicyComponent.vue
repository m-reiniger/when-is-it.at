<script setup lang="ts">
import { onMounted } from 'vue';
import { SeoService } from '../services/SeoService';

onMounted(() => {
    SeoService.initializeSeo('/privacy');
});
</script>

<template>
    <div class="privacy-policy">
        <h1>Privacy Policy</h1>

        <p><strong>Last updated:</strong> January 2025</p>

        <h2>What We Collect</h2>
        <p>We collect minimal data to provide our timezone conversion service:</p>
        <ul>
            <li>
                <strong>Event data:</strong> Event names, dates, and times you create (stored
                locally in your browser)
            </li>
            <li>
                <strong>Usage analytics:</strong> Basic website usage statistics (only if you
                consent)
            </li>
            <li>
                <strong>Cookies:</strong> Essential cookies for functionality and optional
                analytics/advertising cookies
            </li>
        </ul>

        <h2>How We Use Your Data</h2>
        <ul>
            <li>Provide timezone conversion services</li>
            <li>Improve website performance and user experience</li>
            <li>Show relevant advertisements (only with your consent)</li>
        </ul>

        <h2>Data Storage</h2>
        <p>
            Your event data is stored locally in your browser and is not sent to our servers.
            Analytics data (if consented) is processed by Google Analytics.
        </p>

        <h2>Your Rights</h2>
        <p>You can:</p>
        <ul>
            <li>Manage your cookie preferences anytime using the "Cookie Settings" link</li>
            <li>Clear your browser data to remove stored events</li>
            <li>Opt out of analytics and advertising cookies</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>
            We use Google Analytics and Google Ads (with your consent) to understand usage and show
            relevant ads. These services have their own privacy policies.
        </p>

        <h2>Contact</h2>
        <p>
            If you have questions about this privacy policy, please contact us at
            <a href="mailto:privacy@when-is-it.at">privacy@when-is-it.at</a>
        </p>

        <div class="back-link">
            <a href="/">← Back to Home</a>
        </div>
    </div>
</template>

<style scoped>
.privacy-policy {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
    line-height: 1.6;
}

.privacy-policy h1 {
    color: var(--pico-primary);
    margin-bottom: 1rem;
    text-align: center;
}

.privacy-policy h2 {
    color: var(--pico-color);
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.privacy-policy p {
    margin-bottom: 1rem;
    color: var(--pico-muted-color);
}

.privacy-policy ul {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
}

.privacy-policy li {
    margin-bottom: 0.5rem;
    color: var(--pico-muted-color);
}

.privacy-policy strong {
    color: var(--pico-color);
}

.privacy-policy a {
    color: var(--pico-primary);
    text-decoration: underline;
}

.privacy-policy a:hover {
    color: var(--pico-primary-hover);
}

.back-link {
    margin-top: 3rem;
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid var(--pico-muted-border-color);
}

.back-link a {
    font-weight: 500;
    text-decoration: none;
    color: var(--pico-primary);
    padding: 0.5rem 1rem;
    border: 1px solid var(--pico-primary);
    border-radius: var(--pico-border-radius);
    transition: all 0.2s ease;
}

.back-link a:hover {
    background: var(--pico-primary);
    color: var(--pico-primary-inverse);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .privacy-policy {
        padding: 1rem 0.5rem;
    }

    .privacy-policy h1 {
        font-size: 1.5rem;
    }

    .privacy-policy h2 {
        font-size: 1.1rem;
    }
}
</style>
