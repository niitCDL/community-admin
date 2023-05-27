<template>
{{ data }}	
</template>

<script setup lang="ts">
	
	let data = localStorage.getItem("info")
	data = JSON.parse(data)
	
</script>

<style scoped>
.layout-home {
	line-height: 2;
	font-size: 15px;
}

.layout-home h2 {
	margin: 6px 0;
}
</style>
