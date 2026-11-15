import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Neon PostgreSQL connection string',
	},
	SPOTIFY_CLIENT_ID: {
		description: 'Spotify app client ID',
	},
	SPOTIFY_CLIENT_SECRET: {
		description: 'Spotify app client secret',
	},
});
