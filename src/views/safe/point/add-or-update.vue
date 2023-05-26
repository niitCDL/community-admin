<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属小区">
				<el-input v-model="dataForm.communityId" placeholder="所属小区"></el-input>
			</el-form-item>
			<el-form-item prop="name" label="项目名称">
				<el-input v-model="dataForm.name" placeholder="项目名称"></el-input>
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
			<el-form-item label="设备型号">
				<!-- <fast-radio-group v-model="dataForm.type" dict-type="user_gender"></fast-radio-group> -->
				<el-input v-model="dataForm.type" placeholder="设备型号"></el-input>
			</el-form-item>
			<el-form-item label="品牌厂商">
				<el-input v-model="dataForm.factory" placeholder="品牌厂商"></el-input>
			</el-form-item>
			<el-form-item label="维保厂商">
				<el-input v-model="dataForm.insuranceFactory" placeholder="维保厂商"></el-input>
			</el-form-item>
			<el-form-item label="坐标">
				<el-input v-model="dataForm.coordinate" placeholder="座标"></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="dataForm.note" placeholder="备注"></el-input>
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
import { useInspectionApi, useInspectionSubmitApi } from '@/api/safe/inspectionItem'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const orgList = ref([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	communityId: '',
	name: '',
	type: '',
	factory: '',
	insuranceFactory: '',
	photo: 0,
	coordinate: '',
	note: '',
	communityList: [] as any[],
	status: 1
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
	useInspectionApi(id).then(res => {
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
		useInspectionSubmitApi(dataForm).then(() => {
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
