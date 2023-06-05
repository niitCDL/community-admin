<template>
	<el-card class="layout-home">
		<h2>{{ constant.appTitle }}</h2>
		<p>{{ constant.appDesc }}</p>
	</el-card>
</template>

<script setup lang="ts">
import constant from '@/utils/constant'
</script>

<style scoped>
.layout-home {
	line-height: 2;
	font-size: 15px;
}

.layout-home h2 {
	margin: 6px 0;
}
</style>
