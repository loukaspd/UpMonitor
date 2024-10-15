<script lang="ts">
    import { onMount } from 'svelte';
    //----- <Internal Imports> -----//
    import {loadEndpoints, deleteAll, endpointsSearchInput} from './Services/EndpointsService';
    import {loadSettings} from './Services/SettingsService';
    import StorageService from './Services/StorageService';
    import { refreshAllEndpoints } from './Services/EndpointStatusService';

    import EndpointsTable from "./Components/EndpointsTable.svelte";
    import ButtonsComponent from "./Components/ButtonsComponent.svelte";
    import ModalEndpoint from "./Components/ModalEndpoint.svelte";
    import ModalSettings from "./Components/ModalSettings.svelte";
    import ModalHistory from "./Components/ModalHistory.svelte";
    //----- </Internal> -----//

    let modalEndpoint: ModalEndpoint;
    let modalSettings: ModalSettings;
    let modalHistory: ModalHistory;

    onMount(async () => {
        await loadSettings();
		await loadEndpoints();

        window.electronAPI.onLoadFileSelected((data:any) => {
            //const filePath :string = data.filePath;
            const fileContent :string = data.fileContent;
            StorageService.loadEnviroment(fileContent);
        })
	});

    function uiOnSearchInputChanged(event: CustomEvent<string>) {
        endpointsSearchInput.set(event.detail);
    }

    function uiOnAddClicked() {
        modalEndpoint.showModal(null);
    }

    function uiOnSettingsClicked(event: CustomEvent<string>) {
        modalSettings.showModal(event.detail);
    }

    function uiOnHistoryClicked(event: CustomEvent<string>) {
        modalHistory.showModal(event.detail);
    }

    function uiOnEditClicked(event: CustomEvent<string>) {
        modalEndpoint.showModal(event.detail);
    }

    async function uiOnDownloadClicked() {
        await StorageService.saveEnvironment();
    }

    function uiOnLoadClicked() {
        window.electronAPI.loadFileWithPicker();
    }

    function uiOnRefreshClicked() {
        refreshAllEndpoints();
    }

    function uiOnDeleteAllClicked() {
        window.$.modal({
            title: 'Delete all Endpoints?',
            class: 'mini',
            closable  : false,
            actions: [
            {
                text: 'Delete',
                class: 'red',
                click: function () {
                    deleteAll();
                }
            },
            {
                text: 'Cancel',
                class: 'cancel',
            },
            ]
        }).modal('show');
    }
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div style="padding:10px 10px 0px 10px">
    <ButtonsComponent
        on:searchInputChanged={uiOnSearchInputChanged}
        on:addClicked={uiOnAddClicked}
        on:settingsClicked={uiOnSettingsClicked}
        on:deleteAllClicked={uiOnDeleteAllClicked}
        on:downloadClicked={uiOnDownloadClicked}
        on:loadClicked={uiOnLoadClicked}
        on:refreshClicked={uiOnRefreshClicked}
    />

    <EndpointsTable
        on:settingsClicked={uiOnSettingsClicked}
        on:historyClicked={uiOnHistoryClicked}
        on:editClicked={uiOnEditClicked}
    />
    <ModalEndpoint bind:this={modalEndpoint}/>
    <ModalSettings bind:this={modalSettings}/>
    <ModalHistory bind:this={modalHistory}/>

</div>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
