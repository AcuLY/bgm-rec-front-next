<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import * as d3 from 'd3'
import { BANGUMI_SUBJECT } from '../api/_prefix'
import { useStore } from 'vuex'

const props = defineProps({
    pointSource: String,
    allPoints: Object,
    customInput: Array,
    collectionInput: Array,
})

const store = useStore()

const inputPoints = computed(() => {
    if (props.pointSource == 'default') {
        return []
    } else if (props.pointSource == 'custom') {
        return props.customInput
    } else {
        return props.collectionInput
    }
})

const minScore = 4
const maxScore = 8.5
const scoreRange = ref([0, 10])

const minTotal = 50
const maxTotal = 8000
const totalRange = ref([2500, 20000])

const minTime = new Date('2000-01-01').getTime()
const maxTime = new Date().getTime()
const minMonth = new Date('1970-01-01').getTime()
const maxMonth = new Date().getTime()
const formatMonth = (timestamp) => {
    const date = new Date(timestamp)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
}
const dateRange = ref([
    new Date('2000-01-01').getTime(),
    maxMonth
])


const visiblePoints = computed(() => {
    return Object.values(props.allPoints).filter(d => {
        const time = d.timeStamp ?? new Date(d.date).getTime()
        const maxTotal = totalRange.value[1]
        const maxTime = dateRange.value[1]
        const inputIds = new Set(inputPoints.value.map(d => d.id))
        return (
            inputIds.has(d.id) ||
            d.score >= scoreRange.value[0] &&
            d.score <= scoreRange.value[1] &&
            d.total >= totalRange.value[0] &&
            (
                d.total <= maxTotal ||
                maxTotal >= 20000  // 若 max 为“滑块最大值”，则允许 total 超出
            ) &&
            time >= dateRange.value[0] &&
            (
                time <= maxTime ||
                maxTime >= new Date().getTime()  // 如果 max 是“当前时间”，也放宽
            )
        )
    })
})


const colorRangeBackground = ['hsla(200, 0%, 90%, 0.8)', 'hsla(210, 0%, 70%, 0.8)', 'hsla(330, 0%, 30%, 0.8)']
const colorRangeDefault = ['hsla(200, 10%, 85%, 1)', 'hsla(210, 80%, 80%, 1)', 'hsla(330, 80%, 60%, 1)']
const colorRange = computed(() => props.pointSource == 'default' ? colorRangeDefault : colorRangeBackground)

const clickedTag = ref(null)
const onClickTag = (id) => {
    if (!store.state.isMobile || id == clickedTag.value) {
        window.open(BANGUMI_SUBJECT(id), '_blank')
    } else {
        clickedTag.value = id
    }
}
const clearInput = () => {
    if (props.pointSource == 'custom') {
        props.customInput.splice(0)
    } else if (props.pointSource == 'collection') {
        props.collectionInput.splice(0)
    }
}


const width = store.state.isMobile ? 320 : 800, height = store.state.isMobile ? 518 : 520
const margin = { left: store.state.isMobile ? 32 : 40, right: 0, top: 0, bottom: store.state.isMobile ? 24 : 30 }
const baseRadius = 5

const highlightId = ref(null)
const ThermalMode = ref('score')
const containerRef = ref()

