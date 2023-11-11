import type { PageServerLoad } from './$types';

export const load = (async ({ params: { server }, fetch }) => {

    return {
        // streamed: {
        //     items: fetch(`/market/api/items/${server}`).then(res => res.json())
        // }
    };
}) satisfies PageServerLoad;