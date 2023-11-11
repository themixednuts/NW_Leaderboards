import type { LayoutLoad } from './$types';
import { dev } from '$app/environment';
import { inject } from '@vercel/analytics';

inject({ mode: dev ? 'development' : 'production' });

export const load = (async ({ setHeaders }) => {
    setHeaders({
        'cache-control': "max-age=9000"
    })
    return {};
}) satisfies LayoutLoad;