<script lang="ts">
	import { enhance } from '$app/forms';
	import InteractiveMap from '../components/InteractiveMap.svelte'

	interface FacilityData {
		name: string,
		type: string,
		distance_miles: number
	}

	interface ClosestFacilitiesData {
		data: FacilityData[]
	}

	interface ClosestFacilitiesForm extends HTMLCollection {
		latitude: HTMLInputElement,
		longitude: HTMLInputElement,
		facilityType: HTMLInputElement,
		errorMessage: string,
		facilities: ClosestFacilitiesData
	}
	
	export let form: ClosestFacilitiesForm;
</script>

<h2>Get facilities closest to a location</h2>
<InteractiveMap />
<form method="POST" on:submit|preventDefault action="?/getClosestFacilities" style="display: table" use:enhance={() => {
	return async ({ update }) => {
		update({ reset: false });
	}}}>
	<fieldset>
	<label class="form-element">
		Latitude
		<input name="latitude"id="latitude" type="text" required value={form?.latitude ?? "44.30194"} class="form-element">
	</label>
	<label class="form-element">
		Longitude
		<input name="longitude" id="longitude" type="text" required value={form?.longitude ?? "-120.85251"} class="form-element">
	</label>
	<fieldset>
		<legend>Facility Type</legend>
		<label class="form-element">
			Campground
			<input name="facilityType" id="facilityTypeCampground" type="checkbox" value="Campground" checked>
		</label>
		<label class="form-element">
			Museum
			<input name="facilityType" id="facilityTypeMuseum" type="checkbox" value="Museum">
		</label>
		<label class="form-element">
			Visitor Center
			<input name="facilityType" id="facilityTypeVisitorCenter" type="checkbox" value="Visitor Center">
		</label>
	</fieldset>
	<label class="form-element">
		Number of sites
		<input name="limit" id="limit" type="number" required min="1" max="10" value="5" class="form-element">
	</label>
	<button class="form-element">Get closest sites</button>
</fieldset>
</form>

{#if form?.errorMessage }
	<p>{ form.errorMessage }</p>
{:else if form?.facilities?.data }
	<ol>
		{#each form.facilities.data as row }
			<li>{ row.name } ({ row.type }): { row.distance_miles } miles away</li>
		{/each}
	</ol>
{/if}

<style>
	.form-element {
		display: block;
		padding: 0.2rem;
		margin: 0.3rem;
		font-size: 1.3rem;
		line-height: 1.2;
	}
	button {
		background: blue;
		color: white;
		border-radius: 3px;
  	box-shadow: 0px 0px 12px -2px;
	}

	button:hover {
		filter: brightness(90%);
	}
	button:focus {
    outline: 1px solid white;
	}
	input {
		display: block;
		border: 1px solid;
	}
</style>