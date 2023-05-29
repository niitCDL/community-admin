<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属小区">
				<el-select v-model="dataForm.communityId" class="m-2" placeholder="Select" @change="communitychange">
					<el-option v-for="item in PathListByCommunity" :key="item.communityId" :label="item.communityName" :value="item.communityId" />
				</el-select>
			</el-form-item>
			<el-form-item prop="planName" label="计划名称">
				<el-input v-model="dataForm.planName" placeholder="计划名称"></el-input>
			</el-form-item>
			<el-form-item prop="pathId" label="计划线路">
				<el-select v-model="dataForm.pathId" class="m-2" placeholder="Select">
					<el-option v-for="item in pathList" :key="item.id" :label="item.wayName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="inspectorId" label="执行人">
				<el-select v-model="dataForm.inspectorId" class="m-2" placeholder="Select">
					<el-option v-for="item in inspectorList" :key="item.adminId" :label="item.realName" :value="item.adminId" />
				</el-select>
			</el-form-item>
			<el-form-item label="拍照要求">
				<el-radio-group v-model="dataForm.photoRequirement">
					<el-radio :label="3" value="1">拍照</el-radio>
					<el-radio :label="6" value="0">不拍照</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="planCycle" label="执行频率">
				<el-select v-model="dataForm.planCycle" class="m-2" placeholder="Select" @change="communitychange">
					<el-option v-for="item in cycleList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="startTime" label="巡更开始">
				<el-time-select v-model="dataForm.startTime" start="00:00" step="02:00" end="23:00" placeholder="Select time" />
			</el-form-item>
			<el-form-item prop="endTime" label="巡更结束">
				<el-time-select v-model="dataForm.endTime" start="00:00" step="02:00" end="23:00" placeholder="Select time" />
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="dataForm.notes" placeholder="备注"></el-input>
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
import { usePlanApi, usePlanSubmitApi, useGetPathListByComm, useUserListByRoleId } from '@/api/safe/plan'
import { el } from 'element-plus/es/locale'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const PathListByCommunity = ref<any[]>([])
const pathList = ref<any[]>([])
const inspectorList = ref<any[]>([])
const cycleList = reactive([
	{
		id: 0,
		name: '每天'
	},
	{
		id: 1,
		name: '每周'
	},
	{
		id: 2,
		name: '每月'
	}
])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	communityId: '',
	planName: '',
	pathId: '',
	inspectorId: '',
	photoRequirement: 0,
	planCycle: 0,
	startTime: '',
	endTime: '',
	notes: '',
	status: 1
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		for (const key in dataForm) {
			if (key === 'communityId') {
				dataForm[key] = 1
			} else {
				dataForm[key] = ''
			}
		}
	}

	// id 存在则为修改
	if (id) {
		getPlanItem(id)
	}
	// getCommunityLists()
	getInspectorList()
	getPathListByCommId()
}

// 获取信息
const getPlanItem = (id: number) => {
	usePlanApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const getInspectorList = () => {
	useUserListByRoleId(5).then(res => {
		inspectorList.value = res.data
	})
}

//小区改变
const communitychange = value => {
	PathListByCommunity.value.forEach(element => {
		if (element.communityId === value) {
			pathList.value = element.patrolPathVO
			if (pathList.value.length > 0) {
				dataForm.pathId = pathList.value[0].id
			} else {
				dataForm.pathId = ''
			}
			return
		}
	})
}

const getPathListByCommId = () => {
	useGetPathListByComm().then(res => {
		PathListByCommunity.value = res.data
	})
}
const dataRules = ref({
	planName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	communityId: [{ required: true, message: '必填项不能为空', trigger: 'change	' }],
	pathId: [{ required: true, message: '必填项不能为空', trigger: 'change	' }],
	inspectorId: [{ required: true, message: '必填项不能为空', trigger: 'change	' }],
	planCycle: [{ required: true, message: '必填项不能为空', trigger: 'change	' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		usePlanSubmitApi(dataForm).then(() => {
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
