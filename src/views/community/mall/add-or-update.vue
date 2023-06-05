<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属小区">
				<el-select v-model="dataForm.communityId" class="m-2" placeholder="所属小区">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="userId" label="业主">
				<el-select v-model="dataForm.userId" class="m-2" placeholder="业主">
					<el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="mallNumber" label="商铺编号">
				<el-input v-model="dataForm.mallNumber" placeholder="商铺编号"></el-input>
			</el-form-item>
			<!-- <el-form-item prop="mallNumber" label="商铺编号">
				<el-input v-model="dataForm.mallNumber" placeholder="商铺编号"></el-input>
			</el-form-item> -->
			<el-form-item prop="address" label="商铺地址">
				<el-input v-model="dataForm.address" placeholder="商铺地址"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="mallStatus">
				<el-radio-group v-model="dataForm.mallStatus">
					<el-radio :label="0">未售</el-radio>
					<el-radio :label="1">已售</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="mallArea" label="商铺面积">
				<el-input v-model="dataForm.mallArea" placeholder="商铺面积"></el-input>
			</el-form-item>
			<el-form-item prop="mallType" label="商铺类型">
				<el-input v-model="dataForm.mallType" placeholder="商铺类型"></el-input>
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
import { useMallApi, useMallSubmitApi, getUserList } from '@/api/mall/mall'
import { getCommunityList } from '@/api/community/community'
// import type { UploadProps } from 'element-plus'
// import cache from '@/utils/cache'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const communityList = ref<any[]>([])
const userList = ref<any[]>([])
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	userId: '',
	realName: '',
	mallNumber: '',
	communityId: '',
	address: '',
	mallType: '',
	mallStatus: '',
	mallArea: ''
})

// 经过筛选的楼宇列表
const filteredBuildings = ref<any[]>([])

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
		getMall(id)
	}
	getCommunityLists()
	getUserLists()
}

// 获取信息
const getMall = (id: number) => {
	useMallApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}
//获取所有小区列表
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}
//获取所有用户列表
const getUserLists = () => {
	getUserList().then(res => {
		userList.value = res.data
	})
}
// 监听dataForm.communityId的变化并更新filteredBuildings
// watch(
// 	() => dataForm.communityId,
// 	value => {
// 		filteredBuildings.value = buildingList.value.filter(b => b.communityId === value)
// 		dataForm.buildingId = undefined
// 	},
// 	{ deep: true }
// )

// 处理选择小区时的事件
// const handleCommunityChange = () => {
// 	filteredBuildings.value = buildingList.value.filter(b => b.communityId === dataForm.communityId)
// 	dataForm.buildingId = undefined
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

		useMallSubmitApi(dataForm).then(() => {
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
