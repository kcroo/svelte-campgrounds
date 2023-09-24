import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
	const id: string | null = url.searchParams.get('id');
	if (id === null) {
		throw error(400, 'Must provide an id');
	}

	const pool = locals.pool;
	const result = await pool.query(`
		SELECT 
			recreation_areas.id,
			recreation_areas.name,
			recreation_areas.description,
			organizations.name managing_organization
		FROM 
			recreation_areas
			LEFT JOIN organizations ON organizations.id = recreation_areas.organization_id
		WHERE
			recreation_areas.id = $1;
	`, [id]);

	return json({
		data: result.rows
	});
}