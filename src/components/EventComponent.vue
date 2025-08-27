<script setup lang="ts">
import { ref, computed } from 'vue';

import { TimeFormatService } from '@/services/TimeFormatService';
import type { EventDetails } from '@/types';

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

// Update time every second
window.setInterval(() => {
    now.value = new Date();
}, 1000);
</script>

<template>
    <div class="event-header">
        <h1 class="event-name pico-color-pink-500">{{ props.event.n }}</h1>
    </div>

    <article class="event-card primary main-timer">
        <small class="timer-label">
            <span v-if="inFuture">in</span> {{ relativeDifferenceDate }}
        </small>
        <p class="event-time large">{{ relativeDifferenceTime }}</p>
        <small class="highlight" v-if="!inFuture">ago</small>
    </article>

    <div class="timezone-section">
        <article class="event-card timezone-card">
            <header>Your time zone</header>
            <p class="event-time" v-html="formatDateTimeWithLineBreaks(localDateTime)"></p>
            <footer>
                in <span class="bold bright">{{ currentTimeZoneName }}</span
                >.
            </footer>
        </article>
        <article class="event-card timezone-card">
            <header>Original time zone</header>
            <p class="event-time" v-html="formatDateTimeWithLineBreaks(origTZDateTime)"></p>
            <footer>
                in <span class="bold bright">{{ originalTimeZone }}</span
                >.
            </footer>
        </article>
    </div>

    <article class="details-section">
        <details>
            <summary class="details-summary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;More Numbers</summary>

            <div class="details-content">
                That is in totals:
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
    <p class="hide">{{ JSON.stringify(props.event, null, 4) }}</p>
</template>

<style scoped>
* {
    text-align: center;
}

/* Event Header Section */
.event-header {
    margin-bottom: 1.5rem;
    padding: 1rem 0;
}

.event-name {
    color: #785800;
    text-transform: uppercase;
    margin: 0 0 0.75rem 0;
    font-size: 1.75rem;
    letter-spacing: 0.05em;
}

/* Main Timer Section */
.main-timer {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
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

/* Details Section */
.details-section {
    margin-bottom: 1.5rem;
}

.details-summary {
    cursor: pointer;
    padding: 0.75rem;
    background: var(--pico-muted-background);
    border-radius: 6px;
    border: 1px solid var(--pico-muted-border-color);
    transition: background-color 0.2s ease;
}

.details-summary:hover {
    background: var(--pico-muted-hover-background);
}

.details-content {
    margin-top: 1.25rem;
    padding: 1.25rem;
    background: var(--pico-background-color);
    border-radius: 6px;
    border: 1px solid var(--pico-muted-border-color);
}

ul.more-numbers {
    margin-top: 1rem;
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;
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
</style>
