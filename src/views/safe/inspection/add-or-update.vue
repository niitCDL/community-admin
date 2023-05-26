<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属小区">
				<el-select v-model="dataForm.communityId" class="m-2" placeholder="Select">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="name" label="项目名称">
				<el-input v-model="dataForm.name" placeholder="项目名称"></el-input>
			</el-form-item>
			<el-form-item label="项目图片">
				<el-upload
					class="avatar-uploader"
					:action="upurl"
					:show-file-list="false"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
				>
					<el-image v-if="dataForm.photo" :src="dataForm.photo" style="width: 80px; height: 60px" />
					<el-icon v-else class="avatar-uploader-icon" style="width: 80px; height: 60px">上传</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="设备型号">
				<el-input v-model="dataForm.type" placeholder="设备型号"></el-input>
			</el-form-item>
			<el-form-item label="品牌厂商">
				<el-input v-model="dataForm.factory" placeholder="品牌厂商"></el-input>
			</el-form-item>
			<el-form-item label="维保厂商">
				<el-input v-model="dataForm.insuranceFactory" placeholder="维保厂商"></el-input>
			</el-form-item>
			<el-form-item label="坐标">
				<el-input v-model="dataForm.coordinate" placeholder="座标"></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="dataForm.note" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item prop="status" label="状态">
				<fast-radio-group v-model="dataForm.status" dict-type="enable_disable"></fast-radio-group>
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
import { useInspectionApi, useInspectionSubmitApi } from '@/api/safe/inspectionItem'
import { getCommunityList } from '@/api/community/community'
import type { UploadProps } from 'element-plus'
import cache from '@/utils/cache'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const communityList = ref<any[]>([])
const roleList = ref<any[]>([])
const orgList = ref([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	communityId: '',
	name: '',
	type: '',
	factory: '',
	insuranceFactory: '',
	photo: '',
	coordinate: '',
	note: '',
	status: 1
})

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

	// id 存在则为修改
	if (id) {
		getInspectionItem(id)
	}
	getCommunityLists()
}

// 获取信息
const getInspectionItem = (id: number) => {
	useInspectionApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

//获取所有小区列表
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}
const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	communityId: [{ required: true, message: '必填项不能为空', trigger: 'change	' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		useInspectionSubmitApi(dataForm).then(() => {
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

const upurl = import.meta.env.VITE_API_URL + '/safe/inspectionitem/upload?accessToken=' + cache.getToken()

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
defineExpose({
	init
})
</script>
