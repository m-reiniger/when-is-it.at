<script setup lang="ts">
import { routedComponent } from './services/RoutingService';

const navigateTo = (path: string) => {
    window.location.hash = path;
};
</script>

<template>
    <header></header>
    <main>
        <h1><a href="/">When-is-it.at?</a></h1>
        <component :is="routedComponent.component" v-bind="routedComponent.props" />
    </main>
    <footer>
        <button class="outline" @click="navigateTo('/add')">Create your own event</button>
    </footer>
</template>

<style scoped>
main {
    max-width: 650px;
    margin: 1rem auto;

    h1 {
        text-align: center;
        font-size: 1.5rem;
        a {
            text-decoration: none;
            color: inherit;
        }
    }
}
footer {
    text-align: center;
    button {
        margin: 0 auto;
        color: #ffbf00;
        border-color: #ffbf00;
    }
}
</style>
