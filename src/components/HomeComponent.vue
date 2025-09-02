<script setup lang="ts">
import { urlEncoder } from '@/services/UrlCoderService';

const exampleEvent = {
    n: 'First US Moon Landing / Neil Armstong & Buzz Aldrin',
    d: new Date('2026-08-26T15:03:00.000Z'),
    otz: 'PST',
};

//('n!'Apollo%2011%20Moon%20Landing'~d!'1969-07-16T17%3A17%3A00.000Z'~otz!'Europe%2FLondon')_
//('n!'Christmas%202025%20in%20New%20York'~d!'2025-12-25T05%3A00%3A00.000Z'~otz!'America%2FNew_York')_

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
