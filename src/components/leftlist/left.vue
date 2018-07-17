<template>
 	<el-aside :style="{height: cloentHeight+'px', 'width' : !iscoll ? '200px': '67px'} " class="header_list">
			<div class="header_top">
	  			<img src="../../assets/logo.png" alt="">
	  			<b>水果商场</b>
	  		</div>
	  		<div class="menu">
		  		<div class="menu_title">
		  			<i class="el-icon-menu"  @click="iscollapse"></i>
		  		</div>
		  		<div>
		  			<homemenu :iscollapse="iscoll" :titleid="titlefid" @menulistid="upmenulistid"></homemenu>
		  		</div>
	  		</div>
	</el-aside>
</template>
<script>
	import bs from 'common/bus.js';
	import homemenu from 'components/menu/menu';
	export default {
		data() {
			return {
				iscoll: false,
				cloentHeight: ""
			}
		},
		props: ['titlefid'],
		mounted() {
			this.cloentHeight = document.documentElement.clientHeight;
		},
		methods: {
			iscollapse() {
				this.iscoll = !this.iscoll
				bs.$emit('iscoll',this.iscoll);
				// console.log(this.isCollapse)
			},
			upmenulistid(listid) {
				// console.log(listid);
				if(listid != null) {
					this.$emit("listid",listid);  //取得点击栏目获取的ID,传给父级
				}
			}
		},
		components: {
			homemenu
		}
	}
</script>
<style scoped lang="sass">
		.el-aside, .el-main
			overflow: unset;
		.header_list
			overflow: hidden;
			background: #2f4050;
			transition: all .35s linear;
			.header_top
				height: 60px;
				background: #4196e1;
				overflow: hidden;
				img
					width: 60px;
					height: 100%;
					float: left;
				b
					line-height: 60px;
					color: #ffffff;
					float: left;
					font-weight: bold;
					font-size: 20px;
					overflow: hidden;
			.menu
				width: 100%;
				.menu_title
					display: inline-block;
					width: 100%;
					padding: 5px 0;
					display: flex;
					background: #394e62;
					color: #ffffff;
					overflow: hidden;
					transition: all .45s linear;
					h2
						display: inline-block;
						text-align: center;
						flex: 0 0 90%;
						overflow: hidden;
						transition: all .30s linear;
					i
						flex: auto;
						text-align: center;
					.el-icon-menu:before
						content: '';
						display: block;
						width: 20px;
						height: 20px;
						margin: 0 auto;
						background: url('../../assets/menu.png') no-repeat;
						background-size: 100%;
</style>