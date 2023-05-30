<template>
	<el-dialog v-model="ifShow">
		<div style="display: flex">
			<div>
				<div>
					<el-select
						v-model="keywords"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键词"
						:remote-method="remoteMethod"
						:loading="loading"
						:clearable="true"
						size="mini"
						style="width: 500px"
						@change="currentSelect"
					>
						<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item" class="one-text">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.district }}</span>
						</el-option>
					</el-select>
				</div>
				<div id="container" ref="mapcontainer" class="container"></div>
			</div>
			<div class="info-box">
				纬度：{{ form.lat }}
				<br />
				经度：{{ form.lng }}
				<p>详细地址：{{ form.address }}</p>

				<el-button class="submit" @click="handleClick">提交</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
import key from '@/utils/cache/key'
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, reactive, ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus/es'
const mapcontainer = ref('')
// const props = defineProps({
// 	show: {
// 		type: Boolean,
// 		default: false
// 	},
// 	coordinate: {
// 		type: String,
// 		default: ''
// 	}
// })
const emit = defineEmits(['change-form'])
window._AMapSecurityConfig = {
	// 安全密钥
	securityJsCode: 'b58e6f7934bc68448057e8e6bee47ea3'
}

//弹窗是否显示
const ifShow = ref(false)
// 地图实例
const map = shallowRef(null)
// 标记点
const marker = shallowRef(null)
// 地址逆解析
const geoCoder = shallowRef(null)
// 搜索提示
const AutoComplete = shallowRef(null)
// 搜索关键字
const keywords = ref('')

const amap = ref()
// 位置信息
const form = reactive({
	lng: '',
	lat: '',
	address: '',
	adcode: '' //地区编码
})
// 搜索节流阀
const loading = ref(false)

// 搜索提示信息
const options = ref([])
const content = ref('')

// onMounted(() => {
// 	setTimeout(() => {
// 		initMap()
// 	}, 2000)
// })

// 标记点
const setMapMarker = AMap => {
	// 自动适应显示想显示的范围区域
	map.value.setFitView()
	marker.value = new AMap.value.Marker({
		map: map.value,
		position: [form.lng, form.lat]
	})
	// 逆解析地址
	toGeoCoder()
	map.value.setFitView()
	marker.value.setMap(map.value)
}
// 清除点
const removeMarker = () => {
	if (marker.value) {
		marker.value.setMap(null)
	}
}

// 逆解析地址
const toGeoCoder = () => {
	if (form.lng != NaN && form.lat != NaN) {
		let lnglat = [form.lng, form.lat]
		geoCoder.value.getAddress(lnglat, (status, result) => {
			if (status === 'complete' && result.regeocode) {
				form.address = result.regeocode.formattedAddress
			}
		})
	}
}
//提交
const handleClick = () => {
	ifShow.value = false
	emit('change-form', form)
}

// 搜索
const remoteMethod = query => {
	console.log(query)
	if (query !== '') {
		loading.value = true
		setTimeout(() => {
			loading.value = false
			AutoComplete.value.search(query, (status, result) => {
				options.value = result.tips
				console.log(result.tips)
			})
		}, 200)
	} else {
		options.value = []
	}
}
// 选中提示
const currentSelect = val => {
	// 清空时不执行后面代码
	if (!val) {
		return
	}
	console.log(val)
	keywords.value = val.district + val.name
	geoCoder.value.getLocation(val.district + val.name, function (status, result) {
		if (status === 'complete' && result.info === 'OK') {
			//获取经纬度
			form.lng = result.geocodes[0].location.lng
			form.lat = result.geocodes[0].location.lat
			// 清除点
			removeMarker()
			// 标记点
			setMapMarker(amap)
		} else {
			ElMessage.error({
				message: '位置不够详细',
				duration: 500
			})
		}
	})
}
//初始化
const initMap = coordinate => {
	ifShow.value = true
	for (const key in form) {
		form[key] = ''
		keywords.value = ''
	}

	AMapLoader.load({
		// 你申请的Key
		key: '04555912172a06b816aa942177fdfe80',
		version: '2.0',
		// 需要用到的插件
		plugins: ['AMap.Geocoder', 'AMap.AutoComplete']
	})
		.then(AMap => {
			let con = document.getElementById('container')
			console.log('--------:' + con)
			amap.value = AMap
			map.value = new AMap.Map(con, {
				viewMode: '3D', //是否为3D地图模式
				zoom: 5, //初始化地图级别
				center: [105.602725, 37.076636] //初始化地图中心点位置
			})
			//地址逆解析插件
			geoCoder.value = new AMap.Geocoder({
				city: '全国', //城市设为北京，默认：“全国”
				radius: 1000 //范围，默认：500
			})
			// 搜索提示插件
			AutoComplete.value = new AMap.AutoComplete({ city: '全国' })
			//点击获取经纬度;
			map.value.on('click', e => {
				// 获取经纬度
				form.lng = e.lnglat.lng
				form.lat = e.lnglat.lat
				// 清除点
				removeMarker()
				// 标记点
				setMapMarker(amap)
			})
			if (coordinate) {
				const co = coordinate.split(',')
				form.lng = co[0]
				form.lat = co[1]
				removeMarker()
				setMapMarker(amap)
			}
		})
		.catch(err => {
			// 错误
			console.log(err)
		})
}
defineExpose({
	initMap
})
</script>

<style>
.container {
	width: 400px;
	height: 300px;
	margin-top: 10px;
}
.submit {
}
.info-box {
	margin-left: 10px;
	margin-top: 50px;
}
</style>
