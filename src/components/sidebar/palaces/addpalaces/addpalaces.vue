<template>
	<el-dialog title="添加五宫格" :visible.sync="palaces" width="30%" :before-close="palacesClose">
		<el-form ref="palacesForm" :model="form" label-width="100px">
			<el-form-item label="名称：" prop="name">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="图标：">
				<el-upload class="upload-demo" action="http://www.gefei.club/millet/upload.php" :on-remove="icoRemove" :before-remove="icoBeforeRemove" :on-success="handlePreview" :limit="1" :file-list="fileList">
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item label="分类：" prop="cation">
				<el-select v-model="form.cation" placeholder="商品分类">
					<el-option v-for="(itemselect,index) in form.cationlist" :key="itemselect.id" :label="itemselect.title" :value="itemselect.id"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="palaces = false">取 消</el-button>
			<el-button type="primary" @click="onsubmitPalaces('palacesForm')">确 定</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import Bs from 'common/bus.js';
	import qs from 'qs';
	export default {
		data() {
			return {
				palaces: false,
				form: {
					name: "",
					cation: "",
					cationlist: [],
					iconame : ""
				},
				fileList: [],
				gomenu: false
			}
		},
		mounted() {
			Bs.$on("palaces",(palaces) => {
				this.palaces = palaces
			})

			this.$ajax.get("/ai/millet/cation.php",{
				params: {
					gomenu: this.gomenu
				}
			}).then( (res) => {
				this.form.cationlist = res.data.cation;
			})

		},
		methods: {
			palacesClose(done){
				this.$confirm("确定关闭？").then( _ => {
					done();
				}).catch( _ => {

				});
			},
			handlePreview(res,file,fileList) {
					console.log(file.name)
					this.form.iconame = "/ai/icon/"+file.name;
			},
			onsubmitPalaces(formName) {	//提交
				let _this = this;
				let data = qs.stringify(
						{
							gomenu: _this.gomenu,
							title: _this.form.name,
							iconame : _this.form.iconame,
							cation: _this.form.cation
						}
					);
				this.$ajax.post("/ai/millet/addpalaces.php",data).then( (res) => {
					console.log(res);
					if(res.data == 1){
							_this.$message({
								message: "添加五宫格成功",
								type: "success"
							})
							// this.$emit("recaptrue",this.recaptrue);
							//清开输入框内容
							this.fileList = [];
							Bs.$emit("recaptrue",true);
							this.$refs[formName].resetFields()
							_this.palaces = false;
					}
				})
			},
			icoRemove() {	//删除上传图片

			},
			icoBeforeRemove(file,filelist){
				return this.$confirm(`确定移除 ${ file.name}`);
			}
		}
	}
</script>
<style>
	
</style>