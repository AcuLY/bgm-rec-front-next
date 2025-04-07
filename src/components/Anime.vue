<script setup>
import { getOptimalFontSize } from '../utils/util';
import { computed } from 'vue';
import { BANGUMI_SUBJECT } from '../api/_prefix';

const props = defineProps({
    info: Object
})

const nameFontSize = computed(() => getOptimalFontSize(props.info?.name, 260, 52))
const nameCNFontSize = computed(() => getOptimalFontSize(props.info?.nameCN, 260, 32))

const openSubjectPage = () => {
    if (props.info) {
        window.open(BANGUMI_SUBJECT + props.info.id, '_blank')
    }
}
</script>

<template>
    <n-flex class="main-container" vertical size="large" @click="openSubjectPage()">
        <n-flex class="image-info-container" justify="space-between">
            <div class="image-container">
                <template v-if="props.info?.image">
                    <div class="shade"></div>
                    <div class="score-container">
                        <span class="total">{{ props.info.total }}人</span>
                        <span class="score">
                            {{ props.info.score }}
                            <img src="/star.png" style="width: 18px;">
                        </span>
                    </div>
                    <n-image class="image" :src="props.info.image" width="128" />
                </template>
                <template v-else>
                    <n-skeleton class="image" />
                </template>
            </div>

            <div class="info-container">
                <div class="name-container">
                    <template v-if="props.info?.name">
                        <span :style="{ fontSize: nameFontSize }" class="name">{{ props.info.name }}</span>
                    </template>
                    <template v-else>
                        <n-skeleton style="border-radius: 6px;" height="52px"/>
                    </template>

                    <template v-if="props.info?.nameCN">
                        <span :style="{ fontSize: nameCNFontSize }" class="name-cn">{{ props.info.nameCN }}</span>
                    </template>
                    <template v-else>
                        <n-skeleton style="border-radius: 6px;" height="32px"/>
                    </template>
                </div>

                <n-flex vertical>
                    <n-flex class="date">
                        <template v-if="props.info?.date">
                            <span class="date">{{ props.info.date }}</span>
                        </template>
                        <template v-else>
                            <n-skeleton style="border-radius: 4px;" width="100px" height="16px" />
                        </template>
                    </n-flex>

                    <template v-if="props.info?.tags">
                        <n-flex size="small">
                            <div class="tag" v-for="(tag, index) in props.info.tags" :key="index">
                                {{ tag }}
                            </div>
                        </n-flex>
                    </template>
                    <template v-else>
                        <n-skeleton style="border-radius: 4px;" />
                    </template>

                    <template v-if="props.info?.similarity">
                        <a href="" class="similarity">
                            加权相似度：{{ props.info.similarity }} / 10
                        </a>
                    </template>
                    <template v-else>
                        <n-skeleton style="border-radius: 4px;" />
                    </template>
                </n-flex>

            </div>
        </n-flex>

        <div class="summary-container">
            <template v-if="props.info?.summary">
                {{ props.info.summary }}
            </template>
            <template v-else>
                <n-skeleton style="border-radius: 4px;" text repeat="4" />
            </template>
        </div>
    </n-flex>
</template>

<style scoped>
.main-container {
    width: 432px;
    height: 312px;
    border: solid 1px #6f7f82;
    border-radius: 12px;
    align-items: center;
    user-select: none;
    cursor: pointer;
}

.main-container:hover {
    box-shadow: 0px 0px 12px #70bbd0;
}

.image-info-container {
    width: 404px;
    height: 200px;
    justify-content: center;
}

.image-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.shade {
    position: absolute;
    z-index: 2;
    bottom: 0;
    width: 128px;
    height: 182px;
    border-radius: 8px;
    opacity: 0.8;
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, var(--nord2) 80%, var(--nord2) 100%);
}

.score-container {
    position: absolute;
    z-index: 3;
    bottom: 0px;
    right: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
}

.score {
    font-weight: bold;
    color: var(--nord6);
    font-size: 24px;
}

.total {
    color: var(--nord4);
}

.image {
    width: 128px;
    height: 182px;
    border-radius: 8px;
}

.info-container {
    width: 260px;
    padding-top: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 6px;
    line-height: 1.2;
}

.name-container {
    width: 260px;
    height: 90px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.name {
    font-weight: bold;
}

.name-cn {
    color: var(--color-tertiary-text);
}

.date {
    font-size: 16px;
    color: var(--color-tertiary-text);
}

.tag {
    font-size: 16px;
    color: var(--color-tertiary-text);
}

.similarity {
    font-size: 16px;
    font-weight: bold;
    text-underline-offset: 4px;
}

.summary-container {
    width: 404px;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-clamp: 4;

    overflow: hidden;
    text-overflow: ellipsis;
}
</style>