<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RoutingService } from './services/RoutingService';
import { SeoService } from './services/SeoService';

// Initialize Routing when component mounts
onMounted(() => {
    RoutingService.initialize();
});

watch(RoutingService.currentPath, () => {
    SeoService.initializeSeo(RoutingService.currentPath.value);
});

const routedComponent = RoutingService.getRoutedComponent();
</script>

<template>
    <header class="container">
        <nav>
            <ul>
                <h1>
                    <a href="/">
                        <img
                            class="logo"
                            src="./assets/logo-cal.svg"
                            alt="When-is-it.at?" />When-is-it.at?
                    </a>
                </h1>
            </ul>
            <ul>
                <li><a href="/add">Create Event</a></li>
            </ul>
        </nav>
    </header>
    <main class="container">
        <component :is="routedComponent.component" v-bind="routedComponent.props" />
    </main>
    <footer class="container">
        <br />
        <small class="trademark">&#169; 2025 Codewald</small>
    </footer>
</template>

<style scoped>
header {
    max-width: 575px;
    margin: 1rem auto;
    h1 {
        text-align: center;
        font-size: 1.5rem;
        margin-bottom: 0;
        a {
            text-decoration: none;
            color: inherit;
        }
    }

    nav {
        ul:first-child {
            padding-left: 10px;
        }
    }

    .logo {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        margin-top: -4px;
    }
}
main {
    max-width: 575px;
    margin: 1rem auto;
}
footer {
    max-width: 575px;
    margin: 1rem auto;
    text-align: center;
    button {
        margin: 0 auto;
        /* color: #ffbf00;
        border-color: #ffbf00; */
    }
    .trademark {
        display: block;
        margin-top: 3rem;
        margin-bottom: 2rem;
        font-size: 0.8rem;
        color: var(--pico-muted-color);
    }
}
</style>
<style>
body {
    padding: 0 15px;
}
body::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffbf00, #ffd700, #ffbf00);
    opacity: 0.8;
}
</style>
