<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="设备" prop="deviceId">
				<el-select v-model="dataForm.deviceId" placeholder="请选择">
					<el-option v-for="item in deviceList" :key="item.id" :label="item.deviceName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="门禁名称" prop="doorName">
				<el-input v-model="dataForm.doorName" placeholder="门禁名称"></el-input>
			</el-form-item>
			<el-form-item label="所属小区" prop="communityId">
				<el-select v-model="dataForm.communityId" placeholder="请选择">
					<el-option label="万象城" :value="1"></el-option>
					<el-option label="汤臣一品" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="配置码" prop="sysCode">
				<el-input v-model="dataForm.sysCode" placeholder="配置码"></el-input>
			</el-form-item>
			<!-- <el-form-item label="允许欠费通行 0-允许 1-不允许" prop="allowOwed">
				<el-input v-model="dataForm.allowOwed" placeholder="允许欠费通行 0-允许 1-不允许"></el-input>
			</el-form-item>
			<el-form-item label="允许访客通行  0-允许 1-不允许" prop="allowVisit">
				<el-input v-model="dataForm.allowVisit" placeholder="允许访客通行  0-允许 1-不允许"></el-input>
			</el-form-item>
			<el-form-item label="需要访客手机号 0-需要 1-不需要" prop="needTel">
				<el-input v-model="dataForm.needTel" placeholder="需要访客手机号 0-需要 1-不需要"></el-input>
			</el-form-item>
			<el-form-item label="需要访客身份证 0-需要 1-不需要" prop="needIdCard">
				<el-input v-model="dataForm.needIdCard" placeholder="需要访客身份证 0-需要 1-不需要"></el-input>
			</el-form-item>
			<el-form-item label="允许人脸识别 0-允许 1-不允许" prop="allowFace">
				<el-input v-model="dataForm.allowFace" placeholder="允许人脸识别 0-允许 1-不允许"></el-input>
			</el-form-item>
			<el-form-item label="允许指纹识别  0-允许 1-不允许" prop="allowFinger">
				<el-input v-model="dataForm.allowFinger" placeholder="允许指纹识别  0-允许 1-不允许"></el-input>
			</el-form-item> -->
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
import { useDoorApi, useDoorSubmitApi } from '@/api/smart'
import { getDeviceList } from '@/api/smart'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	deviceId: '',
	doorName: '',
	communityId: '',
	sysCode: '',
	allowOwed: '',
	allowVisit: '',
	needTel: '',
	needIdCard: '',
	allowFace: '',
	allowFinger: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getDoor(id)
	}
}

const getDoor = (id: number) => {
	useDoorApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	deviceId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	doorName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	communityId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	sysCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useDoorSubmitApi(dataForm).then(() => {
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
