<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.creatorName" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="downloadExcel()">导出</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column prop="id" label="序号" header-align="center" align="center" width="60"></el-table-column>
			<el-table-column prop="creatorName" label="用户名" header-align="center" align="center" width="90"></el-table-column>
			<el-table-column prop="loginIp" label="登录IP" header-align="center" align="center" width="90"></el-table-column>
			<el-table-column prop="address" label="登录地址" header-align="center" align="center" width="90"></el-table-column>
			<el-table-column prop="terminalType" label="终端类型" header-align="center" align="center" width="130"></el-table-column>
			<el-table-column prop="browserType" label="浏览器类型" show-overflow-tooltip header-align="center" width="220"></el-table-column>
			<el-table-column prop="os" label="操作系统" header-align="center" align="center" width="130"></el-table-column>
			<el-table-column prop="deviceName" label="设备名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="deviceMac" label="设备MAC地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="loginTime" label="登录时间" header-align="center" align="center" width="165"></el-table-column>
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
	</el-card>
</template>

<script setup lang="ts" name="SysLogLogin">
import { useCrud } from '@/hooks'
import { reactive } from 'vue'
import { useLogLoginExportApi } from '@/api/sys/log'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/log/login/page',
	exportUrl: '/sys/log/login/export',
	queryForm: {
		creatorName: ''
	}
})

const downloadExcel = () => {
	useLogLoginExportApi()
	return
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
