<script>
    import { onDestroy, createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    //----- <Internal Imports> -----//
    import {deleteItem} from '../Services/EndpointsService';
    import {endpoitStatusStore, addEndpoint, updateStatus} from '../Services/EndpointStatusService';
    import {Status} from '../Types/Constants';
    import {dateToStringHhMmSs} from '../Helpers/JsHelpers.js'
    //----- </Internal Imports> -----//

    //----- <Exported Variables> -----//
    export let endpoint;
    //----- </Exported Variables> -----//

    addEndpoint(endpoint);

    let endpointStatus;
    const unsubscribe = endpoitStatusStore.subscribe((statuses) => {
        endpointStatus = statuses[endpoint.description];
        if (!endpointStatus) {
            endpointStatus = {status: Status.Pending};
        }
    });

    function checkEndpoint() {
        updateStatus(endpoint);
    }

    function uiOnDeleteClicked() {
        deleteItem(endpoint);
    }

    function uiOnRefreshClicked() {
        checkEndpoint();
    }

    function uiOnSettingsClicked() {
        dispatch('settingsClicked', endpoint.description);
    }

    //----- <Svente-LifeCycle> -----//
    onDestroy(unsubscribe);
    //----- </Svente-LifeCycle> -----/
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<tr>
    <td><b>{endpoint.description}</b></td>
    <td>
        <a href="{endpoint.url}" target="_blank" rel="noreferrer">{endpoint.url}</a>
        <br>
        {#if endpointStatus.status !== Status.Pending}
            <p >last checked: {dateToStringHhMmSs(endpointStatus.lastChecked)}</p>
        {/if}
        
    </td>
    <td 
    class:positive="{endpointStatus.status === Status.Success}"
    class:negative="{endpointStatus.status === Status.Error}"
    >
        {#if endpointStatus.status === Status.Pending}
            <!-- <a href="#" title="loading" data-toggle="tooltip"><i class="material-icons">&#xe627;</i></a> -->
            <div class="loader"></div>
        {:else if endpointStatus.status === Status.Error}
            <span>
                <i class="icon times"></i> Error
                <br/>StatusCode: {endpointStatus.statusCode || '-'}
                <br/>Description: {endpointStatus.description}
            </span>
        {:else if endpointStatus.status === Status.Success}
            <i class="icon checkmark"></i> Success
        {/if}
    </td>
    <td class="single line">
        <a on:click={uiOnDeleteClicked} href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE5C9;</i></a>

        <a on:click={uiOnSettingsClicked} href="#" class="settings" title="Settings" data-toggle="tooltip" style="color:gray"><i class="material-icons">settings</i></a>

        <a on:click={uiOnRefreshClicked} href="#" class="refresh" title="Refresh" data-toggle="tooltip"><i class="material-icons">&#xe5d5;</i></a>
    </td>
</tr>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
<style>
.loader {
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid gray;
  width: 25px;
  height: 25px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 1.5s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>