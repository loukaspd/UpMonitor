//This Service is responsible for checking endpoint status and updating the store
import { get, Writable, writable } from 'svelte/store';

import { JsHelpers } from '../Helpers/JsHelpers';
import type EndpointInfo from '../Types/EndpointInfo';
import { settingsStore } from './SettingsService';
import { Status, StatusDescription, StoreConstants } from '../Auxiliaries/Constants';
import type Settings from '../Types/Settings';
import EndpointStatus, { ErrorDetails, RedirectDetails } from '../Types/EndpointStatus';

export const endpoitStatusStore :Writable<{ [id: string] : EndpointStatus }> = writable({});
export const endpoitStatusHistory = writable({});

let timeouts:{[id: string] : NodeJS.Timeout} = {};

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
    keepStatusToHistory(endpoint, endpointStatus.status, endpointStatus.errorDetails);

    showNotificationIfNeeded(endpoint, prevStatus, endpointStatus.status, settings);

    //Recurse
    timeouts[endpoint.description] = setTimeout(async () => await updateStatusRecursive(endpoint), settings.refreshIntervalSeconds() * 1000);
}


//Helper Functions
function setEndpointStatus(endpoint: EndpointInfo, endpointStatus: EndpointStatus) {
    endpoitStatusStore.update((statuses) => {
        statuses[endpoint.description] = endpointStatus;
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