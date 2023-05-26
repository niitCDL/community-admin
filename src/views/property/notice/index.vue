<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.communityId" placeholder="社区id"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:notice:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:notice:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="自增主键" header-align="center" align="center"></el-table-column>
			<el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityId" label="社区id" header-align="center" align="center"></el-table-column>
					<!-- <el-table-column prop="type" label="通知类型(0:消杀通知 1：物业通知 2：缴费通知)" header-align="center" align="center">
			</el-table-column> -->
			<fast-table-column prop="type" label="性别" dict-type="user_gender"></fast-table-column>
			<!-- <fast-table-column prop="type" label="通知类型" dict-type="type"></fast-table-column> -->
			<el-table-column prop="adminId" label="发布人id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="publishTime" label="发布时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="review" label="审核(0:未审核，1：已审核，2:审核不通过)" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="300">
				<template #default="scope">
					<el-button v-auth="'property:notice:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
					<el-button v-auth="'property:notice:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<el-button v-auth="'property:notice:delete'" type="primary" link @click="review(scope.row.id)">审核</el-button>
					<el-button v-auth="'property:notice:delete'" type="primary" link @click="info(scope.row.id)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="Soft2242NoticeIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessageBox } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/property/notice/page',
	deleteUrl: '/property/notice',
	queryForm: {
		communityId: '',
		title: '',
		content: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const review = (id?: number) => {
	ElMessageBox.confirm('审核', '警告', {
        type: 'info',
        cancelButtonText: '不通过',
        confirmButtonText: '通过',
        beforeClose: (action, instance, done) =>  {
            if (action === 'confirm') {
			
                alert("通过")
				done()
            } else {
				alert("不通过")
                done()
            }
        }
    }).then(() => {
    }).catch(() => { })
}



const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
