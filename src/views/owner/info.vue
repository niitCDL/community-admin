<template>
	<div>
		<el-card>
			<div class="flex">
				<h2 class="ht">{{ data.realName }}</h2>
				<p class="p1 border border-cyan-100">
					<span v-if="data.identity == 0">业主</span>
					<span v-if="data.identity == 1">家属</span>
					<span v-if="data.identity == 2">租户</span>
				</p>
			</div>
			<div class="flex mt-5">
				<p class="text-gray-400">手机号：{{ data.phone }}</p>
				<p class="text-gray-400 ml-5">身份证号：{{ data.identityCard }}</p>
			</div>
			<div class="flex mt-5">
				<p class="text-gray-400">所属校区：{{ data.communityName }}</p>
				<p class="text-gray-400 ml-5">楼宇：{{ data.houseName }}</p>
			</div>
		</el-card>
		<el-card class="box-card">
			<el-tabs v-model="activeName" class="demo-tabs">
				<el-tab-pane label="业主信息" name="first">
					<el-descriptions title="基本信息" :column="2" border>
						<el-descriptions-item label="昵称：" label-align="right" label-class-name="my-label" class-name="my-content" width="50px"
							><span>{{ data.username }}</span></el-descriptions-item
						>
						<el-descriptions-item label="手机号：" label-align="right" width="100px">13013001300</el-descriptions-item>
						<el-descriptions-item label="姓名：" label-align="right">{{ data.realName }}</el-descriptions-item>
						<el-descriptions-item label="类型：" label-align="right">
							<span v-if="data.identity == 0">业主</span>
							<span v-if="data.identity == 1">家属</span>
							<span v-if="data.identity == 2">租户</span>
						</el-descriptions-item>
						<el-descriptions-item label="身份证号：" label-align="right">{{ data.identityCard }}</el-descriptions-item>
						<el-descriptions-item label="性别：" label-align="right">
							<span v-if="data.gender == 0">保密</span>
							<span v-if="data.gender == 1">男</span>
							<span v-if="data.gender == 2">女</span>
						</el-descriptions-item>
						<el-descriptions-item label="出生日期：" label-align="right">{{ data.birthday }} </el-descriptions-item>
						<el-descriptions-item label="户籍所在地：" label-align="right">{{ data.domicileLocation }}</el-descriptions-item>
						<el-descriptions-item label="婚姻状态：" label-align="right">
							<span v-if="data.marriage == 0">未婚</span>
							<span v-else>已婚</span>
						</el-descriptions-item>
						<el-descriptions-item label="居住类型：" label-align="right">
							<span v-if="data.rentalType == 0">长居</span>
							<span v-else>短住</span>
						</el-descriptions-item>
						<el-descriptions-item label="户口类型：" label-align="right">
							<span v-if="data.accountType == 0">城市户口</span>
							<span v-else>农村户口</span>
						</el-descriptions-item>
						<el-descriptions-item label="暂住证号：" label-align="right">{{ data.identityCard }}</el-descriptions-item>
						<el-descriptions-item label="现住地址：" label-align="right">{{ data.address }}</el-descriptions-item>
					</el-descriptions>
					<el-descriptions class="mt-5" title="紧急联系人" :column="2" border>
						<el-descriptions-item label="姓名：" label-align="right" label-class-name="my-label" class-name="my-content" width="175px"
							><span class="w-52">{{ eContacts.realName }}</span></el-descriptions-item
						>
						<el-descriptions-item label="关系：" class="pl-12" label-align="right">{{ eContacts.address }}</el-descriptions-item>
						<el-descriptions-item label="性别：" label-align="right">
							<span v-if="data.gender == 0">保密</span>
							<span v-if="data.gender == 1">男</span>
							<span v-if="data.gender == 2">女</span></el-descriptions-item
						>
						<el-descriptions-item label="手机号：" label-align="right">{{ eContacts.phone }}</el-descriptions-item>
						<el-descriptions-item label="地址：" label-align="right">{{ eContacts.address }}</el-descriptions-item>
					</el-descriptions>
				</el-tab-pane>
				<el-tab-pane label="成员信息" name="second">
					<el-descriptions class="mt-5" title="成员登记" :column="2" border> </el-descriptions>
					<el-table :data="familyData" stripe style="width: 100%">
						<el-table-column prop="realName" label="姓名" width="180" />
						<fast-table-column prop="gender" label="性别" dict-type="user_gender" width="100%"></fast-table-column>
						<el-table-column prop="phone" label="手机号" width="180" />
						<el-table-column prop="identityCard" label="身份证号" />
						<fast-table-column prop="identity" label="关系" dict-type="owner_identity" width="100%"></fast-table-column>
						<el-table-column prop="isRegister" label="是否注册" width="180" />
						<el-table-column prop="date" label="操作" width="180">
							<template #default="scope">
								<el-button v-auth="'owner:info:delete'" type="danger" link @click="deleteFamilyHandle(scope.row.id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { oInfo, ownerFamily, deFamily } from '@/api/owner/owner'
import { ElMessage } from 'element-plus'
const activeName = ref('first')
const data = ref<any>({})
const familyData = ref([])
const eContacts = ref<any>({})
onMounted(() => {
	const ownerId = localStorage.getItem('ownerId')
	oInfo(ownerId).then(res => {
		data.value = res.data
		eContacts.value = JSON.parse(data.value.econtacts)
	})
	ownerFamily({ ownerId: ownerId }).then(res => {
		familyData.value = res.data
	})
})
const deleteFamilyHandle = (id: number) => {
	deFamily(id).then((res: any) => {
		ElMessage.success('删除成功')
		ownerFamily({ ownerId: localStorage.getItem('ownerId') }).then(res => {
			familyData.value = res.data
		})
	})
}
</script>

<style scoped>
.flex {
	display: flex;
}
.text-gray-400 {
	--tw-text-opacity: 1;
	color: rgba(156, 163, 175, var(--tw-text-opacity));
}
.ml-5 {
	margin-left: 1.25rem; /* 20px */
}
.mt-5 {
	margin-top: 1.25rem; /* 20px */
}
.p1 {
	margin-left: 18px;
	margin-top: 5px;
	padding: 3px 8px;
	border: 1px solid rgba(209, 213, 219, 1);
	font-size: 1.25rem; /* 20px */
	line-height: 1.75rem; /* 28px */
	color: rgba(209, 213, 219, 1);
}
.ht {
	color: gray;
}
.box-card {
	margin-top: 15px;
}
</style>
