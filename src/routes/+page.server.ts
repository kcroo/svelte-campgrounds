/** @type {import('./$types').PageServerLoad} */
///** @type {import('./$types').PageLoad} */
export async function load( {fetch}) {
  console.log('fetching rec areas....')
	const response = await fetch('/api/recreation_areas', {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});

	const areas = await response.json();
  console.log(areas)
	return areas;
}