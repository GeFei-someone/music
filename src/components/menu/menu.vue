<template>
	<div class="menu">
		<el-menu v-loading="load" class="menu_wrap el-menu-vertical-demo" active-text-color="#ffffff" :collapse-transition="true" :unique-opened="true" :collapse="iscollapse">
			<el-menu-item index="999" class="list">
					<i class="list_title_icon">
						<img :src="home_go" alt="">
					</i>
					<span class="menuittitle">首页</span>
			</el-menu-item>
			<el-submenu :index="meindex+''" class="list" v-for="(menuitem,meindex) in menulist.coluMenu" :key="menuitem.id">
				<template  slot="title" class="list_title">
					<i class="list_title_icon">
						<img :src="menuitem.icourl" alt="">
					</i>
					<span class="menuittitle">{{ menuitem.menutitle }}</span>
				</template>
				
				<el-menu-item class="adad" @click="jumpcontent(menuitem.id,groupitem.ID,menuitem.fid,groupitem.router)" style=" padding-left: 60px" :index="meindex+'-'+sonindex"  v-for="(groupitem,sonindex) in menuitem.sonmenu" :key="groupitem.ID">
					{{ groupitem.name }}
				</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
	import Bs from 'common/bus.js';
	export default {
		data() {
			return {
				menulist: [],
				menulistall: [],
				trueopened: false,
				downindex: null,
				load: false,
				home_go: "http://www.gefei.club/icon/home.png",
				titleid: "",
				iscollapse: false
			}
		},
		mounted() {
			var _this = this;
			//存数据

			_this.$ajax({
				method: 'get',
				url:"/ai/parantselect.php"
			}).then( (res) => {
				_this.menulistall = res.data.coluse;
				_this.menulist = _this.menulistall[0];

			})
			//获取兄弟参数
			Bs.$on('headfid',(datafid) => {
				this.titleid = datafid;
			})
			Bs.$on('iscoll', (scoll) => {
				this.iscollapse = scoll
			})


			
		},
		watch: {
			titleid: function(newValue,oldValue) {
				let _this = this;
				if(newValue){
					this.load = true;
				}

				for(let i = 0; i < _this.menulistall.length; i++){
					if(newValue == _this.menulistall[i].fid){
						setTimeout(function(){
							_this.menulist = _this.menulistall[i];
							_this.load = false;
						},400)
					}
				}
				
				
			}
		},
		methods: {
			listactive(index) {
				this.downindex = index;
			},
			jumpcontent(meindex,sonindex,fid,router){
				let _this = this;
				_this.$emit('menulistid',{fid: fid,meindex: meindex, sonindex: sonindex, router: router});		//传值给父级

			}
		}
	}
</script>

<style>
	.menu {
		width: 100%;
		height: auto;
	}
	.el-menu--collapse{
		width: 100%!important;
	}
	.menu_wrap{
		width: 100%;
		overflow: hidden;
		background: #2f4050!important;
	}
	.el-menu{
		border-right: 0 none;
	}
	.el-menu-vertical-demo{
		background: #2f4050
	}
	.list{
		color: #ffffff;
		font-size: 13px;
	}
	.header_list .menu .menu_title .el-icon-menu[data-v-7b63ac08]:before{
		margin: 0 auto;
	}
	.el-submenu__title{
		background: #2f4050;
		padding: 0;
	}
	.el-menu-item{
		border-left: 3px solid transparent;
	}
	.el-menu-item:focus, .el-menu-item:hover{
		border-left: 3px solid #4196e1!important;
		background: #23303c!important;
		color: #ffffff!important;
	}
	.el-submenu__title:hover {
	    background-color: #334a5f!important;
	}
	.el-menu--popup-right-start{
		margin-left: 0;
	}
	.list_title_icon{
		width: 16px;
		height: 16px;
		float: left;
		margin-top: 20px;
	}
    img{
		width: 16px;
		height: 16px;
		float: left;
	}
	.menuittitle{
		color: #ffffff;
		vertical-align: top;
		font-size: 14px;
		margin-left: 40px;
		float: left;
	}
	b{
		float: right;
		transition: all .20s linear;
	}
	.adad{
		background: #23303c!important;;
		color: #a7b1c2!important;
		font-size: 12px!important;;
		text-align: left;
	}
	.home_go{
		width: 100%;
		height: 56px;
		border: 0 none;
		border-radius: 0%;
		background: #2f4050;
		color: #ffffff;
	}
	.el-button:focus, .el-button:hover{
		background: #334a5f;
	}
	.home_go img{
		width: 16px;
		height: 16px;
		float: left;
	}
	.home_go b{
		float: left;
		margin-left: 40px;
		color: #ffffff;
	}
</style>