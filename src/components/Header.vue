<script setup>
import { computed, onMounted, watch } from 'vue'
import { useOsTheme } from 'naive-ui'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()

const osThemeRef = useOsTheme()

onMounted(() => {
    const shouldUseDark = osThemeRef.value === 'dark'
    store.dispatch('switchDarkMode', shouldUseDark)
})

watch(osThemeRef, (newTheme) => {
    const shouldUseDark = newTheme === 'dark'
    store.dispatch('switchDarkMode', shouldUseDark)
})

const switchMode = () => {
    const toggled = !store.state.isDarkMode
    store.dispatch('switchDarkMode', toggled)
}


const router = useRouter()
const route = useRoute()

const menuOptions = ref([
    { name: '相似动画', path: '/similar-anime' },
    { name: '个性推荐', path: '/recommendation' },
    { name: '动画分布', path: '/distribution' },
    { name: '关于本站', path: '/about' },
])
const activePath = computed(() => route.path);

const navigateTo = (path) => {
    router.push(path);
};

const windowWidth = ref(window.innerWidth)
onMounted(() => {
    window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth
    })
})
const isMobile = computed(() => windowWidth.value <= 768)
watch(isMobile, (val) => {
    store.dispatch('switchIsMobile', val)
}, { immediate: true })

const menuOptionsGap = computed(() => {
    return isMobile.value ? 24 : 32
})

</script>

<template>
    <n-layout-header v-show="activePath !== '/'">
        <n-flex justify="space-between" class="header-container">
            <div class="title-container" @click="router.push({ name: 'Home' })">
                <n-flex>
                    <img src="/bgm-rec-star.svg" class="bm-icon">
                    <div>Bangumi Match</div>
                </n-flex>
            </div>

            <div class="menu-container">
                <n-flex justify="center" :size="menuOptionsGap">
                    <span v-for="option in menuOptions" :key="option.path" class="menu-option"
                        :class="{ active: activePath === option.path }" @click="navigateTo(option.path)">
                        {{ option.name }}
                    </span>
                </n-flex>
            </div>

            <div class="icon-container">
                <n-flex justify="end">
                    <n-button text class="mode-icon" @click="switchMode" @mouseup="e => e.currentTarget.blur()">
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

                    <a href="https://github.com/bangumi-match" target="_blank" class="header-items">
                        <svg t="1743927261682" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="2612">
                            <path
                                d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                                p-id="2613" fill="currentColor">
                            </path>
                        </svg>
                    </a>
                </n-flex>
            </div>
        </n-flex>
    </n-layout-header>
</template>

<style scoped>
.header-container {
    padding: 20px 20px 20px 20px;
    color: var(--color-titlebar);
    background-color: var(--color-titlebar-background);
    border-style: solid none none none;
    border-color: var(--nord9);
    border-width: 5px;
    font-size: 24px;
    font-weight: bold;
    user-select: none;
    transition: background-color 0.3s cubic-bezier(.4, 0, .2, 1)
}

.title-container {
    order: 1;
}

.menu-container {
    order: 2;
}

.icon-container {
    order: 3;
}

.bm-icon {
    width: 40px;
    height: 40px;
    transform: translateY(-4px);
}

.menu-option {
    position: relative;
    display: inline-block;
    cursor: pointer;
    color: var(--color-titlebar);
    transition: color 0.2s ease;
}

.menu-option:hover,
.menu-option.active {
    color: var(--nord9);
}

.menu-option::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    background-color: currentColor;
    transition: width 0.2s ease, transform 0.2s ease;
    transform: translateY(2px);
}

.menu-option:hover::after,
.menu-option.active::after {
    color: var(--nord9);
    width: 100%;
}

.mode-icon {
    font-size: 40px;
    color: var(--color-titlebar);
    transition: color 0.2s ease;
}

.mode-icon:hover {
    color: var(--nord9);
}

.header-items {
    text-decoration: none;
}

.header-items svg {
    width: 40px;
    margin: -10px 0 -10px 0;
    transform: translateY(1px);
    color: var(--color-titlebar);
    transition: color 0.2s ease;
}

.header-items:hover svg {
    color: var(--nord9);
}

@media (max-width: 768px) {
    .header-container {
        padding: 10px 10px 10px 10px;
        font-size: 16px;
    }

    .menu-container {
        width: 100vw;
        order: 3;
    }

    .icon-container {
        order: 2;
    }

    .bm-icon {
        width: 24px;
        height: 24px;
        transform: translateY(-2px);
    }

    .mode-icon {
        font-size: 30px;
    }

    .header-items svg {
        width: 30px;
        transform: translateY(0px);
    }
}
</style>