import { eventTypeHelpers } from "@routes/reports/[id]/utils.svelte"
import type { Chart, ChartDataset, Tick } from "chart.js"
import { page } from "$app/stores"
import { get } from "svelte/store"
import type { LogEvent } from "@/events.types"

export type ChartContext = (ctx: { chart: InstanceType<typeof Chart> }) => void
export type TickContext = (tickValue: Tick['value'] | string, idx: number, ticks: Tick[]) => string | number

export function generateDataset(
    data: LogEvent[],
    label: (typeof eventTypeHelpers)[keyof typeof eventTypeHelpers]['name'],
    type: 'damage' | 'healing' | 'death',
    subtype: string,
    backgroundColor: string,
    pointStyle: string,
    s: number,
    e: number,
): ChartDataset {
    let currentTotal = 0
    return {
        label,
        data: data
            .filter(
                (event) =>
                    event &&
                    ((event?.type === type && event?.subtype === subtype) || event.type === 'log' || event.type === 'gamemode'),
            )
            .map((event) => {
                if ((!s && !e) || (event.eventAt >= Number(s) && event.eventAt <= Number(e))) {
                    if ('damage' in event.data) {
                        if (event.data.damage)
                            for (const dmgType of Object.values(event.data?.damage)) {
                                currentTotal += dmgType.damage
                            }
                    }

                    if ('amount' in event.data) {
                        currentTotal += event.data.amount
                    }
                }
                const timeDifferenceInSeconds =
                    (event?.eventAt - data[data.findIndex((ev) => ev.eventAt >= Number(s)) ?? 0]?.eventAt) / 1000

                // Calculate DPS
                const dps = timeDifferenceInSeconds > 0 ? currentTotal / timeDifferenceInSeconds : 0
                return { x: event?.eventAt, y: dps }
            }),
        borderColor: `rgb(${backgroundColor})`,
        backgroundColor: `rgba(${backgroundColor}, 0.5)`,
        pointBackgroundColor: `rgb(${backgroundColor})`,
        tension: 0.1,
        // fill: 'origin',
        pointRadius: 1,
        pointStyle: pointStyle,
        hoverRadius: 5,
    }
}
export function filterByType(dataset: ChartDataset) {
    const type = get(page).url.searchParams.get('type') as keyof typeof eventTypeHelpers | undefined
    if (!type) return true

    switch (type) {
        case 'damagedone':
            return dataset.label === eventTypeHelpers[type].name
        case 'damagetaken':
            return dataset.label === eventTypeHelpers[type].name
        case 'healingdone':
            return dataset.label === eventTypeHelpers[type].name
        case 'deaths':
            return dataset.label === eventTypeHelpers[type].name
    }
}