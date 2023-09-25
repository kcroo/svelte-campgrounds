import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  // TODO: validate input
  
	let lat: number | null = Number(url.searchParams.get('lat'));
  let long: number | null = Number(url.searchParams.get('long'));
  let limit: number = Number(url.searchParams.get('limit')) ?? 10;
	if (lat === null || long === null) {
		throw error(400, 'Must provide lat and long. Limit is optional.');
	}

  console.log(lat, long, limit)

	const pool = locals.pool;
  // 'SRID=4326;POINT($2 $1)'::geography
	const result = await pool.query(`
    SELECT
      facilities.name,
      facilities.type,
      ROUND(
        ST_Distance(
          facilities.location,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)
        ) * 0.0006213712
      ) AS distance_miles
    FROM facilities
    WHERE facilities.type IN ('Campground', 'Facility')
    ORDER BY 
      ST_Distance(
        facilities.location,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)
      )
    LIMIT $3;
	`, [lat, long, limit]);

	return json({
		data: result.rows
	});
}