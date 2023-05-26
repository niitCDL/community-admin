<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()" class="w-4/5">
			<el-form-item label="社区id" prop="communityId">
				<el-select v-model="dataForm.communityId" placeholder="请选择">
					<el-option label="万达小区" value="1"></el-option>
					<el-option label="万象城" value="2"></el-option>
					<el-option label="汤臣一品" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="通知类型" prop="type">
				<el-select v-model="dataForm.type" placeholder="请选择">
					<el-option label="消杀通知" value="0"></el-option>
					<el-option label="物业通知" value="1"></el-option>
					<el-option label="缴费通知" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="dataForm.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item label="公告内容" prop="content">
				<el-input type="textarea" v-model="dataForm.content"></el-input>
			</el-form-item>
			<el-form-item label="附件" prop="file">
				<el-input v-model="dataForm.file" placeholder="附件"></el-input>
			</el-form-item>
			<el-form-item label="提醒方式" prop="noticeWay">
				<el-radio-group v-model="dataForm.noticeWay">
					<el-radio :label="0">系统消息</el-radio>
					<el-radio :label="1">短信通知</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="接受范围(0:全部楼宇，1：指定楼宇)" prop="noticeRange">
				<el-radio-group v-model="dataForm.noticeRange">
					<el-radio :label="0">全部楼宇</el-radio>
					<el-radio :label="1">指定楼宇</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="发布时间" prop="publishTime">
				<el-date-picker type="datetime" placeholder="发布时间" v-model="dataForm.publishTime"></el-date-picker>
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
import { useNoticeApi, useNoticeSubmitApi } from '@/api/property/notice'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	communityId: '',
	adminId: '',
	type: '',
	title: '',
	content: '',
	file: '',
	readNumber: '',
	noticeWay: '',
	noticeRange: '',
	publishTime: '',
	review: '',
	reviewUserId: '',
	reviewTime: '',
	deleted: '',
	createTime: '',
	updateTime: '',
	creator: '',
	updater: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getNotice(id)
	}
}

const getNotice = (id: number) => {
	useNoticeApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		// 获取日期选择器的值
		var publishTime = dataForm.publishTime

		// 创建日期对象
		var date = new Date(publishTime)

		// 格式化日期为 "yyyy-MM-dd HH:mm:ss" 格式
		var formattedDate = date.toISOString().slice(0, 19).replace('T', ' ')

		// 将格式化后的日期字符串赋值给 dataForm.publishTime
		dataForm.publishTime = formattedDate
		
		useNoticeSubmitApi(dataForm).then(() => {
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
