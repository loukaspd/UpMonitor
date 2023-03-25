import { writable } from 'svelte/store';
import Settings from "../Types/Settings";
import { StoreConstants } from '../Types/Constants';

export const settingsStore = writable({});

let allSettings = {};
export async function loadSettings() {
    allSettings = JSON.parse(localStorage.getItem('settings')) || {};
    for (const property in allSettings) {
        allSettings[property] = new Settings(allSettings[property]);
    }

    if (!allSettings[StoreConstants.DEFAULT_SETTINGS_ID]) {
        let defaultS = new Settings();
        defaultS.refreshIntervalSec = 60;
        defaultS.notifyOnStatusChange = true;
        allSettings[StoreConstants.DEFAULT_SETTINGS_ID] = defaultS;
    }
    settingsStore.set(allSettings);
}

export async function saveSettings(id: string, item: Settings) {
    allSettings[id] = item;

    localStorage.setItem('settings', JSON.stringify(allSettings));
    settingsStore.set(allSettings);
}

export async function deleteSettings(id: string) {
    delete allSettings[id];

    localStorage.setItem('settings', JSON.stringify(allSettings));
    settingsStore.set(allSettings);
}