<script>
    import { onMount } from 'svelte';
    //----- <Internal Imports> -----//
    import EndpointsTable from "./Components/EndpointsTable.svelte";
    import ModalEndpoint from "./Components/ModalEndpoint.svelte";
    import {loadEndpoints, deleteAll} from './Services/EndpointsService.js';
  import { UiConstants } from './Types/Constants';
    //----- </Internal> -----//

    onMount(async () => {
		await loadEndpoints();
	});

    function uiOnAddClicked() {
        window.$(UiConstants.ModalEndpoint_IdSelector).modal('show');
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
        on:deleteAllClicked={uiOnDeleteAllClicked}/>
    <ModalEndpoint />

</div>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
