<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="硬件设备" prop="deviceId">
				<el-select v-model="dataForm.deviceId" placeholder="请选择">
					<el-option v-for="item in deviceList" :key="item.id" :label="item.deviceName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="仪表名称" prop="meterName">
				<el-input v-model="dataForm.meterName" placeholder="仪表名称"></el-input>
			</el-form-item>
			<el-form-item label="所属小区" prop="communityId">
				<el-select v-model="dataForm.communityId" placeholder="请选择">
					<el-option label="万象城" :value="1"></el-option>
					<el-option label="汤臣一品" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="仪表位置" prop="meterType">
				<el-radio-group v-model="dataForm.meterType">
					<el-radio :label="0">房间表</el-radio>
					<el-radio :label="1">公摊表</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="价格" prop="price">
				<el-input-number v-model="dataForm.price" :precision="2" :step="0.1" :min="0" />
			</el-form-item>
			<el-form-item label="开始数值" prop="startNum">
				<el-input-number v-model="dataForm.startNum" :precision="2" :step="0.1" :min="0" />
			</el-form-item>
			<el-form-item label="最大数值" prop="max">
				<el-input-number v-model="dataForm.max" :precision="2" :step="0.1" :min="0" />
			</el-form-item>
			<el-form-item label="在线状态" prop="onlineStatus">
				<el-radio-group v-model="dataForm.onlineStatus">
					<el-radio :label="0">在线</el-radio>
					<el-radio :label="1">离线</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="通电状态" prop="gateStatus">
				<el-radio-group v-model="dataForm.gateStatus">
					<el-radio :label="0">合闸</el-radio>
					<el-radio :label="1">关闸</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useMeterApi, useMeterSubmitApi } from '@/api/smart'
import { getDeviceList } from '@/api/smart'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	deviceId: '',
	meterName: '',
	communityId: '',
	meterType: 0,
	price: 0,
	startNum: 0,
	nowNum: 0,
	max: 0,
	totalUse: 0,
	onlineStatus: 0,
	gateStatus: 0
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getMeter(id)
	}
}

const getMeter = (id: number) => {
	useMeterApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	deviceId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	meterName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	communityId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	meterType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	price: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useMeterSubmitApi(dataForm).then(() => {
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

onMounted(() => {
	getDevice()
})
</script>
