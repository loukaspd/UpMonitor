<script lang="ts">
    import EndpointInfo from '../Types/EndpointInfo';
    import { saveEndpoint, endpointExists } from '../Services/EndpointsService';
    import { UiConstants } from '../Auxiliaries/Constants';
    import { showErrorToast, showSuccessToast } from '../Auxiliaries/UiHelpers'
    
    let https = '';
    let endpoint = new EndpointInfo();

    export function showModal() {
      endpoint = new EndpointInfo();
      https = 'https://';
      window.$(UiConstants.ModalEndpoint_IdSelector).modal('show');
    }


    async function uiOnSaveClicked() {
        //<Validation>
        if (!endpoint.description) {
          showErrorToast('Description is required');
          return;
        }
        const exists = await endpointExists(endpoint.description);
        if (exists) {
          showErrorToast('Description exists');
          return;
        }
        //</Validation>


        endpoint.url = https + endpoint.url;
        await saveEndpoint(endpoint);
        await showSuccessToast('endpoint created');
        //close modal
        window.$(UiConstants.ModalEndpoint_IdSelector).modal('hide');
    }

    //this is triggered on blur
    async function uiOnUrlChange() {
      if (!endpoint.url.startsWith('https://') 
        && !endpoint.url.startsWith('http://')) {
        return;
      }

      const index = endpoint.url.indexOf('://');
      https = endpoint.url.substring(0, index+3);
      endpoint.url = endpoint.url.substring(index+3);
    }

    //this is triggered on every key press
    async function uiOnUrlInput() {
      //console.log('input',e.target.value);
    }
    
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="ui modal" id="{UiConstants.ModalEndpoint_Id}">
  <div class="header">Add Endpoint</div>

  <div class="content">
    <form class="ui form">
      <!-- Row-1: Description-->
      <div class="field">
        <label for="description">Description</label>
        <input bind:value={endpoint.description} type="text" class="form-control" id="description" placeholder="Description">
      </div>
      <!-- Row-2-->
      <h4 class="ui dividing header">Url</h4>
      <div class="fields">
        <div class="two wide field">
          <select class="ui fluid search dropdown" bind:value={https}>
            <option value="https://">https://</option>
            <option value="http://">http://</option>
          </select>
        </div>
        <div class="fifteen wide field">
          <input type="text" class="form-control" id="url" placeholder="Url"
            bind:value={endpoint.url} 
            on:input={uiOnUrlInput}
            on:change={uiOnUrlChange}
          >
        </div>
      </div>
    </form>
  </div>

  <div class="actions">
    <div class="ui negative button">Cancel</div>
    <button on:click={uiOnSaveClicked} class="ui primary button">Save</button>
  </div>
</div>

<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
<style>
</style>