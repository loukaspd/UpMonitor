<script>
    import EndpointInfo from '../Types/EndpointInfo';
    import { saveEndpoint } from '../Services/EndpointsService';

    let endpoint = new EndpointInfo();

    async function uiOnSaveClicked() {
        //TODO validate form
        await saveEndpoint(endpoint);
        //close modal
        window.$('#modal_endpoint').modal('hide');
    }
    
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="modal fade" id="modal_endpoint" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form>
                <!-- Description -->
                <div class="form-group">
                  <label for="description">Description</label>
                  <input bind:value={endpoint.description} type="text" class="form-control" id="description" placeholder="Description">
                </div>
                <!-- Url -->
                <div class="form-group">
                  <label for="url">Url</label>
                  <input bind:value={endpoint.url} type="text" class="form-control" id="url" placeholder="Url">
                </div>
              </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button on:click={uiOnSaveClicked} type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>

<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
<style>
</style>