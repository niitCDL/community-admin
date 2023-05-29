<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="所属小区" prop="communityId">
				<el-select v-model="dataForm.communityId" placeholder="所属小区">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="停车场名称" prop="parkName">
				<el-input v-model="dataForm.parkName" placeholder="停车场名称"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="contactPhone">
				<el-input v-model="dataForm.contactPhone" placeholder="联系电话"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="address">
				<el-input v-model="dataForm.address" placeholder="地址"></el-input>
			</el-form-item>
			<el-form-item label="车位数量" prop="carportNumber">
				<el-input v-model="dataForm.carportNumber" placeholder="车位数量"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :label="0">开启</el-radio>
					<el-radio :label="1">关闭</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="停车场图片">
				<el-upload
					class="avatar-uploader"
					:action="upurl"
					:show-file-list="true"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
				>
					<el-image v-if="dataForm.parkImg" :src="dataForm.parkImg" style="width: 80px; height: 60px" />
					<el-icon v-else class="avatar-uploader-icon" style="width: 80px; height: 60px">上传</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="备注" prop="content">
				<el-input v-model="dataForm.content" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item label="每小时收费" prop="price">
				<el-input v-model="dataForm.price" placeholder="每小时收费"></el-input>
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
import { useCarApi, useCarSubmitApi } from '@/api/car/car'
import { getCommunityList } from '@/api/community/community'
import type { UploadProps } from 'element-plus'
import cache from '@/utils/cache'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const communityList = ref<any[]>([])

const dataForm = reactive({
	id: '',
	communityId: '',
	parkName: '',
	contactPhone: '',
	address: '',
	carportNumber: '',
	status: '',
	parkImg: '',
	content: '',
	price: ''
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
	getCommunityLists()
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
