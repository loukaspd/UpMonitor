<script lang="ts">
    //<imports>
    import { UiConstants, Status } from '../Auxiliaries/Constants';
    import {endpoitStatusHistory, historyClear} from '../Services/EndpointStatusService';
    import {dateToStringHhMmSs} from '../Helpers/JsHelpers'
    //</imports>

    //<properties>
    let endpointDesc :string;
    //</properties>

    export function showModal(endpointDescription: string) {
        endpointDesc = endpointDescription;

        window.$(UiConstants.ModalHistory_IdSelector).modal('show');
    }

    async function uiOnClearClicked() {
        historyClear(endpointDesc);
    }
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="ui modal" id="{UiConstants.ModalHistory_Id}">
    <div class="basic header">{endpointDesc}</div>

    <div class="scrolling content">
        <div class="ui feed">
            {#each $endpoitStatusHistory[endpointDesc] ?? [] as h (h.lastChecked.toString())}
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

    <!-- Actions -->
    <div class="basic actions">
        <button on:click={uiOnClearClicked} class="ui negative button" style="color:white !important">Clear History</button>
        <div class="ui approve button">Close</div>
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