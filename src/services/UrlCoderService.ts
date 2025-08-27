// <script lang="ts">
import JSONCrush from 'jsoncrush';

import type { EventDetails } from '@/types';

export const urlDecoder = (hash: string): EventDetails => {
    try {
        // const jsonString = atob(decodeURI(hash));
        // return JSON.parse(jsonString) as EventDetails;
        const uncrushed = JSONCrush.uncrush(decodeURIComponent(hash));
        return JSON.parse(uncrushed) as EventDetails;
    } catch {
        throw new Error('Invalid event data');
    }
};

export const urlEncoder = (data: EventDetails) => {
    const jsonString = JSON.stringify(data);
    // console.log('jsonString', jsonString);
    // return encodeURI(btoa(jsonString));
    const crushed = encodeURIComponent(JSONCrush.crush(jsonString));
    console.log('crushed', crushed, crushed.length);
    console.log('crushed base64', btoa(crushed), btoa(crushed).length);
    const base46ed = encodeURIComponent(btoa(jsonString));
    console.log('base46ed', base46ed, base46ed.length);
    return crushed;
};
// </script>
