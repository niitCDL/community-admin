
<template>
	<el-card>
		<h1>{{ data.title }}</h1>
		<div class="sm">
			发布人员:<span>{{ data.userName }}</span> 
			发布时间:<span>{{ data.publishTime }}</span>
			 接收人员:<span v-if="data.noticeRange == 0">全部楼宇</span>
			 <span v-else>指定楼宇</span>
			浏览次数:<span>{{ data.readNumber }}</span>
		</div>
		<div>{{ data.content }}</div>
		<div class="content">
			<div>
				<div>万达物业</div>
				<div>{{ data.publishTime }}</div>
				<div>010-255358887</div>
			</div>
		</div>
		<h4>具体记录</h4>
		<el-table v-if="state.dataListLoading != null" v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="id" label="姓名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="浏览时间" header-align="center" align="center"></el-table-column>
		</el-table>
	</el-card>
</template>

<script setup lang="ts">
import { useReadNoticeUser } from "@/api/property/notice";
import { reactive } from "vue";
import { useGetInfo } from "../property";
const data = useGetInfo()
// console.log(data)
let state = reactive({
	dataListLoading: true,
	dataList: [],
})

useReadNoticeUser(data.id).then((res)=>{
	console.log(res)
	state.dataList = res.data
}).finally(()=>{
	state.dataListLoading = false
	console.log(state.dataListLoading)
})
</script>

<style scoped>
h1 {
	text-align: center;
	margin-top: 20px;
}
.sm {
	background: grey;
	
}
.sm span{
	margin-right: 30px;
}
.content {
	display: flex;
	justify-content: right;
	margin-right: 20px;
}
</style>
