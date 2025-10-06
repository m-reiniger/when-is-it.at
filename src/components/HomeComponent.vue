<script setup lang="ts">
import { DateTime } from 'luxon';

import { urlEncoder } from '@/services/UrlCoderService';
import type { EventDetails } from '@/types';
import AddComponent from './AddComponent.vue';
import { RoutingService } from '@/services/RoutingService';
import { onMounted } from 'vue';
import { AdSenseService } from '@/services/AdSenseService';

const exampleEvents: { description: string; event: EventDetails }[] = [
    {
        description: 'Los Angeles hosts the 34th Summer Olympic Games',
        event: {
            n: 'Summer Olympics 2028',
            d: DateTime.fromISO('2028-07-14T17:00:00', { zone: 'America/Los_Angeles' })
                .toJSDate()
                .getTime(),
            otz: 'America/Los_Angeles',
        },
    },
    {
        description: 'Neil Armstrong becomes the first human to walk on the Moon',
        event: {
            n: 'Apollo 11 Moon Landing',
            d: DateTime.fromISO('1969-07-21T20:17:00', { zone: 'UTC' }).toJSDate().getTime(),
            otz: 'UTC',
        },
    },
    {
        description:
            'Total solar eclipse visible in Egypt, with totality lasting over 6 minutes in Luxor',
        event: {
            n: 'Total Solar Eclipse 2027',
            d: DateTime.fromISO('2027-08-02T12:39:00', { zone: 'Africa/Cairo' })
                .toJSDate()
                .getTime(),
            otz: 'Africa/Cairo',
        },
    },

    {
        description: "Europe's largest gaming convention opens in Cologne, Germany",
        event: {
            n: 'Gamescom 2026',
            d: DateTime.fromISO('2026-08-25T20:00:00', { zone: 'Europe/Berlin' })
                .toJSDate()
                .getTime(),
            otz: 'Europe/Berlin',
        },
    },
];

const createExampleEventHash = (event: EventDetails) => {
    return urlEncoder(event);
};

// adsense content 1
onMounted(() => {
    AdSenseService.showAdBanner1('ads-banner-1-container');
});
</script>

<template>
    <!-- Hero Section -->
    <section class="hero">
        <h1>When Is It, Where You Are?</h1>
        <p class="tagline">
            Discover when global events happen in your local timezone, or create and share your own
            events with the world
        </p>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
        <div class="steps">
            <div class="step">
                <div class="step-icon">📅</div>
                <h3>Convert Times</h3>
                <p>See when global events occur in your local time</p>
            </div>
            <div class="step">
                <div class="step-icon">🔗</div>
                <h3>Create & Share</h3>
                <p>Make your own events and share them with others</p>
            </div>
            <div class="step">
                <div class="step-icon">🌍</div>
                <h3>Global to Local</h3>
                <p>Any event with a single global time becomes local for everyone</p>
            </div>
        </div>
    </section>

    <section class="examples">
        <!-- Examples Section -->
        <h2>Chronometric Samples</h2>
        <p class="examples-intro">Explore these example events to see how the tool works</p>

        <div class="example-events">
            <article
                v-for="event in exampleEvents"
                :key="event.event.n"
                @click="RoutingService.navigateTo(`/${createExampleEventHash(event.event)}`)">
                <header>
                    <h3>{{ event.event.n }}</h3>
                    <p>{{ event.description }}</p>
                </header>
                <a :href="`/${createExampleEventHash(event.event)}`" class="outline">View Event</a>
            </article>
        </div>
    </section>

    <!-- wiia-banner-1 -->
    <div id="ads-banner-1-container"></div>

    <section class="add-event">
        <AddComponent />
    </section>
</template>

<style scoped>
/* Hero Section */
.hero {
    text-align: center;
    margin-bottom: 1rem;
    padding: 2rem 0;
}

.hero h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #b5932d, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.tagline {
    font-size: 1rem;
    color: var(--pico-muted-color);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

/* How It Works */
.how-it-works {
    margin-bottom: 3rem;
}

.how-it-works h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
}

.steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
}

.step {
    text-align: center;
    padding: 0.5rem;
    border-radius: 8px;
    background: var(--pico-card-background-color);
    border: 1px solid var(--pico-card-border-color);
}

.step-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.step h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--pico-primary-color);
}

.step p {
    font-size: 0.9rem;
    color: var(--pico-muted-color);
    line-height: 1.4;
}

/* Examples Section */
h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.examples-intro {
    text-align: center;
    color: var(--pico-muted-color);
    margin-bottom: 2rem;
    font-size: 1rem;
}

.example-events {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 3rem;
    font-size: 0.8rem;

    article {
        cursor: pointer;
        margin: 0;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        header h3 {
            font-size: 1rem;
            color: #b5932d;
        }
    }
}

/* Call to Action */
/* .cta {
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
} */

/* Responsive Design */
@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem;
    }

    .tagline {
        font-size: 1rem;
    }

    .steps {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .example-events {
        grid-template-columns: 1fr;
    }
}
</style>
