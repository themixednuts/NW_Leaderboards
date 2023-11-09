import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch}) => {
    try {
        const req = await fetch('/market/api/servers')
        const servers = await req.json()
        return {
            servers: servers.servers
        };

    }catch(e){
        console.log(e)
        throw error(500)
    }
}) satisfies PageLoad;