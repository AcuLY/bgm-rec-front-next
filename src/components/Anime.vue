<script setup>
import { getOptimalFontSize } from '../utils/util';
import { computed } from 'vue';
import { BANGUMI_SUBJECT } from '../api/_prefix';

const props = defineProps({
    info: Object,
    similarity: Boolean
})

const windowWidth = ref(window.innerWidth)
onMounted(() => { window.addEventListener('resize', () => { windowWidth.value = window.innerWidth }) })
const isMobile = computed(() => windowWidth.value <= 768)
const mobileScaleRatio = computed(() => isMobile.value ? 0.787 : 1)

const nameFontSize = computed(() => getOptimalFontSize(props.info?.name, 260 * mobileScaleRatio.value, 52 * mobileScaleRatio.value, "bold"))
const nameCNFontSize = computed(() => getOptimalFontSize(props.info?.nameCN, 260 * mobileScaleRatio.value, 32 * mobileScaleRatio.value, "medium"))

const openSubjectPage = () => {
    if (props.info) {
        window.open(BANGUMI_SUBJECT(props.info.id), '_blank')
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
                            {{ Number(props.info.score).toFixed(1) }}
                            <img src="/star.png">
                        </span>
                    </div>
                    <n-image class="image" :src="props.info.image" :width="128 * mobileScaleRatio" />
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
                        <n-skeleton style="border-radius: 6px;" :height="52 * mobileScaleRatio" />
                    </template>

                    <template v-if="'nameCN' in props.info">
                        <span :style="{ fontSize: nameCNFontSize }" class="name-cn">{{ props.info.nameCN }}</span>
                    </template>
                    <template v-else>
                        <n-skeleton style="border-radius: 6px;" :height="32 * mobileScaleRatio" />
                    </template>
                </div>

                <n-flex vertical>
                    <n-flex v-show="props.info?.wish" align="center" size="small">
                        <svg t="1746279587828" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="2791" width="24" height="24">
                            <path
                                d="M512.042667 193.237333a255.914667 255.914667 0 0 1 351.658666 9.728 256 256 0 0 1 10.069334 351.402667l-361.813334 362.325333-361.728-362.325333a256 256 0 0 1 361.813334-361.130667z"
                                fill="#ec5676" p-id="2792"></path>
                        </svg>
                        <span style="font-size: medium;">已标记为 “想看”</span>
                    </n-flex>

                    <n-flex class="date">
                        <template v-if="'date' in props.info">
                            <span class="date">{{ props.info.date }}</span>
                        </template>
                        <template v-else>
                            <n-skeleton style="border-radius: 4px;" :width="100 * mobileScaleRatio"
                                :height="16 * mobileScaleRatio" />
                        </template>
                    </n-flex>

                    <template v-if="'tags' in props.info">
                        <n-flex size="small">
                            <div class="tag" v-for="(tag, index) in props.info.tags" :key="index">
                                {{ tag }}
                            </div>
                        </n-flex>
                    </template>
                    <template v-else>
                        <n-skeleton style="border-radius: 4px;" />
                    </template>

                    <template v-if="props.similarity && props.info?.similarity">
                        <a href="" class="similarity">
                            加权相似度：{{ props.info.similarity }} / 10
                        </a>
                    </template>
                    <template v-else-if="props.similarity">
                        <n-skeleton style="border-radius: 4px;" />
                    </template>
                </n-flex>

            </div>
        </n-flex>

        <div class="summary-container">
            <template v-if="'summary' in props.info">
                {{ props.info.summary }}
            </template>
            <template v-else>
                <n-skeleton style="border-radius: 4px;" text :repeat="4" />
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

.score img {
    width: 18px;
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

@media (max-width: 768px) {
    .main-container {
        width: 340px;
        height: 246px;
        border-radius: 8px;
    }

    .main-container:hover {
        box-shadow: 0px 0px 6px #70bbd0;
    }

    .image-info-container {
        width: 318px;
        height: 156px;
    }

    .shade {
        width: 101px;
        height: 143px;
        border-radius: 4px;
    }

    .score {
        font-size: 19px;
    }

    .score img {
        width: 14px;
    }

    .total {
        font-size: 14px;
    }

    .image {
        width: 101px;
        height: 143px;
        border-radius: 4px;
    }

    .info-container {
        width: 205px;
        padding-top: 14px;
        gap: 5px;
    }

    .name-container {
        width: 205px;
        height: 71px;
        gap: 5px;
    }

    .date {
        font-size: 13px;
    }

    .tag {
        font-size: 13px;
    }

    .similarity {
        font-size: 13px;
    }

    .summary-container {
        width: 318px;
        font-size: 11px;
    }
}
</style>