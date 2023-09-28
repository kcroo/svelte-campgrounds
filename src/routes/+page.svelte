<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	
	export let form: ActionData;
</script>

<form method="POST" action="?/getClosestFacilities" use:enhance>
	<label>
		Latitude
		<input name="latitude"id="latitude" type="text" value="44.30194">
	</label>
	<label>
		Longitude
		<input name="longitude" id="longitude" type="text" value="-120.85251">
	</label>
	<label>
		Number of sites
		<input name="limit" id="limit" type="number" min="1" max="10" value="5">
	</label>
	<button>Get closest sites</button>
</form>

{#if form?.facilities?.data }
	<ol>
		{#each form.facilities.data as row }
			<li>{ row.name } ({ row.type }): { row.distance_miles } miles away</li>
		{/each}
	</ol>
{/if}
