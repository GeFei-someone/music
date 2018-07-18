<template>
	<el-header >
  		<div class="header_right">
  				<ul class="headlist_wrap">
  					<li v-for="(headlist,index) in headlist" @click="activehead(headlist.fid,index)" :key="headlist.fid" :class="[ activelist == index ? 'active' : '' ]">
  						{{ headlist.name }}
  					</li>
  					<div style="float: right;margin-right: 30px" class="portrait" >
  						<div class="radiusPortrait">
  							<img :src="userlist.imgurl" alt="">
  						</div>
  						<span>欢迎你：{{ userlist.user }}</span>
  						<b v-if="userlist.identity == 1">管理员</b>
						<b v-else>普通用户</b>
  						<!-- {{ $route.query.identity }} -->
  						<i class="el-icon-caret-bottom"></i>
  						<span class="cance" @click="cance">注销</span>
  					</div>
  				</ul>
  		</div>
  	</el-header>
</template>
<script>
	import Bs from 'common/bus.js';
	export default {
		name: "headur",
		data() {
			return {
				headlist: [],
				activelist: 0,
				iscoll: false,
				userlist: []
			}
		},
		computed: {
			identity() {
				let identityval = this.identityval;
				if(identityval == 1 && this.user == "admin"){
					identityval = 1;
				}else{
					identityval = 0;
				}
				return identityval;
			}
		},
		mounted(){
			this.$ajax({
				method: 'get',
				url: '/ai/parantselect.php/'
			}).then((res) => {
				// console.log(res)
				for(let i = 0; i < res.data.coluse.length; i++ ){
					this.headlist.push(res.data.coluse[i]);
				}
			})
			this.selectidnum();
		},
		methods: {
			activehead(fid,index){
				let listIndex = index;
				this.activelist = listIndex;
				// console.log(fid);
				// this.$emit("headfid",fid);   //传值
				Bs.$emit('headfid',fid)
			},
			cance() {
				this.$router.push("/");
				//删除cookie 重新登陆
				let delcookie = this.getCookie('upid');
				if(delcookie != ""){
					this.delectCookie("upid");
				}
			},
			selectidnum() {
				var _this = this;
				if(_this.$route.query.upid){
					_this.$ajax.get('/ai/selectupid.php',{
						params: {
							ID:  _this.$route.query.upid
						}
					}	
					).then((res) => {
						_this.userlist = res.data;
					})
				}else{
					_this.$ajax.get('/ai/selectupid.php',{
						params: {
							ID:  _this.getCookie('upid')
						}
					}	
					).then((res) => {
						_this.userlist = res.data;
					})
				}

			},
			getCookie(cname) {		//获取cookie
			  var name = cname + "=";
			  var ca = document.cookie.split(';');
			  for(var i=0; i<ca.length; i++) 
			  {
			    var c = ca[i].trim();
			    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
			  }
			  return "";
			},
			delectCookie(cname,cvalue,expires) {

				var date = new Date();
				var expires = "expires="+date.toGMTString();
				document.cookie = cname+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
			}
		}
	}
</script>

<style scoped lang="sass">
	.el-header
			width: 100%;
			height: 60px;
			background: #ffffff;
			color: #000000;
			padding: 0;
			border-bottom: 1px solid #eeeeee;
			.header_right
				.headlist_wrap
					height: 60px;
					margin-left: 10px;
					font-size: 0;
					li
						display: inline-block;
						float: left;
						font-size: 13px;
						height: 60px;
						line-height: 60px;
						padding: 0 10px;
						color: #888;
						font-weight: bold;
						&:hover
							cursor: pointer
					li.active
						color: #333;
				.portrait
					padding: 0 10px;
					display: inline-block;
					.radiusPortrait
						width: 35px;
						height: 35px;
						border-radius: 50%;
						overflow: hidden;
						margin-top: 13px;
						float: left;
						img
							width: 100%;
							height: 100%;
					b
						float: left;
						font-size: 13px;
						margin-left: 10px;
						line-height: 60px;
						color: #4196e1;
						font-weight: bold;
					i
						float: left;
						font-size: 13px;
						line-height: 60px;
						margin-left: 10px;
					span
						float: left;
						font-size: 13px;
						line-height: 60px;
						margin-left: 10px;
						&:hover
							cursor: pointer; 
</style>