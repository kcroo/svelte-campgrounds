import { error, json } from '@sveltejs/kit';

const validFacilityTypes = ['Campground', 'Museum', 'Visitor Center'];
type FacilityType = (typeof validFacilityTypes)[number];
const isFacilityType = (x: string): x is FacilityType => validFacilityTypes.includes(x);

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  // TODO: validate input

  let lat: number | null = Number(url.searchParams.get('lat'));
  let long: number | null = Number(url.searchParams.get('long'));
  let limit: number = Number(url.searchParams.get('limit')) ?? 10;

  let facilityTypes: string[] | undefined = url.searchParams.get('facilityType') ? url.searchParams.get('facilityType')?.split(',') : [];
  if (facilityTypes == null || facilityTypes.length < 1) {
    throw error(400, {
      severity: 'High',
      message: 'Must provide at least one facility type'
    })
  } else {
    for (let type of facilityTypes) {
      if (!isFacilityType(type)) {
        throw error(400, {
          severity: 'High',
          message: 'Invalid facility type'
        })
      }
    }
  }

  if (lat === null || long === null) {
    throw error(400, {
      severity: 'High',
      message: 'Must provide lat and long. Limit is optional.'
    });
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
    `, [lat, long, limit, facilityTypes]);

    return json({
      data: result.rows
    });
  } catch(Exception) {
    console.log(Exception)
    throw error(500, {
      severity: 'High',
      message: 'Facility querying error'});
  }
}