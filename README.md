# Up-Monitor

## About
Electron app build with Svelte for Monitoring Up status of Endpoints

## Download Windows Installer
Download [latest release](http://github.com/loukaspd/UpMonitor/releases/latest) installer.

## Development
1. Install dependencies
``` bash
$ yarn # or npm install
```

1. Start electron application with hot reload for dev
``` bash
$ yarn electron-dev # or npm run electron-dev
```

## Release
|Command|Description|
|--|--|
|`yarn electron:windows`| Generates windows installer on folder dist |
|`yarn release:windows`| Generates windows installer and uploads it to github release as draft |


## Used libraries
- [create-svelte-electron-app](https://github.com/soulehshaikh99/create-svelte-electron-app) create Electron application with Svelte