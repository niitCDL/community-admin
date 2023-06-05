<template>
	<el-card>
		<el-form ref="dataFormRef" :model="dataForm" label-width="200px">
			<el-form-item label="用户名">
				<span>: {{ store.userStore.user.username }}</span>
			</el-form-item>
			<el-form-item style="padding-left: 12px" prop="avatar" label="当前头像">
				<el-avatar shape="circle" :size="100" :src="store.userStore.user.avatar"></el-avatar>
			</el-form-item>
			<el-form-item prop="newAvatar" label="新头像">
				<el-upload
					ref="upload"
					action="http://localhost:8080/sys/user/avatar"
					:headers="headers"
					:auto-upload="false"
					:limit="1"
					:on-exceed="handleExceed"
					:show-file-list="true"
					:on-success="handleSuccess"
				>
					<template #trigger>
						<el-button type="primary">选择文件</el-button>
					</template>
					<el-button style="margin-left: 10px; margin-top: -2px" type="success" @click="submitUpload">上传</el-button>
				</el-upload>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script setup lang="ts" name="ProfilePassword">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import store from '@/store'
import { genFileId } from 'element-plus'
import { ElMessage } from 'element-plus'
import { closeTab } from '@/utils/tabs'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const router = useRouter()
const route = useRoute()
const upload = ref<UploadInstance>()
const dataFormRef: any = ref(null)
const headers = {
	Authorization: store.userStore.token
}
const dataForm = reactive({
	id: store.userStore.user.id,
	avatar: '',
	file: {}
})

const handleExceed: UploadProps['onExceed'] = files => {
	upload.value!.clearFiles()
	const file = files[0] as UploadRawFile
	file.uid = genFileId()
	upload.value!.handleStart(file)
	console.log(file)
}

const handleSuccess = () => {
	ElMessage.success('修改成功,重新登录生效')
	// 关闭当前tab
	closeTab(router, route)
}

const submitUpload = () => {
	upload.value!.submit()
}
</script>
