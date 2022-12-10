<script>
    import { onMount } from 'svelte';
    //----- <Internal Imports> -----//
    import EndpointsTable from "./Components/EndpointsTable.svelte";
    import ModalEndpoint from "./Components/ModalEndpoint.svelte";
    import {loadEndpoints} from './Services/EndpointsService.js';
    //----- </Internal> -----//

    onMount(async () => {
		await loadEndpoints();
	});

    function uiOnAddClicked() {
        if (! (!!window.$)) {
            alert('jQuery is not loaded');
            return;
        }

        window.$('#modal_endpoint').modal('show');
    }
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="container-xl">
    <EndpointsTable on:addClicked={uiOnAddClicked}/>
    <ModalEndpoint />

</div>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
