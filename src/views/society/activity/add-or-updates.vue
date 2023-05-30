<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="70%" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="activityName" label="活动名称">
				<el-input v-model="dataForm.activityName" placeholder="活动名称 "></el-input>
			</el-form-item>
			<el-form-item prop="title" label="活动标题">
				<el-input v-model="dataForm.title" placeholder="活动标题 "></el-input>
			</el-form-item>
			<el-form-item prop="communityId" label="所属社区">
				<el-tree-select v-model="dataForm.communityId" :data="communityList" style="width: 100%" />
			</el-form-item>
			<el-form-item prop="typeId" label="活动类别">
				<el-tree-select v-model="dataForm.typeId" :data="activityTypeList" style="width: 100%" />
			</el-form-item>
			<el-form-item prop="content" label="活动内容">
				<!-- <el-input v-model="dataForm.content" style="width: 100%" /> -->
				<div>
					<WangEditor v-model="dataForm.content" placeholder="请输入..."></WangEditor>
				</div>
			</el-form-item>
			<el-form-item prop="tel" label="联系电话">
				<el-input v-model="dataForm.tel" style="width: 100%" />
			</el-form-item>
			<el-form-item prop="location" label="活动地点">
				<el-input v-model="dataForm.location" style="width: 100%" />
			</el-form-item>
			<el-form-item prop="createTime" label="开始时间">
				<el-date-picker
					v-model="dataForm.createTime"
					type="datetime"
					placeholder="开始时间"
					format="YYYY/MM/DD hh:mm:ss"
					value-format="YYYY-MM-DD hh:mm:ss"
				/>
			</el-form-item>
			<el-form-item prop="endTime" label="截至时间">
				<el-date-picker
					v-model="dataForm.endTime"
					type="datetime"
					placeholder="结束时间"
					format="YYYY/MM/DD hh:mm:ss"
					value-format="YYYY-MM-DD hh:mm:ss"
				/>
			</el-form-item>
			<!-- <el-form-item prop="price" label="物业公司">
				<el-input v-model="dataForm.price" placeholder="物业公司"></el-input>
			</el-form-item> -->
			<el-form-item prop="status" label="状态">
				<!-- <fast-radio-group v-model="dataForm.status" dict-type="user_status"></fast-radio-group> -->
				<el-radio-group v-model="dataForm.status">
					<el-radio :label="0">生效</el-radio>
					<el-radio :label="1">失效</el-radio>
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
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useCommunityListApi } from '@/api/society/order'
import { useActivitySubmitApi, useActivityTypeListApi, useActivityApi } from '@/api/society/activity'
import WangEditor from '@/components/wang-editor/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
let activityTypeList = reactive([{}])
let communityList = reactive([{}])

// const orgList = ref([
// 	{
// 		value: 0,
// 		label: '购买车位订单'
// 	},
// 	{
// 		value: 1,
// 		label: '租赁车位订单'
// 	},
// 	{
// 		value: 2,
// 		label: '停车订单'
// 	},
// 	{
// 		value: 3,
// 		label: '水费'
// 	},
// 	{
// 		value: 4,
// 		label: '电费'
// 	},
// 	{
// 		value: 5,
// 		label: '物业费'
// 	}
// ])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	userId: 1,
	communityId: 1,
	status: 1,
	deleted: '0',
	createTime: '2023-05-25 19:25:55',
	creator: 10000,
	updater: 10000,
	updateTime: '2023-05-25 19:25:55',
	typeId: 0,
	title: '',
	content: '',
	location: '',
	tel: '',
	activityName: '',
	endTime: '2023-05-25 19:25:55'
})
// 富文本编辑数据
const editorValue = ref('<p>内容</p>')

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// id 存在则为修改
	if (id) {
		getType(id)
	}
	getList()
}

// 获取小区列表
const getCommunityList = () => {
	return useCommunityListApi().then(res => {
		const getList = ref([{ id: 1, communityName: '' }])
		getList.value = res.data
		console.log(getList.value)
		// 遍历housrList
		getList.value.map(item => {
			console.log(item.communityName)
			// 将getList的元素插入 houseList中
			communityList.push({ value: item.id, label: item.communityName })
			console.log(communityList)
		})
	})
}
// 获取活动类型列表
const getList = () => {
	return useActivityTypeListApi().then(res => {
		const getList = ref([{ id: 1, name: '' }])
		getList.value = res.data
		console.log(getList.value)
		// 遍历housrList
		getList.value.map(item => {
			console.log(item.name)
			// 将getList的元素插入 houseList中
			activityTypeList.push({ value: item.id, label: item.name })
			console.log(activityTypeList)
		})
	})
}

// 获取信息
const getType = (id: number) => {
	useActivityApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	realName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useActivitySubmitApi(dataForm).then(() => {
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
