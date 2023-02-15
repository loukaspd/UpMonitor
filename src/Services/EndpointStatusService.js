//This Service is responsible for checking endpoint status and updating the store
import { writable } from 'svelte/store';

import Settings from '../Types/Settings.js';
import {Status} from '../Types/Constants';

export const endpoitStatusStore = writable({});

let settings = {};
let timeouts = {};

export function initSettings() {
    let defaultSettings = new Settings();
    defaultSettings.refreshIntervalSec = 60;
    defaultSettings.notifyOnError = false;
    settings["_"] = defaultSettings;
}

export function addEndpoint(endpoint) {
    initSettings();//TODO move to app

    const s = settingsForEndpoint(endpoint);
    updateStatusRecursive(endpoint, s);
}

export function removeEndpoint(endpoint) {
    clearTimeout(timeouts[endpoint.description]);
}

export function updateStatus(endpoint) {
    clearTimeout(timeouts[endpoint.description]);
    const s = settingsForEndpoint(endpoint);
    updateStatusRecursive(endpoint, s);
}

async function updateStatusRecursive(endpoint, settings) {
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
    timeouts[endpoint.description] = setTimeout(async () => await updateStatusRecursive(endpoint, settings), settings.refreshIntervalSec * 1000);
}


//Helper Functions
function setEndpointStatus(endpoint, status, errorDetails = {}) {
    endpoitStatusStore.update((statuses) => {
        statuses[endpoint.description] = {status, ...errorDetails, lastChecked: new Date() };
        return statuses;
    });
}


function settingsForEndpoint(endpoint) {
    return settings[endpoint.description] || settings["_"];
}