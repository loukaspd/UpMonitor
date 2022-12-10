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
                console.log(response);
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
    <td>1</td>
    <td>{endpoint.description}</td>
    <td><a href="{endpoint.url}">{endpoint.url}</a></td>
    <td>
        {#if status === Status.Pending}
            <a href="#" title="loading" data-toggle="tooltip"><i class="material-icons">&#xe627;</i></a>
        {:else if status === Status.Error}
            <span class="status text-danger">&bull;</span> Error
        {:else if status === Status.Success}
            <span class="status text-success">&bull;</span> Success
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