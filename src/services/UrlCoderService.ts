import JSONCrush from 'jsoncrush';

import type { EventDetails } from '@/types';

export const urlDecoder = (hash: string): EventDetails => {
    try {
        // const jsonString = atob(decodeURI(hash));
        // return JSON.parse(jsonString) as EventDetails;
        const uncrushed = JSONCrush.uncrush(decodeURIComponent(hash));
        const data = JSON.parse(uncrushed) as EventDetails;
        data.d = data.d * 10000;
        return data;
    } catch {
        throw new Error('Invalid event data');
    }
};

export const urlEncoder = (data: EventDetails) => {
    const compressedData = structuredClone(data);

    // remove last four digits since they will always be 0000
    compressedData.d = compressedData.d / 10000;

    const jsonString = JSON.stringify(compressedData);
    //const base46ed = encodeURIComponent(btoa(jsonString));
    const crushed = encodeURIComponent(JSONCrush.crush(jsonString));
    return crushed;
};
