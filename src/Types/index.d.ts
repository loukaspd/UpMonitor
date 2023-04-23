export {};

declare global {
    interface Window {
        $ :any;
        electronAPI :any;   //see preload.js for exposed methods
    }
}