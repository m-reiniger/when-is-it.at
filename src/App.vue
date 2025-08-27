<script setup lang="ts">
import AddComponent from './components/AddComponent.vue';
import { routedComponent } from './services/RoutingService';

const navigateTo = (path: string) => {
    window.location.hash = path;
};
</script>

<template>
    <header>
        <nav>
            <ul>
                <h1>
                    <a href="/"
                        ><img
                            class="logo"
                            src="./assets/logo-cal.svg"
                            alt="When-is-it.at?"
                        />When-is-it.at?</a
                    >
                </h1>
            </ul>
            <ul>
                <li><a href="/#/add">Create Event</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <component :is="routedComponent.component" v-bind="routedComponent.props" />
    </main>
    <footer>
        <button
            class="outline"
            @click="navigateTo('/add')"
            v-if="routedComponent.component !== AddComponent"
        >
            Create your own event
        </button>
    </footer>
</template>

<style scoped>
header {
    max-width: 650px;
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
    max-width: 650px;
    margin: 1rem auto;
}
footer {
    max-width: 650px;
    margin: 1rem auto;
    text-align: center;
    button {
        margin: 0 auto;
        /* color: #ffbf00;
        border-color: #ffbf00; */
    }
}
</style>
