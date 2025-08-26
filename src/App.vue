<script setup lang="ts">
import { routedComponent } from './services/RoutingService.vue';

const navigateTo = (path: string) => {
    window.location.hash = path;
};
</script>

<template>
    <header></header>
    <main>
        <h1>When-is-it.at?</h1>
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
