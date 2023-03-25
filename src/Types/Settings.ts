export default class Settings {
    public refreshIntervalSec: number;
    public notifyOnStatusChange: boolean;

    constructor(init?:Partial<Settings>) {
        this.refreshIntervalSec = init?.refreshIntervalSec ?? 0;
        this.notifyOnStatusChange = init?.notifyOnStatusChange ?? true;
    }
}