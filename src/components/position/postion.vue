<template>
	<div id="container" class="mapbox"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
var searchService,
	geocoder,
	map,
	markersArray = []
onMounted(() => {
	init()
})
const init = () => {
	var that = this
	var center = new qq.maps.LatLng(39.916527, 116.397128)
	var map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 13
	})
	var latlngBounds = new qq.maps.LatLngBounds()
	qq.maps.event.addListener(map, 'click', function (event) {
		console.log(event)
		that.fristForm.longitude = event.latLng.getLng() // 经度
		that.fristForm.latitude = event.latLng.getLat() // 纬度

		if (markersArray) {
			for (let i in markersArray) {
				markersArray[i].setMap(null)
			}
		}
		var marker = new qq.maps.Marker({
			map: map,
			position: event.latLng
		})
		markersArray.push(marker)
	})

	geocoder = new qq.maps.Geocoder({
		complete: function (result) {
			console.log(result)
			that.fristForm.longitude = result.detail.location.lng
			that.fristForm.latitude = result.detail.location.lat
			map.setCenter(result.detail.location)
			var marker = new qq.maps.Marker({
				map: map,
				position: result.detail.location
			})
			markersArray.push(marker)
		}
	})
}
</script>

<style lang="scss" scoped></style>
