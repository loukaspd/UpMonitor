//This Service is responsible for checking endpoint status and updating the store
import { get, writable } from 'svelte/store';

import { settingsStore } from './SettingsService';
import { Status, StatusDescription, StoreConstants } from '../Types/Constants';

export const endpoitStatusStore = writable({});
export const endpoitStatusHistory = writable({});

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

export function historyClear(endpointDescription) {
    endpoitStatusHistory.update((statuses) => {
        statuses[endpointDescription] = [];
        return statuses;
    });
}

async function updateStatusRecursive(endpoint) {
    let prevStatus = get(endpoitStatusStore)[endpoint.description]?.status;
    setEndpointStatus(endpoint, Status.Pending);
    let status;
    let errorDetails = {};
    try {
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
    keepStatusToHistory(endpoint,status, errorDetails);


    const settings = settingsForEndpoint(endpoint);
    showNotificationIfNeeded(endpoint, prevStatus, status, settings);

    //Recurse
    timeouts[endpoint.description] = setTimeout(async () => await updateStatusRecursive(endpoint), settings.refreshIntervalSec * 1000);
}


//Helper Functions
function setEndpointStatus(endpoint, status, errorDetails = {}) {
    endpoitStatusStore.update((statuses) => {
        statuses[endpoint.description] = {status, ...errorDetails, lastChecked: new Date() };
        return statuses;
    });
}

function keepStatusToHistory(endpoint, status, errorDetails = {}) {
    if (status == Status.Pending) {
        return;//we don't store pending status
    }
    
    const history = get(endpoitStatusHistory)[endpoint.description] ?? [];
    
    history.unshift({status, ...errorDetails, lastChecked: new Date() });

    endpoitStatusHistory.update((statuses) => {
        statuses[endpoint.description] = [...history];
        return statuses;
    });
}


function showNotificationIfNeeded(endpoint, prevStatus, newStatus, settings) {
    if (!prevStatus) return;    //first time retrieving this endpoint's status

    if (prevStatus == newStatus) return;    //no status change

    if(!settings.notifyOnStatusChange) return; //disabled by settings

    const prevDescr = StatusDescription[prevStatus];
    const currentDescr = StatusDescription[newStatus];
    window.electronAPI.showStatusNotification({
        description: endpoint.description, 
        prevStatus: prevDescr, 
        currentStatus: currentDescr 
    });
}


function settingsForEndpoint(endpoint) {
    const settings = get(settingsStore);
    
    return settings[endpoint.description] || settings[StoreConstants.DEFAULT_SETTINGS_ID];
}