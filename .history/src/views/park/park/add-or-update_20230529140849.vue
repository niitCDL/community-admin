<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="所属小区" prop="communityId">
				<el-select v-model="dataForm.communityId" placeholder="所属小区">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="停车场名称" prop="parkName">
				<el-input v-model="dataForm.parkName" placeholder="停车场名称"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="contactPhone">
				<el-input v-model="dataForm.contactPhone" placeholder="联系电话"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="address">
				<el-input v-model="dataForm.address" placeholder="地址"></el-input>
			</el-form-item>
			<el-form-item label="车位数量" prop="carportNumber">
				<el-input v-model="dataForm.carportNumber" placeholder="车位数量"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :label="0"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="停车场图" prop="parkImg">
				<el-input v-model="dataForm.parkImg" placeholder="停车场图"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="content">
				<el-input v-model="dataForm.content" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item label="单价（按小时收费）;10.00" prop="price">
				<el-input v-model="dataForm.price" placeholder="单价（按小时收费）;10.00"></el-input>
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
import { useParkApi, useParkSubmitApi } from '@/api/park/park'
import { getCommunityList } from '@/api/community/community'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const communityList = ref<any[]>([])

const dataForm = reactive({
	id: '',
	communityId: '',
	parkName: '',
	contactPhone: '',
	address: '',
	carportNumber: '',
	status: '',
	parkImg: '',
	content: '',
	price: '',
	deleted: '',
	creator: '',
	createTime: '',
	updater: '',
	updateTime: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getPark(id)
	}
	getCommunityLists()
}

const getPark = (id: number) => {
	useParkApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

//获取所有小区列表
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useParkSubmitApi(dataForm).then(() => {
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
