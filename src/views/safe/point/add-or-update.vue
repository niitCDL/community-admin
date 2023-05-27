<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属小区">
				<el-input v-model="dataForm.communityId" placeholder="所属小区" required="true"></el-input>
			</el-form-item>
			<el-form-item prop="buildingId" label="所属楼宇">
				<el-input v-model="dataForm.buildingId" placeholder="所属楼宇"></el-input>
			</el-form-item>

			<el-form-item prop="units" label="所属单元">
				<el-input v-model="dataForm.units" placeholder="所属单元"></el-input>
			</el-form-item>

			<el-form-item prop="pointName" label="巡更点名称">
				<el-input v-model="dataForm.pointName" placeholder="巡更点名称"></el-input>
			</el-form-item>

			<el-form-item prop="pointNumber" label="寻更点编号">
				<el-input v-model="dataForm.pointNumber" placeholder="寻更点编号"></el-input>
			</el-form-item>

			<el-form-item prop="coordinate" label="经纬度坐标">
				<el-input v-model="dataForm.coordinate" placeholder="经纬度坐标"></el-input>
			</el-form-item>
			<!-- <el-form-item prop="orgId" label="所属机构">
				<el-tree-select
					v-model="dataForm.orgId"
					:data="orgList"
					value-key="id"
					check-strictly
					:render-after-expand="false"
					:props="{ label: 'name', children: 'children' }"
					style="width: 100%"
				/>
			</el-form-item> -->

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
import { usePointSubmitApi, usePointApi } from '@/api/safe/point'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const orgList = ref([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	communityId: '',
	buildingId: '',
	units: '',
	pointName: '',
	pointNumber: '',
	coordinate: '',
	status: ''
})

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

	// id 存在则为修改
	if (id) {
		getInspectionItem(id)
	}
}

// 获取信息
const getInspectionItem = (id: number) => {
	usePointApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	communityId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		usePointSubmitApi(dataForm).then(() => {
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
