<template>
	<el-dialog title="编辑商品" :visible.sync="edit" width="90%" :before-close="colseDialog">
		<table border="1" cellpadding="10">
			<el-form ref="ruleform" :rules="rulse" :inline="true" class="demo-form-inline" :model="form" label-width="120px" label-position="center" method="post" enctype="multipart/form-data">
				<tr class="rowone">
					<td style="line-height: 181px;vertical-align: top">商品图片：</td>
					<td>
						<img :src="form.imgurl" alt="" style="width: 136px;height: 136px;">
						<el-upload  class="upload-demo" :on-remove="upimgRemove" action="http://www.gefei.club/millet/commupload.php" :file-list="fileList" :limit="1" :on-success="uploadsuccess">
							<el-button size="small" type="primary">重新上传</el-button>
						</el-upload>
					</td>
					<td style="line-height: 181px;vertical-align: top">商品名称：</td>
					<td>
						<el-input v-model="form.title" prop="title"></el-input>
					</td>
					<td style="line-height: 181px;vertical-align: top">商品简称：</td>
					<td>
						<el-input v-model="form.titleshort"  prop="titleshort"></el-input>
					</td>
					<td style="line-height: 181px;vertical-align: top">商品分类</td>
					<td style="width: 17%;">
						<el-select v-model="form.cation" placeholder="商品分类" prop="cation" style="width: 47%">
							<el-option v-for="(itemselect,index) in form.selectlist" :key="itemselect.id" :label="itemselect.title" :value="itemselect.id"></el-option>
						</el-select>
						<el-select :disabled="disabled" v-model="form.region" prop="region" placeholder="区域" style="width: 47%">
							<el-option v-for="(itemselect,index) in form.selectlist2" :key="itemselect.id" :label="itemselect" :value="index"></el-option>
						</el-select>
					</td>
				</tr>
				<tr style="line-height: 70px">
					<td >商品描述：</td>
					<td><el-input v-model="form.brief" prop="brief"></el-input></td>
					<td >商品简述：</td>
					<td><el-input v-model="form.briefshort" ></el-input></td>
				</tr>
				<tr style="line-height: 70px">
					<td >赠品：</td>
					<td style="width: 160px"><el-input v-model="form.give" prop="give" ></el-input></td>
					<td>促销活动：</td>
					<td><el-input v-model="form.promotion" prop="promotion"></el-input></td>
					<td>商品原价：</td>
					<td><el-input-number v-model="form.original" prop="original" @change="handleChange" :min="1" :max="100000" label="原价"></el-input-number></td>
					<td>商品现价：</td>
					<td><el-input-number v-model="form.Present" prop="Present" @change="handleChange" :min="1" :max="100000" label="现价"></el-input-number></td>
				</tr>
				<tr style="line-height: 70px">
					<td>商品版本：</td>
					<td><el-input v-model="form.edition" prop="edition"></el-input></td>
					<td>商品颜色：</td>
					<td><el-input v-model="form.color" prop="color" placeholder="多个颜色以,分开"></el-input></td>
					<td>最大购买：</td>
					<td><el-input v-model="form.purchasemaxnum" prop="purchasemaxnum" placeholder="最高购买数量"></el-input></td>
					<td>最少购买：</td>
					<td><el-input v-model="form.purchaseminnum" prop="purchaseminnum" placeholder="多个颜色以,分开"></el-input></td>
				</tr>
				<hr />
				<tr>
					<td style="line-height: 181px;vertical-align: top">轮播图</td>
					<td v-for="(itemback,index) in form.backgimg">
						<img :src="itemback" alt="" style="width: 136px;height: 136px;">
<el-upload  class="upload-demo" :on-remove="upimgRemove" action="http://www.gefei.club/millet/commupload.php" :file-list="fileList" :limit="1" :on-success="uploadsuccess">
							<el-button size="small" type="primary">重新上传</el-button>
						</el-upload>
					</td>
				</tr>
				<tr>
					<td style="line-height: 181px;vertical-align: top">购物车图：</td>
					<td v-for="(itemback,index) in form.colorimg">
						<img :src="itemback" alt="" style="width: 136px;height: 136px;">
