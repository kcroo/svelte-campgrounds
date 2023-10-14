import { error, json } from '@sveltejs/kit';

const validFacilityTypes = ['Campground', 'Museum', 'Visitor Center'];
type FacilityType = (typeof validFacilityTypes)[number];
const isFacilityType = (x: string): x is FacilityType => validFacilityTypes.includes(x);

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  // TODO: validate input

  let lat: string | null = url.searchParams.get('lat');
  let long: string | null = url.searchParams.get('long');
  let limit: string = url.searchParams.get('limit') ?? '10';

  let facilityTypes: string[] | undefined = url.searchParams.get('facilityType') ? url.searchParams.get('facilityType')?.split(',') : [];
  if (facilityTypes == null || facilityTypes.length < 1) {
    throw error(400, 'Must provide at least one facility type');
  } else {
    for (let type of facilityTypes) {
      if (!isFacilityType(type)) {
        throw error(400, 'Invalid facility types')
      }
    }
  }

  if (lat == null || lat === '' || isNaN(Number(lat))) {
    throw error(400, 'Must provide a number for latitude');
  }
  if (long == null || long === '' || isNaN(Number(long))) {
    throw error(400, 'Must provide a number for longitude');
  }
  if (limit == null || limit === '' || isNaN(Number(limit))) {
    throw error(400, 'Must provide a number for limit');
  }

  console.log(lat, long, limit, facilityTypes)
  
  try {
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
      WHERE facilities.type = ANY($4)
      ORDER BY 
        ST_Distance(
          facilities.location,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)
        )
      LIMIT $3;
    `, [Number(lat), Number(long), Number(limit), facilityTypes]);

    return json({
      data: result.rows
    });
  } catch(Exception: any) {
    console.log(Exception)
    throw error(500, 'Query error');
  }
}