onMounted(async () => {
    let currentXScale = null
    let currentYScale = null

    let mobileClicked = null

    for (const d of Object.values(props.allPoints)) {
        d.timeStamp = new Date(d.date).getTime()
        d.normalizedDate = (d.timeStamp - minTime) / (maxTime - minTime)
        d.normalizedDate = Math.max(0, Math.min(1, d.normalizedDate))
    }

    const all = Object.values(props.allPoints)
    let x = d3.scaleLinear()
        .domain([d3.min(all, d => d.x) - 1, d3.max(all, d => d.x) + 1])
        .range([margin.left, width - margin.right])
    let y = d3.scaleLinear()
        .domain([d3.min(all, d => d.y) - 1, d3.max(all, d => d.y) + 1])
        .range([height - margin.bottom, margin.top])
    const colorScale = computed(() =>
        d3.scaleLinear().domain([0, 0.5, 1]).range(colorRange.value)
    )
    const defaultColorScale = computed(() =>
        d3.scaleLinear().domain([0, 0.5, 1]).range(colorRangeDefault)
    )

    // 清空
    d3.select(containerRef.value).selectAll('*').remove()

    // 插入canvas
    const canvas = d3.select(containerRef.value)
        .append('canvas')
        .attr('width', width)
        .attr('height', height)
        .style('position', 'absolute')
        .style('left', 0)
        .style('top', 0)
        .node()

    const ctx = canvas.getContext('2d')

    // 3. SVG 只绘制坐标轴、交互层
    const svg = d3.select(containerRef.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('position', 'absolute')
        .style('left', 0)
        .style('top', 0)
        .style('pointer-events', 'none'); // 默认 SVG 不捕获鼠标，仅交互层例外

    // 坐标轴
    let xAxisG = svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .attr('pointer-events', 'all') // 让坐标轴能选中文字
    let yAxisG = svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .attr('pointer-events', 'all')

    function renderAxes(xScale, yScale) {
        xAxisG.call(d3.axisBottom(xScale).ticks(10))
        yAxisG.call(d3.axisLeft(yScale).ticks(10))
    }
    renderAxes(x, y)

    // legend
    function updateLegend() {
        let legendTop, legendBottom
        if (ThermalMode.value === 'score') {
            legendTop = '高分'
            legendBottom = '低分'
        } else if (ThermalMode.value === 'total') {
            legendTop = '热门'
            legendBottom = '冷门'
        } else {
            legendTop = '新作'
            legendBottom = '旧作'
        }
        let fontSize = store.state.isMobile ? 12 : 16
        let barWidth = store.state.isMobile ? 80 : 120

        d3.select('#legend-placeholder')
            .style("display", "flex")
            .style("flex-direction", "row")
            .style("align-items", "center")
            .style("gap", store.state.isMobile ? "4px" : "6px")
            .html(`
            <span style="font-weight:bold;font-size:${fontSize}px;">${legendBottom}</span>
            <div style="width: ${barWidth}px; height: 10px; background: linear-gradient(to right, ${colorRangeDefault}); border-radius: 4px;"></div>
            <span style="font-weight:bold;font-size:${fontSize}px;">${legendTop}</span>
        `)
    }
    updateLegend()

    // 画点
    function drawSinglePoint(d, xScale, yScale, isHighlight) {
        const px = xScale(d.x)
        const py = yScale(d.y)
        let r = baseRadius
        let lineWidth = 0.94
        if (isHighlight) {
            r = baseRadius * 2
            lineWidth = 3
        } else if (d.input && props.pointSource === 'custom') {
            r = baseRadius * 1.5
            lineWidth = 2.2
        } else if (d.input && props.pointSource === 'collection') {
            r = baseRadius * 1.2
            lineWidth = 1.8
        }

        let value
        if (ThermalMode.value === 'score') value = (d.score - minScore) / (maxScore - minScore)
        else if (ThermalMode.value === 'total') value = (d.total - minTotal) / (maxTotal - minTotal)
        else value = d.normalizedDate
        value = Math.max(0, Math.min(1, value))

        const color = d.input ? defaultColorScale.value(value) : colorScale.value(value)

        ctx.beginPath()
        ctx.arc(px, py, r, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.strokeStyle = isHighlight || d.input ? '#fff' : '#555'
        ctx.lineWidth = lineWidth
        ctx.globalAlpha = d.input ? 1 : 0.94
        ctx.fill()
        ctx.stroke()
    }

    function drawPoints(xScale, yScale) {
        currentXScale = xScale
        currentYScale = yScale

        ctx.clearRect(0, 0, width, height)
        ctx.save()
        ctx.beginPath()
        ctx.rect(margin.left, margin.top, width - margin.left - margin.right, height - margin.top - margin.bottom)
        ctx.clip()

        // 标记 input 点
        const inputIds = new Set(inputPoints.value.map(d => d.id))
        visiblePoints.value.forEach(d => {
            d.input = inputIds.has(d.id)
        })

        // 先绘制非 input 且非高亮点
        visiblePoints.value.forEach(d => {
            if (highlightId.value === d.id || d.input) return
            drawSinglePoint(d, xScale, yScale, false)
        })

        // 再绘制 input 点（非高亮）
        visiblePoints.value.forEach(d => {
            if (highlightId.value === d.id || !d.input) return
            drawSinglePoint(d, xScale, yScale, false)
        })

        // 绘制高亮点及十字线
        if (highlightId.value) {
            const d = visiblePoints.value.find(p => p.id === highlightId.value)
            if (d) {
                drawSinglePoint(d, xScale, yScale, true)

                const px = xScale(d.x)
                const py = yScale(d.y)

                ctx.save()
                ctx.setLineDash([4, 4])
                ctx.strokeStyle = '#999'
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.moveTo(margin.left, py)
                ctx.lineTo(width - margin.right, py)
                ctx.moveTo(px, margin.top)
                ctx.lineTo(px, height - margin.bottom)
                ctx.stroke()
                ctx.restore()
            }
        }

        ctx.restore()
    }
    drawPoints(x, y)

    // tooltip
    const tooltip = d3.select(containerRef.value)
        .append("div")
        .attr("class", "d3-tooltip")
        .style("display", "none")
        .style("position", "absolute")

    function showTooltip(d, px, py) {
        let extraInfo = ''
        if (ThermalMode.value === 'score') extraInfo = `评分：${d.score} &nbsp 排名：${d.rank}`
        else if (ThermalMode.value === 'total') extraInfo = `收藏人数：${d.total}`
        else extraInfo = `播出时间: ${d.date}`

        const html = `
            <div>
            <div class="tooltip-name">${d.name}</div>
            <div>${d.name_cn}</div>
            <div>${extraInfo}</div>
            </div>
        `
        tooltip
            .style("display", "block")
            .html(html)

        const tooltipEl = tooltip.node()
        const bbox = tooltipEl.getBoundingClientRect()

        let left = px + 18
        let top = py - 12

        const containerBox = containerRef.value.getBoundingClientRect()
        const maxLeft = containerBox.width - bbox.width
        const maxTop = containerBox.height - bbox.height

        // 修正超出边界
        if (left > maxLeft) left = px - bbox.width - 10
        if (top > maxTop) top = containerBox.height - bbox.height - 10
        if (left < 0) left = 0
        if (top < 0) top = 0

        tooltip
            .style("left", `${left}px`)
            .style("top", `${top}px`)
    }

    function clearTooltip() {
        tooltip
            .style("display", "none")
            .html("")
    }


    function findNearestPoint(mx, my, xScale, yScale) {
        let minDist = Infinity, nearest = null
        for (const d of visiblePoints.value) {
            const px = xScale(d.x)
            const py = yScale(d.y)
            const dx = px - mx, dy = py - my
            const dist = dx * dx + dy * dy
            if (
                px >= margin.left && px <= width - margin.right &&
                py >= margin.top && py <= height - margin.bottom &&
                dist < (baseRadius + 4) ** 2 &&
                dist < minDist
            ) {
                minDist = dist
                nearest = d
            }
        }
        return nearest
    }

    // 交互事件层
    const eventRect = svg.append("rect")
        .attr("x", margin.left).attr("y", margin.top)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("fill", "transparent")
        .style("pointer-events", "all")

    // 缩放交互
    let transform = d3.zoomIdentity
    svg.call(
        d3.zoom()
            .scaleExtent([0.7, 30])
            .on("zoom", (event) => {
                transform = event.transform
                const zx = transform.rescaleX(x)
                const zy = transform.rescaleY(y)
                renderAxes(zx, zy)
                drawPoints(zx, zy)
            })
    )

    // 鼠标悬浮/点击交互
    eventRect
        .on("mousemove", function (event) {
            const [mx, my] = d3.pointer(event)
            const zx = transform.rescaleX(x)
            const zy = transform.rescaleY(y)

            const nearest = findNearestPoint(mx, my, zx, zy)
            highlightId.value = nearest?.id

            if (nearest) {
                eventRect.style("cursor", "pointer")
                const px = zx(nearest.x)
                const py = zy(nearest.y)
                showTooltip(nearest, px, py)
            } else {
                eventRect.style("cursor", "default")
                tooltip.style("display", "none")
            }
        })
        .on("mouseleave", function () {
            tooltip.style("display", "none")
            drawPoints(transform.rescaleX(x), transform.rescaleY(y))
            eventRect.style("cursor", "default")
        })
        .on("click", function (event) {
            const [mx, my] = d3.pointer(event)
            const zx = transform.rescaleX(x)
            const zy = transform.rescaleY(y)
            const nearest = findNearestPoint(mx, my, zx, zy)
            if (nearest) {
                if (!store.state.isMobile || mobileClicked == nearest.id) {
                    window.open(BANGUMI_SUBJECT(nearest.id), '_blank')
                } else {
                    mobileClicked = nearest.id
                    highlightId.value = nearest.id
                }
            }
        })


    watch([ThermalMode, scoreRange, totalRange, dateRange, () => props.pointSource, visiblePoints], () => {
        updateLegend()
        drawPoints(transform.rescaleX(x), transform.rescaleY(y))
        clearTooltip()
    })

    watch(highlightId, (id) => {
        drawPoints(currentXScale, currentYScale)
        if (!id) return tooltip.style("display", "none")

        const d = visiblePoints.value.find(p => p.id === id)
        if (!d) return

        showTooltip(d, currentXScale(d.x), currentYScale(d.y))
    })
})
</script>

<template>
    <div class="chart-container">
        <n-flex class="tag-container" v-show="props.pointSource != 'default'" wrap>
            <n-button type="primary" v-show="inputPoints.length > 0" @click="clearInput()">清空</n-button>
            <n-tag class="tag" v-for="(anime, index) in inputPoints" :key="anime.id" closable
                @close="inputPoints.splice(index, 1)" size="large" round @mouseenter="highlightId = anime.id;"
                @mouseleave="highlightId = null" @click="onClickTag(anime.id)">
                {{ anime.nameCN ? anime.nameCN : anime.name }}
            </n-tag>
        </n-flex>

        <n-divider class="divider"></n-divider>

        <n-flex class="option-container" justify="space-between">
            <n-flex class="slider-container" vertical justify="space-between">
                <n-flex justify="space-between">
                    <span>评分：<span class="range-value">{{ scoreRange[0] }}</span> - <span class="range-value">{{
                        scoreRange[1] }}</span></span>
                    <n-slider class="slider" v-model:value="scoreRange" range :step="0.1" :max="10" :min="0" />
                </n-flex>

                <n-flex justify="space-between">
                    <span>
                        人数：<span class="range-value">{{ totalRange[0] }}</span> -
                        <span class="range-value">
                            {{ totalRange[1] === 20000 ? String(totalRange[1]) + "+" : totalRange[1] }}
                        </span>
                    </span>
                    <n-slider class="slider" v-model:value="totalRange" range :step="50" :max="20000" :min="50" />
                </n-flex>

                <n-flex justify="space-between">
                    <span>
                        日期：<span class="range-value">{{ formatMonth(dateRange[0]) }}</span> -
                        <span class="range-value">{{ formatMonth(dateRange[1]) }}</span>
                    </span>
                    <n-slider class="slider" v-model:value="dateRange" :min="minMonth" :max="maxMonth"
                        :step="30 * 24 * 60 * 60 * 1000" range :format-tooltip="ts => formatMonth(ts)" />
                </n-flex>

            </n-flex>

            <n-flex class="mode-container" :vertical="!store.state.isMobile"
                :justify="store.state.isMobile ? 'space-between' : 'flex-end'"
                :size="store.state.isMobile ? 'small' : 'large'">
                <n-radio-group v-model:value="ThermalMode" name="tooltip-mode" size="small">
                    <n-radio-button class="radio" value="score">评分</n-radio-button>
                    <n-radio-button class="radio" value="total">热度</n-radio-button>
                    <n-radio-button class="radio" value="date">日期</n-radio-button>
                </n-radio-group>

                <div id="legend-placeholder"></div>
            </n-flex>
        </n-flex>

        <div ref="containerRef" class="svg-container"></div>
    </div>
</template>

<style>
.d3-tooltip {
    position: absolute;
    background: rgba(34, 34, 34, 0.784);
    color: #fff;
    padding: 8px 16px;
    font-size: 14px !important;
    border-radius: 8px;
    pointer-events: none;
    white-space: nowrap;
    z-index: 999;
    box-shadow: 0 2px 12px #8882;
    line-height: 1.7;
}

.tooltip-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    font-size: large;
}

@media (max-width: 768px) {
    .d3-tooltip {
        padding: 6px 12px !important;
        font-size: 11px !important;
    }

    .tooltip-name {
        font-size: 12px;
    }
}
</style>

<style scoped>
.chart-container {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.tag-container {
    margin-top: 16px;
    width: 800px;
    max-height: 240px;
    overflow-y: scroll;
}

.tag {
    border: solid 1px var(--color-tag-background);
    background-color: var(--color-chart-background);
}

.tag:hover {
    background-color: var(--color-tag-background-hover);
    box-shadow: 0 0 6px var(--color-tag-background);
}

.divider {
    width: 840px;
}

.option-container {
    width: 800px;
    padding: 0 20px 0 20px;
    margin: 16px 0 24px 0;
}

.range-value {
    color: var(--color-tertiary-text);
}

.slider-container {
    font-size: medium;
    font-weight: bold;
}

.slider {
    width: 280px;
    transform: translateY(4px);
    margin-left: 6px;
}

.mode-container {
    font-weight: bold;
    align-items: flex-end;
}

.svg-container {
    position: relative;
    width: 800px;
    height: 520px;
    border-radius: 20px;
    border: solid #829da6;
    background: var(--color-chart-background);
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

@media (max-width: 768px) {
    .tag-container {
        margin-top: 12px;
        width: 320px;
        max-height: 240px;
    }

    .tag {
        font-size: 12px;
    }

    .divider {
        width: 320px;
        margin: 0;
    }

    .option-container {
        width: 320px;
        padding: 0;
        margin: 12px 0 18px 0;
    }

    .slider-container {
        font-size: small;
    }

    .slider {
        width: 140px;
        transform: translateY(0px);
        margin-left: 0px;
    }

    .mode-container {
        width: 320px;
    }

    .radio {
        font-size: 12px;
    }

    .svg-container {
        width: 320px;
        height: 518px;
        border-radius: 12px;
    }
}
</style>