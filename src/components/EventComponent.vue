<script setup lang="ts">
import { computed, ref } from 'vue';

import { DateTime, type DurationUnit } from 'luxon';

import type { EventDetails } from '@/types';

const props = defineProps<{
    event: EventDetails;
}>();

const now = ref(new Date());

const originalTimeZone = props.event.otz;
const eventTime = new Date(props.event.d);

const inFuture = computed(() => eventTime.getTime() > now.value.getTime());

const currentTimeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
    const nowDateTime = DateTime.fromJSDate(now.value);
    const eventDateTime = DateTime.fromJSDate(eventTime);

    const diffDateValues = ['years', 'months', 'days'] as DurationUnit[];
    let diffDate = inFuture.value
        ? eventDateTime.diff(nowDateTime, diffDateValues)
        : nowDateTime.diff(eventDateTime, diffDateValues);
    diffDate = diffDate.set({ day: Math.floor(diffDate.get('day')) });

    const diffTimeValues = [
        'years',
        'months',
        'days',
        'hours',
        'minutes',
        'seconds',
    ] as DurationUnit[];
    let diffTime = inFuture.value
        ? eventDateTime.diff(nowDateTime, diffTimeValues)
        : nowDateTime.diff(eventDateTime, diffTimeValues);
    diffTime = diffTime.set({ second: Math.floor(diffTime.get('second')) });

    return {
        date: diffDate.toHuman({
            unitDisplay: 'long',
            showZeros: false,
        }),
        time: `${diffTime.hours}h ${diffTime.minutes}m ${Math.floor(diffTime.seconds)}s`,
    };
});

const relativeDiffParts = computed(() => {
    let startTine = DateTime.fromJSDate(now.value);
    let endTime = DateTime.fromJSDate(eventTime);
    if (!inFuture.value) {
        endTime = DateTime.fromJSDate(now.value);
        startTine = DateTime.fromJSDate(eventTime);
    }

    // years
    let yearsDiff = endTime.diff(startTine, [
        'years',
        'months',
        'days',
        'hours',
        'minutes',
        'seconds',
    ]);
    yearsDiff = yearsDiff.set({ second: Math.floor(yearsDiff.get('second')) });
    const years =
        yearsDiff.get('year') !== 0
            ? yearsDiff.toHuman({
                  unitDisplay: 'long',
                  showZeros: false,
              })
            : '';

    // months
    let monthDiff = endTime.diff(startTine, ['months', 'days', 'hours', 'minutes', 'seconds']);
    monthDiff = monthDiff.set({ second: Math.floor(monthDiff.get('second')) });
    const months =
        monthDiff.get('month') !== 0
            ? monthDiff.toHuman({
                  unitDisplay: 'long',
                  showZeros: false,
              })
            : '';

    // weeks
    let weekDiff = endTime.diff(startTine, ['weeks', 'days', 'hours', 'minutes', 'seconds']);
    weekDiff = weekDiff.set({ second: Math.floor(weekDiff.get('second')) });
    const weeks =
        weekDiff.get('week') !== 0
            ? weekDiff.toHuman({
                  unitDisplay: 'long',
                  showZeros: false,
              })
            : '';

    // days
    let dayDiff = endTime.diff(startTine, ['days', 'hours', 'minutes', 'seconds']);
    dayDiff = dayDiff.set({ second: Math.floor(dayDiff.get('second')) });
    const days =
        dayDiff.get('day') !== 0
            ? dayDiff.toHuman({
                  unitDisplay: 'long',
                  showZeros: false,
              })
            : '';

    // hours
    let hoursDiff = endTime.diff(startTine, ['hours', 'minutes', 'seconds']);
    hoursDiff = hoursDiff.set({ second: Math.floor(hoursDiff.get('second')) });
    const hours =
        hoursDiff.get('hour') !== 0
            ? hoursDiff.toHuman({
                  unitDisplay: 'long',
                  showZeros: false,
              })
            : '';

    // minutes
    let minutesDiff = endTime.diff(startTine, ['minutes', 'seconds']);
    minutesDiff = minutesDiff.set({ second: Math.floor(minutesDiff.get('second')) });
    const minutes =
        minutesDiff.get('minute') !== 0
            ? minutesDiff.toHuman({
                  unitDisplay: 'long',
                  showZeros: false,
              })
            : '';

    // seconds
    let secondsDiff = endTime.diff(startTine, ['seconds']);
    secondsDiff = secondsDiff.set({ second: Math.floor(secondsDiff.get('second')) });
    const seconds =
        secondsDiff.get('second') !== 0
            ? secondsDiff.toHuman({
                  unitDisplay: 'long',
                  showZeros: false,
              })
            : '';
    return {
        years: years ? `<span>${years.split(' ').join('</span> <span>')}</span>` : '',
        months: months ? `<span>${months.split(' ').join('</span> <span>')}</span>` : '',
        weeks: weeks ? `<span>${weeks.split(' ').join('</span> <span>')}</span>` : '',
        days: days ? `<span>${days.split(' ').join('</span> <span>')}</span>` : '',
        hours: hours ? `<span>${hours.split(' ').join('</span> <span>')}</span>` : '',
        minutes: `<span>${minutes.split(' ').join('</span> <span>')}</span>`,
        seconds: `<span>${seconds.split(' ').join('</span> <span>')}</span>`,
    };
});

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
            <span v-if="inFuture">in</span> {{ relativeDifference.date }}
        </small>
        <p class="event-time highlight large">{{ relativeDifference.time }}</p>
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
                <li v-if="relativeDiffParts.years" v-html="relativeDiffParts.years"></li>
                <li v-if="relativeDiffParts.months" v-html="relativeDiffParts.months"></li>
                <li v-if="relativeDiffParts.weeks" v-html="relativeDiffParts.weeks"></li>
                <li v-if="relativeDiffParts.days" v-html="relativeDiffParts.days"></li>
                <li v-if="relativeDiffParts.hours" v-html="relativeDiffParts.hours"></li>
                <li v-if="relativeDiffParts.minutes" v-html="relativeDiffParts.minutes"></li>
                <li v-if="relativeDiffParts.seconds" v-html="relativeDiffParts.seconds"></li>
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
