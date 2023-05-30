<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属小区">
				<el-select v-model="dataForm.communityId" class="m-2" placeholder="所属小区" @change="updateCommunityName">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<input v-model="dataForm.communityName" type="hidden" />
			<el-form-item prop="buildingId" label="所属楼宇">
				<el-select v-model="dataForm.buildingId" class="m-2" placeholder="所属楼宇" @change="updateBuildingName">
					<el-option v-for="item in filteredBuildings" :key="item.id" :label="item.buildingName" :value="item.id" />
				</el-select>
			</el-form-item>
			<input v-model="dataForm.buildingName" type="hidden" />
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
				<el-input v-model="dataForm.houseArea" placeholder="房屋面积"></el-input>
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
	id: undefined as number | undefined,
	buildingId: undefined as number | undefined,
	houseNumber: '',
	communityName: '',
	communityId: undefined as number | undefined,
	buildingName: '',
	units: '',
	houseStatus: '',
	houseArea: '',
	content: ''
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
// 监听dataForm.communityId的变化并更新filteredBuildings
watch(
	() => dataForm.communityId,
	value => {
		filteredBuildings.value = buildingList.value.filter(b => b.communityId === value)
		// dataForm.buildingId = undefined
		// 更新 communityName
		updateCommunityName()
		updateBuildingName()
	},
	{ deep: true }
)
// 监听 dataForm.buildingId 的变化并更新 buildingName
watch(
	() => dataForm.buildingId,
	value => {
		const selectedBuilding = buildingList.value.find(item => item.id === value)
		if (selectedBuilding) {
			dataForm.buildingName = selectedBuilding.buildingName
		} else {
			dataForm.buildingName = ''
		}
	},
	{ immediate: true }
)

// 处理选择小区时的事件
const handleCommunityChange = () => {
	filteredBuildings.value = buildingList.value.filter(b => b.communityId === dataForm.communityId)
	dataForm.buildingId = undefined
}

const dataRules = ref({
	username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	realName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 更新 communityName
const updateCommunityName = () => {
	const selectedCommunity = communityList.value.find(item => item.id === dataForm.communityId)
	if (selectedCommunity) {
		dataForm.communityName = selectedCommunity.communityName
	} else {
		dataForm.communityName = ''
	}
}
// 更新 buildingName
const updateBuildingName = () => {
	const selectedBuilding = buildingList.value.find(item => item.id === dataForm.buildingId)
	if (selectedBuilding) {
		dataForm.buildingName = selectedBuilding.buildingName
	} else {
		dataForm.buildingName = ''
	}
}

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
// const updateCommunityName = () => {
//       const selectedCommunity = this.communityList.find(item => item.id === this.dataForm.communityId)
//       if (selectedCommunity) {
//         this.dataForm.communityName = selectedCommunity.communityName
//       }
// 	}
defineExpose({
	init
})
</script>
