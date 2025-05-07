<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import InputAnime from './InputAnime.vue'
import InputUser from './InputUser.vue'
import { debounce } from 'lodash'
import { useNotification } from 'naive-ui'
import ScatterChart from './ScatterChart.vue'
import { fetchUserCollections } from '../api/bangumi'
import { useStore } from 'vuex'

const notify = useNotification()
const isLoading = ref(false)

const store = useStore()

const pointSource = ref('default')

const allPoints = ref({})
onMounted(() => {
    fetch('/coordinate-data.json').then(res => res.json().then(json => allPoints.value = json))
})
const isDataReady = computed(() => Object.keys(allPoints.value).length > 0)

const animeNameKeyword = ref('')
const customInputPoints = ref([])

const onAnimeIdInputChanged = debounce(async () => {
    try {
        isLoading.value = true
        const id = Number(animeNameKeyword.value)

        if (customInputPoints.value.some(anime => anime.id === id)) {
            notify.warning({
                title: "该动画已存在",
                duration: 3000
            })
            isLoading.value = false
            return
        }

        const point = allPoints.value[id]
        if (!point) {
            notify.warning({
                title: "暂无该动画数据",
                duration: 3000
            })
            isLoading.value = false
            return
        }

        customInputPoints.value.push({
            id,
            x: point.x,
            y: point.y,
            rank: point.rank,
            score: point.score,
            total: point.total,
            name: point.name,
            nameCN: point.name_cn,
            date: point.date
        })

        notify.success({
            title: "添加成功",
            duration: 3000
        })
        isLoading.value = false
    } catch (error) {
        notify.error({
            title: error.message,
            duration: 3000
        })
        isLoading.value = false
    }
}, 500)

watch(animeNameKeyword, () => {
    onAnimeIdInputChanged()
})

const userId = ref('')
const collectionInputPoints = ref([])
const onUserIdInputChanged = debounce(async () => {
    try {
        isLoading.value = true
        isDataReady.value = false
        collectionInputPoints.value = []

        const userCollectionIdsByGroup = (await fetchUserCollections(userId.value)).data

        const allIds = [
            ...userCollectionIdsByGroup.doing,
            ...userCollectionIdsByGroup.collect,
            ...userCollectionIdsByGroup.onhold,
            ...userCollectionIdsByGroup.dropped,
        ]
        const uniqueIds = Array.from(new Set(allIds))

        let result = []
        for (const id of uniqueIds) {
            const point = allPoints.value[id]
            if (point) {
                result.push({
                    id,
                    x: point.x,
                    y: point.y,
                    rank: point.rank,
                    score: point.score,
                    total: point.total,
                    name: point.name,
                    nameCN: point.name_cn,
                    date: point.date,
                })
            }
        }

        collectionInputPoints.value = result
        isLoading.value = false
        isDataReady.value = true
    } catch (error) {
        notify.error({
            title: error.message,
            duration: 3000
        })
        isLoading.value = false
        isDataReady.value = true
    }
}, 1000)

watch(userId, () => {
    onUserIdInputChanged()
})

</script>

<template>
    <div class="compare-container">
        <div class="input-container">
            <n-tabs class="input-tab" v-model:value="pointSource" type="segment" animated :size="store.state.isMobile ? 'small' : 'large'">
                <n-tab-pane name="default" tab="全部">

                </n-tab-pane>
                <n-tab-pane class="dynamic-input-container" name="custom" tab="自定义添加">
                    <InputAnime v-model:animeId="animeNameKeyword" v-model:isLoading="isLoading" />
                </n-tab-pane>
                <n-tab-pane name="collection" tab="从收藏导入">
                    <InputUser v-model:userName="userId" v-model:isLoading="isLoading" />
                </n-tab-pane>
            </n-tabs>
        </div>

        <n-skeleton v-if="!isDataReady" height="640px" width="840px" :sharp="false"></n-skeleton>
        <ScatterChart v-if="isDataReady" :allPoints="allPoints" :pointSource="pointSource"
            :customInput="customInputPoints" :collectionInput="collectionInputPoints" />
    </div>
</template>

<style>
.n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab.n-tabs-tab--active {
    font-weight: bold;
    color: var(--color-tertiary-text);
}

.n-tabs .n-tabs-tab {
    font-weight: bold;
    color: var(--color-tertiary-text);
}

.n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab:hover {
    color: var(--color-tertiary-text);
}

.d3-tooltip {
    position: absolute;
    background: rgba(34, 34, 34, 0.784);
    color: #fff;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 8px;
    pointer-events: none;
    white-space: nowrap;
    z-index: 999;
    box-shadow: 0 2px 12px #8882;
    line-height: 1.7;
}

@media (max-width: 768px) {
    .n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab.n-tabs-tab--active {
        font-size: 12px;
    }

    .n-tabs .n-tabs-tab {
        font-size: 12px;
    }
}
</style>

<style scoped>
.compare-container {
    width: 90vw;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.input-container {
    width: 100%;
    margin: 12px;
    display: flex;
    justify-content: center;
}

.input-tab {
    width: 90%;
}

@media (max-width: 768px) {
    .input-container {
        width: 100%;
        margin: 12px;
        display: flex;
        justify-content: center;
    }
}
</style>