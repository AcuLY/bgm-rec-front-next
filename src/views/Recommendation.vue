<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash'
import { fetchUserCollections, getAnimeInfo, getUserInfo } from '../api/bangumi'
import { getUserRecommendation } from '../api/match'
import Anime from '../components/Anime.vue'
import { useNotification } from 'naive-ui'
import InputUser from '../components/InputUser.vue'
import { useStore } from 'vuex'

const isLoadingInfo = ref(false)

const notify = useNotification()
const store = useStore()
const mobileScaleRatio = computed(() => store.state.isMobile ? 0.787 : 1)

const userId = ref('')
const userName = ref('')
const userNickname = ref('')

const userCollectionIds = ref([])

const recommendationAnimeIds = ref([])
const recommendationAnimeInfos = ref([])

const onIdInputChanged = debounce(async () => {
    try {
        isLoadingInfo.value = true
        curAnimeInfoIndex = 0
        recommendationAnimeIds.value = []
        recommendationAnimeInfos.value = []

        const userInfo = await getUserInfo(userName.value)
        userId.value = userInfo.id
        userNickname.value = userInfo.nickname

        const [collectionsResp, recommendations] = await Promise.all([
            fetchUserCollections(userName.value),
            getUserRecommendation(userId.value)
        ])
        userCollectionIds.value = collectionsResp.data

        recommendationAnimeIds.value = recommendations
        recommendationAnimeIds.value = recommendations.filter(item => {
            const id = item.id
            const inDoing = userCollectionIds.value.doing?.includes(id)
            const inCollect = userCollectionIds.value.collect?.includes(id)
            const inOnHold = userCollectionIds.value.onhold?.includes(id)
            const inDropped = userCollectionIds.value.dropped?.includes(id)
            return !(inDoing || inCollect || inOnHold || inDropped)
        }).map(item => item.id)    // 暂时未处理同系列

        await getTwentyAnimeInfos()

        isLoadingInfo.value = false
    } catch (error) {
        notify.error({
            title: error.message,
            duration: 3000
        })

        curAnimeInfoIndex = 0
        recommendationAnimeIds.value = []
        recommendationAnimeInfos.value = []
        isLoadingInfo.value = false
    }
}, 1000)

let curAnimeInfoIndex = 0
const getTwentyAnimeInfos = async () => {
    if (curAnimeInfoIndex >= recommendationAnimeIds.value.length) {
        return
    }

    recommendationAnimeInfos.value = recommendationAnimeInfos.value.filter(item => Object.keys(item).length > 0)

    const nextIds = recommendationAnimeIds.value.slice(curAnimeInfoIndex, curAnimeInfoIndex + 20)
    const userCollectedSet = new Set(userCollectionIds.value.wish)

    const newAnimeInfos = await Promise.all(
        nextIds.map(async id => {
            const info = await getAnimeInfo(id)
            return {
                ...info,
                wish: userCollectedSet.has(id)
            }
        })
    )

    const updatedList = [...recommendationAnimeInfos.value, ...newAnimeInfos]
    curAnimeInfoIndex += 20

    if (curAnimeInfoIndex < recommendationAnimeIds.value.length) {
        updatedList.push({})
    }

    recommendationAnimeInfos.value = updatedList
}


watch(userName, () => {
    onIdInputChanged()
})

const emptyAnimeList = Array.from({ length: 20 }, () => ({}))

defineOptions({
    name: 'Recommendation'
})
</script>

<template>
    <n-layout-content class="recommendation-container">
        <InputUser v-model:userName="userName" v-model:isLoading="isLoadingInfo" />

        <n-divider>
            <n-flex class="recommendation-title-container" justify="center" size="small">
                <template v-if="isLoadingInfo">
                    <n-skeleton style="border-radius: 4px;" :width="160 * mobileScaleRatio"
                        :height="36 * mobileScaleRatio" />
                    <span>的个性化推荐动画</span>
                </template>
                <template v-else-if="recommendationAnimeInfos.length >= 1">
                    <span class="user-nickname">{{ userNickname }}</span>
                    <span>的个性化推荐动画</span>
                </template>
            </n-flex>
        </n-divider>


        <n-infinite-scroll :distance="10" @load="getTwentyAnimeInfos">
            <n-flex class="rec-anime-info-container" justify="center" :size="12">
                <div v-for="(anime, index) in isLoadingInfo ? emptyAnimeList : recommendationAnimeInfos" :key="index">
                    <Anime :info="anime" :similarity="false" />
                </div>
            </n-flex>
        </n-infinite-scroll>

    </n-layout-content>

</template>

<style scoped>
.recommendation-container {
    height: calc(100vh - 85px);
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
}

.recommendation-title-container {
    max-width: 90vw;
    font-size: 22px;
    font-weight: bold;
}

.user-nickname {
    color: #88C0D0;
    font-size: 28px;
}

.rec-anime-info-container {
    height: calc(100vh - 80px);
    padding: 12px 0 20px 0;
}

@media (max-width: 768px) {
    .recommendation-container {
        height: calc(100vh - 85px);
    }

    .recommendation-title-container {
        font-size: 16px;
    }

    .user-nickname {
        font-size: 22px;
    }

    .rec-anime-info-container {
        height: calc(100vh - 85px);
        padding: 0 0 20px 0;
    }
}
</style>