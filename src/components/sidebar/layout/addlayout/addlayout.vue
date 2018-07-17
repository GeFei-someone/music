<template>
	<el-dialog title="添加" :visible.sync="prlayout" width="30%">
		<el-form :model="form">
			<el-form-item label="分类名称：">
						<el-select v-model="form.select" placeholder="请选择分类">
						<el-option v-for="(itemselect,index) in form.selectlist" :key="itemselect.id" :label="itemselect.title" :value="itemselect.id"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script>
	export default {
		data() {
			return {
				form: {
					title: "",
					select: "",
					selectlist: [],
					cationid: null,
					setting: "",
					bannerswitch: false

				},
				gomenu: false,
				fileList: [],
				listlength: 1
			}
		},
		props: ["prlayout"],
		mounted() {
			let _this = this;
			//获取分类
			this.$ajax.get('/ai/millet/cation.php',{
				params: {
					gomenu: this.gomenu
				}
			}).then( (res) => {
				for(let i = 0; i < res.data.cation.length; i++){
					
					if(res.data.cation[i].switch.indexOf("true") != -1){
						res.data.cation[i].switch = true;
						// console.log(res.data.cation[i])
						_this.form.selectlist.push(res.data.cation[i]);
					}else{
						res.data.cation[i].switch = false
					}
				}
			})
		},
		methods: {
		}
	}
</script>

<style>
	.el-upload__tip{
		float: right;
		margin-top: 0;
	}
</style>