export enum Status {
    Pending =1,
    Success =2,
    Error =3
};

export enum SettingIntervalType {
    Seconds = 'Seconds',
    Minutes = 'Minutes'
}

export enum MoveDirection {
    Up = 1,
    Down = 2
}

export const StatusDescription = {
    1: "Pending",
    2: "Success",
    3: "Error"
};

export const StoreConstants = {
    DEFAULT_SETTINGS_ID: '_'
}

export const UiConstants = {
    ModalEndpoint_Id: 'modal_endpoint',
    ModalEndpoint_IdSelector : '#modal_endpoint',

    ModalSettings_Id: 'modal_settings',
    ModalSettings_IdSelector: '#modal_settings',

    ModalHistory_Id: 'modal_history',
    ModalHistory_IdSelector: '#modal_history',
};