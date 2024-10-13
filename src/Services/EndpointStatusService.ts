//This Service is responsible for checking endpoint status and updating the store
import { get, Writable, writable } from 'svelte/store';

import type EndpointInfo from '../Types/EndpointInfo';
import { settingsStore } from './SettingsService';
import { Status, StatusDescription, StoreConstants } from '../Auxiliaries/Constants';
import type Settings from '../Types/Settings';
import EndpointStatus, { ErrorDetails, RedirectDetails } from '../Types/EndpointStatus';

export const endpoitStatusStore :Writable<{ [id: string] : EndpointStatus }> = writable({});
export const endpoitStatusHistory = writable({});

let timeouts = {};

export function addEndpoint(endpoint: EndpointInfo) {
    updateStatusRecursive(endpoint);
}

export function removeEndpoint(endpoint: EndpointInfo) {
    clearTimeout(timeouts[endpoint.description]);
}

export function updateStatus(endpoint: EndpointInfo) {
    clearTimeout(timeouts[endpoint.description]);
    updateStatusRecursive(endpoint);
}

export function historyClear(endpointDescription: string) {
    endpoitStatusHistory.update((statuses) => {
        statuses[endpointDescription] = [];
        return statuses;
    });
}

async function updateStatusRecursive(endpoint :EndpointInfo) {
    let prevStatus :Status= get(endpoitStatusStore)[endpoint.description]?.status;
    setEndpointStatus(endpoint, Status.Pending, new RedirectDetails());
    let status :Status;
    let errorDetails: ErrorDetails = null;
    let redirectDetails: RedirectDetails = new RedirectDetails();
    try {
        let response = await fetch(endpoint.url);
        redirectDetails = new RedirectDetails({redirected: response.redirected, url: response.url});
        if (response.ok) {
            status = Status.Success;
        }
        else {
            status = Status.Error;
            errorDetails = new ErrorDetails({statusCode: response.status, description: await response.text()});
        }
        status = response.ok ? Status.Success : Status.Error;
    }
    catch(error) {
        console.log(error);
        status = Status.Error;
        errorDetails = new ErrorDetails({description: error.message});
    }
    setEndpointStatus(endpoint, status, redirectDetails, errorDetails);
    keepStatusToHistory(endpoint, status, errorDetails);


    const settings = settingsForEndpoint(endpoint);
    showNotificationIfNeeded(endpoint, prevStatus, status, settings);

    //Recurse
    timeouts[endpoint.description] = setTimeout(async () => await updateStatusRecursive(endpoint), settings.refreshIntervalSeconds() * 1000);
}


//Helper Functions
function setEndpointStatus(endpoint: EndpointInfo, status :Status, redirectDetails: RedirectDetails, errorDetails :ErrorDetails = null) {
    endpoitStatusStore.update((statuses) => {
        statuses[endpoint.description] = new EndpointStatus({status, redirectDetails, errorDetails, lastChecked: new Date()});
        return statuses;
    });
}

function keepStatusToHistory(endpoint :EndpointInfo, status :Status, errorDetails = {}) {
    if (status == Status.Pending) {
        return;//we don't store pending status
    }
    
    const history = get(endpoitStatusHistory)[endpoint.description] ?? [];
    
    history.unshift({status, ...errorDetails, lastChecked: new Date() });

    endpoitStatusHistory.update((histories) => {
        histories[endpoint.description] = [...history];
        return histories;
    });
}


function showNotificationIfNeeded(endpoint :EndpointInfo, prevStatus :Status, newStatus :Status, settings :Settings) {
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


function settingsForEndpoint(endpoint :EndpointInfo) :Settings {
    const settings = get(settingsStore);    
    return settings[endpoint.description] || settings[StoreConstants.DEFAULT_SETTINGS_ID];
}