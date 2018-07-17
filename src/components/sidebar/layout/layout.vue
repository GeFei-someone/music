<template>
	<div>
		<el-button type="primary" @click="addlayout">添加分类布局</el-button>
		<!-- <el-button type="primary" @click="opendel">编辑分类布局</el-button> -->
		<add-layout :prlayout="layout"></add-layout>
	</div>
</template>

<script>
	import addLayout from 'components/sidebar/layout/addlayout/addlayout';
	export default {
		data() {
			return {
				layout: false
			}
		},
		methods: {
			addlayout() {
				this.layout = true
			}
		},
		components: {
			addLayout
		}
	}
</script>

<style>
	
</style>