<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash'
import { getAnimeInfo, searchAnimeByKeyword } from '../api/bangumi'
import { getSimilarAnime } from '../api/match'
import AnimeCompact from '../components/AnimeCompact.vue'
import Anime from '../components/Anime.vue'
import { useNotification } from 'naive-ui'
import { BANGUMI_SUBJECT } from '../api/_prefix'

const notify = useNotification()

const animeId = ref('')
const animeName = ref('')

const searchByKeywordOn = ref(false)
const animeKeyword = ref('')
const keywordResults = ref([])

const onKeywordInputChanged = debounce(async () => {
    keywordResults.value = await searchAnimeByKeyword(animeKeyword.value)
}, 500)

watch(animeKeyword, () => {
    onKeywordInputChanged()
})

const fillIdBySearchResult = (id) => {
    animeId.value = String(id)
    searchByKeywordOn.value = false
}

const similarAnimeIds = ref([])
const similarAnimeInfos = ref([])

const onIdInputChanged = debounce(async () => {
    try {
        similarAnimeIds.value = await getSimilarAnime(animeId.value)

        getAnimeInfo(animeId.value).then(res => {
            animeName.value = res.name
        })

        similarAnimeInfos.value = await Promise.all(similarAnimeIds.value.map(id => getAnimeInfo(id)))
        console.log(similarAnimeInfos.value)
    } catch (error) {
        notify.error({
            title: error.message,
            duration: 3000
        })
    }
}, 500)

watch(animeId, () => {
    onIdInputChanged()
})

const utility = {
    id: 110568,
    name: '空色ユーティリティ',
    nameCN: '一杆青空',
    image: 'https://lain.bgm.tv/r/400/pic/cover/l/ea/c4/479788_mcfeN.jpg',
    summary: '「再这样下去，就只能作为普通的村民A毕业了！」青羽美波有一个烦恼，那就是她没有任何专长或是想做的事。美好的女子高中生活，真的要以路人角色结束了吗！ ？美波从学校飞奔而出，寻找属于自己的「Special」。碰巧来到了附近的高尔夫练习场，并在工读生茜遥的搭话下，握起了高尔夫球杆―――「Utility」。这就是美波与高尔夫的相遇。高尔夫不是只有挥杆和获胜！而是一切都很有趣！与天才高尔夫球手―――遥，以及想当网红的星美彩花一起。为了寻求自己成为「主角」的瞬间，超级初学者―――美波，今天也举起了球杆！',
    tags: ['TV', '日本', '原创', '运动'],
    date: '2025-1-3',
    score: '6.7',
    total: 1001,
    similarity: 8
}
for (let i = 0; i < 20; i++) {
    similarAnimeInfos.value.push({...utility});
}
</script>

<template>
    <n-layout-content class="similar-anime-container">
        <n-collapse-transition class="outer-container" :show="!searchByKeywordOn">
            <n-flex justify="center" :size="20">
                <span class="input-title">动画 id</span>
                <n-input class="input" v-model:value="animeId" placeholder="请输入动画在 Bangumi 的条目 id" />
            </n-flex>
        </n-collapse-transition>

        <n-flex class="outer-container" justify="center" :size="20">
            <n-tooltip trigger="hover">
                <template #trigger>
                    <span class="hint-text">不知道动画的 id ?</span>
                </template>
                在 <a href="https://bgm.tv" target="_blank">Bangumi</a> 点开一个动画页面，链接中最后一段的数字就是 id。<br />
                如 <a href="https://bgm.tv/subject/501702" target="_blank">https://bgm.tv/subject/501702</a> 的 id 是
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
                <n-input class="input" v-model:value="animeKeyword" placeholder="请输入动画名称关键字（中文日文均可）" />
            </n-flex>

            <n-divider v-show="keywordResults.length"><span
                    :style="{color: 'var(--color-hint)', fontWeight: 'bold'}">搜索结果</span></n-divider>

            <n-flex class="search-result-container" justify="flex-start">
                <div v-for="anime in keywordResults" :key="anime.id">
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <AnimeCompact @click="fillIdBySearchResult(anime.id)" :name="anime.name"
                                :nameCN="anime.name_cn" :image="anime.images?.large || ''" />
                        </template>
                        <a :href="BANGUMI_SUBJECT + String(anime.id)" target="_blank" style="text-underline-offset: 3px;">{{ anime.name }}</a>
                    </n-tooltip>
                </div>
            </n-flex>
        </n-collapse-transition>

        <n-divider>
            <n-flex class="similar-anime-title-container" justify="center" size="small"
                v-show="similarAnimeIds.length >= 1">
                <span style="color: #88C0D0; font-size: 28px;">{{ animeName }}</span>
                <span>的相似动画</span>
            </n-flex>
        </n-divider>

        <n-flex justify="center" :size="20" v-show="similarAnimeInfos.length >= 1">
            <div v-for="(anime, index) in similarAnimeInfos" :key="index">
                <Anime :info="anime" />
            </div>
        </n-flex>


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
    font-size: 24px;
    font-weight: bold;
}
</style>