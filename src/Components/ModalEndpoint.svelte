<script>
    import { onMount } from 'svelte';
    import EndpointInfo from '../Types/EndpointInfo';
    import { saveEndpoint } from '../Services/EndpointsService';
    import {UiConstants} from '../Types/Constants';
    
    
    let endpoint = new EndpointInfo();

    setTimeout(() => {
        window.$(UiConstants.ModalEndpoint_IdSelector).on('show.bs.modal', function (e) {
          console.log('hello');
          endpoint = new EndpointInfo();
        });
      }, 1000);


    async function uiOnSaveClicked() {
        //TODO validate form
        await saveEndpoint(endpoint);
        //close modal
        //window.$('#modal_endpoint').modal('hide');
    }
    
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="ui modal" id="{UiConstants.ModalEndpoint_Id}">
  <div class="header">Add Endpoint</div>

  <div class="content">
    <form class="ui form">
      <div class="field">
        <label for="description">Description</label>
        <input bind:value={endpoint.description} type="text" class="form-control" id="description" placeholder="Description">
      </div>
      <div class="field">
        <label for="url">Url</label>
        <input bind:value={endpoint.url} type="text" class="form-control" id="url" placeholder="Url">
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