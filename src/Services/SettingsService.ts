import { Writable, writable } from 'svelte/store';
import Settings from "../Types/Settings";
import { StoreConstants } from '../Auxiliaries/Constants';

export const settingsStore :Writable<{ [id: string] : Settings }>= writable({});

let allSettings = {};
export async function loadSettings() {
    allSettings = JSON.parse(localStorage.getItem('settings')) || {};
    for (const property in allSettings) {
        allSettings[property] = new Settings(allSettings[property]);
    }

    if (!allSettings[StoreConstants.DEFAULT_SETTINGS_ID]) {
        let defaultS = new Settings();
        allSettings[StoreConstants.DEFAULT_SETTINGS_ID] = defaultS;
    }
    settingsStore.set(allSettings);
}

export async function setSettings(settings:any) {
    if (!settings[StoreConstants.DEFAULT_SETTINGS_ID]) {
        let defaultS = new Settings();
        settings[StoreConstants.DEFAULT_SETTINGS_ID] = defaultS;
    }
    settingsStore.set(allSettings);
    localStorage.setItem('settings', JSON.stringify(allSettings));
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