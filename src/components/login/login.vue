<template>
	<div class="login">
			<div class="login_wrap" @submit.prevent="submit">
				<form action="" >
					<div>
						<input type="text" v-model="inputtext.name" name="user" placeholder="用户名" autofocus>
					</div>
					<div>
						<input type="password" v-model="inputtext.pwd" name="pwd" placeholder="密码">
					</div>
					<div>
						<input type="text" v-model="inputtext.cation" name="cation" maxlength="4" placeholder="验证码">
						<span class="verification"  v-on:click="objtainiden">
							<s-identify :identifyCode="identifyCode"></s-identify>
						</span>
					</div>
					<div class="submit">
						<button type="submit">登陆</button>
					</div>
				</form>
			</div>
			<div class="load_wrap" v-if="load">
				<div class="load"></div>
			</div>
			<div class="land" :style="{ marginTop: landtop }">
					登陆成功
			</div>
	</div>
</template>

<script>
	import SIdentify from 'components/identify/identify';	//验证码
	import Qs from 'qs';
	export default {
		data() {
			return {
				inputtext: {},
				identifyCodes: "1234567890abcdefghijklmnopqrstuvwxyz",
      			identifyCode: "",
      			load: false,
      			landtop: "-50px",
      			id: 0,
			}
		},
		mounted() {
			this.identifyCode = "";
    		this.makeCode(this.identifyCodes, 4);
    		// 查看是否已登陆中
    		let id = this.getCookie('upid');
    		if(id != "" && id != null){
    			this.$router.push("/home");
    		}
		},
		methods: {
			submit() {
				const _this = this;
				console.log(this.inputtext);
				if(this.inputtext.name == null){
					this.open('用户名不得为空');
				}else if(this.inputtext.pwd == null){
					this.open('密码不得为空');
				}else if(this.inputtext.cation == null){
					this.open('请填写验证码');
				}else if(this.inputtext.cation != this.identifyCode){
					this.open('验证码不正确');
					this.identifyCode = "";
					this.makeCode(this.identifyCodes, 4);
				}else{
					let datanum = Qs.stringify({
						user: _this.inputtext.name,
						pwd: _this.inputtext.pwd
					})
					// this.open('登陆成功');
					_this.$ajax.post(
						'/ai/millet/selectuser.php',
						datanum,
						{ headers:{'Content-Type':'application/x-www-form-urlencoded'} }
					).then((res) => {
						console.log(res);
						if(res.data.error == 1){
							_this.load = true;
							setTimeout(function(){
								_this.load = false;
								_this.landres = true;
								_this.landtop = '10px';
								setTimeout(function(){
									_this.$router.push({ name: 'home', query: {upid: res.data.id }});

									// _this.$emit('identity',res.data.identity);
								},2000)
								_this.id = res.data.id;
								_this.checkCookie();

								// var oDate = new Date();
								// oDate.setDate(oDate.getTime()+(30*24*60*60*1000));
								
							},2500)
							// _this.open('登陆成功欢迎你:'+_this.inputtext.name);
						}else{
							_this.open('用户名或密码错误！');
						}
					})
				}
			},
			open(text) {
				this.$alert(text,'错误提示',{
					confirmButtonText: '确定'
				})
			},
			objtainiden() {
				this.identifyCode = "";
				this.makeCode(this.identifyCodes, 4);
				// console.log(1)
			},
			randomNum(min, max) {
			    return Math.floor(Math.random() * (max - min) + min);
			},
			refreshCode() {
		      this.identifyCode = "";
		      this.makeCode(this.identifyCodes, 4);
			},
			makeCode(o, l) {
		      for (let i = 0; i < l; i++) {
		        this.identifyCode += this.identifyCodes[
		          this.randomNum(0, this.identifyCodes.length)
		        ];
		      }
		      console.log(this.identifyCode);
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
			checkCookie() {
				var _this = this;
				var user = _this.getCookie('user');
				if(user != ""){
					console.log('替换cookie');
					_this.setCookie('upid',_this.id,30);
				}else{
					console.log('设置cookie');
					_this.setCookie('upid',_this.id,30);
				}
			},
			setCookie(cname,cvalue,expires) {
				// document.cookie = "user="+_this.inputtext.name+";expires="+oDate.toGMTString()+";path=/";	//设置cookie
				var date = new Date();
				date.setTime(date.getTime()+(expires*24*60*60*1000));
				var expires = "expires="+date.toGMTString();
				document.cookie = cname+"="+cvalue+"; "+expires+";path=/";
			}
		},
		components: {
			SIdentify
		}
	}
</script>

<style>
	.login{
		width: 100%;
		height: 100%;
		background: url(../../assets/loginimg.jpg) top  no-repeat;
		background-size: 100% 100%;
		position: fixed;
		top: 0;
		left: 0;
	}
	.login_wrap{
		width: 480px;
		height: 362px;
		position: fixed;
		background: rgba(255,255,255,.2);
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		border: 3px solid rgba(255,255,255,.5);
		border-radius: 12px;
	}
	.login_wrap:before{
		content: '';
		width: 100px;
		height: 10px;
		display: block;
		margin: 0 auto;
		border: 2px solid rgba(255,255,255,.5);
		border-radius: 12px;
		margin-top: 30px;
		background: url(../../assets/loginimg.jpg)   no-repeat;
		background-position: 100%;
	}
	form{
		overflow: hidden;
		margin-top: 10px;
	}
	.login_wrap form div{
		/*padding: 10px 40px;*/
		width: 300px;
		height: 50px;
		background: rgba(255,255,255,.2);
		border: 1px solid rgba(255,255,255,.2);
		border-radius: 5px;
		margin: 20px auto 0 auto;
		position: relative;
	}
	.login_wrap form div input{
		margin-left: 30px;
		width: 85%;
		border: 0 none;
		background: rgba(0,0,0,0);
		margin-top: 10px;
		height: 30px;
		color: #ffffff;
		outline: none;
		font-size: 13px;
	}
	input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {   
 		/* WebKit browsers */   
		color: #ffffff;   
	}   
	input:-moz-placeholder, textarea:-moz-placeholder {   
		/* Mozilla Firefox 4 to 18 */   
		color: #ffffff;   
	}   
	input::-moz-placeholder, textarea::-moz-placeholder {   
		 /* Mozilla Firefox 19+ */   
		color: #ffffff;   
	}   
	input:-ms-input-placeholder, textarea:-ms-input-placeholder {   
		 /* Internet Explorer 10+ */   
		color: #ffffff;   
	}
	.verification{
		width: 80px;
		height: 40px;
		display: block;
		position: absolute;
		right: 5px;
		bottom: 5px;
		background:  red;
	}
	.login_wrap form .submit{	
		text-align: center;
		line-height: 40px;
		border: 0 none;
	}
	.submit button{
		width: 100%;
		height: 100%;
		background: #4196e1;
		border: 0 none;
		color: #ffffff;
		font-size: 13px;

	}
	.load_wrap{
		width: 100px;
		height: 70px;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		font-size: 12px;
		color: #ffffff;
	}
	.load{
		width: 50px;
		height: 50px;
		background: rgba(255,255,255,.4);
		perspective: 400;
	    -webkit-animation: rotateplane 1.2s infinite ease-in-out;
	    animation: rotateplane 1.2s infinite ease-in-out;
		text-align: center;
		line-height: 50px;
		margin-left: 15px;
		margin-bottom: 10px;

	}
	@keyframes rotateplane {
	  0% {
	    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
	    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
	  } 50% {
	    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
	    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
	  } 100% {
	    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
	    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
	  }
	}
	.land{
		width: 300px;
		height: 50px;
		background: rgba(65,150,225,.5);
		color: #ffffff;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
		line-height: 50px;
		border-radius: 5px;
		transition: all .45s ease-in-out;
	}
</style>