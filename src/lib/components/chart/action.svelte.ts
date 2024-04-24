import {
    Chart,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    LineController,
    PointElement,
    TimeSeriesScale,
    type Plugin,
    Filler,
    type ChartType,
    type ChartDataset,
} from 'chart.js'
import type { Action } from 'svelte/action'
import 'chartjs-adapter-date-fns'
import annotationPlugin from 'chartjs-plugin-annotation'
import type { ChartContext, TickContext } from './utils.svelte'

const hoverLine: Plugin = {
    id: 'hoverline',
    afterDatasetDraw(chart) {
        const {
            ctx,
            chartArea: { top, bottom },
            tooltip,
            scales: { x },
        } = chart

        if (!tooltip?.dataPoints?.length) return
        const xCoor = x.getPixelForValue(tooltip.dataPoints[0].parsed.x)

        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgb(155,155,155)'
        ctx.setLineDash([6, 6])
        ctx.moveTo(xCoor, top)
        ctx.lineTo(xCoor, bottom)
        ctx.stroke()
        ctx.closePath()
        ctx.setLineDash([])
    },
}

export interface ChartActionParameters {
    datasets: ChartDataset[]
    zoomPlugin: typeof import('chartjs-plugin-zoom')
    start?: number
    end?: number
    type?: ChartType
    onZoomComplete?: ChartContext
    onPanComplete?: ChartContext
    tick?: TickContext
}

export class createChart {
    private _chart: InstanceType<typeof Chart> | undefined
    private _isZoomedOrPanned = false

    action: Action<HTMLCanvasElement, ChartActionParameters> = (el, { datasets, zoomPlugin, start, end, type = 'line', onPanComplete: panCompleteCb, onZoomComplete: zoomCompleteCb, tick: tickCb }) => {
        Chart.register(
            Title,
            TimeSeriesScale,
            Tooltip,
            Legend,
            LineController,
            CategoryScale,
            LinearScale,
            LineElement,
            PointElement,
            annotationPlugin,
            Filler,
            zoomPlugin.default,
        )
        this._chart = new Chart(el, {
            type,
            data: {
                datasets,
            },
            options: {
                // parsing: true,
                // normalized: true,
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'x', axis: 'x', intersect: false },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'second',
                            displayFormats: {
                                second: 'mm:ss:SSS',
                            },
                        },
                        ticks: {
                            maxTicksLimit: 8,
                            includeBounds: true,
                            callback(tickValue, index, ticks) {
                                if (tickCb) return tickCb(tickValue, index, ticks)
                                return tickValue
                            },
                            // source: 'data',
                        },
                        // title: {
                        // 	display: true,
                        // 	text: 'time',
                        // },
                    },
                    y: {
                        // stacked: true,
                        ticks: {
                            count: 5,
                        },
                        title: {
                            display: true,
                            text: 'per second',
                        },
                        grid: {
                            display: true,
                            // drawOnChartArea: true,
                            color: 'rgba(50,50,50)',
                            lineWidth: 0.4,
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        mode: 'x',
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            modifierKey: 'ctrl',
                            onPanComplete: ({ chart }) => {
                                this._isZoomedOrPanned = chart.isZoomedOrPanned()
                                if (panCompleteCb) panCompleteCb({ chart })
                            },
                        },
                        zoom: {
                            mode: 'x',
                            wheel: {
                                enabled: true,
                                // modifierKey: 'shift',
                            },

                            drag: {
                                enabled: true,
                                threshold: 5,
                            },
                            onZoomComplete: ({ chart }) => {
                                this._isZoomedOrPanned = chart.isZoomedOrPanned()
                                if (zoomCompleteCb) zoomCompleteCb({ chart })
                            },
                        },
                        limits: {
                            x: {
                                min: 'original',
                                max: 'original',
                            },
                            y: {
                                min: 'original',
                                max: 'original',
                            },
                        },
                    },
                },
                transitions: {
                    zoom: {
                        animation: {
                            duration: 300,
                        },
                    },
                },
            },
            plugins: [hoverLine],
        })

        if (start && end) this._chart.zoomScale('x', { min: start, max: end }, 'resize')


        return {
            destroy: () => {
                if (this._chart) this._chart.destroy()
            },
            update: ({ datasets }) => {
                if (!this._chart) return
                this._chart.data.datasets = datasets
                this._chart.update()
            },
        }
    }

    get chart() {
        return this._chart
    }

    get isZoomed() {
        return this._isZoomedOrPanned
    }
}
