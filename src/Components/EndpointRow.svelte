<script lang="ts">
    import { onDestroy, createEventDispatcher } from 'svelte';
    const evntSettingsDispatcher = createEventDispatcher<{ settingsClicked: string }>();
    const evntHistoryDispatcher = createEventDispatcher<{ historyClicked: string }>();
    //----- <Internal Imports> -----//
    import EndpointStatus from '../Types/EndpointStatus'
    import type EndpointInfo from '../Types/EndpointInfo';
    import {deleteItem} from '../Services/EndpointsService';
    import {endpoitStatusStore, addEndpoint, updateStatus} from '../Services/EndpointStatusService';
    import {settingsStore} from '../Services/SettingsService'
    import {Status} from '../Auxiliaries/Constants';
    import {dateToStringHhMmSs} from '../Helpers/JsHelpers'
    //----- </Internal Imports> -----//

    //----- <Exported Variables> -----//
    export let endpoint :EndpointInfo;
    //----- </Exported Variables> -----//

    addEndpoint(endpoint);

    let endpointStatus :EndpointStatus;
    const endpointStatusUnsubscr = endpoitStatusStore.subscribe((statuses) => {
        endpointStatus = statuses[endpoint.description] as EndpointStatus;
        if (!endpointStatus) {
            endpointStatus = new EndpointStatus();
        }
    });
    let settingsActive :boolean;
    const settingsUnsubscr = settingsStore.subscribe((settings) => {
        settingsActive = !!settings[endpoint.description];
    })

    function checkEndpoint() {
        updateStatus(endpoint);
    }

    function settingsClicked() {
        evntSettingsDispatcher('settingsClicked', endpoint.description);
    }

    function showHistory() {
        evntHistoryDispatcher('historyClicked', endpoint.description);
    }

    //----- Ui Callbacks -----//
    function uiOnDeleteClicked() {
        deleteItem(endpoint);
    }

    function uiOnRefreshClicked() {
        checkEndpoint();
    }

    function uiOnSettingsClicked() {
        settingsClicked();
    }

    function uiOnHistoryClicked() {
        showHistory();
    }

    //----- <Svente-LifeCycle> -----//
    onDestroy(endpointStatusUnsubscr);
    onDestroy(settingsUnsubscr);
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
            <p>last checked: {dateToStringHhMmSs(endpointStatus.lastChecked)}</p>
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
        <a on:click={uiOnDeleteClicked} href={'#'} class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE5C9;</i></a>

        <a on:click={uiOnSettingsClicked} href={'#'} class="settings" title="Settings" data-toggle="tooltip"
            class:gray="{!settingsActive}"><i class="material-icons">settings</i></a>

        <a on:click={uiOnRefreshClicked} href={'#'} class="refresh" title="Refresh" data-toggle="tooltip"><i class="material-icons">&#xe5d5;</i></a>

        <a on:click={uiOnHistoryClicked} href={'#'} class="settings" title="History" data-toggle="tooltip" style="color:black;"><i class="material-icons">work_history</i></a>
    </td>
</tr>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
<style>

/* -----Settings color */
.gray {
    color:gray !important;
}

/* -----Loader */
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