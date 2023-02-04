<script>
    import { onMount } from 'svelte';
    //----- <Internal Imports> -----//
    import EndpointsTable from "./Components/EndpointsTable.svelte";
    import ModalEndpoint from "./Components/ModalEndpoint.svelte";
    import {loadEndpoints} from './Services/EndpointsService.js';
  import { UiConstants } from './Types/Constants';
    //----- </Internal> -----//

    onMount(async () => {
		await loadEndpoints();
	});

    function uiOnAddClicked() {
        if (! (!!window.$)) {
            alert('jQuery is not loaded');
            return;
        }

        window.$(UiConstants.ModalEndpoint_IdSelector).modal('show');
    }
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div style="padding:10px 10px 0px 10px">
    <EndpointsTable on:addClicked={uiOnAddClicked}/>
    <ModalEndpoint />

</div>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
