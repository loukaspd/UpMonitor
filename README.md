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

### Generate Windows Installer (on folder `dist`)
```bash
yarn electron:windows
```

### Generate windows installer and upload to github release as draft
```
yarn release:windows
```

You first need assign github access token to an environment variable  
On macOS/linux:
```
export GH_TOKEN="<YOUR_TOKEN_HERE>"
```
On Windows, run in powershell:
```
[Environment]::SetEnvironmentVariable("GH_TOKEN","<YOUR_TOKEN_HERE>","User")
```
Make sure to restart your IDE/Terminal to inherit latest env variable.


## Used libraries
- [create-svelte-electron-app](https://github.com/soulehshaikh99/create-svelte-electron-app) create Electron application with Svelte