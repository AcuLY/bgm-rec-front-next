<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps(['userName', 'isLoading'])
const emit = defineEmits(['update:userName'])

const store = useStore()
const mobileScaleRatio = computed(() => store.state.isMobile ? 0.787 : 1)

const userName = ref('')

watch(userName, () => {
    if (userName.value.length > 0) {
        emit("update:userName", userName.value)
    }
})
</script>

<template>
    <n-flex class="outer-container" justify="center" :size="20 * mobileScaleRatio">
        <span class="input-title">Bangumi UID</span>
        <n-input class="input" :loading="props.isLoading" v-model:value="userName" placeholder="请输入 UID（不是昵称）" />
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
    width: 200px;
}

.input-title {
    color: var(--color-titlebar);
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

@media (max-width: 768px) {
    .outer-container {
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
}
</style>