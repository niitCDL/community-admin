<template>
	<div>
		<WangEditor v-model="editorValue" placeholder="请输入..."></WangEditor>
	</div>
</template>

<script lang="ts" setup name="DemoWangeditorIndex">
import WangEditor from '@/components/wang-editor/index.vue'
import { ref } from 'vue'
const editorValue = ref('<p>内容</p>')
</script>
