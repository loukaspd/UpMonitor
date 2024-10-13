<script lang="ts">
    import { onDestroy, createEventDispatcher } from 'svelte';
    const evntSettingsDispatcher = createEventDispatcher<{ settingsClicked: string }>();
    const evntHistoryDispatcher = createEventDispatcher<{ historyClicked: string }>();
    const evntEditDispatcher = createEventDispatcher<{ editClicked: string }>();
    //----- <Internal Imports> -----//
    import {MoveDirection} from '../Auxiliaries/Constants';
    import EndpointStatus from '../Types/EndpointStatus'
    import type EndpointInfo from '../Types/EndpointInfo';
    import {changeOrder, deleteItem} from '../Services/EndpointsService';
    import {endpoitStatusStore, addEndpoint, updateStatus} from '../Services/EndpointStatusService';
    import {deleteSettings, settingsStore} from '../Services/SettingsService'
    import {Status} from '../Auxiliaries/Constants';
    import {dateToStringHhMmSs} from '../Helpers/JsHelpers'
    //----- </Internal Imports> -----//

    //----- <Exported Variables> -----//
    export let endpoint :EndpointInfo;
    export let firstItem: boolean;
    export let lastItem: boolean;
    //----- </Exported Variables> -----//

    addEndpoint(endpoint);

    let endpointStatus :EndpointStatus;
    const endpointStatusUnsubscr = endpoitStatusStore.subscribe((statuses) => {
        endpointStatus = statuses[endpoint.id] as EndpointStatus;
        if (!endpointStatus) {
            endpointStatus = new EndpointStatus();
        }
    });
    let settingsActive :boolean;
    const settingsUnsubscr = settingsStore.subscribe((settings) => {
        settingsActive = !!settings[endpoint.id];
    })

    function checkEndpoint() {
        updateStatus(endpoint);
    }

    function settingsClicked() {
        evntSettingsDispatcher('settingsClicked', endpoint.id);
    }

    function showHistory() {
        evntHistoryDispatcher('historyClicked', endpoint.id);
    }

    function editClicked() {
        evntEditDispatcher('editClicked', endpoint.id);
    }

    function showResponse() {
        window.$.modal({
            title: '',
            content: endpointStatus.errorDetails.description,
            class: 'small',
            closable  : true,
            actions: [
            {
                text: 'Ok',
                class: 'ok',
            }]
        }).modal('show');
    }

    //----- Ui Callbacks -----//
    function uiOnDeleteClicked() {
        deleteItem(endpoint);
        deleteSettings(endpoint.id);
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

    function uiOnShowResponseClicked() {
        showResponse();
    }

    function uiOnEditClicked() {
        editClicked();
    }

    function uiOnMoveUpClicked() {
        changeOrder(endpoint.id, MoveDirection.Up);
    }

    function uiOnMoveDownClicked() {
        changeOrder(endpoint.id, MoveDirection.Down);
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
    <td class="collapsing">
        <div class="ui fitted slider checkbox">
            {#if firstItem == false}
                <a on:click={uiOnMoveUpClicked} href={'#'} title="moveUp" data-toggle="tooltip"><i class="material-icons">arrow_upward</i></a>
            {/if}

            {#if lastItem == false}
                <a on:click={uiOnMoveDownClicked} href={'#'} title="moveUp" data-toggle="tooltip"><i class="material-icons">arrow_downward</i></a>
            {/if}
        </div>
    </td>
    <td><b>{endpoint.description}</b></td>
    <td>
        <a href="{endpoint.url}" target="_blank" rel="noreferrer">{endpoint.url}</a>
        <!-- Redirect Info -->
        {#if endpointStatus.redirectDetails.redirected}
            <br>
            <i class="material-icons">warning</i>
            <span>redirected to: {endpointStatus.redirectDetails.url}</span>
        {/if}
        <!-- Last Checked-->
        {#if endpointStatus.status !== Status.Pending}
            <br>
            <span>last checked: {dateToStringHhMmSs(endpointStatus.lastChecked)}</span>
            <br>
            <span>next check: {dateToStringHhMmSs(endpointStatus.nextCheck)}</span>
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
                <br/>StatusCode: {endpointStatus.errorDetails.statusCode || '-'}
                <br/><a href={'#'} on:click={uiOnShowResponseClicked}>Response</a>
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

        <a on:click={uiOnEditClicked} href={'#'} class="edit" title="Edit" data-toggle="tooltip" style="color:black;"><i class="material-icons">edit</i></a>
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