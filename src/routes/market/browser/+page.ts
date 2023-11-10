import type { PageLoad } from './$types';

export const load = (async ({ fetch}) => {
    const req = await fetch('/market/api/servers')
    const servers = await req.json()
    return {
        servers: servers.servers
    };
}) satisfies PageLoad;