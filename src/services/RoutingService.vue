<script lang="ts">
import { computed, ref } from 'vue';

import HomeComponent from '../components/HomeComponent.vue';
import AddComponent from '../components/AddComponent.vue';
import EventComponent from '@/components/EventComponent.vue';

import { urlDecoder } from './UrlCoderService.vue';

const urlHash = ref(window.location.hash);

window.addEventListener('hashchange', () => {
    console.log('hashchange', window.location.hash);
    urlHash.value = window.location.hash;
});

export const routedComponent = computed(() => {
    const cleanHash = urlHash.value.slice(1);
    switch (cleanHash) {
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
        default: {
            try {
                const event = urlDecoder(cleanHash);
                console.log('event', event);
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
</script>
