import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// do stuff whenever the page loads
}

export const actions = {
	getClosestFacilities: async ({ fetch, request }) => {
		const data = await request.formData();
		const latitude = data.get('latitude');
		const longitude = data.get('longitude');
		const limit = data.get('limit');

		const response = await fetch(`/api/facilities?lat=${latitude}&long=${longitude}&limit=${limit}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
	
		const facilities = await response.json();
		return { facilities };
	}
} satisfies Actions;
