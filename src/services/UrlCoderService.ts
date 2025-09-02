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
    //const base46ed = encodeURIComponent(btoa(jsonString));
    const crushed = encodeURIComponent(JSONCrush.crush(jsonString));
    return crushed;
};
