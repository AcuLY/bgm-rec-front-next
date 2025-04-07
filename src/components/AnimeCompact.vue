<script setup>
import '../assets/theme'

const props = defineProps({
    name: String,
    nameCN: String,
    image: String,
})
</script>

<template>
    <div class="anime-compact-container">
        <n-image width="150" :src="props.image === '' ? '/no-image.png' : props.image" fallback-src="/no-image.png"/>
        <div class="shade"></div>
        <n-flex class="anime-names-container" vertical>
            <span class="name-cn" v-show="props.nameCN != props.name">{{ props.nameCN }}</span>
            <span class="name">{{ props.name }}</span>
        </n-flex>
    </div>
</template>

<style scoped>
.anime-compact-container {
    position: relative;
    width: 150px;
    height: 200px;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
}

.anime-compact-container:hover {
    box-shadow: 0px 0px 12px #70bbd0;
}

.shade {
    position: absolute;
    z-index: 2;
    bottom: 0;
    height: 150px;
    width: 200px;
    opacity: 0.8;
    background-image: linear-gradient(180deg, rgba(0,0,0,0.00) 0%, var(--nord2) 80%, var(--nord2) 100%);
}

.anime-names-container {
    position: absolute;
    bottom: 0px;
    font-weight: bold;
    color: white;
    z-index: 3;
    user-select: none;
}

.name-cn {
    width: 138px;
    margin: 0 6px -12px 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.name {
    width: 138px;
    margin: 2px 6px 2px 6px;
    font-size: large;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.anime-compact-container img {
    width: 150px;
    height: 211px;
    object-fit: cover;
}
</style>