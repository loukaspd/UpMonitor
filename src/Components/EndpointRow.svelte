<script>
    import { onMount } from 'svelte';
    //----- <Internal Imports> -----//
    import {deleteItem} from '../Services/EndpointsService';
    import {Status} from '../Types/Constants';
    //----- </Internal Imports> -----//

    onMount(async () => {
		await checkEndpoint();
	});

    export let endpoint;
    let status = Status.Pending;

    function checkEndpoint() {
        status = Status.Pending;
        fetch(endpoint.url)
            .then(response => {
                if (response.ok) {
                    status = Status.Success;
                } else {
                    status = Status.Error;
                }
            })
            .catch(error => {
                console.log(error);
                status = Status.Error;
            });
    }

    function uiOnDeleteClicked() {
        deleteItem(endpoint);
    }

    function uiOnRefreshClicked() {
        checkEndpoint();
    }
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<tr>
    <td><b>{endpoint.description}</b></td>
    <td>
        <a href="{endpoint.url}">{endpoint.url}</a>
        <br>
        {#if status !== Status.Pending}
            <p >last checked:</p>
        {/if}
        
    </td>
    <td 
    class:positive="{status === Status.Success}"
    class:negative="{status === Status.Error}"
    >
        {#if status === Status.Pending}
            <!-- <a href="#" title="loading" data-toggle="tooltip"><i class="material-icons">&#xe627;</i></a> -->
            <div class="loader"></div>
        {:else if status === Status.Error}
            <i class="icon times"></i> Error
        {:else if status === Status.Success}
            <i class="icon checkmark"></i> Success
        {/if}
    </td>
    <td>
        <a on:click={uiOnDeleteClicked} href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE5C9;</i></a>

        <a on:click={uiOnRefreshClicked} href="#" class="refresh" title="Refresh" data-toggle="tooltip"><i class="material-icons">&#xe5d5;</i></a>
    </td>
</tr>


<!-- ######################################## -->
<!-- Styles -->
<!-- ######################################## -->
<style>
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