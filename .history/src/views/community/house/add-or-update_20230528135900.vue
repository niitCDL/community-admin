<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属小区">
				<el-select v-model="dataForm.communityId" class="m-2" placeholder="所属小区">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="buildingId" label="所属楼宇">
				<el-select v-model="dataForm.buildingId" class="m-2" placeholder="所属小区">
					<el-option v-for="item in buildingList" :key="item.id" :label="item.buildingName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="houseNumber" label="房间号">
				<el-input v-model="dataForm.houseNumber" placeholder="房间号"></el-input>
			</el-form-item>
			<el-form-item prop="units" label="所在单元">
				<el-input v-model="dataForm.units" placeholder="所在单元"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dataForm.houseStatus">
					<el-radio :label="0">未售</el-radio>
					<el-radio :label="1">已售</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="usedArea" label="房屋面积">
				<el-input v-model="dataForm.usedArea" placeholder="房屋面积"></el-input>
			</el-form-item>
			<el-form-item prop="content" label="备注">
				<el-input v-model="dataForm.content" placeholder="备注"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useHouseApi, useHouseSubmitApi } from '@/api/house/house'
import { getCommunityList } from '@/api/community/community'
import { getBuildingList } from '@/api/building/building'
// import type { UploadProps } from 'element-plus'
// import cache from '@/utils/cache'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const communityList = ref<any[]>([])
const buildingList = ref<any[]>([])
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	buildingId: '',
	houseNumber: '',
	communityId: '',
	buildingName: '',
	units: '',
	houseStatus: '',
	usedArea: '',
	content: ''
})

// 经过筛选的楼宇列表
const filteredBuildings = ref([])

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

	//id 存在则为修改
	if (id) {
		getHouse(id)
	}
	getCommunityLists()
	getBuildingLists()
}

// 获取信息
const getHouse = (id: number) => {
	useHouseApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}
//获取所有小区列表
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}
//获取所有楼宇列表
const getBuildingLists = () => {
	getBuildingList().then(res => {
		buildingList.value = res.data
	})
}

// const handleCommunityChange = () => {
// 	dataForm.buildingId = ''
// 	const filteredBuildings = buildingList.filter(b => b.communityId === this.dataForm.communityId)
// 	this.$set(this, 'buildingList', filteredBuildings)
// }

const dataRules = ref({
	username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	realName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useHouseSubmitApi(dataForm).then(() => {
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
// const upurl = import.meta.env.VITE_API_URL + '/safe/inspectionitem/upload?accessToken=' + cache.getToken()

// //图片上传
// const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
// 	console.log(response)
// 	dataForm.photo = response.data.url
// 	console.log(dataForm)
// }

// //图片上传前
// const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
// 	if (rawFile.type !== 'image/jpeg') {
// 		ElMessage.error('Avatar picture must be JPG format!')
// 		return false
// 	} else if (rawFile.size / 1024 / 1024 > 10) {
// 		ElMessage.error('Avatar picture size can not exceed 2MB!')
// 		return false
// 	}
// 	return true
// }

defineExpose({
	init
})
</script>
