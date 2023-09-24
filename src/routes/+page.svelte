<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#each data.data as row }
  <p>Rec area is {row.name}</p>
	<p>{@html row.description}</p>
{/each}
