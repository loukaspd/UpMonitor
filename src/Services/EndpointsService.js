//This Service is responsible for syncing endpoints to localstorage and appStore
import { appStore } from '../Store.js';

let endPoints = [];

export async function saveEndpoint(item) {
    endPoints = [...endPoints, item];
    localStorage.setItem('endpoints', JSON.stringify(endPoints));
    appStore.set(endPoints);
}

export async function loadEndpoints() {
    endPoints = JSON.parse(localStorage.getItem('endpoints')) || [];
    appStore.set(endPoints);
}

export async function deleteItem(item) {
    endPoints = endPoints.filter(x => x !== item);
    localStorage.setItem('endpoints', JSON.stringify(endPoints));
    appStore.set(endPoints);
}

export async function deleteAll() {
    localStorage.clear('endpoints');
    appStore.set([]);
    endPoints = [];
}