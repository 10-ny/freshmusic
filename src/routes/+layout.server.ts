import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const PUBLIC_PATHS = ['/welcome'];

export const load: LayoutServerLoad = ({ locals, url }) => {
	const isPublic = PUBLIC_PATHS.some((p) => url.pathname.startsWith(p));
	if (!isPublic && !locals.userId) redirect(302, '/welcome');
	return { userId: locals.userId };
};
