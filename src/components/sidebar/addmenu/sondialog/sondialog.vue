<template>
	<el-dialog title="添加子菜单" :visible.sync="sondialog" width="50%" :before-close="colseDialog">
		<el-form ref="ruleform" :rules="rulse" :model="form" label-width="120px" label-position="right" method="post" enctype="multipart/form-data">
			<el-form-item label="菜单名称：" prop="name">
				<el-input v-model="form.name"></el-input>
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
			sondialog: false,
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
			parantlist: [],
			upload: true,
			paranstvalue: "",
			menuid: 0,
			parannum: null
		}
	},
	mounted() {
		let _this = this;
		Bus.$on('sondialog',(sondialog) => {
			_this.sondialog = sondialog;
		})
		Bus.$on('menuid',(num) => {
			this.menuid = num;
			// console.log("sondialog"+this.menuid)
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
				this.$refs['ruleform'].resetFields();
			})
			.catch(_ => {

			});
		},
		onsubmit(formName) {
			let _this = this;
				//验证表单
				_this.$refs[formName].validate((valid) => {
					if(valid){
						
						_this.$ajax.get("/ai/insertsonmenu.php",
						{
							params: {
								parantid: _this.menuid,
								menuname: _this.form["name"],
								menuswitch: _this.form["switch"],
								menurouter: _this.form["url"]
							}
						}
						).then((res) => {
							if(res.data == 1){
								_this.$message({
									message: '创建菜单成功',
									type: 'success'
								});
								//成功后清理表单内容
								_this.sondialog = false;
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
				_this.$refs[formName].resetFields();
				_this.sondialog = false;
				_this.upload = true;
				_this.parannum = null;
			}
		},
		watch: {
			"menuid": function(newValue,oloValue){

				let _this = this;
				// _this.menuid = newValue;
				if(newValue){
					for(let i = 0; i < this.parantlist.length; i++) {
						for(let j = 0; j < this.parantlist[i].coluMenu.length; j++){
							if(_this.parantlist[i].coluMenu[j].id == newValue){
								_this.parannum = _this.parantlist[i].coluMenu[j].menutitle
							}
						}
					}
				}
			}
		}
	}
	</script>

	<style>

	</style>