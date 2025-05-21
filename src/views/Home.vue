<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { CompareFilled as SimilarAnimeIcon, RecommendSharp as RecommendationIcon, ScatterPlotOutlined as DistributionIcon, ArticleOutlined as AboutIcon } from '@vicons/material'
import { NIcon } from 'naive-ui'

const store = useStore()

const switchMode = () => {
    const toggled = !store.state.isDarkMode
    store.dispatch('switchDarkMode', toggled)
}

const router = useRouter()

function renderSimilarAnimeIcon() {
    return h(NIcon, null, {
        default: () => h(SimilarAnimeIcon)
    })
}

function renderRecommendationIcon() {
    return h(NIcon, null, {
        default: () => h(RecommendationIcon)
    })
}

function renderDistributionIcon() {
    return h(NIcon, null, {
        default: () => h(DistributionIcon)
    })
}

function renderAboutIcon() {
    return h(NIcon, null, {
        default: () => h(AboutIcon)
    })
}
</script>

<template>
    <n-layout-header>
        <n-flex class="icon-container" justify="end">
            <n-button text class="icon" @click="switchMode" @mouseup="e => e.currentTarget.blur()">
                <n-icon v-show="store.state.isDarkMode">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24">
                        <path
                            d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"
                            fill="currentColor"></path>
                    </svg>
                </n-icon>

                <n-icon v-show="!store.state.isDarkMode">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24">
                        <path
                            d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
                            fill="currentColor"></path>
                    </svg>
                </n-icon>
            </n-button>

            <a href="https://github.com/bangumi-match" target="_blank">
                <svg t="1743927261682" class="icon" id="github" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2612">
                    <path
                        d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                        p-id="2613" fill="currentColor">
                    </path>
                </svg>
            </a>
        </n-flex>
    </n-layout-header>

    <n-layout-content class="content">
        <n-flex class="home-container" vertical justify="center">
            <n-flex class="title-container" vertical justify="center" align="center" :size="0">
                <h1 class="title">Bangumi Match</h1>
                <h2 class="subtitle">发现你心中的下一部最爱</h2>
            </n-flex>

            <n-flex justify="center" :size="24">
                <n-button class="button" ghost color="#81A1C1" size="large" :render-icon="renderSimilarAnimeIcon"
                    @click="router.push({ name: 'SimilarAnime' })">相似动画</n-button>
                <n-button class="button" ghost color="#81A1C1" size="large" :render-icon="renderRecommendationIcon"
                    @click="router.push({ name: 'Recommendation' })">个性推荐</n-button>
                <n-button class="button" ghost color="#81A1C1" size="large" :render-icon="renderDistributionIcon"
                    @click="router.push({ name: 'Distribution' })">动画分布</n-button>
                <n-button class="button" ghost color="#81A1C1" size="large" :render-icon="renderAboutIcon"
                    @click="router.push({ name: 'About' })">关于本站</n-button>
            </n-flex>
        </n-flex>
    </n-layout-content>
</template>

<style scoped>
.icon-container {
    padding: 20px 20px 20px 20px;
    background-color: var(--color-home-background);
    border-style: solid none none none;
    border-color: var(--nord9);
    border-width: 5px;
    align-items: center;
    transition: background-color 0.3s cubic-bezier(.4, 0, .2, 1)
}

.icon {
    font-size: 40px;
    color: var(--color-titlebar);
    transition: color 0.2s ease;
    text-decoration: none;
    transform: translateY(-3px);
}

.icon:hover {
    color: var(--nord8);
}

#github {
    width: 40px;
    transform: translateX(-1px) translateY(-1px);
}

.content {
    height: calc(100vh - 91px);
    background-color: var(--color-home-background);
}

.home-container {
    transform: translateY(64px);
}

.title-container {
    padding: 16px 32px;
}

.title {
    font-size: 64px;
    margin: 0;
}

.button {
    font-size: large;
}

@media (max-width: 768px) {
    .icon-container {
        padding: 10px 10px 10px 10px;
    }

    .icon {
        font-size: 30px;
    }

    #github {
        width: 30px;
        transform: translateY(0px);
    }

    .content {
        height: calc(100vh - 61px);
    }
}
</style>