<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属社区">
				<el-select v-model="dataForm.communityId" placeholder="请选择社区">
					<el-option v-for="option in communities" :key="option.id" :label="option.communityName" :value="option.id"></el-option>
				</el-select>
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

			<!-- <el-form-item prop="coordinate" label="经纬度坐标">
				<el-input v-model="dataForm.coordinate" placeholder="经纬度坐标"></el-input>
			</el-form-item> -->
			<el-form-item prop="coordinate" label="经纬度坐标">
				<el-input v-model="dataForm.coordinate" :suffix-icon="Location" @click="choose" />
				<mapper ref="mapcontainer" :form="form" @change-form="handleClick"></mapper>
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
import { usePointSubmitApi, usePointApi } from '@/api/safe/point'

import { useCommuntiySearchApi } from '@/api/safe/point'
import mapper from '@/components/position/mapper.vue'
import { Location } from '@element-plus/icons-vue'

const communities = ref<any[]>([])
useCommuntiySearchApi().then(res => {
	communities.value = res.data
})

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const orgList = ref([])
const dataFormRef = ref()

//定位组件先绑定ref
const mapcontainer = ref()
//选择座标被点击
const choose = () => {
	console.log('aaaa')
	//根据组件绑定的ref使用初始化方法
	mapcontainer.value.initMap(dataForm.coordinate)
}

let form = ref()
const handleClick = newValue => {
	console.log('niah' + newValue.lng)
	form.value = newValue
	const newForm = form.value
	dataForm.coordinate = newForm.lng + ',' + newForm.lat
	for (const key in newValue) {
		newValue[key] = ''
	}
}

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

// const handleClick = newValue => {
// 	console.log('niah' + newValue.lng)
// 	form.value = newValue
// 	const newForm = form.value
// 	message.value = newValue.ifShow
// 	dataForm.coordinate = newForm.lng + ',' + newForm.lat
// }
const message = ref()
const openMapper = () => {
	message.value = true
}
</script>
