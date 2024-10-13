//This Service is responsible for syncing endpoints to localstorage and appStore
import { writable, get } from 'svelte/store';
import EndpointInfo from '../Types/EndpointInfo';

export const endpoitsStore = writable<EndpointInfo[]>([]);

export async function saveEndpoint(item: EndpointInfo) {
    const endPoints = upsertEndpoint(get(endpoitsStore), item);

    setEndpoitns(endPoints);
}

export async function loadEndpoints() {
    //localStorage
    const endPoints = (JSON.parse(localStorage.getItem('endpoints')) || []).map((i:any) => new EndpointInfo(i));
    //Store
    endpoitsStore.set(endPoints);
}

export async function setEndpoitns(endpoints: EndpointInfo[]) {
    endpoitsStore.set(endpoints);
    localStorage.setItem('endpoints', JSON.stringify(endpoints));
}

export async function deleteItem(item: EndpointInfo) {
    //localStorage
    const endpoints = get(endpoitsStore).filter(x => x !== item);
    localStorage.setItem('endpoints', JSON.stringify(endpoints));
    //Store
    endpoitsStore.update((endpoints1) => endpoints1.filter(x => x !== item));
}

export async function deleteAll() {
    //localStorage
    localStorage.removeItem('endpoints');
    //Store
    endpoitsStore.set([]);
}

function upsertEndpoint(allEndpoints: EndpointInfo[], endpoint: EndpointInfo) : EndpointInfo[] {
    const exists = !!allEndpoints.find(x => x.id === endpoint.id);
    if (exists) {
        return allEndpoints.map(x => x.id === endpoint.id ? endpoint : x);
    }
    else {
        return [...allEndpoints, endpoint];
    }
}