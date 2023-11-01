import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    runtime: 'nodejs18.x',
    isr: {
        expiration: 14400
    }
}

export const GET: RequestHandler = async ({ params: { id, server } }) => {

    const query = `
    --explain query plan
    SELECT itemKey as id, locale.text as name, price, sum(quantity) as quantity, sessionDate as updatedAt
    FROM orders
    INNER JOIN MasterItemDefinitions AS master ON itemKey = master.ItemID COLLATE NOCASE 
    INNER JOIN locale_en_us AS locale ON locale.key = SUBSTR(master.Name, 2) COLLATE NOCASE
    WHERE server = :server
    AND contractType = 1
    AND itemKey = :id
    AND sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
    group by price
    `

    let res
    let startTime = performance.now()
    try {
        res = await db.execute({
            sql: query,
            args: {
                id,
                server: server.toLowerCase()
            }
        })
        console.log('db timer - Item Search: ', performance.now() - startTime, ' ms')

    } catch (e) {
        console.log(e)
        throw error(500)
    }
    // console.log(res.rows)
    if (!res.rows.length) throw error(400, 'Bad Request')

    console.log(res.rows)
    const n = 1;
    //@ts-ignore
    const results = res.rows.map(row => ({...row, price: parseInt(row.price) / 100 })) as unknown as {id: string, name: string, price: number, quantity: number, updatedAt: string}[]

    const totalPrice = results.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalQuantity = results.reduce((total, item) => total + item.quantity, 0);
    const avgPrice = totalPrice / totalQuantity;

    const priceStdDev = Math.sqrt(
        results.reduce((total, item) => {
            const squaredDifferences = Array(item.quantity)
                .fill(item.price - avgPrice)
                .map(diff => Math.pow(diff, 2));

            return squaredDifferences.reduce((acc, val) => acc + val, 0) + total
        }, 0) / (totalQuantity)
    );

    const priceUpperBound = avgPrice + n * priceStdDev;
    const priceLowerBound = avgPrice - n * priceStdDev;

    const filteredData = results.filter(item => item.price >= priceLowerBound && item.price <= priceUpperBound);
    const filteredAvgPrice = filteredData.reduce((total, item) => total + item.price, 0) / filteredData.length;

    return json({
        id: results[0].id,
        name: results[0].name,
        server,
        updatedAt: results[0].updatedAt,
        data: results.map(item => ({ price: item.price, quantity: item.quantity })),
        minPriceWithinStdDev: Math.min(...filteredData.map(item => item.price)),
        meanPriceWithinStdDev: filteredAvgPrice / 100,
        stdDev: priceStdDev / 100,
        n,
        mean: avgPrice,
        totalQuantity,
    });
};