import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';

const validFacilityTypes = ['Campground', 'Museum', 'Visitor Center'];
const isFacilityType = (x: string): x is App.FacilityType => validFacilityTypes.includes(x);

export const load: PageServerLoad = async (event) => {
	// do stuff whenever the page loads
}

export const actions = {
	getClosestFacilities: async ({ fetch, request }) => {
		const data = await request.formData();

		try {
			const latitude = data.get('latitude');
			const longitude = data.get('longitude');
			const limit = Number(data.get('limit'));
			const facilityTypes = data.getAll('facilityType');

			if (!latitude) return fail(422, {description: latitude, error: 'Must provide latitude'});
			else if (!longitude) return fail(422, {description: longitude, error: 'Must provide longitude'});
			else if (facilityTypes.length < 1) return fail(422, {description: facilityTypes, error: 'Must provide at least one facility type'});
			else if (isNaN(Number(latitude))) return fail(422, {description: latitude, error: `Latitude ${latitude} is not valid`});
			else if (isNaN(Number(longitude))) return fail(422, {description: longitude, error: `Longitude ${longitude} is not valid`});
			else if (facilityTypes.some(fc => !isFacilityType(String(fc)))) return fail(422, {description: facilityTypes, error: `Invalid facility types`});

			let response = await fetch(`/api/facilities?lat=${latitude}&long=${longitude}&limit=${limit}&facilityType=${facilityTypes.join(',')}`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			});
		
			const facilities = await response.json();
			if (response.status !== 200) {
				return fail(response.status, {errorMessage: facilities.message});
			}
			
			return { facilities };
		} catch(error: any) {
			return fail(422, {
				description: 'Unknown error',
				error: error.message
			});
		}
		
	}
} satisfies Actions;
