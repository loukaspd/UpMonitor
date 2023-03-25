export default class EndpointInfo {
    public description :string;
    public url :string;

    constructor(init?:Partial<EndpointInfo>) {
        this.description = init?.description ?? '';
        this.url = init?.url ?? '';
    }
}