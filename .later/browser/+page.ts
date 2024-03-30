import type { PageLoad } from './$types';

export const load = (async ({ fetch, setHeaders }) => {

    setHeaders({
        'cache-control': "public,s-maxage=9000"
    })

    const results = fetch('/market/api/servers')
    return {
        streamed: {
            servers: results.then(res => res.json().then(res => res.servers))
        }
    };
}) satisfies PageLoad;