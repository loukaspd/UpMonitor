//This Service is responsible for checking endpoint status and updating the store
import { get, writable } from 'svelte/store';

import { settingsStore } from './SettingsService';
import { Status, StoreConstants } from '../Types/Constants';

export const endpoitStatusStore = writable({});

let timeouts = {};

export function addEndpoint(endpoint) {
    updateStatusRecursive(endpoint);
}

export function removeEndpoint(endpoint) {
    clearTimeout(timeouts[endpoint.description]);
}

export function updateStatus(endpoint) {
    clearTimeout(timeouts[endpoint.description]);
    updateStatusRecursive(endpoint);
}

async function updateStatusRecursive(endpoint) {
    setEndpointStatus(endpoint, Status.Pending);
    let status;
    let errorDetails = {};
    try {
        //await new Promise(resolve => setTimeout(resolve, 3000));
        let response = await fetch(endpoint.url);
        if (response.ok) {
            status = Status.Success;
        }
        else {
            status = Status.Error;
            errorDetails = {statusCode: response.status, description: await response.text()};
        }
        status = response.ok ? Status.Success : Status.Error;
    }
    catch(error) {
        console.log(error);
        status = Status.Error;
        errorDetails = {description: error.message};
    }
    setEndpointStatus(endpoint, status, errorDetails);

    //Recurse
    const settings = settingsForEndpoint(endpoint);
    timeouts[endpoint.description] = setTimeout(async () => await updateStatusRecursive(endpoint), settings.refreshIntervalSec * 1000);
}


//Helper Functions
function setEndpointStatus(endpoint, status, errorDetails = {}) {
    endpoitStatusStore.update((statuses) => {
        statuses[endpoint.description] = {status, ...errorDetails, lastChecked: new Date() };
        return statuses;
    });
}


function settingsForEndpoint(endpoint) {
    const settings = get(settingsStore);
    
    return settings[endpoint.description] || settings[StoreConstants.DEFAULT_SETTINGS_ID];
}