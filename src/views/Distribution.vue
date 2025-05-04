<script setup>
import Chart from '../components/Chart.vue';
</script>

<template>
    <n-layout-content class="compare-container">
        <Chart />
    </n-layout-content>
</template>

<style scoped>
.compare-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: scroll;
}


</style>