import type { EventDetails } from '@/types';
import { urlDecoder, urlEncoder } from './UrlCoderService';

export class SeoService {
    private static readonly BASE_URL = 'https://when-is-it.at';
    private static readonly SITE_NAME = 'When is it at?';
    private static readonly DEFAULT_DESCRIPTION =
        'Convert global events to your local timezone instantly. Create and share events with precise timezone information.';

    /**
     * Update meta tags for the home page
     */
    public static updateHomePageMeta(): void {
        this.updateTitle('When is it at? - Global Event Time Converter');
        this.updateDescription(this.DEFAULT_DESCRIPTION);
        this.updateCanonicalUrl('/');
        this.updateOpenGraph({
            title: 'When is it at? - Global Event Time Converter',
            description: this.DEFAULT_DESCRIPTION,
            url: '/',
            type: 'website',
        });

        // Add home page structured data
        this.addHomePageStructuredData();
    }

    /**
     * Update meta tags for the add event page
     */
    public static updateAddEventPageMeta(): void {
        this.updateTitle('Create Event - When is it at?');
        this.updateDescription(
            'Create and share your own events with precise timezone information. Perfect for meetings, celebrations, and international events.',
        );
        this.updateCanonicalUrl('/add');
        this.updateOpenGraph({
            title: 'Create Event - When is it at?',
            description: 'Create and share your own events with precise timezone information.',
            url: '/add',
            type: 'website',
        });

        // Add add event page structured data
        this.addAddEventPageStructuredData();
    }

