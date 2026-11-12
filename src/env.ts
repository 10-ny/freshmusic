import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Neon PostgreSQL connection string',
	},
});
