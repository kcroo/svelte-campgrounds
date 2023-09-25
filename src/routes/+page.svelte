<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if data.data}
	<ol>
		{#each data.data as row }
		<li>{ row.name } ({ row.type }): { row.distance_miles } miles away</li>
		{/each}
	</ol>
{/if}
