<script setup lang="ts">
import { computed, ref } from 'vue';

import { getTimeZones, type TimeZone } from '@vvo/tzdb';

import { Searchable } from '@/util/Searchable';

const name = ref('');
const date = ref();
const time = ref();
const timeZone = ref();
const tzSearch = ref('');

const timeZones = getTimeZones({ includeUtc: true });
const filteredTimeZones = computed(() => {
    return timeZones.filter(
        (tz) =>
            tz.name.toLowerCase().includes(tzSearch.value.toLowerCase()) ||
            tz.alternativeName.toLowerCase().includes(tzSearch.value.toLowerCase()) ||
            tz.abbreviation.toLowerCase().includes(tzSearch.value.toLowerCase()),
    );
});

const formatTzDisplay = (key: string) => {
    const tz: TimeZone | undefined = timeZones.find((tz) => tz.name === key);
    if (!tz) return key;
    return `${tz.name} - ${tz.alternativeName} (${tz.abbreviation})`;
};
const searchable = new Searchable(formatTzDisplay, 'searchable');

const createEvent = (e: Event) => {
    e.preventDefault();
    console.log(name.value, date.value, time.value, timeZone.value, tzSearch.value);
};
</script>

<template>
    <h1>Create your own event</h1>
    <article>
        <form>
            <fieldset>
                <label>
                    Event Name
                    <input name="name" placeholder="Event Name" v-model="name" />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    Event Date
                    <input type="date" name="date" aria-label="Date" v-model="date" />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    Event Time
                    <input type="time" name="time" aria-label="Time" v-model="time" />
                </label>
            </fieldset>
            <fieldset class="timezone" id="searchable">
                <label>
                    Event Time Zone
                    <input type="hidden" name="timezone-value" v-model="timeZone" />
                    <input type="text" name="timezone" aria-label="Time Zone" v-model="tzSearch" />
                    <small>select the timezone your event takes place in</small>
                    <ul class="dropdown-content hide">
                        <li
                            v-for="tz in filteredTimeZones"
                            :key="tz.name"
                            :data-key="tz.name"
                            @click="searchable.onSelect($event, tz.name)"
                        >
                            {{ formatTzDisplay(tz.name) }}
                        </li>
                    </ul>
                </label>
            </fieldset>
            <div class="create-button-container">
                <button @click="createEvent">Create</button>
            </div>
        </form>
    </article>
</template>

<style scoped>
.create-button-container {
    display: flex;
    justify-content: end;
}

.timezone label {
    position: relative;
}
.dropdown-content {
    display: none;
    z-index: 1000;
    position: absolute;
    max-height: 200px;
    overflow-y: auto;

    padding: 0;
    margin: 0;
    margin-top: -45px;

    list-style: none;
    background-color: var(--pico-form-element-background-color);
    border: 1px solid var(--pico-muted-border-color);

    li {
        list-style: none;
        padding: 0.5rem;
        cursor: pointer;
    }
    li:hover {
        background-color: var(--pico-primary-background);
    }
}
.dropdown-content.show {
    display: block;
}
</style>
