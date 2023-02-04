<script>
    //----- <Methods Imports> -----//
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    //----- </Methods Imports> -----//

    //----- <Internal Imports> -----//
    import EndpointRow from './EndpointRow.svelte';
    import {appStore} from '../Store.js';
    //----- </Internal Imports> -----//

    //----- <Ui-Callbacks> ----- //
    function uiOnAddClicked() {
        dispatch('addClicked');
    }
    function uiOnSettingsClicked() {
        dispatch('settingsClicked');
    }
    //----- </Ui-Callbacks> ----- //
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<table class="ui compact celled table">
    <thead>
        <tr>
            <!-- <th>#</th> -->
            <th>Name</th>						
            <th>Url</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        {#each $appStore as endpoint (endpoint.description)}
            <EndpointRow {endpoint} />
        {/each}
    </tbody>
    <tfoot class="full-width">
        <tr>
            <th colspan="4">
            <button class="ui right floated small primary labeled icon button" on:click={uiOnAddClicked}>
                <i class="plus icon"></i> Add
            </button>
            <button class="ui right floated small primary labeled icon button" on:click={uiOnSettingsClicked}>
                <i class="plus icon"></i> Settings
            </button>
            </th>
        </tr>
    </tfoot>
</table>