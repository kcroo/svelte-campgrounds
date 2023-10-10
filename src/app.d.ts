// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		type ErrorSeverity = 'Low' | 'Medium' | 'High';
		type FacilityType = (typeof validFacilityTypes)[number];

		interface Error {
			severity: ErrorSeverity,
			message: String
		}
		interface Locals {
			pool: PoolConfig
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
