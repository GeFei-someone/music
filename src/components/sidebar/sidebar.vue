<template>
	<el-main style="{ height: sideHeight+'px'}">
		<el-breadcrumb v-if="menunavtitle">
			<el-breadcrumb-item v-for="(itemtitle,index) in menunavtitle" :key="index">{{ itemtitle }}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="content">
			<component :is="componentax"></component>
		</div>
</el-main>
</template>

<script>
import Bus from 'common/bus';
// import comm from 'components/sidebar/comm/comm';
// import addmenu from 'components/sidebar/addmenu/addmenu';
export default {
	data() {
		return {
			menulicontent: [],
			menunavtitle: [],
			menuconttrue: false,
			sondialog: true,
			current: [],
			index: 1,
			colus: []
			}
		},
		props: ['menulistid','componentax'],
		mounted() {
			var _this = this;
			this.$ajax.get("/ai/parantselect.php").then( (res) => {
				this.colus = res.data.coluse;
			})

		},
		methods: {
			
		},
		watch: {
			"menulistid": function(newValue,oloValue){
				// console.log(newValue.fid)
				let _this = this;
				let coluse = _this.colus;
				let colutitle = [];
				if(newValue != null){
					_this.menunavtitle = [];
					for(let i = 0; i < coluse.length; i++){
						if(coluse[i].fid == newValue.fid){
							// console.log(coluse[i])
							_this.menunavtitle.push(coluse[i].name)
							for(let j = 0; j < coluse[i].coluMenu.length; j++){
								if(coluse[i].coluMenu[j].id == newValue.meindex){
									_this.menunavtitle.push(coluse[i].coluMenu[j].menutitle)
									for(let h = 0; h < coluse[i].coluMenu[j].sonmenu.length; h++){
										if(coluse[i].coluMenu[j].sonmenu[h].ID == newValue.sonindex){
											_this.menunavtitle.push(coluse[i].coluMenu[j].sonmenu[h].name);
										}
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
	.el-main{
		padding-right: 0;
		background: #eef2f5;
	}
	.el-breadcrumb {
		font-size: 10px;
	}
	.content{
		width: 98%;
		/*height: 300px;*/
		margin-top: 20px;
		padding: 10px;
		background: #ffffff;
	}
	</style>