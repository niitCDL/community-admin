<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="硬件设备" prop="deviceId">
				<el-select v-model="dataForm.deviceId" placeholder="请选择">
					<el-option v-for="item in deviceList" :key="item.id" :label="item.deviceName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="监控名称" prop="monitorName">
				<el-input v-model="dataForm.monitorName" placeholder="监控名称"></el-input>
			</el-form-item>
			<el-form-item label="所属小区" prop="communityId">
				<el-select v-model="dataForm.communityId" placeholder="请选择">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :label="0">正常</el-radio>
					<el-radio :label="1">故障</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否启用" prop="enabled">
				<el-radio-group v-model="dataForm.enabled">
					<el-radio :label="0">启用</el-radio>
					<el-radio :label="1">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="监控分组" prop="monitorType">
				<el-select v-model="dataForm.monitorType" placeholder="请选择">
					<el-option v-for="item in monitorTypeList" :key="item.id" :label="item.type" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="监控直播url" prop="url">
				<el-input v-model="dataForm.url" placeholder="监控直播url"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="orderd">
				<el-input-number v-model="dataForm.orderd" controls-position="right" :min="0" label="排序"></el-input-number>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useMonitorApi, useMonitorSubmitApi } from '@/api/smart'
import { getDeviceList } from '@/api/smart'
import { getCommunityList } from '@/api/community/community'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	deviceId: '',
	communityId: '',
	monitorName: '',
	status: 0,
	enabled: 0,
	monitorType: '',
	url: '',
	orderd: 0
})

defineProps<{
	monitorTypeList: any[]
}>()

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getMonitor(id)
	}
}

const getMonitor = (id: number) => {
	useMonitorApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	deviceId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	monitorName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	monitorType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useMonitorSubmitApi(dataForm).then(() => {
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

// 获取设备列表
const deviceList = ref<any[]>([])

const getDevice = () => {
	getDeviceList().then((res: any) => {
		deviceList.value = res.data
		console.log(deviceList)
	})
}

//获取所有小区列表
const communityList = ref<any[]>([])
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}

onMounted(() => {
	getDevice()
	getCommunityLists()
})
</script>
