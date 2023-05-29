<template>
	<el-card>
		<h1>{{ data.title }}</h1>
		<div class="sm">提交时间:{{ data.createTime }}</div>
		<div class="content">
			<div class="left">
				<div>投诉单号：{{ data.id }}</div>
				<div>
					投诉类型:
					<template v-for="n in complaint_type" :key="n.dictValue">
						<span v-if="data.type == n.dictValue">
							{{ n.dictLabel }}
						</span>
					</template>
				</div>
				<div>投诉小区：{{ data.communityName }}</div>
				<div>投诉时间：{{ data.createTime }}</div>
				<div>投诉人：{{ data.userName }}</div>

				<div>手机号：1234567890</div>

				<div>内容：{{ data.content }}</div>
			</div>

			<div class="right">
				<img :src="data.imgs" />
			</div>
		</div>
		<h3>投诉处理</h3>
	</el-card>
</template>

<script setup lang="ts">
import { useReadNoticeUser } from '@/api/property/notice'
import { router } from '@/router'
import { reactive } from 'vue'
import { useGetDictType, useGetInfo, useSetInfo } from '../property'
const data = useGetInfo()
let complaint_type = await useGetDictType(18)


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
