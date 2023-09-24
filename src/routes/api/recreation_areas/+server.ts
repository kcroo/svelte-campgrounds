import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
	const pool = locals.pool;
	const result = await pool.query('SELECT * FROM organizations LIMIT 1;');
	return json(result.rows[0]);
}