<script>
    import { onMount } from 'svelte';
    //----- <Internal Imports> -----//
    import EndpointsTable from "./Components/EndpointsTable.svelte";
    import ModalEndpoint from "./Components/ModalEndpoint.svelte";
    import ModalSettings from "./Components/ModalSettings.svelte";
    import {loadEndpoints, deleteAll} from './Services/EndpointsService.js';
    import {loadSettings} from './Services/SettingsService.js';
    import {StoreConstants} from './Types/Constants.js'
    //----- </Internal> -----//

    let modalEndpoint;
    let modalSettings;

    onMount(async () => {
		await loadEndpoints();
        await loadSettings();
	});

    function uiOnAddClicked() {
        modalEndpoint.showModal();
    }

    function uiOnSettingsClicked(event) {
        console.log(event.detail);
        modalSettings.showModal(event.detail);
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
        on:deleteAllClicked={uiOnDeleteAllClicked}/>
    <ModalEndpoint bind:this={modalEndpoint}/>
    <ModalSettings bind:this={modalSettings}/>

</div>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
