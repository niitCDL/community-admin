<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="车主" prop="communityId">
				<el-select v-model="dataForm.userId" placeholder="车主">
					<el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="联系方式" prop="phone">
				<el-input v-model="dataForm.phone" placeholder="联系方式"></el-input>
			</el-form-item>
			<el-form-item label="车牌号" prop="licence">
				<el-input v-model="dataForm.licence" placeholder="车牌号"></el-input>
			</el-form-item>
			<el-form-item label="品牌" prop="brand">
				<el-input v-model="dataForm.brand" placeholder="品牌"></el-input>
			</el-form-item>
			<el-form-item label="型号" prop="specification">
				<el-input v-model="dataForm.specification" placeholder="型号"></el-input>
			</el-form-item>
			<el-form-item label="颜色" prop="color">
				<el-input v-model="dataForm.color" placeholder="颜色"></el-input>
			</el-form-item>
			<el-form-item label="保险截止日期" prop="deadline">
				<el-input v-model="dataForm.deadline" placeholder="保险截止日期"></el-input>
			</el-form-item>
			<el-form-item label="年审日期" prop="annualTime">
				<el-input v-model="dataForm.annualTime" placeholder="年审日期"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useCarApi, useCarSubmitApi, get } from '@/api/car/car'
import { getCommunityList } from '@/api/community/community'
import type { UploadProps } from 'element-plus'
import cache from '@/utils/cache'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const communityList = ref<any[]>([])

const dataForm = reactive({
	id: '',
	userId: '',
	phone: '',
	licence: '',
	brand: '',
	specification: '',
	color: '',
	deadline: '',
	annualTime: ''
})

const upurl = import.meta.env.VITE_API_URL + '/safe/inspectionitem/upload?accessToken=' + cache.getToken()

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		for (const key in dataForm) {
			dataForm[key] = ''
		}
	}

	if (id) {
		getPark(id)
	}
	getUserLists()
}

const getPark = (id: number) => {
	useParkApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

//获取所有小区列表
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}

const dataRules = ref({})

//图片上传
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	console.log(response)
	dataForm.photo = response.data.url
	console.log(dataForm)
}

//图片上传前
const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
	if (rawFile.type !== 'image/jpeg') {
		ElMessage.error('Avatar picture must be JPG format!')
		return false
	} else if (rawFile.size / 1024 / 1024 > 10) {
		ElMessage.error('Avatar picture size can not exceed 2MB!')
		return false
	}
	return true
}

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useParkSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
