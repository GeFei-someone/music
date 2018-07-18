<template>
	<el-dialog title="添加菜单" :visible.sync="dialotrue" width="50%" :before-close="colseDialog">
		<el-form ref="ruleform" :rules="rulse" :model="form" label-width="120px" label-position="right" method="post" enctype="multipart/form-data">
			<el-form-item label="菜单名称：" prop="name">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="图标：">
				<el-upload  class="upload-demo" :on-remove="upimgRemove"  action="http://www.gefei.club/millet/upload.php" :file-list="fileList" :limit="1" :on-success="uploadsuccess">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-form-item>
			<el-form-item label="父级：">
				<el-input v-model="parannum" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="可见：" prop="delivery">
				<el-switch active-value="1" inactive-value="2" v-model="form.switch"></el-switch>
			</el-form-item>
			<el-form-item label="url：" prop="url">
				<el-input v-model="form.url"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="colseDialogForm('ruleform')">取 消</el-button>
			<el-button type="primary" @click="onsubmit('ruleform')">创 建</el-button>
		</span>
	</el-dialog>
</template>

<script>
import Bus from 'common/bus';
export default {
	data() {
		return {
			dialotrue: false,
			form: {
				name: "",
				icon: "",
				switch: true,
				url: ""
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
			upload: true,
			gomenu: true,
			paranstvalue: "",
			menuid: "",
			parannum: null,
			parantlist: []

		}
	},
	mounted() {
		let _this = this;
		Bus.$on('dialogVisible',(dialotrue) => {
			_this.dialotrue = dialotrue;
		});

		Bus.$on('menuid',(num) => {
			_this.menuid = num;
		})
		this.$ajax.get('/ai/parantselect.php').then( (res)=> {
			_this.parantlist = res.data.coluse;
		})
	},
	methods: {
		colseDialog(done) {
			this.$confirm('确认关闭？ 关闭后什么都不会保存')
			.then(_ => {
				
				done();
				this.fileList = [];
				this.parannum = null;
				//删除文件
				this.$ajax.get("/ai/upload.php",
				{
					params: {
						upload: _this.upload,
						filename: _this.form["icon"]
					}
				}
				).then((res) => {
					console.log(res)
				})
				//清理输入框内容
				this.$refs['ruleform'].resetFields();
			})
			.catch(_ => {

			});
		},
		uploadsuccess(response,file,fileList) {
				this.form.icon = file.name;  //保存上传的名称
		},
		upimgRemove() {		//删除文件
			let _this = this;
			this.upload = true;
			this.$ajax.get("/ai/upload.php",
			{
				params: {
					upload: _this.upload,
					filename: _this.form["icon"]
				}
			}
			).then((res) => {
				console.log(res)
			})
		},
		onsubmit(formName) {
			console.log(this.form.switch);
			let _this = this;
				//验证表单
				_this.$refs[formName].validate((valid) => {
					if(valid){
						
						_this.$ajax.get("/ai/insertmenu.php",
						{
							params: {
								gomenu: _this.gomenu,
								filename: _this.form["icon"],
								menuname: _this.form["name"],
								menuswitch: _this.form["switch"],
								menurouter: _this.form["url"],
								fid: _this.menuid
							}
						}
						).then((res) => {
							if(res.data == 1){
								_this.$message({
									message: '创建菜单成功',
									type: 'success'
								});

								//成功后清理表单内容
								_this.dialotrue = false;
								this.fileList = [];
								this.parannum = null;
								this.$refs['ruleform'].resetFields();
							}else{
								_this.$message.error({message: '创建菜单失败，请重试'})
							}
						})
						//获取数据提交给后台

					}else{
						console.log('error submit!!');
						return false;
					}
				})
			},
			colseDialogForm(formName){
				let _this = this;
				this.$refs[formName].resetFields();
				this.dialotrue = false;
				this.parannum = null;
				this.upload = true
				this.$ajax.get("/ai/upload.php",
				{
					params: {
						upload: _this.upload,
						filename: _this.form["icon"]
					}
				}
				).then((res) => {
					if(res.data == 1){
						this.dialotrue = false;
					}
				})
			}
		},
		watch: {
			"menuid": function(newValue,olo){
				let _this = this;
				if(newValue){
					//获取父级栏目
					for(let i = 0; i < _this.parantlist.length; i++){
						if(_this.parantlist[i].fid == newValue){
							_this.parannum = _this.parantlist[i].name
						}
					}
				}
			}
		}
	}
	</script>

	<style>

	</style>