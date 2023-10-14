// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		type FacilityType = (typeof validFacilityTypes)[number];

		interface Locals {
			pool: PoolConfig
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
