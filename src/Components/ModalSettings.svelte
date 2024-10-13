<script lang="ts">
    import Settings from '../Types/Settings';
    import { UiConstants, StoreConstants, SettingIntervalType } from '../Auxiliaries/Constants';
    import { settingsStore, saveSettings, deleteSettings } from '../Services/SettingsService';
    
    let settingId = '';
    let settings = new Settings();

    export function showModal(id: string) {
      settingId = id;
      settings = $settingsStore[id];
      if (settings == null) {
        settings = new Settings();
      }
      window.$(UiConstants.ModalSettings_IdSelector).modal('show');
    }


    async function uiOnSaveClicked() {
      await saveSettings(settingId, settings);
      window.$(UiConstants.ModalSettings_IdSelector).modal('hide');
    }

    async function uiOnDeleteClicked() {
      await deleteSettings(settingId);
      window.$(UiConstants.ModalSettings_IdSelector).modal('hide');
    }
    
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="ui modal" id="{UiConstants.ModalSettings_Id}">
  <div class="header">Settings</div>

  <div class="content">
    <form class="ui form">
      <h4 class="ui dividing header">Duration</h4>
      <div class="fields">
        <div class="six wide field">
          <input bind:value={settings.refreshInterval} type="number" class="form-control" id="refreshIntervalSec" placeholder="Interval">
        </div>
        <div class="three wide field">
          <select class="ui fluid search dropdown" bind:value={settings.intervalType}>
            <option value={SettingIntervalType.Minutes}>Minutes</option>
            <option value={SettingIntervalType.Seconds}>Seconds</option>
          </select>
        </div>
      </div>
      <div class="field">
        <div class="ui checkbox">
            <input bind:checked={settings.notifyOnStatusChange} type="checkbox" tabindex="0" class="hidden" id="notifyOnStatusChange">
            <label for="notifyOnStatusChange">Notify On Status Change</label>
        </div>
      </div>
    </form>
  </div>

  <div class="actions">
    <div class="ui cancel button">Cancel</div>
    {#if settingId != StoreConstants.DEFAULT_SETTINGS_ID }
      <button on:click={uiOnDeleteClicked} class="ui negative button">Delete</button>
    {/if}
    <button on:click={uiOnSaveClicked} class="ui primary button">Save</button>
  </div>
</div>

<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
<style>
</style>