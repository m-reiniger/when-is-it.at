<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { TimeFormatService } from '@/services/TimeFormatService';
import { SeoService } from '@/services/SeoService';
import type { EventDetails } from '@/types';
import { RoutingService } from '@/services/RoutingService';
import { AdSenseService } from '@/services/AdSenseService';

const props = defineProps<{
    event: EventDetails;
}>();

const now = ref(new Date());

const originalTimeZone = props.event.otz;
const eventTime = new Date(props.event.d);

// Computed properties that use the service
const inFuture = computed(() => TimeFormatService.isInFuture(now.value, eventTime));
const currentTimeZoneName = computed(() => TimeFormatService.getCurrentTimeZoneName());
const localDateTime = computed(() => TimeFormatService.getLocalDateTime(eventTime));
const origTZDateTime = computed(() =>
    TimeFormatService.getOriginalTimeZoneDateTime(eventTime, originalTimeZone),
);

const relativeDifferenceDate = computed(() =>
    TimeFormatService.getRelativeDateDifference(now.value, eventTime),
);

const relativeDifferenceTime = computed(() =>
    TimeFormatService.getRelativeTimeDifference(now.value, eventTime),
);

// Detailed time breakdown computed properties
const relativeTimeDiffSeconds = computed(() =>
    addSpanToWords(
        TimeFormatService.getGeneralTimeDifferenceString(now.value, eventTime, ['seconds']),
    ),
);

const relativeTimeDiffMinutes = computed(() =>
    addSpanToWords(
        TimeFormatService.getGeneralTimeDifferenceString(now.value, eventTime, [
            'minutes',
            'seconds',
        ]),
    ),
);

const relativeTimeDiffHours = computed(() =>
    addSpanToWords(
        TimeFormatService.getGeneralTimeDifferenceString(now.value, eventTime, [
            'hours',
            'minutes',
            'seconds',
        ]),
    ),
);

const relativeTimeDiffDays = computed(() =>
    addSpanToWords(
        TimeFormatService.getGeneralTimeDifferenceString(now.value, eventTime, [
            'days',
            'hours',
            'minutes',
            'seconds',
        ]),
    ),
);

const relativeTimeDiffWeeks = computed(() =>
    addSpanToWords(
        TimeFormatService.getGeneralTimeDifferenceString(now.value, eventTime, [
            'weeks',
            'days',
            'hours',
            'minutes',
            'seconds',
        ]),
    ),
);

const relativeTimeDiffMonths = computed(() =>
    addSpanToWords(
        TimeFormatService.getGeneralTimeDifferenceString(now.value, eventTime, [
            'months',
            'days',
            'hours',
            'minutes',
            'seconds',
        ]),
    ),
);

const relativeTimeDiffYears = computed(() =>
    addSpanToWords(
        TimeFormatService.getGeneralTimeDifferenceString(now.value, eventTime, [
            'years',
            'months',
            'days',
            'hours',
            'minutes',
            'seconds',
        ]),
    ),
);

const addSpanToWords = (words: string) => {
    if (words) {
        return `<span>${words.split(' ').join('</span> <span>')}</span>`;
    }
    return '';
};

const formatDateTimeWithLineBreaks = (dateTimeString: string) => {
    if (!dateTimeString) return '';

    const words = dateTimeString.split(' ');
    if (words.length < 4) return dateTimeString;

    // Insert line breaks after day (1st word) and year (4th word)
    const formattedWords = [];

    // First word (day of week)
    formattedWords.push(words[0]);
    formattedWords.push('<br>');

    // Second and third words (day and month)
    formattedWords.push(words[1], words[2]);

    // Fourth word (year)
    formattedWords.push(words[3]);
    formattedWords.push('<br>');

    // Remaining words (time and timezone)
    if (words.length > 4) {
        formattedWords.push(words.slice(4).join(' '));
    }

    return formattedWords.join(' ');
};

// Share functionality
const currentUrl = ref(window.location.href);
const isCopied = ref(false);

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(currentUrl.value);
        isCopied.value = true;

        // Reset the icon after 5 seconds
        setTimeout(() => {
            isCopied.value = false;
        }, 5000);
    } catch (err) {
        console.error('Failed to copy URL:', err);
    }
};

