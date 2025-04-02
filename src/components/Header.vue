<script setup>
import { computed, onMounted, watch } from 'vue'
import { useOsTheme } from 'naive-ui'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()

const osThemeRef = useOsTheme()

onMounted(() => {
    store.dispatch('switchDarkMode', osThemeRef.value === 'dark')
})

watch(osThemeRef, (newTheme) => {
    store.dispatch('switchDarkMode', newTheme === 'dark')
})

const switchMode = () => {
    store.dispatch('switchDarkMode', !store.state.isDarkMode)
    console.log(store.state.isDarkMode)
}


const router = useRouter()
const route = useRoute()

const menuOptions = ref([
    { name: '相似动画', path: '/similar-anime' },
    { name: '个性推荐', path: '/recommendation' },
    { name: '统计信息', path: '/statistics' },
    { name: '关于本站', path: '/about' },
])
const activePath = computed(() => route.path);

const navigateTo = (path) => {
    router.push(path);
};

const windowWidth = ref(window.innerWidth)
onMounted(() => { window.addEventListener('resize', () => { windowWidth.value = window.innerWidth }) })
const menuOptionsGap = computed(() => {
    return windowWidth.value > 768 ? 32 : 12
})

</script>

<template>
    <n-layout-header>
        <n-flex justify="space-between" class="header-container">
            <n-flex v-show="windowWidth > 768">
                <img src="/bssIcon.png" class="bss-icon">
                <div>Bangumi Rec</div>
            </n-flex>

            <n-flex justify="center" :size="menuOptionsGap">
                <span v-for="option in menuOptions" :key="option.path" class="menu-option"
                    :class="{ active: activePath === option.path }" @click="navigateTo(option.path)">
                    {{ option.name }}
                </span>
            </n-flex>

            <n-flex justify="end">
                <n-button text class="mode-icon" @click="switchMode" color="#FFFFFF">
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

                <a href="https://github.com/AcuLY/BangumiStaffStats" target="_blank" class="header-items">
                    <img src="/github.png" alt="Github">
                </a>
            </n-flex>
        </n-flex>
    </n-layout-header>
</template>

<style scoped>
.header-container {
    padding: 20px 20px 20px 20px;
    background-color: #191919;
    border-style: solid none none none;
    border-color: #ff5b9a;
    border-width: 5px;
    font-size: 24px;
    font-weight: bold;
    color: rgb(255, 255, 255);
    user-select: none;
}

.bss-icon {
    width: 40px;
    height: 40px;
    transform: translateY(-4px);
}

.menu-option {
    position: relative;
    display: inline-block;
    cursor: pointer;
    color: white;
    transition: color 0.2s ease;
}

.menu-option:hover,
.menu-option.active {
    color: #ff5b9a;
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
    color: #ff5b9a;
    width: 100%;
}

.mode-icon {
    color: white;
    font-size: 40px;
}

.mode-icon:hover {
    color: #ff5b9a;
}

.header-items {
    color: white;
    text-decoration: none;
}

.header-items img {
    width: 40px;
    margin: -10px 0 -10px 0;
    transform: translateY(2px);
}


@media (max-width: 768px) {
    .header-container {
        padding: 10px 10px 10px 10px;
        font-size: 16px;
    }

    .bss-icon {
        width: 24px;
        height: 24px;
        transform: translateY(-2px);
    }

    .mode-icon {
        font-size: 30px;
    }

    .header-items img {
        width: 30px;
        transform: translateY(0px);
    }

    .mode-icon {
        font-size: 30px;
    }
}
</style>