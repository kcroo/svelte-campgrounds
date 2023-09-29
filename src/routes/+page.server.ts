import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	// do stuff whenever the page loads
}

export const actions = {
	getClosestFacilities: async ({ fetch, request }) => {
		try {
			const data = await request.formData();
			const latitude = data.get('latitude');
			const longitude = data.get('longitude');
			const limit = data.get('limit');
			const facilityType = data.getAll('facilityType');

			const response = await fetch(`/api/facilities?lat=${latitude}&long=${longitude}&limit=${limit}&facilityType=${facilityType.join(',')}`, {
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
		} catch(Exception) {
			throw error(500, {
				severity: 'High', 
				message: 'unknown error!'
			});
		}
		
	}
} satisfies Actions;
