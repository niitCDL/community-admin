<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="车主" prop="userId">
				<el-select v-model="dataForm.userId" placeholder="车主">
					<el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="联系方式" prop="phone">
				<el-input v-model="dataForm.phone" placeholder="联系方式"></el-input>
			</el-form-item>
			<el-form-item label="车牌号" prop="licence">
				<el-input v-model="dataForm.licence" placeholder="车牌号"></el-input>
			</el-form-item>
			<el-form-item label="品牌" prop="brand">
				<el-input v-model="dataForm.brand" placeholder="品牌"></el-input>
			</el-form-item>
			<el-form-item label="型号" prop="specification">
				<el-input v-model="dataForm.specification" placeholder="型号"></el-input>
			</el-form-item>
			<el-form-item label="颜色" prop="color">
				<el-input v-model="dataForm.color" placeholder="颜色"></el-input>
			</el-form-item>
			<el-form-item label="保险截止日期" prop="deadline">
				<el-date-picker v-model="dataForm.deadline" placeholder="保险截止日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="年审日期" prop="annualTime">
				<el-date-picker v-model="dataForm.annualTime" placeholder="年审日期"></el-date-picker>
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
import { useCarApi, useCarSubmitApi, getUserList, getCarVO } from '@/api/car/car'
import type { UploadProps } from 'element-plus'
import cache from '@/utils/cache'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const userList = ref<any[]>([])

const dataForm = reactive({
	id: '',
	userId: '',
	phone: '',
	licence: '',
	brand: '',
	specification: '',
	color: '',
	deadline: '',
	annualTime: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		for (const key in dataForm) {
			dataForm[key as keyof typeof dataForm] = ''
		}
	}

	if (id) {
		getCar(id)
	}
	getUserLists()
}
const getCar = (id: number) => {
	getCarVO(id).then(res => {
		Object.assign(dataForm, res.data)
		console.log(res.data)
	})
}

//获取所有车主列表
const getUserLists = () => {
	getUserList().then(res => {
		userList.value = res.data
		console.log(res.data)
	})
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useCarSubmitApi(dataForm).then(() => {
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