// Update time every second
window.setInterval(() => {
    now.value = new Date();
}, 1000);

onMounted(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    // Update SEO meta tags for this specific event
    SeoService.updateEventPageMeta(props.event);
    AdSenseService.showAdBanner2('ads-banner-2-container');
});
</script>

<template>
    <section class="event-header">
        <h1 class="event-name pico-color-pink-500">{{ props.event.n }}</h1>
    </section>

    <section class="main-timer">
        <article class="event-card primary" :class="{ 'in-past': !inFuture }">
            <small class="timer-label">
                <span v-if="inFuture">in</span> {{ relativeDifferenceDate }}
            </small>
            <p class="event-time large">{{ relativeDifferenceTime }}</p>
            <small v-if="!inFuture">ago</small>
        </article>
    </section>

    <section class="timezone-section">
        <article class="event-card timezone-card">
            <header>Your time zone</header>
            <p class="event-time" v-html="formatDateTimeWithLineBreaks(localDateTime)"></p>
            <footer>
                in <span class="bold bright">{{ currentTimeZoneName.replace('_', ' ') }}</span>
            </footer>
        </article>
        <article class="event-card timezone-card">
            <header>Original time zone</header>
            <p class="event-time" v-html="formatDateTimeWithLineBreaks(origTZDateTime)"></p>
            <footer>
                in <span class="bold bright">{{ originalTimeZone.replace('_', ' ') }}</span>
            </footer>
        </article>
    </section>

    <section id="ads-banner-2-container"></section>

    <section class="details-section">
        <article>
            <details>
                <summary class="details-summary">
                    <span class="summary-icon">📊</span>
                    <span class="summary-text">More Numbers</span>
                </summary>

                <div class="details-content">
                    <div class="content-header">That is in totals:</div>
                    <ul class="more-numbers">
                        <li v-if="relativeTimeDiffYears" v-html="relativeTimeDiffYears"></li>
                        <li v-if="relativeTimeDiffMonths" v-html="relativeTimeDiffMonths"></li>
                        <li v-if="relativeTimeDiffWeeks" v-html="relativeTimeDiffWeeks"></li>
                        <li v-if="relativeTimeDiffDays" v-html="relativeTimeDiffDays"></li>
                        <li v-if="relativeTimeDiffHours" v-html="relativeTimeDiffHours"></li>
                        <li v-if="relativeTimeDiffMinutes" v-html="relativeTimeDiffMinutes"></li>
                        <li v-if="relativeTimeDiffSeconds" v-html="relativeTimeDiffSeconds"></li>
                    </ul>
                </div>
            </details>
        </article>
    </section>

    <section class="share-section">
        <article>
            <header>📤 Share this event</header>
            <fieldset role="group">
                <input
                    type="text"
                    id="share-url"
                    name="share-url"
                    :value="currentUrl"
                    readonly
                    placeholder="Loading URL..." />
                <button
                    type="button"
                    class="copy-button"
                    @click="copyToClipboard"
                    :title="isCopied ? 'URL copied!' : 'Copy URL to clipboard'">
                    {{ isCopied ? '✅ Copied!' : '📋 Copy' }}
                </button>
            </fieldset>
        </article>
    </section>
    <!-- Call to Action -->
    <section class="cta" @click="RoutingService.navigateTo('/add')">
        <h3>Ready to create your own event?</h3>
        <a href="/add" class="primary outline">Create Event Now</a>
    </section>
</template>

<style scoped>
* {
    text-align: center;
}

/* Event Header Section */
.event-header {
    padding: 1rem 0;
}

.event-name {
    color: #b5932d;
    text-transform: uppercase;
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    background: rgba(139, 115, 0, 0.08);
    border: 1px solid rgba(139, 115, 0, 0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    display: inline-block;
}

/* Main Timer Section */
.main-timer article {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
}

.main-timer article::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffbf00, #ffd700, #ffbf00);
    opacity: 0.8;
}

