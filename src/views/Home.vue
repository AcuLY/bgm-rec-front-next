<script setup>
import Header from '../components/Header.vue';
import { darkTheme, zhCN } from 'naive-ui';
import { useStore } from 'vuex';
import { watch } from 'vue';
import { nordTheme, nordDarkTheme } from '../assets/theme';

const store = useStore()

const currentTheme = ref(null);
const currentThemeOverride = ref(nordTheme);

watch(() => store.state.isDarkMode, (newValue) => {
    if (newValue) {
        currentTheme.value = darkTheme;
        currentThemeOverride.value = nordDarkTheme;
    } else {
        currentTheme.value = null;
        currentThemeOverride.value = nordTheme;
    }
});
</script>

<template>
    <n-config-provider :theme="currentTheme" :theme-overrides="currentThemeOverride" :locale="zhCN">
        <n-notification-provider>
            <Header />
            <router-view v-slot="{ Component }">
                <keep-alive include="SimilarAnime,Recommendation, Distribution,About">
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </n-notification-provider>
    </n-config-provider>
</template>

<style scoped></style>