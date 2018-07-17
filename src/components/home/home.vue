<template>
	<div class="home">
		 <el-container>
		 	<leftlist @listid="uplistid" :titlefid="titlefid"></leftlist>
		 	<el-container :style="{height: sideHeight+'px'}" >
					<headur></headur>
		  			<el-header style="height: 0px"></el-header>
    				<sidebar :menulistid="menuid" :componentax="component"></sidebar>
		  	</el-container>
  		</el-container>
	</div>
</template>
<script>
	import headur from 'components/head/head';
	import sidebar from 'components/sidebar/sidebar';
	import leftlist from 'components/leftlist/left';
	export default {
		name: 'home',
		data() {
			return {
				titlefid: "",
				menuid: [],
				sideHeight: "",
				component: "a"
			}
		},
		mounted() {
			var _this = this;
			//获取当前屏幕的高度
			_this.sideHeight = document.documentElement.clientHeight;
		},
		methods: {
			upfid(fid) {
				this.titlefid = fid;
			},
			uplistid(newdata){
				this.component = newdata.router;
				this.menuid = newdata
			}
		},
		components: {
			sidebar,
			headur,
			leftlist
		}
	}
</script>
<style scoped lang="sass">
	.home
		width: 100%;
		height: auto;
		background: #ffffff;
</style>