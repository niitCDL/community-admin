<template>
	<el-config-provider :size="size">
		<Suspense>
			<router-view />
		</Suspense>
	</el-config-provider>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useTitle } from '@vueuse/core'
import store from '@/store'
import { handleThemeStyle } from '@/utils/theme'

const size = computed(() => store.appStore.componentSize)

// 设置标题
useTitle('Admin Vue')

onMounted(() => {
	nextTick(() => {
		// 初始化主题样式
		handleThemeStyle(store.appStore.theme)
	})
})
</script>
