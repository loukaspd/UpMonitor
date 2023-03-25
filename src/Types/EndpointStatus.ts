import { Status } from "./Constants"

export default class EndpointStatus {
    public status :Status = Status.Pending;
    public lastChecked :Date;
    //errorDetails
    public statusCode :Number;
    public description :string;
    public history :[];
}