<script lang="ts">
    //----- <Methods Imports> -----//
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import {StoreConstants} from '../Auxiliaries/Constants';
    //----- </Methods Imports> -----//
    
    
    //----- <Ui-Callbacks> ----- //
    function uiOnUploadClicked() {
        dispatch('loadClicked');
    }
    function uiOnDownloadClicked() {
        dispatch('downloadClicked');
    }
    function uiOnAddClicked() {
        dispatch('addClicked');
    }
    function uiOnSettingsClicked() {
        dispatch('settingsClicked', StoreConstants.DEFAULT_SETTINGS_ID);
    }
    function uiOnDeleteAllClicked() {
        dispatch('deleteAllClicked');
    }
    function uiOnRefreshClicked() {
        dispatch('refreshClicked');
    }
    //----- </Ui-Callbacks> ----- //
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="flex-container" style="justify-content:flex-end;">

    <div class="flex-container" style="flex-grow:1">
        <button class="ui small labeled icon button" on:click={uiOnDownloadClicked}>
            <i class="save icon"></i> Save
        </button>

        <button class="ui small primary labeled icon button" on:click={uiOnUploadClicked}>
            <i class="upload icon"></i> Load
        </button>
    </div>

    <div class="flex-container">
        <button class="ui small secondary icon button" on:click={uiOnRefreshClicked}>
            <i class="play icon"></i> Refresh
        </button>
        <button class="ui small negative icon button" on:click={uiOnDeleteAllClicked}>
            <i class="close icon"></i> Delete All
        </button>
        <button class="ui small icon button" on:click={uiOnSettingsClicked}>
            <i class="edit icon"></i> Settings
        </button>
        <button class="ui small primary labeled icon button" on:click={uiOnAddClicked}>
            <i class="plus icon"></i> Add
        </button>
    </div>
</div>


<!-- ######################################## -->
<!-- Style  -->
<!-- ######################################## -->
<style>
    .flex-container {
        display: flex;
    }
</style>