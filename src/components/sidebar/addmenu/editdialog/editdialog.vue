<template>
	<div>
		<div v-if="setup == 1">
			<el-dialog title="编辑" :visible.sync="editdialog" width="50%" :before-close="colseDialog">
				<el-form ref="ruleformson" :rules="rulse" :model="form" label-width="120px" label-position="right">
					<el-form-item label="菜单名称：" prop="name">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
					<el-form-item label="可见：" prop="delivery">
						<el-switch active-value="1" inactive-value="2" :change="changetrue()" v-model="form.switch"></el-switch>
					</el-form-item>
					<el-form-item label="url：" prop="url">
						<el-input v-model="form.url"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="colseDialogForm('ruleformson')">取 消</el-button>
					<el-button type="primary" @click="onsubmitson('ruleformson')">保 存</el-button>
				</span>
			</el-dialog>
		</div>
		<div v-if="setup == 2">
			<el-dialog title="编辑" :visible.sync="editdialog" width="50%" :before-close="colseDialog">
				<el-form ref="ruleformtop" :rules="rulse" :model="form" label-width="120px" label-position="right" method="post" enctype="multipart/form-data">
					<el-form-item label="菜单名称：" prop="name">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
					<el-form-item label="图标：">
						<el-upload  class="upload-demo" :on-remove="upimgRemove"  action="http://www.gefei.club/millet/upload.php" :file-list="fileList" :limit="1" :on-success="uploadsuccess">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="可见：" prop="delivery">
						<el-switch active-value="1" inactive-value="2" :change="changetrue()" v-model="form.switch"></el-switch>
					</el-form-item>
					<el-form-item label="url：" prop="url">
						<el-input v-model="form.url"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="colseDialogForm('ruleformtop')">取 消</el-button>
					<el-button type="primary" @click="onsubmitmenu('ruleformtop')">保 存</el-button>
				</span>
			</el-dialog>
		</div>
		<div v-if="setup == 3">
			<el-dialog title="编辑" :visible.sync="editdialog" width="50%" :before-close="colseDialog">
				<el-form ref="ruleformsonmenu" :rules="rulse" :model="form" label-width="120px" label-position="right">
					<el-form-item label="菜单名称：" prop="name">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
					<el-form-item label="可见：" prop="delivery">
						<el-switch active-value="1" inactive-value="2" :change="changetrue()" v-model="form.switch"></el-switch>
					</el-form-item>
					<el-form-item label="url：" prop="url">
						<el-input v-model="form.url"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="colseDialogForm('ruleformsonmenu')">取 消</el-button>
					<el-button type="primary" @click="onformsonmenu('ruleformsonmenu')">保 存</el-button>
				</span>
			</el-dialog>
		</div>
		
	</div>

</template>

