<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash'
import { getAnimeInfo, searchAnimeByKeyword } from '../api/bangumi'
import { getSimilarAnime } from '../api/match'
import AnimeCompact from '../components/AnimeCompact.vue'
import Anime from '../components/Anime.vue'
import { useNotification } from 'naive-ui'
import { BANGUMI_SUBJECT } from '../api/_prefix'

const isLoadingSearch = ref(false)
const isLoadingInfo = ref(false)

const notify = useNotification()
const windowWidth = ref(window.innerWidth)
onMounted(() => { window.addEventListener('resize', () => { windowWidth.value = window.innerWidth }) })
const isMobile = computed(() => windowWidth.value <= 768)
const mobileScaleRatio = computed(() => isMobile.value ? 0.787 : 1)

const animeId = ref('')
const animeName = ref('')

const searchByKeywordOn = ref(false)
const animeKeyword = ref('')
const keywordResults = ref([])

const onKeywordInputChanged = debounce(async () => {
    isLoadingSearch.value = true
    keywordResults.value = await searchAnimeByKeyword(animeKeyword.value)
    isLoadingSearch.value = false

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
    searchByKeywordOn.value = false
}

const similarAnimeIds = ref([])
const similarAnimeSimilarities = ref([])
const similarAnimeInfos = ref([])

const onIdInputChanged = debounce(async () => {
    try {
        isLoadingInfo.value = true
        curAnimeInfoIndex = 0
        similarAnimeIds.value = []
        similarAnimeInfos.value = []

        const idsAndSimilarities = await getSimilarAnime(animeId.value)
        similarAnimeIds.value = idsAndSimilarities.map(item => item['id'])
        similarAnimeSimilarities.value = idsAndSimilarities.map(item => (Number(item['score']) * 10).toFixed(2))

        getAnimeInfo(animeId.value).then(res => {
            animeName.value = res.name
        })

        await getTwentyAnimeInfos()

        isLoadingInfo.value = false
    } catch (error) {
        notify.error({
            title: error.message,
            duration: 3000
        })

        curAnimeInfoIndex = 0
        similarAnimeIds.value = []
        similarAnimeInfos.value = []
        isLoadingInfo.value = false
    }
}, 500)

let curAnimeInfoIndex = 0;
const getTwentyAnimeInfos = async () => {
    if (curAnimeInfoIndex >= similarAnimeIds.value.length) {
        return;
    }

    similarAnimeInfos.value = similarAnimeInfos.value.filter(item => Object.keys(item).length > 0);

    const nextIds = similarAnimeIds.value.slice(curAnimeInfoIndex, curAnimeInfoIndex + 20);
    const newAnimeInfos = await Promise.all(nextIds.map(id => getAnimeInfo(id)));

    newAnimeInfos.forEach((info, i) => {
        info.similarity = similarAnimeSimilarities.value[curAnimeInfoIndex + i];
    });

    const updatedList = [...similarAnimeInfos.value, ...newAnimeInfos];

    curAnimeInfoIndex += 20;

    if (curAnimeInfoIndex < similarAnimeIds.value.length) {
        updatedList.push({});
    }

    similarAnimeInfos.value = updatedList;
}

watch(animeId, () => {
    onIdInputChanged()
})

const emptyAnimeList = Array.from({ length: 20 }, () => ({}));
</script>

<template>
    <n-layout-content class="similar-anime-container">
        <n-collapse-transition class="outer-container" :show="!searchByKeywordOn">
            <n-flex justify="center" :size="20 * mobileScaleRatio">
                <span class="input-title">动画 ID</span>
                <n-input class="input" :loading="isLoadingInfo" v-model:value="animeId"
                    placeholder="请输入动画在 Bangumi 的 ID" />
            </n-flex>
        </n-collapse-transition>

        <n-flex class="outer-container" justify="center" :size="20 * mobileScaleRatio">
            <n-tooltip trigger="hover">
                <template #trigger>
                    <span class="hint-text">不知道动画的 id ?</span>
                </template>
                在 <a href="https://bgm.tv" target="_blank">Bangumi</a> 点开一个动画页面，<br />链接中最后一段的数字就是 id。<br />
                如 <a href="https://bgm.tv/subject/501702" target="_blank">https://bgm.tv/subject/501702</a><br /> 的 id 是
                501702。
            </n-tooltip>

            <n-switch v-model:value="searchByKeywordOn" size="large">
                <template #checked><span style="font-weight: bold;">按名称搜索</span></template>
                <template #unchecked><span style="font-weight: bold;">按名称搜索</span></template>
            </n-switch>
        </n-flex>

        <n-collapse-transition class="outer-container" :show="searchByKeywordOn">
            <n-flex justify="center">
                <span class="input-title">动画名关键字</span>
                <n-input class="input" :loading="isLoadingSearch"
                    v-model:value="animeKeyword" placeholder="请输入动画名（中文或日文）" />
            </n-flex>

            <n-divider v-show="keywordResults.length"><span
                    :style="{ color: 'var(--color-hint)', fontWeight: 'bold' }">搜索结果</span></n-divider>

            <n-flex class="search-result-container" justify="flex-start">
                <div v-for="anime in keywordResults" :key="anime.id">
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <AnimeCompact @click="fillIdBySearchResult(anime.id)" :name="anime.name"
                                :nameCN="anime.name_cn" :image="anime.images?.large || ''" />
                        </template>
                        <a :href="BANGUMI_SUBJECT (String(anime.id))" target="_blank" style="text-underline-offset: 3px;">{{ anime.name }}</a>
                    </n-tooltip>
                </div>
            </n-flex>
        </n-collapse-transition>

        <n-divider>
            <n-flex class="similar-anime-title-container" justify="center" size="small">
                <template v-if="isLoadingInfo">
                    <n-skeleton style="border-radius: 4px;" :width="160 * mobileScaleRatio"
                        :height="36 * mobileScaleRatio" />
                    <span>的相似动画</span>
                </template>
                <template v-else-if="similarAnimeInfos.length >= 1">
                    <a :href="BANGUMI_SUBJECT + animeId" target="_blank" style="text-decoration: none;">
                        <span class="origin-anime-name">{{ animeName }}</span>
                    </a>
                    <span>的相似动画</span>
                </template>
            </n-flex>
        </n-divider>


        <n-infinite-scroll :distance="10" @load="getTwentyAnimeInfos">
            <n-flex class="similar-anime-info-container" justify="center" :size="12">
                <div v-for="(anime, index) in isLoadingInfo ? emptyAnimeList : similarAnimeInfos" :key="index">
                    <Anime :info="anime" similarity />
                </div>
            </n-flex>
        </n-infinite-scroll>

    </n-layout-content>

</template>

<style scoped>
.similar-anime-container {
    height: calc(100vh - 85px);
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
}

.outer-container {
    width: 100vw;
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
    font-size: 20px;
    font-weight: bold;
}

.hint-text {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-hint);
    user-select: none;
    padding: 0 6px 0 6px;
    box-sizing: border-box;
    border: 1px dashed transparent;
    border-radius: 6px;
    transition: border-color 0.5s;
    text-decoration: underline;
    text-underline-offset: 4px;
}

.hint-text:hover {
    color: #88C0D0;
    border-color: #88C0D0;
}

.search-by-name-container {
    width: 90vw;
    margin: 20px;
}

.search-result-container {
    width: 90vw;
    height: 480px;
    padding: 12px;
    overflow-y: scroll;
}

.similar-anime-title-container {
    max-width: 90vw;
    font-size: 22px;
    font-weight: bold;
}

.origin-anime-name {
    color: #88C0D0;
    font-size: 28px;
}

.similar-anime-info-container {
    height: calc(100vh - 80px);
    padding: 12px 0 20px 0;
}

@media (max-width: 768px) {
    .similar-anime-container {
        height: calc(100vh - 85px);
    }

    .outer-container {
        width: 100vw;
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

    .search-result-container {
        height: 378px;
        padding: 0;
    }

    .similar-anime-title-container {
        font-size: 16px;
    }

    .origin-anime-name {
        font-size: 22px;
    }

    .similar-anime-info-container {
        height: calc(100vh - 85px);
        padding: 0 0 20px 0;
    }
}
</style>