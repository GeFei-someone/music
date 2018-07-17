<template>
	<el-dialog title="添加商品" :visible.sync="commpush" width="90%" :before-close="colseDialog">
		<table border="1" cellpadding="10">
			<el-form ref="formcomm" :rules="rulse" :inline="true" class="demo-form-inline" :model="form" label-width="120px" label-position="center" method="post" enctype="multipart/form-data">
				<tr class="rowone">
					<td style="line-height: 214px;vertical-align: top">商品图片：</td>
					<td>
						<img :src="form.imgurl" alt="" style="width: 136px;height: 136px;">
						<el-upload  class="upload-demo" :on-remove="upimgRemove" action="http://www.gefei.club/millet/commupload.php" :file-list="fileList" :limit="1" :on-success="uploadsuccess">
							<el-button size="small" type="primary">重新上传</el-button>
						</el-upload>
					</td>
					<td style="line-height: 214px;vertical-align: top">商品名称：</td>
					<td>
						<el-input v-model="form.title"></el-input>
					</td>
					<td style="line-height: 214px;vertical-align: top">商品简称：</td>
					<td>
						<el-input v-model="form.titleshort"></el-input>
					</td>
					<td style="line-height: 214px;vertical-align: top">商品分类</td>
					<td style="width: 17%;">
						<el-select v-model="form.cation" placeholder="商品分类" style="width: 47%">
							<el-option v-for="(itemselect,index) in form.selectlist" :key="itemselect.id" :label="itemselect.title" :value="itemselect.id"></el-option>
						</el-select>
						<el-select :disabled="disabled" v-model="form.region" placeholder="区域" style="width: 47%">
							<el-option v-for="(itemselect,index) in form.selectlist2" :key="itemselect.id" :label="itemselect" :value="index"></el-option>
						</el-select>
					</td>
				</tr>
				<tr style="line-height: 70px">
					<td >商品描述：</td>
					<td><el-input v-model="form.brief" ></el-input></td>
					<td >商品简述：</td>
					<td><el-input v-model="form.briefshort" ></el-input></td>
				</tr>
				<tr style="line-height: 70px">
					<td >赠品：</td>
					<td style="width: 160px"><el-input v-model="form.give" ></el-input></td>
					<td>促销活动：</td>
					<td><el-input v-model="form.promotion" ></el-input></td>
					<td>商品原价：</td>
					<td><el-input-number v-model="form.original" @change="handleChange" :min="1" :max="100000" label="原价"></el-input-number></td>
					<td>商品现价：</td>
					<td><el-input-number v-model="form.Present" @change="handleChange" :min="1" :max="100000" label="现价"></el-input-number></td>
				</tr>
				<tr style="line-height: 70px">
					<td>商品版本：</td>
					<td><el-input v-model="form.edition" ></el-input></td>
					<td>商品颜色：</td>
					<td><el-input v-model="form.color" placeholder="多个颜色以,分开"></el-input></td>
					<td>最大购买：</td>
					<td><el-input v-model="form.purchasemaxnum" placeholder="最高购买数量"></el-input></td>
					<td>最少购买：</td>
					<td><el-input v-model="form.purchaseminnum" placeholder="多个颜色以,分开"></el-input></td>
				</tr>
				<hr />
				<tr>
					<td style="line-height: 181px;vertical-align: top">轮播图：</td>
					<td>
						<el-upload list-type="picture-card"  class="upload-demo banner_list" :on-remove="upimgRemove"  action="http://www.gefei.club/millet/bannupload.php" :file-list="fileList" :limit="10" :on-success="bannersuccess">
							<i class="el-icon-plus"></i>
						</el-upload>
					</td>
				</tr>
				<tr>
					<td style="line-height: 181px;vertical-align: top">购物车图：</td>
					<td>
						<el-upload list-type="picture-card"  class="upload-demo banner_list" :on-remove="upimgRemove"   action="http://www.gefei.club/millet/colorupload.php" :file-list="fileListcolor" :limit="10" :on-success="colorsuccess">
							<i class="el-icon-plus"></i>
						</el-upload>
					</td>
				</tr>
			</el-form>
		</table>
		<span slot="footer" class="dialog-footer">
			<el-button @click="colseDialogForm('formcomm')">取 消</el-button>
			<el-button type="primary" @click="onsubmitmenu('formcomm')">保 存</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import Bs from 'common/bus.js';
	import qs from 'qs';
	export default {
		data() {
			return {
				commpush: false,
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
					backgimg: [],
					colorimg: [],
					selectlist: [],
					selectlist2: [],
					cation: "",
					region: "",
					imgurl: "",
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
				fileList: [],
				fileListcolor: [],
				gomenu: false,
				recaptrue: true,
				backimg: [],
				coloimg: [],
				disabled: true
			}
		},
		mounted() {
			let _this = this;
			Bs.$on('commpushtrue', (commpush) => {
				// console.log(commpush)
				_this.commpush = commpush;
			})
			//获取分类
			this.$ajax.get('/ai/millet/cation.php',{
				params: {
					gomenu: _this.gomenu
				}
			}).then( (res) => {
				// console.log(res);
				this.form.selectlist = res.data.cation;
				// this.form.selectlist2 = 
			})

		},
		methods: {
			colseDialogForm(formName){
				let _this = this;
				_this.$refs[formName].resetFields();
				_this.commpush = false;
				_this.upload = true;
				if(formName.indexOf(formName) != -1){
					this.$ajax.get("/ai/millet/commupload.php",
					{
						params: {
							upload: _this.upload,
							fi1enameall: _this.form.uploadimg
						}
					}
					).then((res) => {
						// console.log(res)
						if(res.data == 1){
							this.commpush = fa1se;
							//清开输入框内容
							this.fileList = [];
							this.fileListcolor = [];

							this.$refs[formName].resetFields();
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
					this.$ajax.get("/ai/millet/commupload.php",
					{
						params: {
							upload: _this.upload,
							filenameall: _this.form.uploadimg
						}
					}
					).then((res) => {
						if(res.data == 1){
							this.commpush = false;
							//清开输入框内容
							this.fileList = [];
							this.fileListcolor = [];
							this.$refs[formName].resetFields();
						}
					})
				})
				.catch(_ => {

				});
			},
			upimgRemove() {		//删除文件
				let _this = this;
				this.upload = true;
				this.$ajax.get("/ai/millet/commupload.php",
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
				this.form.imgurl = "";
				this.form.imgurl = "/ai" + res.slice(2,res.length);
				this.form.masterimg = res;
			},
			bannersuccess(res,file,fileList){	//轮播图上传
				this.form.backgimg.push(res);

			},
			colorsuccess(res,file,fileList){	//颜色图上传
				this.form.colorimg.push(res);
			},
			handleChange(value){

			},
			//提交数据
			onsubmitmenu(formName){
				let _this = this;
				let backarr = this.form.backgimg;
				let coloarr = this.form.colorimg;
				let backsplit = [];
				let colosplit = [];
				for(let i = 0; i < backarr.length; i++){
					backsplit.push("/ai" + backarr[i].slice(2,backarr[i].length));
				}
				for(let i = 0; i < coloarr.length; i++){
					colosplit.push("/ai" + coloarr[i].slice(2,coloarr[i].length));
				}
				let data = qs.stringify({ 
							gomenu: _this.gomenu,
							title: _this.form["title"],
							masterimg: "/ai" + _this.form["masterimg"].slice(2,_this.form["masterimg"].length),
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
							bannimg: backsplit,
							colorimg: colosplit,
							cationid: _this.form["cation"],
							regionid: _this.form["region"],
							briefshort: _this.form["briefshort"]
						});
				_this.$ajax.post('/ai/millet/addcomm.php',data).then( (res) => {
							if(res.data == 1){
								_this.$message({
									message: "添加商品成功",
									type: "success"
								})
								this.$emit("recaptrue",this.recaptrue);
								//清开输入框内容
								this.fileList = [];
								this.fileListcolor = [];
								this.$refs[formName].resetFields()
								_this.commpush = false;
							}
				})
			}
		},
		watch: {
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
	  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>