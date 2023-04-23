import { endpoitsStore, setEndpoitns } from "./EndpointsService"
import { get } from 'svelte/store';
import { setSettings, settingsStore } from "./SettingsService";
import { StoreConstants } from "../Auxiliaries/Constants";
import Settings from "../Types/Settings";
import EndpointInfo from "../Types/EndpointInfo";

// Responsible for Saving & Loading Endpoints
export default class StorageService {
    public static async saveEnvironment() {
        const endpoints = get(endpoitsStore);
        const allSettings = get(settingsStore);
        const settings = {};
        for (const property in allSettings) {
            if (property == StoreConstants.DEFAULT_SETTINGS_ID) {
                continue;
            }
            settings[property] = new Settings(allSettings[property]);
        }
        
        const env = {
            endpoints: [...endpoints],
            settings
        };

        let jsonString = JSON.stringify(env);
        window.electronAPI.saveToFileWithPicker(jsonString);
    }

    public static async loadEnviroment(jsonString: string) {
        console.log(jsonString);
        const parsed = JSON.parse(jsonString);
        const endpoints = parsed.endpoints.map((e:any) => new EndpointInfo(e));
        const settings = parsed.settings;
        const allSettings = get(settingsStore);
        settings[StoreConstants.DEFAULT_SETTINGS_ID] = allSettings[StoreConstants.DEFAULT_SETTINGS_ID];

        await setEndpoitns(endpoints);
        await setSettings(allSettings);
    }
}