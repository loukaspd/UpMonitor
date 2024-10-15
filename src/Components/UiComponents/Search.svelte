<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher<{ searchInputChanged: string }>();
    //#region <Props>
    export let placeholder:string;
    //#endregion </Props>

    let _input = '';

    function throwInputChangeEvent() {
        dispatch('searchInputChanged', _input);
    }

    function uiOnClearClicked() {
        _input = '';
        throwInputChangeEvent();
    }

    function uiOnInputChanged() {
        throwInputChangeEvent();
    }
</script>


<!-- ######################################## -->
<!-- Render  -->
<!-- ######################################## -->
<div class="search-container">
    <span class="search-icon">&#128269;</span>
    <input type="text" class="search-input" id="search-input"
    placeholder={placeholder}
    bind:value={_input}
    on:keyup={uiOnInputChanged}
    >
    <!-- Clear icon -->
    <button class="clear-icon" id="clear-icon"
    on:click={uiOnClearClicked}
    style:display={!_input ? 'none' : ''}
    >&times;</button>
</div>

<style>
    .search-container {
        position: relative;
        width: 400px;
        font-size: 14px;
    }

    .search-input {
        width: 100%;
        padding: 10px 15px 10px 45px; /* Adjust padding to leave space for the icon on the left */
        border-radius: 20px; /* Fully rounded search bar */
        border: 1px solid #d3d4d8;
        background-color: #fff;
        font-size: 15px;
        color: #2d333a;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .search-input:focus {
        border-color: #2684ff;
        box-shadow: 0 0 0 3px rgba(38, 132, 255, 0.1);
    }

    .search-icon {
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
        font-size: 18px;
        color: #6f7782;
    }

    .clear-icon {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        font-size: 18px;
        color: #6f7782;
        cursor: pointer;
    }
</style>