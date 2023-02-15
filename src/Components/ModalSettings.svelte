<script>
    import Settings from '../Types/Settings';
    import { UiConstants } from '../Types/Constants';
    import { settingsStore, saveSettings } from '../Services/SettingsService';
    
    let settingId = '';
    let settings = new Settings();

    export function showModal(id) {
      settingId = id;
      settings = $settingsStore[id];
      if (settings == null) {
        settings = new Settings();
      }
      window.$(UiConstants.ModalSettings_IdSelector).modal('show');
    }


    async function uiOnSaveClicked() {
      await saveSettings(settingId, settings);
    }
    
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="ui modal" id="{UiConstants.ModalSettings_Id}">
  <div class="header">Settings</div>

  <div class="content">
    <form class="ui form">
      <div class="field">
        <label for="refreshIntervalSec">Refresh Interval (Sec)</label>
        <input bind:value={settings.refreshIntervalSec} type="number" class="form-control" id="refreshIntervalSec" placeholder="Description">
      </div>
      <div class="field">
        <div class="ui checkbox">
            <input bind:checked={settings.notifyOnError} type="checkbox" tabindex="0" class="hidden" id="notifyOnError">
            <label for="notifyOnError">Notify On Error</label>
        </div>
      </div>
    </form>
  </div>

  <div class="actions">
    <div class="ui negative button">Cancel</div>
    <button on:click={uiOnSaveClicked} class="ui approve button">Save</button>
  </div>
</div>

<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
<style>
</style>