<template>
	<el-card>
		<h1>{{ data.title }}</h1>
		<div class="sm">提交时间:{{ data.createTime }}</div>
		<div class="content">
			<div class="left">
				<div>投诉单号：{{ data.id }}</div>
				<div>报修类型:<span v-if="data.type == 0">公共报修</span><span v-else>个人报修</span></div>
				<div>报修小区：{{ data.communityName }}</div>
				<div>报修时间：{{ data.createTime }}</div>
				<div>报修人：{{ data.userName }}</div>

				<div>手机号：1234567890</div>

				<div>内容：{{ data.content }}</div>
			</div>

			<div class="right">
				<img :src="data.imgs" />
			</div>
		</div>
		<h3>报修处理</h3>
	</el-card>
</template>

<script setup lang="ts">
import { useReadNoticeUser } from '@/api/property/notice'
import { reactive } from 'vue'
import { useGetInfo } from '../property'
const data = useGetInfo()
console.log(data)
// let state = reactive({
// 	dataListLoading: true,
// 	dataList: [],
// })

// useReadNoticeUser(data.id).then((res)=>{
// 	console.log(res)
// 	state.dataList = res.data
// }).finally(()=>{
// 	state.dataListLoading = false
// 	console.log(state.dataListLoading)
// })
</script>

<style scoped>
h1 {
	text-align: center;
	margin-top: 20px;
}
.sm {
	background: grey;
}
.sm span {
	margin-right: 30px;
}
.content {
	min-height: 300px;
	position: relative;
}

.content .left{
	/* border: 1px solid red; */
}
.content .right{
	position: absolute;
	right: 10px;
	top: 0px;
}
.content img{
	width: 150px;
	height: 150px;
}
</style>