<script>
import Bus from 'common/bus';
export default {
	data() {
		return {
			editdialog: false,
			form: {
				name: "",
				icon: "",
				switch: "1",
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
			parantlist: [],
			fileList: [],  //上传成功的文件
			upload: true,
			paranstvalue: "",
			menuid: 0,
			setup: null,
			parid: 0,
			psoid: 0,
			newid: null,
			current: [],
			gomenu: true,
			icotree: "" //之前的图片
		}
	},
	mounted() {
		let _this = this;
		Bus.$on('editdialog',(editdialog) => {
			_this.editdialog = editdialog;
		})
		Bus.$on('menuid',(num) => {
			this.menuid = num;
			// console.log(num);
		});
		Bus.$on('newID',(newID) => {	//子id
			this.newid = newID;
		});
		Bus.$on('parid',(parid) => {	//父id
			this.parid = parid;
		});
		Bus.$on('setup',(updata) => {
			this.setup = updata;
			// console.log(updata);
		});
		Bus.$on('psonid',(psoid) => {
			this.psoid = psoid;
		});
		this.$ajax.get('/ai/parantselect.php').then( (res)=> {
			_this.parantlist = res.data.coluse;
		});

	},
	methods: {
		colseDialog(done) {
			this.$confirm('确认关闭？ 关闭后什么都不会保存')
			.then(_ => {
				
				done();
				this.fileList = [];
				//删除上传文件
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
				this.$refs['ruleformtop'].resetFields();
				this.$refs['ruleformson'].resetFields();
				this.$refs['ruleformsonmenu'].resetFields();


			})
			.catch(_ => {

			});
		},
		onsubmitson(formName) {
		let _this = this;
			//验证表单
			_this.$refs[formName].validate((valid) => {
				if(valid){
					
					_this.$ajax.get("/ai/updatason.php",
					{
						params: {
							gomenu: _this.gomenu,
							dataid: _this.menuid,
							menuname: _this.form["name"],
							menuswitch: _this.form["switch"],
							menurouter: _this.form["url"]
						}
					}
					).then((res) => {
						if(res.data == 1){
							_this.$message({
								message: '更新成功',
								type: 'success'
							});
							//成功后清理表单内容
							_this.editdialog = false;
							this.fileList = [];
							this.$refs['formName'].resetFields();
						}else{
							_this.$message.error({message: '更新菜单失败，请重试'})
						}
					})
					//获取数据提交给后台

				}else{
					console.log('error submit!!');
					return false;
				}
			})
		},
		onsubmitmenu(formName) {
			let _this = this;
			//验证表单
			_this.$refs[formName].validate((valid) => {
				if(valid){
					
					_this.$ajax.get("/ai/updatamenu.php",
					{
						params: {
							gomenu: _this.gomenu,
							filename: _this.form["icon"],
							menuname: _this.form["name"],
							menuswitch: _this.form["switch"],
							menurouter: _this.form["url"],
							icotree: _this.icotree,
							dataid: _this.newid
						}
					}
					).then((res) => {
						if(res.data == 1){
							_this.$message({
								message: '更新成功',
								type: 'success'
							});

							//成功后清理表单内容
							_this.editdialog = false;
							this.fileList = [];
							this.$refs['formName'].resetFields();
						}else{
							_this.$message.error({message: '更新菜单失败，请重试'})
						}
					})
					//获取数据提交给后台

				}else{
					console.log('error submit!!');
					return false;
				}
			})
		},
		onformsonmenu(formName) {
			let _this = this;
			//验证表单
			_this.$refs[formName].validate((valid) => {
				if(valid){
					
					_this.$ajax.get("/ai/updatapson.php",
					{
						params: {
							gomenu: _this.gomenu,
							menuname: _this.form["name"],
							menuswitch: _this.form["switch"],
							menurouter: _this.form["url"],
							dataid: _this.psoid
						}
					}
					).then((res) => {
						if(res.data == 1){
							_this.$message({
								message: '更新成功',
								type: 'success'
							});

							//成功后清理表单内容
							_this.editdialog = false;
							this.fileList = [];
							this.$refs[formName].resetFields();
						}else{
							_this.$message.error({message: '更新菜单失败，请重试'})
						}
					})
					//获取数据提交给后台

				}else{
					console.log('error submit!!');
					return false;
				}
			})
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
		colseDialogForm(formName){
			let _this = this;
			_this.$refs[formName].resetFields();
			_this.editdialog = false;
			_this.upload = true;
			if(formName.indexOf(formName) != -1){
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
						this.editdialog = false;
					}
				})
			}
		},
		changetrue(){
			// console.log(this.form.switch);
		}
	},
	watch: {
		"parid": function(newval,olo){
			// console.log(this.newid);
			if(newval){
				// console.log(this.form.switch);
				for(let i = 0; i < this.parantlist.length; i++){
					if(this.parantlist[i].fid == newval){
						// console.log(this.parantlist[i]);
						this.form.name = this.parantlist[i].name;
						this.form.switch = this.parantlist[i].fso;
						this.form.url = this.parantlist[i].to;
					}
				}
			}
		},
		"newid": function(newval,olo){
			for(let i = 0; i < this.parantlist.length; i++){
				if(this.parantlist[i].fid == this.parid){
					for(let j = 0; j < this.parantlist[i].coluMenu.length; j++){
						if(this.parantlist[i].coluMenu[j].id == newval){
							console.log(this.parantlist[i].coluMenu[j]);
							this.form.name = this.parantlist[i].coluMenu[j].menutitle;
							this.form.switch = this.parantlist[i].coluMenu[j].so;
							this.form.url = this.parantlist[i].coluMenu[j].router;
							let icourl = this.parantlist[i].coluMenu[j].icourl; //截取ico名
							let icosplist = icourl.split('.')[2].split('/')[2];
							this.icotree = icosplist;
						}
					}
				}
			}

		},
		"psoid": function(newval,olo){
			if(newval){
				for(let i = 0; i < this.parantlist.length; i++){
					for(let j = 0; j < this.parantlist[i].coluMenu.length; j++){
						
						if(this.parantlist[i].coluMenu[j].sonmenu){
							for(let h = 0; h < this.parantlist[i].coluMenu[j].sonmenu.length; h++){
								if(this.parantlist[i].coluMenu[j].sonmenu[h].ID == newval){
									console.log(this.parantlist[i].coluMenu[j].sonmenu[h])
									this.form.name = this.parantlist[i].coluMenu[j].sonmenu[h].name;
									this.form.switch = this.parantlist[i].coluMenu[j].sonmenu[h].menuswitch;
									this.form.url = this.parantlist[i].coluMenu[j].sonmenu[h].router;
								}
							
							}
						}

					}
				}
			}

		}
	}
}
</script>

<style>
	.el-dialog__footer{
		padding: 10px 20px 20px;
		text-align: right;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
</style>