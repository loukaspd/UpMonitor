import { JsHelpers } from "../Helpers/JsHelpers";

export default class EndpointInfo {
    public id:string;
    public description :string;
    public url :string;

    constructor(init?:Partial<EndpointInfo>) {
        this.id = init?.id ?? JsHelpers.newGuid();
        this.description = init?.description ?? '';
        this.url = init?.url ?? '';
    }
}