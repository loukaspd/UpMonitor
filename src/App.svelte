<svelte:head>
	<!-- Material Icons -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

	<!-- jquery -->
	<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js" on:load={onJqueryLoaded}></script>
	<!-- Fomantic ui-->
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.1/dist/semantic.min.css">
	<script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.1/dist/semantic.min.js"></script>
</svelte:head>

<script>
	import Main from './Main.svelte';

	let jQueryLoaded = false;

	function onJqueryLoaded() {
		console.log('jQuery loaded');
		jQueryLoaded = true;
	}
</script>

{#if jQueryLoaded}
	<Main />
{:else}
	<h1> loading...</h1>
{/if}