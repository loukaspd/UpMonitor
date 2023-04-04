import { SettingIntervalType } from "../Auxiliaries/Constants";

export default class Settings {
    public refreshInterval: number;
    public notifyOnStatusChange: boolean;
    public intervalType :SettingIntervalType;

    constructor(init?:Partial<Settings>) {
        this.refreshInterval = init?.refreshInterval ?? 1;
        this.notifyOnStatusChange = init?.notifyOnStatusChange ?? true;
        this.intervalType = init?.intervalType ?? SettingIntervalType.Minutes;
    }

    public refreshIntervalSeconds() :number {
        const result = this.refreshInterval * (this.intervalType == SettingIntervalType.Seconds ? 1 : 60);
        return result;
    }
}