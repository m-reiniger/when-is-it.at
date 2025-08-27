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

// Update time every second
window.setInterval(() => {
    now.value = new Date();
}, 1000);
</script>

<template>
    <h1 class="event-name pico-color-pink-500">{{ props.event.n }}</h1>
    <p v-if="inFuture">starts</p>
    <p v-else>started</p>
    <article>
        <small class="highlight">
            <span v-if="inFuture">in</span> {{ relativeDifferenceDate }}
        </small>
        <p class="event-time highlight large">{{ relativeDifferenceTime }}</p>
        <small class="highlight" v-if="!inFuture">ago</small>
    </article>
    <p class="devider">-OR-</p>
    <article>
        <p class="event-time">{{ localDateTime }}</p>
        <small
            >in your time zone <span class="bold">{{ currentTimeZoneName }}</span
            >.</small
        >
    </article>
    <p class="devider">-OR-</p>
    <article>
        <p class="event-time">{{ origTZDateTime }}</p>
        <small
            >in the original time zone <span class="bold">{{ originalTimeZone }}</span
            >.</small
        >
    </article>
    <p class="devider">-OR-</p>
    <article>
        <details>
            <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;More Numbers</summary>

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
        </details>
    </article>
    <p class="hide">{{ JSON.stringify(props.event, null, 4) }}</p>
</template>

<style scoped>
* {
    text-align: center;
}

.event-name {
    color: #785800;
}
.event-time {
    margin: 0;
    font-weight: bold;
    color: #785800;
}
.highlight {
    color: #ffbf00;
}
.bold {
    font-weight: bold;
}
.large {
    font-size: 2rem;
}
.devider {
    font-weight: bold;
    font-size: 0.75rem;
    color: #fff;
}

ul.more-numbers {
    margin-top: 1rem;
    display: flex;
    flex-direction: column-reverse;
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
