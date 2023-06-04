<template>
	<el-dialog v-model="visible" title="出入记录" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" label-width="100px" :model="form">
			<el-form-item label="停车场名称" prop="parkId" class="ml-[190px]">
				{{ form.parkName }}
			</el-form-item>

			<el-form-item label="车牌号" prop="licence"> {{ form.licence }} </el-form-item>

			<el-row>
				<el-col :span="12">
					<el-form-item label="进入闸机" prop="doorName">
						{{ form.doorName }}
						<!-- <fast-select v-model="form.doorName" dict-type="sms_platform" disabled style="width: 100%"></fast-select> -->
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="进入时间" prop="accessTime">
						{{ form.accessTime }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="收费金额" prop="accessTime"> {{ form.price }}元 </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="离开时间" prop="leaveTime">
						{{ form.leaveTime }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="车辆类型" prop="status">
						<el-tag v-if="form.type" type="primary">固定车辆</el-tag>
						<el-tag v-else type="success">临时车辆</el-tag>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="visible = false">关闭</el-button>
		</template>
		<el-col :span="12" class="image-container"> <el-image src="https://s1.ax1x.com/2023/06/04/pC9W9c6.jpg" class="img"> </el-image> </el-col>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRecordApi, getInfo } from '@/api/record/record'
import { getParkList, getOwnerList, getCarList } from '@/api/carport/carport'
const dataFormRef = ref()
const parkList = ref<any[]>([])
const visible = ref(false)
const form = reactive({
	id: '',
	parkName: '',
	parkId: '',
	licence: '',
	doorName: '',
	accessTime: '',
	leaveTime: '',
	type: '',
	createTime: '',
	price: ''
})

// const init = (data?: any) => {
// 	visible.value = true

// 	Object.assign(form, data)
// }

const init = (id?: number) => {
	visible.value = true
	form.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		for (const key in form) {
			form[key as keyof typeof form] = ''
		}
	}

	if (id) {
		getParkRecord(id)
	}
	getParkLists()
}

//获取所有停车场列表
const getParkLists = () => {
	getParkList().then(res => {
		parkList.value = res.data
	})
}
const getParkRecord = (id: number) => {
	getInfo(id).then(res => {
		Object.assign(form, res.data)
		console.log(res.data)
	})
}

defineExpose({
	init
})
</script>
<style scoped>
.image-container {
	position: absolute;
	top: 120px;
	margin-left: 320px;
}
.img {
	width: 320px;
}
</style>
