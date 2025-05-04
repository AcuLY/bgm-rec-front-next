<script setup>
import { ref } from 'vue'
import AnimeCompact from '../components/AnimeCompact.vue'
import { searchAnimeByKeyword } from '../api/bangumi'
import { BANGUMI_SUBJECT } from '../api/_prefix'
import { useNotification } from 'naive-ui'
import { debounce } from 'lodash'
import { useStore } from 'vuex'

const props = defineProps(['animeId', 'isLoading'])
const emit = defineEmits(['update:animeId'])

const notify = useNotification()
const store = useStore()

const animeId = ref('')
watch(animeId, () => {
    if (animeId.value.length > 0) emit('update:animeId', animeId.value)
})

const showSearchResult = ref(false)
const animeKeyword = ref('')
const keywordResults = ref([])

const isLoadingSearch = ref(false)
const onKeywordInputChanged = debounce(async () => {
    if (animeKeyword.value.length == 0) {
        return
    }

    isLoadingSearch.value = true
    keywordResults.value = await searchAnimeByKeyword(animeKeyword.value)
    isLoadingSearch.value = false

    showSearchResult.value = true

    if (keywordResults.value.length == 0) {
        notify.warning({
            title: '无搜索结果！',
            duration: 3000
        })
    }
}, 500)

watch(animeKeyword, () => {
    onKeywordInputChanged()
})

const fillIdBySearchResult = (id) => {
    animeId.value = String(id)
}
</script>

<template>
    <div class="outer-container">
        <n-flex justify="center" size="large">
            <span class="input-title">动画名称</span>
            <n-input class="input" :loading="props.isLoading || isLoadingSearch" v-model:value="animeKeyword"
                placeholder="输入关键字搜索（中文或日文）" />
            <n-switch class="switch" v-model:value="showSearchResult" :size="store.state.isMobile ? 'medium' : 'large'">
                <template #checked><span style="font-weight: bold;">显示搜索结果</span></template>
                <template #unchecked><span style="font-weight: bold;">显示搜索结果</span></template>
            </n-switch>
        </n-flex>

        <n-collapse-transition :show="showSearchResult">
            <n-divider v-show="keywordResults.length"><span
                    :style="{ color: 'var(--color-hint)', fontWeight: 'bold' }">搜索结果</span></n-divider>

            <n-flex class="search-result-container" justify="center" wrap align="start">
                <div v-for="anime in keywordResults" :key="anime.id">
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <AnimeCompact @click="fillIdBySearchResult(anime.id)" :name="anime.name"
                                :nameCN="anime.name_cn" :image="anime.images?.large || ''" />
                        </template>
                        <a :href="BANGUMI_SUBJECT(String(anime.id))" target="_blank"
                            style="text-underline-offset: 3px;">{{
                                anime.name }}</a>
                    </n-tooltip>
                </div>
            </n-flex>
        </n-collapse-transition>
    </div>
</template>

<style scoped>
.outer-container {
    margin: 20px 0 0px 0;
    box-sizing: border-box;
    padding: 0 20px 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.input {
    width: 280px;
}

.input-title {
    color: var(--color-titlebar);
    font-size: 20px;
    font-weight: bold;
}

.switch {
    transform: translateY(4px);
}

.search-by-name-container {
    width: 90vw;
    margin: 20px;
}

.search-result-container {
    height: 480px;
    padding: 12px;
    overflow-y: scroll;
}

@media (max-width: 768px) {
    .outer-container {
        margin: 15px 0 0px 0;
        padding: 0 15px 0 15px;
    }

    .input {
        width: 240px;
        height: 32px;
    }

    .input-title {
        transform: translateY(2px);
        font-size: 16px;
    }

    .switch {
        transform: translateY(-1px);
    }

    .search-result-container {
        height: 378px;
        padding: 0;
    }
}
</style>