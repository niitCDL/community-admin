<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属社区">
				<el-select v-model="dataForm.communityId" placeholder="请选择社区" @change="change">
					<el-option v-for="option in communities" :key="option.id" :label="option.communityName" :value="option.id"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item prop="wayName" label="巡更线路名称">
				<el-input v-model="dataForm.wayName" placeholder="巡更线路名称"></el-input>
			</el-form-item>

			<div style="display: flex">
				<el-form-item prop="type">
					<el-select v-model="dataForm.type" placeholder="请选择">
						<el-option v-for="option in chooseForm" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item v-show="dataForm.type == '0'" prop="pointIds" label="请选择巡更点">
					<el-select v-model="dataForm.elementIds" placeholder="请选择巡更点" multiple>
						<el-option v-for="option in points" :key="option.id" :label="option.pointName" :value="option.id"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item v-show="dataForm.type == '1'" prop="itemIds" label="请选择巡检项目">
					<el-select v-model="dataForm.elementIds" placeholder="请选择巡检项目" multiple>
						<el-option v-for="option in items" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>
			</div>

			<el-form-item prop="locationLength" label="定位距离">
				<el-input v-model="dataForm.locationLength" placeholder="定位距离"></el-input>
			</el-form-item>

			<!-- <el-form-item prop="coordinate" label="经纬度坐标">
				<el-input v-model="dataForm.coordinate" placeholder="经纬度坐标"></el-input>
			</el-form-item> -->

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
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus/es'
import { usePathSubmitApi, usePathApi } from '@/api/safe/path'

import { useCommuntiySearchApi } from '@/api/safe/point'
import { usePointSearchApi, useItemsSearchApi, usePointByIds } from '@/api/safe/path'

//获取社区id和name
let communities = ref<any[]>([])
useCommuntiySearchApi().then(res => {
	communities.value = res.data
})

//巡更点列表
let points = ref([])

//巡检项目列表
let items = ref<any[]>([])

//获取巡检项目和巡更点数据
const change = () => {
	if (dataForm.type == '0') {
		usePointSearchApi(dataForm.communityId).then(res => {
			points.value = res.data
		})
	}

	if (dataForm.type == '1') {
		useItemsSearchApi(dataForm.communityId).then(res => {
			items.value = res.data
		})
	}
}

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const value1 = ref
const dataForm = reactive({
	id: '',
	communityId: '',
	elementIds: [],
	locationLength: '',
	type: '',
	wayName: '',
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

	change()
	console.log('---------------------------' + points.value)

	// id 存在则为修改
	if (id) {
		getInspectionItem(id)
		usePointByIds(dataForm.elementIds).then(res => {
			points.value = res.data
		})
	}
}

// 获取信息
const getInspectionItem = (id: number) => {
	usePathApi(id).then(res => {
		Object.assign(dataForm, res.data)
		console.log(dataForm)
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

		usePathSubmitApi(dataForm).then(() => {
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

// const chooseForm = ref({
// 	choose1: {
// 		id: '0',
// 		name: '巡更点'
// 	},
// 	choose2: {
// 		id: '1',
// 		name: '巡更项目'
// 	}
// })

const chooseForm = ref([
	{
		id: 0,
		name: '巡更点'
	},
	{
		id: 1,
		name: '巡更项目'
	}
])
</script>
<style scoped></style>