<el-upload  class="upload-demo" :on-remove="upimgRemove" action="http://www.gefei.club/millet/commupload.php" :file-list="fileList" :limit="1" :on-success="uploadsuccess">
							<el-button size="small" type="primary">重新上传</el-button>
						</el-upload>
					</td>
				</tr>
			</el-form>
		</table>
		<span slot="footer" class="dialog-footer">
			<el-button @click="colseDialogForm('ruleform')">取 消</el-button>
			<el-button type="primary" @click="onsubmitmenu('ruleform')">保 存</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import Bs from 'common/bus.js';
	import qs from 'qs';
	export default {
		data() {
			return {
				edit: false,
				form: {
					title: "",
					masterimg: "",
					titleshort: "",
					brief: "",
					promotion: "",
					original: "",
					Present: "",
					edition: "",
					color: "",
					purchasemaxnum: "",
					purchaseminnum: 1,
					commimg: "",
					switch: true,
					url: "",
					promotion: "",
					give: "",
					uploadimg: [],
					backgimg: [],
					colorimg: [],
					imgurl: "",
					selectlist: [],
					select: "",
					cation: "",
					region: "",
					briefshort: ""
				},
				rulse: {
					name: [
					{required: true,message: '请输入菜单名称',trigger: 'blur'}
					],
					url: [
					{required: true,message: '请输入url',trigger: 'blur'}
					]
				},
				editcommlistall: [],
				commid: "",
				fileList: [],
				gomenu: false,
				recaptrue: true,
				disabled: true
			}
		},
		mounted() {
			let _this = this;
			Bs.$on('edit', (edit) => {
				_this.edit = edit;
			})
			Bs.$on('id', (id) => {
				_this.commid = id;
			})
			_this.$ajax.get("/ai/selecomm.php").then( (res) => {
				_this.editcommlistall = res.data.comm;
				for(let i = 0; i < _this.editcommlistall.length; i++){
					let imgurlsplit = _this.editcommlistall[i].imgurl.slice(3,_this.editcommlistall[i].imgurl.length);
					_this.editcommlistall[i].imgurl = "/ai/"+imgurlsplit;
				}
			})


		},
		methods: {
			colseDialogForm(formName){
				let _this = this;
				_this.$refs[formName].resetFields();
				_this.edit = false;
				_this.upload = true;
				if(formName.indexOf(formName) != -1){
					this.$ajax.get("/ai/commupload.php",
					{
						params: {
							upload: _this.upload,
							fi1enameall: _this.form.uploadimg
						}
					}
					).then((res) => {
						if(res.data == 1){
							this.edit = fa1se;
						}
					})
				}
			},
			colseDialog(done) {
				this.$confirm('确认关闭？ 关闭后什么都不会保存')
				.then(_ => {
					
					done();
					this.fileList = [];
					this.parannum = null;
					//删除上传的文件
					this.$ajax.get("/ai/commupload.php",
					{
						params: {
							upload: _this.upload,
							filenameall: _this.form.uploadimg
						}
					}
					).then((res) => {
						if(res.data == 1){
							this.edit = false;
						}
					})
					//清开输入框内容
					this.$refs['ruleform'].resetFields();
				})
				.catch(_ => {

				});
			},
			upimgRemove() {		//删除文件
				let _this = this;
				this.upload = true;
				this.$ajax.get("/ai/commupload.php",
				{
					params: {
						upload: _this.upload,
						filenameall: _this.form.uploadimg
					}
				}
				).then((res) => {
				})
			},
			uploadsuccess(res,file,fileList) {	//主图上传
				this.form.masterimg = res;
				this.form.uploadimg.push(res);
			},
			bannersuccess(res,file,fileList){	//轮播图上传
				this.form.backgimg.push(res);
				this.form.uploadimg.push(res);

			},
			colorsuccess(res,file,fileList){	//颜色图上传
				this.form.colorimg.push(res);
				this.form.uploadimg.push(res);
			},
			handleChange(value){
				console.log(value)
			},
			//提交数据
			onsubmitmenu(formName){
				
				let _this = this;
				let data = qs.stringify({ 
							gomenu: _this.gomenu,
							commid: _this.commid,
							title: _this.form["title"],
							masterimg: _this.form["imgurl"],
							titleshort: _this.form["titleshort"],
							brief: _this.form["brief"],
							promotion: _this.form["promotion"],
							give: _this.form["give"],
							original: _this.form["original"],
							Present: _this.form["Present"],
							edition: _this.form["edition"],
							color: _this.form["color"],
							max: _this.form["purchasemaxnum"],
							min: _this.form["purchaseminnum"],
							bannimg: _this.form["backgimg"],
							colorimg: _this.form["colorimg"],
							cationid: _this.form["cation"],
							regionid: _this.form["region"],
							briefshort: _this.form["briefshort"]
						});
				_this.$ajax.post('/ai/editcomm.php',data).then( (res) => {
							if(res.data == 1){
								_this.$message({
									message: "编辑商品成功",
									type: "success"
								})
								this.$emit("recaptrue",this.recaptrue)
								_this.edit = false;
								//清开输入框内容
								this.$refs['ruleform'].resetFields();
							}
				})
			}
		},
		watch: {
			commid: function(newval,oloval){
				let _this = this;
				this.$ajax.get('/ai/selecomm.php').then( (res) => {
					for(let i = 0; i < res.data.comm.length; i++){
						if( res.data.comm[i].id == newval){
							let list =  res.data.comm[i];
							this.form.title = list.title;
							this.form.titleshort = list.titleshort;
							this.form.brief = list.brief;
							this.form.give = list.give;
							this.form.promotion = list.promotion;
							this.form.original = list.original;
							this.form.Present = list.Present;
							this.form.edition = list.edition;
							this.form.color = list.color;
							this.form.purchasemaxnum = list.purchasemaxnum;
							this.form.purchaseminnum = list.purchaseminnum;
							this.form.cation = list.cationid;
							this.form.imgurl = [];
							this.form.backgimg = [];
							this.form.colorimg = [];
							this.form.imgurl = list.imgurl;
							let productimgall = list.productimg.split(',');
							let colorimg = list.colorimg.split(',');
							for(let j = 0; j < productimgall.length; j++){
								this.form.backgimg.push(productimgall[j]);
							}
							
							for(let h = 0; h < colorimg.length; h++){
								let cimglength = colorimg[h].length;

								this.form.colorimg.push(colorimg[h]);
							}
							//获取分类
							this.$ajax.get('/ai/cation.php',{
								params: {
									gomenu: this.gomenu
								}
							}).then( (res) => {
								this.form.selectlist = res.data.cation;
								for(let i = 0; i < res.data.cation.length; i++){
									if(this.form.cation == res.data.cation[i].id){
										this.form.select = res.data.cation[i].title;
									}
								}
							})

						}
					}
				})
			},
			"form.cation": function(newval,oloval){
				if(newval){
					this.disabled = false;
					this.form.selectlist2 = [];
					for(let i = 0; i < this.form.selectlist.length; i++){
						if(this.form.selectlist[i].id == newval){
							// this.form.selectlist2 = this.form.selectlist[i].region
							let selelist = this.form.selectlist[i].region.split(',');
							for(let j = 0; j < selelist.length; j++){
								this.form.selectlist2.push(selelist[j]);
							}
						}
					}
				}
			}
		}
	}
</script>
<style>
	.el-upload-list{
		float: right;
    	margin-left: 30px;
    	margin-top: 4px
	}
	.el-input-number{
		width: 196px;
	}
	.banner_list .el-upload-list{
		float: none;
		margin: 0;
	}
	.banner_list .el-form-item__label{
		line-height: 50px;
	}
	.el-upload__tip{
		display: inline-block;
		margin-left: 30px;
	}

	.el-button:focus, .el-button:hover{
		background: #66b1ff;
		color: #ffffff;
	}
	.el-button--success:focus, .el-button--success:hover{
		background: #85ce61;
		color: #ffffff;
	}
	.el-button--danger:focus, .el-button--danger:hover{
		background: #f78989;
	    border-color: #f78989;
	    color: #fff;
	}
	td{
	
		padding: 0 7px;
		font-size: 12px;
		text-align: right;
	}
	.el-input__inner{
		font-size: 12px;
	}
	.el-upload{
		display: block;
		margin-top: 10px;
		width: 136px;
	}
	.upload-demo{
		overflow: hidden;
    	clear: both;
    	margin-top: 10px;
	}
	.rowone td{
		vertical-align: middle;

	}
</style>