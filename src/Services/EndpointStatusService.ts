//This Service is responsible for checking endpoint status and updating the store
import { get, Writable, writable } from 'svelte/store';

import { JsHelpers } from '../Helpers/JsHelpers';
import type EndpointInfo from '../Types/EndpointInfo';
import { settingsStore } from './SettingsService';
import { Status, StatusDescription, StoreConstants } from '../Auxiliaries/Constants';
import type Settings from '../Types/Settings';
import EndpointStatus, { ErrorDetails, RedirectDetails } from '../Types/EndpointStatus';
import { endpoitsStore } from './EndpointsService';

export const endpoitStatusStore :Writable<{ [id: string] : EndpointStatus }> = writable({});
export const endpoitStatusHistory : Writable<{[id:string] : EndpointStatus[]}>= writable({});

let timeouts:{[id: string] : NodeJS.Timeout} = {};

export function addEndpoint(endpoint: EndpointInfo) {
    if (get(endpoitStatusStore).hasOwnProperty(endpoint.id)) {
        return;
    }
    updateStatusRecursive(endpoint);
}

export function removeEndpoint(endpoint: EndpointInfo) {
    clearTimeout(timeouts[endpoint.id]);
    delete timeouts[endpoint.id];
    endpoitStatusStore.update((statuses) => {
        delete statuses[endpoint.id];
        return statuses;
    });
    endpoitStatusHistory.update((statuses) => {
        delete statuses[endpoint.id];
        return statuses;
    });
}

export function updateStatus(endpoint: EndpointInfo) {
    clearTimeout(timeouts[endpoint.id]);
    updateStatusRecursive(endpoint);
}

export function refreshAllEndpoints() {
    get(endpoitsStore).forEach(endpoint => updateStatus(endpoint));
}

export function historyClear(endpointDescription: string) {
    endpoitStatusHistory.update((statuses) => {
        statuses[endpointDescription] = [];
        return statuses;
    });
}

async function updateStatusRecursive(endpoint :EndpointInfo) {
    let prevStatus :Status= get(endpoitStatusStore)[endpoint.id]?.status;
    setEndpointStatus(endpoint, new EndpointStatus({status:Status.Pending}));
    const settings = settingsForEndpoint(endpoint);
    
    let endpointStatus = new EndpointStatus();
    try {
        let response = await fetch(endpoint.url);
        endpointStatus.redirectDetails = new RedirectDetails({redirected: response.redirected, url: response.url});
        if (response.ok) {
            endpointStatus.status = Status.Success;
        }
        else {
            endpointStatus.status = Status.Error;
            endpointStatus.errorDetails = new ErrorDetails({statusCode: response.status, description: await response.text()});
        }
    }
    catch(error) {
        console.log(error);
        endpointStatus.status = Status.Error;
        endpointStatus.errorDetails = new ErrorDetails({description: error.message});
    }
    endpointStatus.nextCheck = JsHelpers.addSecondsToDate(new Date(), settings.refreshIntervalSeconds());

    setEndpointStatus(endpoint, endpointStatus);
    keepStatusToHistory(endpoint, endpointStatus);

    showNotificationIfNeeded(endpoint, prevStatus, endpointStatus.status, settings);

    //Recurse
    timeouts[endpoint.id] = setTimeout(async () => await updateStatusRecursive(endpoint), settings.refreshIntervalSeconds() * 1000);
}


//Helper Functions
function setEndpointStatus(endpoint: EndpointInfo, endpointStatus: EndpointStatus) {
    endpoitStatusStore.update((statuses) => {
        statuses[endpoint.id] = endpointStatus;
        return statuses;
    });
}

function keepStatusToHistory(endpoint :EndpointInfo, endpointStatus: EndpointStatus) {
    if (endpointStatus.status == Status.Pending) {
        return;//we don't store pending status
    }
    
    const history = get(endpoitStatusHistory)[endpoint.id] ?? [];
    
    history.unshift(endpointStatus);

    endpoitStatusHistory.update((histories) => {
        histories[endpoint.id] = [...history];
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
        description: endpoint.id, 
        prevStatus: prevDescr, 
        currentStatus: currentDescr 
    });
}


function settingsForEndpoint(endpoint :EndpointInfo) :Settings {
    const settings = get(settingsStore);    
    return settings[endpoint.id] || settings[StoreConstants.DEFAULT_SETTINGS_ID];
}