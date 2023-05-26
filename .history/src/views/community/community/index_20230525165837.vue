<script setup lang="ts"></script>

<template>
	<el-card shadow="never" class="border-0">
		<!-- 新建/刷新 -->
		<div class="f-between mb-4">
			<div>
				<el-button
					class="px-8 py-4 bg-blue-500 text-light-50 rounded-full"
					@click="handleCreate"
					v-permission="['sys:notice:save']"
					>新增</el-button
				>
				<el-button
					class="px-8 py-4 bg-green-500 text-light-50 rounded-full"
					@click="importNotice"
					v-permission="['sys:notice:import']"
					>导入</el-button
				>
				<el-button
					class="px-8 py-4 bg-indigo-500 text-light-50 rounded-full"
					@click="exportNotice"
					v-permission="['sys:notice:export']"
					>导出</el-button
				>
				<input
					type="text"
					v-model="keyword"
					placeholder="请搜索"
					class="text-gray-500 border-gray-300 border-solid border-1 outline-none rounded-2xl py-1 ml-3 w-60 pl-2 text-sm"
				/>
				<el-button class="px-8 py-4 bg-sky-500 text-light-50 rounded-full ml-2" @click="getData">搜索</el-button>
			</div>
			<el-tooltip content="刷新数据" placement="top" effect="dark">
				<el-button text @click="getData">
					<IEpRefresh />
				</el-button>
			</el-tooltip>
		</div>

		<el-table :data="tableData" stripe v-loading="loading" class="w-full">
			<el-table-column label="公告标题" prop="title" />
			<el-table-column label="公告内容" prop="content" />
			<el-table-column label="发布时间" prop="createTime" width="380" />
			<el-table-column label="操作" width="200" align="center">
				<template #default="scope">
					<el-button type="primary" size="small" @click="handleEdit(scope.row)" v-permission="['sys:notice:update']"
						>修改</el-button
					>
					<el-popconfirm
						title="你确定删除公告吗？"
						confirmButtonText="确认"
						cancelButtonText="取消"
						@confirm="handleDelete(scope.row.id)"
					>
						<template #reference>
							<el-button type="danger" size="small" v-permission="['sys:notice:delete']">删除</el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>

		<div class="f-center mt-5">
			<el-pagination
				:total="total"
				:current-page="currentPage"
				:page-size="limit"
				@current-change="getData"
				layout="prev, pager, next"
			/>
		</div>
</template>

<style scoped></style>
