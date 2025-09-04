<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { getTimeZones, type TimeZone } from '@vvo/tzdb';
import { DateTime } from 'luxon';

import { Searchable } from '@/util/Searchable';
import { urlEncoder } from '@/services/UrlCoderService';
import { TimeFormatService } from '@/services/TimeFormatService';
import { RoutingService } from '@/services/RoutingService';

const name = ref('');
const date = ref();
const time = ref();
const timeZone = ref();
const tzSearch = ref('');

const localTimeZone = ref(TimeFormatService.getCurrentTimeZoneName());

const timeZones = getTimeZones({ includeUtc: true });
const filteredTimeZones = computed(() => {
    return timeZones.filter(
        (tz) =>
            tz.name.toLowerCase().includes(tzSearch.value.toLowerCase()) ||
            tz.alternativeName.toLowerCase().includes(tzSearch.value.toLowerCase()) ||
            tz.abbreviation.toLowerCase().includes(tzSearch.value.toLowerCase()) ||
            tz.countryName.toLowerCase().includes(tzSearch.value.toLowerCase()) ||
            tz.mainCities.some((city) => city.toLowerCase().includes(tzSearch.value.toLowerCase())),
    );
});

const formatTzDisplay = (key: string) => {
    const tz: TimeZone | undefined = timeZones.find((tz) => tz.name === key);
    if (!tz) return key;
    return `${tz.name.replace('_', ' ')} - ${tz.alternativeName.replace('_', ' ')} (${tz.abbreviation})`;
};
const searchable = new Searchable(formatTzDisplay, 'searchable');

const createEvent = (e: Event) => {
    e.preventDefault();
    //console.log(name.value, date.value, time.value, timeZone.value, tzSearch.value);
    const form = document.getElementById('add-event-form') as HTMLFormElement;
    if (!form.checkValidity()) {
        form.reportValidity();
        const invalidInputs = form.querySelectorAll('input:invalid');
        invalidInputs.forEach((input) => {
            input.setAttribute('aria-invalid', 'true');
        });
        return;
    } else {
        const link = urlEncoder({
            n: name.value,
            //d: new Date(`${date.value}T${time.value}:00.000Z`),
            d: DateTime.fromISO(`${date.value}T${time.value}`, { zone: timeZone.value })
                .toJSDate()
                .getTime(),
            otz: timeZone.value,
        });
        RoutingService.navigateTo(`/${link}`);
    }
};

onMounted(() => {
    const form = document.getElementById('add-event-form') as HTMLFormElement;
    const invalidInputs = form.querySelectorAll('input');
    invalidInputs.forEach((input) => {
        input.addEventListener('input', () => {
            input.removeAttribute('aria-invalid');
        });
    });
});
</script>

<template>
    <div class="header-container">
        <h1>Create your own event</h1>
    </div>
    <article>
        <form id="add-event-form">
            <fieldset>
                <label>
                    Event Name
                    <input
                        name="name"
                        placeholder="Event Name"
                        v-model="name"
                        maxlength="60"
                        required />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    Event Date
                    <input type="date" name="date" aria-label="Date" v-model="date" required />
                    <small>Date the event takes place in its original time zone</small>
                </label>
            </fieldset>
            <fieldset>
                <label>
                    Event Time
                    <input type="time" name="time" aria-label="Time" v-model="time" required />
                    <small>Time the event takes place in its original time zone</small>
                </label>
            </fieldset>
            <fieldset class="timezone" id="searchable">
                <label>
                    Event Time Zone
                    <input type="hidden" name="timezone-value" v-model="timeZone" required />
                    <input
                        type="search"
                        name="timezone"
                        aria-label="Time Zone"
                        v-model="tzSearch"
                        required />
                    <small>Timezone the event takes place in</small>
                    <ul class="dropdown-content hide">
                        <li
                            :key="localTimeZone"
                            :data-key="localTimeZone"
                            @click="searchable.onSelect($event, localTimeZone)"
                            class="highlight">
                            Use my timezone: {{ localTimeZone }}
                        </li>
                        <li
                            v-for="tz in filteredTimeZones"
                            :key="tz.name"
                            :data-key="tz.name"
                            @click="searchable.onSelect($event, tz.name)">
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
.header-container {
    padding: 1rem 0;
    text-align: center;

    h1 {
        margin: auto;

        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #b5932d, #ffd700);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
}

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
    max-height: 250px;
    overflow-y: auto;

    padding: 0;
    margin: 0;
    margin-top: -45px;

    list-style: none;
    background-color: var(--pico-form-element-background-color);
    border: 1px solid var(--pico-muted-border-color);

    font-size: 0.8rem;

    li {
        list-style: none;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
    }
    li:hover {
        background-color: var(--pico-primary-background);
    }
    li.highlight {
        border-bottom: 1px solid var(--pico-primary);
    }
}
.dropdown-content.show {
    display: block;
}

#add-event-form {
    fieldset {
        margin-bottom: 0;
    }
    input {
        font-size: 0.8rem;
    }
    input[type='search'] {
        --pico-border-radius: 0;
    }
}
</style>
