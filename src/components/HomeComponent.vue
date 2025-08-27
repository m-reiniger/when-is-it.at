<script setup lang="ts">
import { urlEncoder } from '@/services/UrlCoderService';

const exampleEvent = {
    n: 'My Test Event',
    d: new Date('2026-08-26T15:03:00.000Z'),
    otz: 'PST',
};

// eyJuIjoiRXhhbXBsZSBFdmVudCIsImQiOiIyMDI1LTA4LTI2VDEwOjM0OjUxLjI4OVoiLCJvdHoiOiJQU1QifQ==
const exampleEventHash = urlEncoder(exampleEvent);
</script>

<template>
    <h1>Home</h1>
    <p>
        <a :href="`#${exampleEventHash}`">{{ exampleEventHash }}</a>
    </p>
</template>

<style scoped></style>