    /**
     * Update meta tags for a specific event
     */
    public static updateEventPageMeta(event: EventDetails): void {
        const eventName = event.n;
        const eventDate = new Date(event.d);
        const timezone = event.otz;

        // Format date for display
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
            timeZone: timezone,
        });

        const title = `${eventName} - When is it at?`;
        const description = `Find out when "${eventName}" happens in your timezone. Event scheduled for ${formattedDate} (${timezone.replace('_', ' ')}). Convert to your local time instantly.`;

        this.updateTitle(title);
        this.updateDescription(description);
        this.updateCanonicalUrl(`/${this.encodeEventForUrl(event)}`);
        this.updateOpenGraph({
            title,
            description,
            url: `/${this.encodeEventForUrl(event)}`,
            type: 'article',
        });

        // Add event-specific structured data
        this.addEventStructuredData(event);
    }

    /**
     * Update the page title
     */
    private static updateTitle(title: string): void {
        document.title = title;
        this.updateMetaTag('name', 'title', title);
        this.updateMetaTag('property', 'og:title', title);
        this.updateMetaTag('property', 'twitter:title', title);
    }

    /**
     * Update the meta description
     */
    private static updateDescription(description: string): void {
        this.updateMetaTag('name', 'description', description);
        this.updateMetaTag('property', 'og:description', description);
        this.updateMetaTag('property', 'twitter:description', description);
    }

    /**
     * Update the canonical URL
     */
    private static updateCanonicalUrl(path: string): void {
        const fullUrl = `${this.BASE_URL}${path}`;
        this.updateMetaTag('rel', 'canonical', fullUrl, 'link');
        this.updateMetaTag('property', 'og:url', fullUrl);
        this.updateMetaTag('property', 'twitter:url', fullUrl);
    }

    /**
     * Update Open Graph meta tags
     */
    private static updateOpenGraph(data: {
        title: string;
        description: string;
        url: string;
        type: string;
    }): void {
        this.updateMetaTag('property', 'og:type', data.type);
        this.updateMetaTag('property', 'og:site_name', this.SITE_NAME);
    }

    /**
     * Add structured data for an event
     */
    private static addEventStructuredData(event: EventDetails): void {
        const eventDate = new Date(event.d);
        const now = new Date();
        const isInFuture = eventDate > now;

        // Calculate time until/from event
        const timeDiff = Math.abs(eventDate.getTime() - now.getTime());
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        // Enhanced event description
        const timeStatus = isInFuture
            ? `happens in ${daysDiff} days and ${hoursDiff} hours`
            : `happened ${daysDiff} days and ${hoursDiff} hours ago`;

        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.n,
            startDate: eventDate.toISOString(),
            endDate: eventDate.toISOString(), // Assuming single moment events
            description: `"${event.n}" ${timeStatus}. Find out when this event happens in your local timezone. Event scheduled for ${eventDate.toLocaleDateString(
                'en-US',
                {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: event.otz,
                },
            )} in ${event.otz.replace('_', ' ')}.`,
            url: `${this.BASE_URL}/${this.encodeEventForUrl(event)}`,
            image: `${this.BASE_URL}/og-image.svg`,
            organizer: {
                '@type': 'Organization',
                name: this.SITE_NAME,
                url: this.BASE_URL,
            },
            location: {
                '@type': 'Place',
                name: event.otz.replace('_', ' '),
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: event.otz.replace('_', ' '),
                },
            },
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                validFrom: new Date().toISOString(),
            },
            eventStatus: isInFuture
                ? 'https://schema.org/EventScheduled'
                : 'https://schema.org/EventPostponed',
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            isAccessibleForFree: true,
            keywords: [
                'timezone converter',
                'event time',
                'global time',
                'local time',
                'time conversion',
                event.otz.replace('_', ' '),
                event.n.toLowerCase(),
            ],
            about: {
                '@type': 'Thing',
                name: 'Timezone Conversion',
                description: 'Converting global events to local timezones',
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${this.BASE_URL}/${this.encodeEventForUrl(event)}`,
            },
        };

        // Remove existing event structured data
        const existingScript = document.querySelector('script[data-event-structured-data]');
        if (existingScript) {
            existingScript.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-event-structured-data', 'true');
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    /**
     * Add structured data for the home page
     */
    private static addHomePageStructuredData(): void {
        // Remove existing page-specific structured data
        this.removePageStructuredData('home-page');

        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: this.SITE_NAME,
            description: this.DEFAULT_DESCRIPTION,
            url: this.BASE_URL,
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Web Browser',
            browserRequirements: 'Requires JavaScript. Requires HTML5.',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
            },
            creator: {
                '@type': 'Organization',
                name: 'Codewald',
                url: this.BASE_URL,
            },
            featureList: [
                'Timezone conversion',
                'Event creation and sharing',
                'Global to local time conversion',
                'Real-time countdown timers',
                'International event support',
            ],
            screenshot: `${this.BASE_URL}/og-image.svg`,
            softwareVersion: '1.0',
            datePublished: '2025-01-01',
            dateModified: new Date().toISOString(),
            inLanguage: 'en-US',
            isAccessibleForFree: true,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': this.BASE_URL,
            },
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${this.BASE_URL}/add`,
                },
                'query-input': 'required name=event',
            },
        };

        this.addStructuredDataScript(structuredData, 'home-page');

        // Add structured data for example events
        this.addExampleEventsStructuredData();

        // Add FAQ structured data
        this.addFAQStructuredData();
    }

    /**
     * Add structured data for the add event page
     */
    private static addAddEventPageStructuredData(): void {
        // Remove existing page-specific structured data
        this.removePageStructuredData('add-event-page');

        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Create Event - When is it at?',
            description:
                'Create and share your own events with precise timezone information. Perfect for meetings, celebrations, and international events.',
            url: `${this.BASE_URL}/add`,
            isPartOf: {
                '@type': 'WebSite',
                name: this.SITE_NAME,
                url: this.BASE_URL,
            },
            about: {
                '@type': 'Thing',
                name: 'Event Creation',
                description: 'Creating and sharing events with timezone information',
            },
            mainEntity: {
                '@type': 'SoftwareApplication',
                name: 'Event Creator',
                description: 'Tool for creating and sharing events with timezone conversion',
                applicationCategory: 'UtilityApplication',
                operatingSystem: 'Web Browser',
            },
            breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: this.BASE_URL,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Create Event',
                        item: `${this.BASE_URL}/add`,
                    },
                ],
            },
            potentialAction: {
                '@type': 'CreateAction',
                name: 'Create Event',
                description: 'Create a new event with timezone information',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${this.BASE_URL}/add`,
                },
            },
        };

        this.addStructuredDataScript(structuredData, 'add-event-page');
    }

    /**
     * Add structured data for example events on the home page
     */
    private static addExampleEventsStructuredData(): void {
        // Remove existing example events structured data
        this.removePageStructuredData('example-events');

        // Example events from HomeComponent
        const exampleEvents = [
            {
                name: 'Summer Olympics 2028',
                date: '2028-07-14T17:00:00',
                timezone: 'America/Los_Angeles',
                description: 'Los Angeles hosts the 34th Summer Olympic Games',
            },
            {
                name: 'Apollo 11 Moon Landing',
                date: '1969-07-21T20:17:00',
                timezone: 'UTC',
                description: 'Neil Armstrong becomes the first human to walk on the Moon',
            },
            {
                name: 'Total Solar Eclipse 2027',
                date: '2027-08-02T12:39:00',
                timezone: 'Africa/Cairo',
                description:
                    'Total solar eclipse visible in Egypt, with totality lasting over 6 minutes in Luxor',
            },
            {
                name: 'Gamescom 2026',
                date: '2026-08-25T20:00:00',
                timezone: 'Europe/Berlin',
                description: "Europe's largest gaming convention opens in Cologne, Germany",
            },
        ];

        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Example Events - When is it at?',
            description: 'Sample events demonstrating timezone conversion capabilities',
            numberOfItems: exampleEvents.length,
            itemListElement: exampleEvents.map((event, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Event',
                    name: event.name,
                    startDate: event.date,
                    description: event.description,
                    location: {
                        '@type': 'Place',
                        name: event.timezone,
                    },
                    organizer: {
                        '@type': 'Organization',
                        name: this.SITE_NAME,
                    },
                    isAccessibleForFree: true,
                    eventStatus:
                        new Date(event.date) > new Date()
                            ? 'https://schema.org/EventScheduled'
                            : 'https://schema.org/EventPostponed',
                },
            })),
        };

        this.addStructuredDataScript(structuredData, 'example-events');
    }

    /**
     * Add FAQ structured data for better SEO
     */
    private static addFAQStructuredData(): void {
        // Remove existing FAQ structured data
        this.removePageStructuredData('faq');

        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'What is When is it at?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'When is it at? is a global event time converter that helps you convert events from any timezone to your local time. You can also create and share your own events with precise timezone information.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'How does timezone conversion work?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Simply enter an event with its original timezone, and our tool will automatically convert it to your local timezone. You can see the event time in both the original timezone and your local timezone.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Can I create and share my own events?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! You can create your own events with specific dates, times, and timezones. Each event gets a unique shareable link that others can use to see the event in their local timezone.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Is When is it at? free to use?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes, When is it at? is completely free to use. There are no registration requirements, no hidden fees, and no limitations on the number of events you can create or view.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'What types of events can I convert?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'You can convert any type of event - meetings, conferences, celebrations, sports events, webinars, or any other scheduled event. The tool works with all timezones worldwide.',
                    },
                },
            ],
        };

        this.addStructuredDataScript(structuredData, 'faq');
    }

    /**
     * Add a structured data script to the document head
     */
    private static addStructuredDataScript(
        data: Record<string, unknown>,
        identifier: string,
    ): void {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute(`data-${identifier}-structured-data`, 'true');
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    /**
     * Remove page-specific structured data
     */
    private static removePageStructuredData(identifier: string): void {
        const existingScript = document.querySelector(`script[data-${identifier}-structured-data]`);
        if (existingScript) {
            existingScript.remove();
        }
    }

    /**
     * Update or create a meta tag
     */
    private static updateMetaTag(
        attribute: string,
        value: string,
        content: string,
        tagName: string = 'meta',
    ): void {
        let element = document.querySelector(`${tagName}[${attribute}="${value}"]`) as HTMLElement;

        if (!element) {
            element = document.createElement(tagName);
            element.setAttribute(attribute, value);
            document.head.appendChild(element);
        }

        if (tagName === 'link') {
            element.setAttribute('href', content);
        } else {
            element.setAttribute('content', content);
        }
    }

    /**
     * Encode event data for URL using the existing UrlCoderService
     */
    private static encodeEventForUrl(event: EventDetails): string {
        return urlEncoder(event);
    }

    /**
     * Initialize SEO for the current route
     */
    static initializeSeo(path: string): void {
        console.trace('initializing SEO for', path);
        if (path === '' || path === '/') {
            this.updateHomePageMeta();
        } else if (path === 'add' || path === '/add') {
            this.updateAddEventPageMeta();
        } else {
            // Try to decode as event
            try {
                const event = urlDecoder(path.slice(1));
                this.updateEventPageMeta(event);
            } catch {
                this.updateHomePageMeta();
            }
        }
    }
}
