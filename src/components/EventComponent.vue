<script setup lang="ts">
import { computed } from 'vue';

import type { EventDetails } from '@/types';

const props = defineProps<{
    event: EventDetails;
}>();

const now = new Date();

const originalTimeZone = props.event.otz;
const eventTime = new Date(props.event.d);
const timediff = eventTime.getTime() - now.getTime();

const currentTimeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

const yearInMs = 1000 * 60 * 60 * 24 * 365;
const monthInMs = 1000 * 60 * 60 * 24 * 30;
const dayInMs = 1000 * 60 * 60 * 24;
const hourInMs = 1000 * 60 * 60;
const minuteInMs = 1000 * 60;
const secondInMs = 1000;

const localDateTime = computed(() =>
    Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'long' }).format(eventTime),
);

const origTZDateTime = computed(() =>
    Intl.DateTimeFormat(undefined, {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: originalTimeZone,
    }).format(eventTime),
);

const relativeDifference = computed(() => {
    const yearsDiff = Math.floor(timediff / yearInMs);
    const monthsDiff = Math.floor((timediff - yearsDiff * yearInMs) / monthInMs);
    const daysDiff = Math.floor(
        (timediff - yearsDiff * yearInMs - monthsDiff * monthInMs) / dayInMs,
    );
    const hoursDiff = Math.floor(
        (timediff - yearsDiff * yearInMs - monthsDiff * monthInMs - daysDiff * dayInMs) / hourInMs,
    );
    const minutesDiff = Math.floor(
        (timediff -
            yearsDiff * yearInMs -
            monthsDiff * monthInMs -
            daysDiff * dayInMs -
            hoursDiff * hourInMs) /
            minuteInMs,
    );
    const secondsDiff = Math.floor(
        (timediff -
            yearsDiff * yearInMs -
            monthsDiff * monthInMs -
            daysDiff * dayInMs -
            hoursDiff * hourInMs -
            minutesDiff * minuteInMs) /
            secondInMs,
    );
    const duration = {
        years: yearsDiff,
        months: monthsDiff,
        days: daysDiff,
        hours: hoursDiff,
        minutes: minutesDiff,
        seconds: secondsDiff,
    };
    return new Intl.DurationFormat(undefined, { style: 'long' }).format(duration);
});

const relativeDiffParts = computed(() => {
    const years = Math.floor(timediff / yearInMs);
    const months = Math.floor(timediff / monthInMs);
    const days = Math.floor(timediff / dayInMs);
    const hours = Math.floor(timediff / hourInMs);
    const minutes = Math.floor(timediff / minuteInMs);
    const seconds = Math.floor(timediff / secondInMs);
    return { years, months, days, hours, minutes, seconds };
});
</script>

<template>
    <h1 class="event-name pico-color-pink-500">{{ props.event.n }}</h1>
    <p>will take place at</p>
    <article>
        <p class="event-time highlight">{{ localDateTime }}</p>
        <small>in your time zone ({{ currentTimeZoneName }}).</small>
    </article>
    <p class="devider">-OR-</p>
    <article>
        <p class="event-time">{{ origTZDateTime }}</p>
        <small>in the original time zone ({{ originalTimeZone }}).</small>
    </article>
    <p class="devider">-OR-</p>
    <article>
        <p class="event-time">in {{ relativeDifference }}</p>
        <small
            >That is:
            <ul>
                <li v-if="relativeDiffParts.years > 0">{{ relativeDiffParts.years }} years,</li>
                <li v-if="relativeDiffParts.months > 0">{{ relativeDiffParts.months }} months,</li>
                <li v-if="relativeDiffParts.days > 0">{{ relativeDiffParts.days }} days,</li>
                <li v-if="relativeDiffParts.hours > 0">{{ relativeDiffParts.hours }} hours,</li>
                <li v-if="relativeDiffParts.minutes > 0">
                    {{ relativeDiffParts.minutes }} minutes or
                </li>
                <li v-if="relativeDiffParts.seconds > 0">
                    {{ relativeDiffParts.seconds }} seconds
                </li>
            </ul>
        </small>
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
.devider {
    font-weight: bold;
    font-size: 0.75rem;
    color: #fff;
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
