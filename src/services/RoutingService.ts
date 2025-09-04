import { computed, ref, watch } from 'vue';

import HomeComponent from '../components/HomeComponent.vue';
import AddComponent from '../components/AddComponent.vue';
import EventComponent from '@/components/EventComponent.vue';
import PrivacyPolicyComponent from '../components/PrivacyPolicyComponent.vue';

import { urlDecoder } from './UrlCoderService';

export class RoutingService {
    private static urlPath = ref(window.location.pathname);

    public static initialize() {
        this.setupPopStateHandler();
        this.setupLinkHandlers();
        this.watchRouteChanges();
    }

    public static get currentPath() {
        return this.urlPath;
    }

    public static navigateTo(path: string) {
        window.history.pushState({ path }, path, path);
        this.urlPath.value = path;
    }

    public static getUrlPath = () => this.urlPath.value;

    public static getRoutedComponent = () =>
        computed(() => {
            switch (this.urlPath.value) {
                case '':
                case '/':
                    return {
                        component: HomeComponent,
                        props: {},
                    };
                case 'add':
                case '/add':
                    return {
                        component: AddComponent,
                        props: {},
                    };
                case 'privacy':
                case '/privacy':
                    return {
                        component: PrivacyPolicyComponent,
                        props: {},
                    };
                default: {
                    try {
                        const event = urlDecoder(this.urlPath.value.slice(1));
                        return {
                            component: EventComponent,
                            props: {
                                event,
                            },
                        };
                    } catch {
                        return {
                            component: HomeComponent,
                            props: {},
                        };
                    }
                }
            }
        });

    private static watchRouteChanges() {
        watch(this.urlPath, () => {
            this.setupLinkHandlers();
        });
    }

    private static setupPopStateHandler() {
        window.addEventListener('popstate', () => {
            this.urlPath.value = new URL(window.location.href).pathname;
        });
    }

    private static setupLinkHandlers() {
        window.setTimeout(() => {
            document.querySelectorAll('#app [href^="/"]').forEach((linkElement) =>
                linkElement.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const { pathname: path } = new URL((e?.target as HTMLAnchorElement)?.href);
                    this.navigateTo(path);
                }),
            );
        }, 1);
    }
}
