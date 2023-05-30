<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="parkId" label="所属停车场">
				<el-select v-model="dataForm.parkId" class="m-2" placeholder="所属停车场">
					<el-option v-for="item in parkList" :key="item.id" :label="item.parkName" :value="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item prop="ownerId" label="户主名">
				<el-select v-model="dataForm.ownerId" class="m-2" placeholder="户主名">
					<el-option v-for="item in ownerList" :key="item.id" :label="item.realName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="carId" label="所属车辆">
				<el-select v-model="dataForm.carId" class="m-2" placeholder="所属车辆">
					<el-option v-for="item in carList" :key="item.id" :label="item.licence" :value="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item prop="carportName" label="车位名称">
				<el-input v-model="dataForm.carportName" placeholder="车位名称"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :label="0">闲置</el-radio>
					<el-radio :label="1">已租</el-radio>
					<el-radio :label="2">已售</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="startTime" label="生效时间">
				<el-date-picker v-model="dataForm.startTime" placeholder="生效时间"></el-date-picker>
			</el-form-item>
			<el-form-item prop="endTime" label="失效时间">
				<el-date-picker v-model="dataForm.endTime" placeholder="失效时间"></el-date-picker>
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
import { useCarportApi, useCarportSubmitApi } from '@/api/carport/carport'
import { getParkList, getOwnerList, getCarList } from '@/api/carport/carport'
// import type { UploadProps } from 'element-plus'
// import cache from '@/utils/cache'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const parkList = ref<any[]>([])
const ownerList = ref<any[]>([])
const carList = ref<any[]>([])
const roleList = ref<any[]>([])
const dataFormRef = ref()

const dataForm = reactive({
	id: undefined as number | undefined,
	parkId: '',
	carId: '',
	ownerId: '',
	carportName: '',
	status: '',
	startTime: '',
	endTime: '',
	parkName: ''
})

// // 经过筛选的楼宇列表
// const filteredBuildings = ref<any[]>([])

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
		getCarport(id)
	}
	getParkLists()
	getOwnerLists()
	getCarLists()
}

// 获取信息
const getCarport = (id: number) => {
	useCarportApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}
//获取所有停车场列表
const getParkLists = () => {
	getParkList().then(res => {
		parkList.value = res.data
	})
}
//获取所有户主列表
const getOwnerLists = () => {
	getOwnerList().then(res => {
		ownerList.value = res.data
	})
}
//获取所有车辆列表
const getCarLists = () => {
	getCarList().then(res => {
		carList.value = res.data
	})
}
// // 监听dataForm.communityId的变化并更新filteredBuildings
// watch(
// 	() => dataForm.communityId,
// 	value => {
// 		filteredBuildings.value = buildingList.value.filter(b => b.communityId === value)
// 		dataForm.buildingId = undefined
// 		// 更新 communityName
// 		updateCommunityName()
// 		updateBuildingName()
// 	},
// 	{ deep: true }
// )
// // 监听 dataForm.buildingId 的变化并更新 buildingName
// watch(
// 	() => dataForm.buildingId,
// 	value => {
// 		const selectedBuilding = buildingList.value.find(item => item.id === value)
// 		if (selectedBuilding) {
// 			dataForm.buildingName = selectedBuilding.buildingName
// 		} else {
// 			dataForm.buildingName = ''
// 		}
// 	},
// 	{ immediate: true }
// )

// // 处理选择小区时的事件
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

// // 更新 communityName
// const updateCommunityName = () => {
// 	const selectedCommunity = communityList.value.find(item => item.id === dataForm.communityId)
// 	if (selectedCommunity) {
// 		dataForm.communityName = selectedCommunity.communityName
// 	} else {
// 		dataForm.communityName = ''
// 	}
// }
// 更新 buildingName
// const updateBuildingName = () => {
// 	const selectedBuilding = buildingList.value.find(item => item.id === dataForm.buildingId)
// 	if (selectedBuilding) {
// 		dataForm.buildingName = selectedBuilding.building
// 	} else {
// 		dataForm.buildingName = ''
// 	}
// }

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useCarportSubmitApi(dataForm).then(() => {
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
