<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash'
import { getAnimeInfo, getUserInfo } from '../api/bangumi'
import { getUserRecommendation } from '../api/match'
import Anime from '../components/Anime.vue'
import { useNotification } from 'naive-ui'

const isLoadingInfo = ref(false)

const notify = useNotification()
const windowWidth = ref(window.innerWidth)
onMounted(() => { window.addEventListener('resize', () => { windowWidth.value = window.innerWidth }) })
const isMobile = computed(() => windowWidth.value <= 768)
const mobileScaleRatio = computed(() => isMobile.value ? 0.787 : 1)

const userId = ref('')
const userName = ref('')
const userNickname = ref('')

const recommendAnimeList = ref([]) // 修改为包含 id 和 series 的数组
const recommendAnimeSimilarities = ref([])
const recommendAnimeInfos = ref([])

const onIdInputChanged = debounce(async () => {
  try {
    isLoadingInfo.value = true
    curAnimeInfoIndex = 0
    recommendAnimeList.value = []
    recommendAnimeInfos.value = []

    const userInfo = await getUserInfo(userName.value)
    userId.value = userInfo.id
    userNickname.value = userInfo.nickname

    recommendAnimeList.value = await getUserRecommendation(userId.value) // 获取包含 id 和 series 的数据

    await getTwentyAnimeInfos()

    isLoadingInfo.value = false
  } catch (error) {
    notify.error({
      title: error.message,
      duration: 3000
    })

    curAnimeInfoIndex = 0
    recommendAnimeList.value = []
    recommendAnimeInfos.value = []
    isLoadingInfo.value = false
  }
}, 500)

let curAnimeInfoIndex = 0;
const getTwentyAnimeInfos = async () => {
  if (curAnimeInfoIndex >= recommendAnimeList.value.length) {
    return;
  }

  recommendAnimeInfos.value = recommendAnimeInfos.value.filter(item => Object.keys(item).length > 0);

  const nextItems = recommendAnimeList.value.slice(curAnimeInfoIndex, curAnimeInfoIndex + 20);
  const nextIds = nextItems.map(item => item.id); // 提取 id 列表
  const newAnimeInfos = await Promise.all(nextIds.map(id => getAnimeInfo(id)));

  newAnimeInfos.forEach((info, i) => {
    info.similarity = recommendAnimeSimilarities.value[curAnimeInfoIndex + i];
    info.series = nextItems[i].series; // 添加 series 信息
  });

  const updatedList = [...recommendAnimeInfos.value, ...newAnimeInfos];

  curAnimeInfoIndex += 20;

  if (curAnimeInfoIndex < recommendAnimeList.value.length) {
    updatedList.push({});
  }

  recommendAnimeInfos.value = updatedList;
}

watch(userName, () => {
  onIdInputChanged()
})

const emptyAnimeList = Array.from({ length: 20 }, () => ({}));
</script>

<template>
    <n-layout-content class="recommendation-container">
        <n-flex class="outer-container" justify="center" :size="20 * mobileScaleRatio">
            <span class="input-title">Bangumi UID</span>
            <n-input class="input" :loading="isLoadingInfo" v-model:value="userName" placeholder="请输入 UID（不是昵称）" />
            <n-tooltip trigger="hover">
                <template #trigger>
                    <span class="hint-text">不知道你的 uid ?</span>
                </template>
                进入你在 <a href="https://bgm.tv" target="_blank">Bangumi</a> 的个人主页，<br />
                查看链接的最后一项，<br />
                如 <span style="color: #88C0D0;">https://bgm.tv/user/lucay126</span><br />
                的 uid 就是 <span style="color: #88C0D0;">lucay126</span>
            </n-tooltip>
        </n-flex>

        <n-divider>
            <n-flex class="recommendation-title-container" justify="center" size="small">
                <template v-if="isLoadingInfo">
                    <n-skeleton style="border-radius: 4px;" :width="160 * mobileScaleRatio"
                        :height="36 * mobileScaleRatio" />
                    <span>的个性化推荐动画</span>
                </template>
                <template v-else-if="recommendAnimeInfos.length >= 1">
                    <span class="user-nickname">{{ userNickname }}</span>
                    <span>的个性化推荐动画</span>
                </template>
            </n-flex>
        </n-divider>


        <n-infinite-scroll :distance="10" @load="getTwentyAnimeInfos">
            <n-flex class="rec-anime-info-container" justify="center" :size="12">
                <div v-for="(anime, index) in isLoadingInfo ? emptyAnimeList : recommendAnimeInfos" :key="index">
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
    width: 200px;
}

.input-title {
    font-size: 20px;
    font-weight: bold;
}

.hint-text {
    display: flex;
    align-items: center;
    font-size: 16px;
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

    .outer-container {
        width: 100vw;
        margin: 15px 0 0px 0;
        padding: 0 15px 0 15px;
    }

    .input {
        width: 200px;
        height: 32px;
    }

    .input-title {
        transform: translateY(2px);
        font-size: 16px;
    }

    .hint-text {
        font-size: 14px;
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