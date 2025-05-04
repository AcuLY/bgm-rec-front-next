<script setup>
import { ref, watch } from 'vue'
import { debounce } from 'lodash'
import { getAnimeInfo } from '../api/bangumi'
import { getSimilarAnime } from '../api/match'
import Anime from '../components/Anime.vue'
import { useNotification } from 'naive-ui'
import { BANGUMI_SUBJECT } from '../api/_prefix'
import InputAnime from '../components/InputAnime.vue'
import { useStore } from 'vuex'

const isLoadingInfo = ref(false)

const notify = useNotification()

const store = useStore()
const mobileScaleRatio = computed(() => store.state.isMobile ? 0.787 : 1)

const animeId = ref('')
const animeName = ref('')
watch(animeId, () => {
    onIdInputChanged()
})

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
}, 1000)

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

defineOptions({
    name: 'SimilarAnime'
})
</script>

<template>
    <n-layout-content class="similar-anime-container">
        <div style="width: 100vw;">
            <InputAnime v-model:animeId="animeId" v-model:isLoading="isLoadingInfo"/>
        </div>

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

.similar-anime-title-container {
    max-width: 90vw;
    font-size: 22px;
    font-weight: bold;
}

.origin-anime-name {
    color: #88C0D0;
    font-size: 28px;
}

.origin-anime-name:hover {
    text-decoration: underline;
    text-underline-offset: 8px;
}

.similar-anime-info-container {
    height: calc(100vh - 80px);
    padding: 12px 0 20px 0;
}

@media (max-width: 768px) {
    .similar-anime-container {
        height: calc(100vh - 85px);
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