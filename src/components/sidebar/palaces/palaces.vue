<template>
	<div>
		<el-button type="primary" @click="addpalaces">添加五宫格</el-button>
		<el-button type="primary" @click="delpalaces">删除五宫格</el-button>

		<add-palaces></add-palaces>

		<div class="palaces_list">
			<el-table :data="palaceslist" style="width: 100%" v-loading="loading" @row-click="rowClick">
				<el-table-column align="center" prop="id" label="id" width="180"></el-table-column>
				<el-table-column align="center" prop="title" label="标题" width="180"></el-table-column>
				<el-table-column align="center" prop="icourl" label="图标" width="180">
					<template slot-scope="scope">
						<img :src="scope.row.icourl" alt="" style="width:100px; height: 100px;float: none" >
					</template>
				</el-table-column>
				<el-table-column align="center" prop="cationid" label="父级" width="180"></el-table-column>
			</el-table>
		</div>
		<el-dialog title="删除" :visible.sync="del" width="30%">
			<span>确定删除</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="del = false">取 消</el-button>
				<el-button type="primary" @click="deltrue">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import addPalaces from 'components/sidebar/palaces/addpalaces/addpalaces';
	import Bs from 'common/bus.js';
	export default {
		data() {
			return {
				palaces: true,
				gomenu: false,
				palaceslist: [],
				cationlist: [],
				del: false,
				recaptrue: false,
				loading: false,
				rowId: 0,
				rowurl: ""
			}
		},
		mounted() {
			this.$ajax.get("/ai/cation.php",{
				params: {
					gomenu: this.gomenu
				}
			}).then( (res) => {
				this.cationlist = res.data.cation;
			})

			Bs.$on("recaptrue", (recatrue) => {
				this.recaptrue = recatrue
			})
		},
		methods: {
			addpalaces() {
				Bs.$emit("palaces",this.palaces);
			},
			rowClick(row,event,colimn) {
				
				this.rowId = row.id;
				this.rowurl = row.icourl
			},
			delpalaces() {
				this.del = true;
			},
			deltrue() {
				if(this.rowId != 0){
					this.$ajax.get("/ai/delpalaces.php",{
						params: {
							gomenu: this.gomenu,
							id: this.rowId,
							imgall: this.rowurl,
							ok: 0

						}
					}).then( (res) => {
						if(res.data == 1) {
							this.del = false;
							this.$message({
								message: "删除五宫格成功",
								type: "success"
							});
							this.recaptrue = true;
						}
					})
				}else{
					this.$message("请选择要删除的数据");
					this.del = false;
				}
			}
		},
		watch: {
			"cationlist": function(newval,oloval){
				if(newval){
					this.$ajax.get("/ai/selepalaces.php").then( (res) => {
						if(res.data){
							for(let i = 0; i < res.data.palaces.length; i++){
								
								for(let j = 0; j < this.cationlist.length; j++){
									if(res.data.palaces[i].cationid == this.cationlist[j].id){
										res.data.palaces[i].cationid = this.cationlist[j].title;
									}
								}
							}
							this.palaceslist = res.data.palaces;
						}else{
							console.log("暂无数据")
						}
					})
				}
			},
			"recaptrue": function(newval,oloval) {
				if(newval){
					let _this = this;
					this.$ajax.get("/ai/selepalaces.php").then( (res) => {
						if(res.data){
							for(let i = 0; i < res.data.palaces.length; i++){
								
								for(let j = 0; j < this.cationlist.length; j++){
									if(res.data.palaces[i].cationid == this.cationlist[j].id){
										res.data.palaces[i].cationid = this.cationlist[j].title;
									}
								}
							}
							this.loading = true;
							
							setTimeout(function(){
								_this.palaceslist = res.data.palaces;
								_this.loading = false;
								_this.recaptrue = false;
							},2000)
							
						}else{
							console.log("暂无数据")
						}
					})
				}
			}
		},
		components: {
			addPalaces
		}
	}
</script>

<style>
	.el-upload-list{
/*		float: right;
    	margin-left: 30px;
    	margin-top: 4px*/
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
	.palaces_list{
		margin-top: 30px;
		width: 100%;
	}
</style>