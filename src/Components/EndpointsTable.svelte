<script>
    //----- <Methods Imports> -----//
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    //----- </Methods Imports> -----//

    //----- <Internal Imports> -----//
    import EndpointRow from './EndpointRow.svelte';
    import {appStore} from '../Store.js';
    //----- </Internal Imports> -----//

    //----- <Ui-Callbacks> ----- //
    function uiOnAddClicked() {
        dispatch('addClicked');
    }
    //----- </Ui-Callbacks> ----- //
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="table-responsive">
    <div class="table-wrapper">
        <div class="table-title">
            <div class="row">
                <div class="col-sm-5">
                    <h2>Endpoints</h2>
                </div>
                <div class="col-sm-7">
                    <a href="#" class="btn btn-secondary" on:click={uiOnAddClicked}><i class="material-icons">&#xE147;</i> <span>Add</span></a>				
                </div>
            </div>
        </div>
        <table class="table table-striped table-hover">
            <!-- <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>						
                    <th>Url</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead> -->
            <tbody>
                {#each $appStore as endpoint (endpoint.description)}
                    <EndpointRow {endpoint} />
                {/each}
            </tbody>
        </table>

        <!-- Pagination -->
        <!-- <div class="clearfix">
            <div class="hint-text">Showing <b>5</b> out of <b>25</b> entries</div>
            <ul class="pagination">
                <li class="page-item disabled"><a href="#">Previous</a></li>
                <li class="page-item"><a href="#" class="page-link">1</a></li>
                <li class="page-item"><a href="#" class="page-link">2</a></li>
                <li class="page-item active"><a href="#" class="page-link">3</a></li>
                <li class="page-item"><a href="#" class="page-link">4</a></li>
                <li class="page-item"><a href="#" class="page-link">5</a></li>
                <li class="page-item"><a href="#" class="page-link">Next</a></li>
            </ul>
        </div> -->
    </div>
</div>