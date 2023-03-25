<script lang="ts">
    //----- <Methods Imports> -----//
    //----- </Methods Imports> -----//

    //----- <Internal Imports> -----//
    import EndpointRow from './EndpointRow.svelte';
    import {endpoitsStore} from '../Services/EndpointsService';
    //----- </Internal Imports> -----//
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
        {#each $endpoitsStore as endpoint (endpoint.description)}
            <EndpointRow {endpoint}
            on:settingsClicked
            on:historyClicked/>
        {/each}
    </tbody>
</table>