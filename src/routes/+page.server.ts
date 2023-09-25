/** @type {import('./$types').PageServerLoad} */
///** @type {import('./$types').PageLoad} */
export async function load( {fetch}) {
  console.log('fetching 10 closest facilities....')
	const lat = '44.30194037928479';
	const long = '-120.85251454882285';
	const response = await fetch(`/api/facilities?lat=${lat}&long=${long}&limit=5`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});

	const facilities = await response.json();
	return facilities;
}