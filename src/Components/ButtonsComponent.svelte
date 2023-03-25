<script lang="ts">
    //----- <Methods Imports> -----//
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import {StoreConstants} from '../Types/Constants';
    //----- </Methods Imports> -----//
    
    
    //----- <Ui-Callbacks> ----- //
    function uiOnAddClicked() {
        dispatch('addClicked');
    }
    function uiOnSettingsClicked() {
        dispatch('settingsClicked', StoreConstants.DEFAULT_SETTINGS_ID);
    }
    function uiOnDeleteAllClicked() {
        dispatch('deleteAllClicked');
    }
    //----- </Ui-Callbacks> ----- //
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="flex-container">
    <button class="ui right floated small negative labeled icon button" on:click={uiOnDeleteAllClicked}>
        <i class="close icon"></i> Delete All
    </button>
    <button class="ui right floated small labeled icon button" on:click={uiOnSettingsClicked}>
        <i class="edit icon"></i> Settings
    </button>
    <button class="ui right floated small primary labeled icon button" on:click={uiOnAddClicked}>
        <i class="plus icon"></i> Add
    </button>
</div>


<!-- ######################################## -->
<!-- Style  -->
<!-- ######################################## -->
<style>
    .flex-container {
        display: flex;

        justify-content:flex-end;
    }
</style>