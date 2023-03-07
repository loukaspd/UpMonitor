<script>
    //<imports>
    import { UiConstants, Status } from '../Types/Constants';
    import {endpoitStatusHistory} from '../Services/EndpointStatusService';
    import {dateToStringHhMmSs} from '../Helpers/JsHelpers.js'
    //</imports>

    //<properties>
    let endpointDesc;
    let history = [];
    //</properties>

    export function showModal(endpointDescription) {
        endpointDesc = endpointDescription;
        history = endpoitStatusHistory[endpointDescription];
        console.log(history);

        window.$(UiConstants.ModalHistory_IdSelector).modal('show');
    }
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="ui modal" id="{UiConstants.ModalHistory_Id}">
    <div class="header">{endpointDesc}</div>

    <div class="scrolling content">
        <div class="ui feed">
            {#each history as h (h.lastChecked.toString())}
            <div class="event">
                <div class="label">
                    {#if h.status === Status.Success}
                        <i class="icon checkmark positive"></i>
                    {:else}
                        <i class="icon times negative"></i>
                    {/if}
                </div>
                <div class="content">
                    <div class="summary">
                        
                        {#if h.status === Status.Success}
                            <span class="positive">Success</span>
                        {:else}
                            <span class="negative">Error</span>
                        {/if}
                        <div class="date">{dateToStringHhMmSs(h.lastChecked)}</div>
                    </div>
                </div>
            </div>
            {/each}
          </div>
    </div>
</div>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
<style>
.positive {
    color: #2c662d !important;
}

.negative {
    color: #9f3a38 !important;
}
</style>