import { Status } from "../Auxiliaries/Constants"

export default class EndpointStatus {
    public status :Status = Status.Pending;
    public lastChecked :Date;
    public nextCheck: Date;
    public redirectDetails: RedirectDetails;
    //errorDetails
    public errorDetails? :ErrorDetails;
    public history :[];


    constructor(init?:Partial<EndpointStatus>) {
        this.status = init?.status ?? Status.Pending;
        this.lastChecked = init?.lastChecked ?? new Date();
        this.nextCheck = init?.nextCheck ?? new Date();
        this.redirectDetails = init?.redirectDetails ?? new RedirectDetails();
        this.errorDetails = init?.errorDetails ?? null;
        this.history = [...this.history ?? []];
    }
}

export class ErrorDetails {
    public statusCode :Number;
    public description :string;

    constructor(init?:Partial<ErrorDetails>) {
        this.statusCode = init?.statusCode ?? 0;
        this.description = init?.description ?? '';
    }
}

export class RedirectDetails {
    public redirected: boolean = false;
    public url :string;

    constructor(init?:Partial<RedirectDetails>) {
        this.redirected = init?.redirected ?? false;
        this.url = init?.url ?? '';
    }
}