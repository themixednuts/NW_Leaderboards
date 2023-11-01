import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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

    const n = 1;
    const convertedData = res.rows.map(item => ({
        ...item,
        price: parseInt(item.price) / 100,
    }));
    // console.log(convertedData)

    const totalPrice = convertedData.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalQuantity = convertedData.reduce((total, item) => total + item.quantity, 0);
    const avgPrice = totalPrice / totalQuantity;

    const priceStdDev = Math.sqrt(
        convertedData.reduce((total, item) => total + Math.pow(item.price * item.quantity - avgPrice, 2), 0) / (totalQuantity)
    );

    const priceUpperBound = avgPrice + n * priceStdDev;
    const priceLowerBound = avgPrice - n * priceStdDev;

    const filteredData = convertedData.filter(item => item.price >= priceLowerBound && item.price <= priceUpperBound);
    const filteredAvgPrice = filteredData.reduce((total, item) => total + item.price, 0) / filteredData.length;

    return json({
        id: res.rows[0].id,
        name: res.rows[0].name,
        updatedAt: res.rows[0].updatedAt,
        data: convertedData.map(item => ({ price: item.price, quantity: item.quantity })),
        server,
        minPriceWithinStdDev: Math.min(...filteredData.map(item => item.price)),
        meanPriceWithinStdDev: filteredAvgPrice / 100,
        stdDev: priceStdDev / 100,
        n,
        mean: avgPrice,
        totalQuantity,
    });
};