.timer-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 0.4rem;
    display: block;
}

.event-time {
    margin: 0;
    font-weight: bold;
    color: #785800;
    font-size: 1.1rem;
}

.highlight {
    color: #ffbf00;
    font-weight: 600;
    margin-top: 0.5rem;
    display: block;
}

.bold {
    font-weight: bold;
}

.bright {
    color: var(--pico-color);
}

.large {
    font-size: 2.25rem;
    margin: 0.75rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Timezone Section */
.timezone-section {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
}

/* Responsive behavior for small screens */
@media (max-width: 480px) {
    .timezone-section {
        flex-direction: column;
        align-items: center;
    }

    .timezone-card {
        width: 100%;
    }
}

.timezone-card {
    padding: 1.25rem;
    border-radius: 8px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--pico-muted-border-color);
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    flex: 1;
    max-width: none;
}

.timezone-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

article.event-card {
    header {
        font-size: 0.9rem;
        font-weight: bold;
        color: var(--pico-muted-color);
        text-transform: uppercase;
        margin-bottom: 0.75rem;
        letter-spacing: 0.05em;
    }

    footer {
        font-size: 0.9rem;
        color: var(--pico-muted-color);
        margin-top: 0.75rem;
    }
}

article.event-card.primary {
    background: linear-gradient(135deg, var(--pico-primary) 0%, var(--pico-primary-hover) 100%);
    color: var(--pico-primary-inverse);
    border: none;
}

article.event-card.primary.in-past {
    background: linear-gradient(135deg, var(--pico-muted-color) 0%, var(--pico-primary-hover) 100%);
}

/* Details Section */
.details-section article {
    margin-bottom: 1.5rem;
}

.details-summary {
    cursor: pointer;
    padding: 0.75rem 1rem;
    background: var(--pico-muted-background);
    border-radius: 8px;
    border: 1px solid var(--pico-muted-border-color);
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
}

.details-summary:hover {
    background: var(--pico-muted-hover-background);
    border-color: var(--pico-primary);
}

.summary-icon {
    font-size: 1.1rem;
}

.summary-text {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.details-content {
    margin-top: 1.25rem;
    padding: 1.5rem;
    background: var(--pico-background-color);
    border-radius: 8px;
    border: 1px solid var(--pico-muted-border-color);
}

.content-header {
    font-size: 0.9rem;
    color: var(--pico-muted-color);
    text-align: center;
    margin-bottom: 1.25rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

ul.more-numbers {
    margin-top: 1rem;
    display: flex;
    flex-direction: column-reverse;
    gap: 0.75rem;
}

ul.more-numbers li {
    padding: 0.75rem;
    background: var(--pico-muted-background);
    border-radius: 6px;
    border: 1px solid var(--pico-muted-border-color);
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        transform 0.1s ease;
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.4;
}

ul.more-numbers li:hover {
    background: var(--pico-muted-hover-background);
    border-color: var(--pico-primary);
    transform: translateX(4px);
}

/* Share Section */
.share-section article {
    margin-bottom: 1.5rem;
}

.share-section header {
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--pico-muted-color);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    letter-spacing: 0.05em;
}

.copy-button {
    white-space: nowrap;
    transition: all 0.2s ease;
}

.copy-button:active {
    transform: scale(0.95);
}

.copy-button:hover {
    background-color: var(--pico-primary-hover);
}

ul,
li {
    list-style-type: none;
    padding: 0;
}

.hide {
    display: none;
}
</style>

<style>
ul.more-numbers li span {
    font-weight: 100;
}
ul.more-numbers li span:nth-child(2),
ul.more-numbers li span:nth-child(1) {
    font-weight: bold;
    color: #785800;
}

/* Call to Action */
.cta {
    cursor: pointer;
    text-align: center;
    padding: 2rem;
    background: var(--pico-card-background-color);
    border-radius: 8px;
    border: 1px solid var(--pico-card-border-color);
}

.cta h3 {
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.cta .primary {
    font-size: 1.1rem;
    padding: 0.75rem 2rem;
}
</style>
