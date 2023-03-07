<script>
    import { onMount } from 'svelte';
    //----- <Internal Imports> -----//
    import EndpointsTable from "./Components/EndpointsTable.svelte";
    import ModalEndpoint from "./Components/ModalEndpoint.svelte";
    import ModalSettings from "./Components/ModalSettings.svelte";
    import ModalHistory from "./Components/ModalHistory.svelte";
    import {loadEndpoints, deleteAll} from './Services/EndpointsService.js';
    import {loadSettings} from './Services/SettingsService.js';
    //----- </Internal> -----//

    let modalEndpoint;
    let modalSettings;
    let modalHistory;

    onMount(async () => {
        await loadSettings();
		await loadEndpoints();
	});

    function uiOnAddClicked() {
        modalEndpoint.showModal();
    }

    function uiOnSettingsClicked(event) {
        modalSettings.showModal(event.detail);
    }

    function uiOnHistoryClicked(event) {
        modalHistory.showModal(event.detail);
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
    <EndpointsTable 
        on:addClicked={uiOnAddClicked}
        on:settingsClicked={uiOnSettingsClicked}
        on:deleteAllClicked={uiOnDeleteAllClicked}
        on:historyClicked={uiOnHistoryClicked}/>
    <ModalEndpoint bind:this={modalEndpoint}/>
    <ModalSettings bind:this={modalSettings}/>
    <ModalHistory bind:this={modalHistory}/>

</div>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
