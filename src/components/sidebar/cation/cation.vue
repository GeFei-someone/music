<template>
	<div>
		<el-button type="primary" @click="addcation">添加分类</el-button>
		<el-button type="primary" @click="opendel">删除分类</el-button>
		<el-button type="primary" :disabled="disabled"  @click="editcation">编辑分类</el-button>

		<cation-view @recap="recapdata"></cation-view>
		<cation-edit :id="id"></cation-edit>
		<el-table v-if="cationlist" @row-click="openRowlist" :data="cationlist" style="width: 100%"  v-loading="loading" element-loading-text="拼命加载中" highlight-current-row @current-change="rowclick">
			<el-table-column align="left"  prop="id" label="ID" width="300"></el-table-column>
			<el-table-column align="left"  prop="title" label="分类名称" width="300"></el-table-column>
			<el-table-column align="left"  prop="switch" label="分类可见" width="100"></el-table-column>
			<el-table-column align="left"  prop="edition" label="URL" width="100"></el-table-column>
			<el-table-column align="left"  prop="region" label="区域" width="180"></el-table-column>
		</el-table>
		<el-dialog title="删除" :visible.sync="del" width="30%">
			<span>确定删除</span>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="del = false">取 消</el-button>
			    <el-button type="primary" @click="delcation">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Bs from 'common/bus.js';
	import cationView from 'components/sidebar/cation/addcation/addcation';
	import cationEdit from 'components/sidebar/cation/editcation/editcation';
	export default {
		data() {
			return {
				addcationdata: true,
				gomenu: false,
				cationlist: [],
				recaptrue: false,
				loading: false,
				switchId: null,
				del: false,
				id: "",
				editcationtrue: true,
				disabled: true

			}
		},
		mounted(){
			this.$ajax.get('/ai/cation.php',{
				params: {
					gomenu: this.gomenu
				}
			}).then( (res) => {
				this.cationlist = res.data.cation;
			})

		},
		methods: {
			addcation() {
				Bs.$emit('cation',this.addcationdata);
			},
			recapdata(recap) {
				this.recaptrue = recap;
			},
			rowclick(row){
				if(row){
					this.switchId = row.id
				}else{
					this.switchId = null;
				}
			},
			opendel() {
				this.del = true;
			},
			editcation() {
				Bs.$emit('editcationtrue',this.addcationdata);
			},
			openRowlist(row) {
				this.id = row.id;
				this.disabled = false
			},
			delcation(){
				this.$ajax.get('/ai/delcation.php',{
					params: {
						gomenu: this.gomenu,
						switchId: this.switchId
					}
				}).then( (res) => {
					if(res.data == 1){
						this.del = false;
						this.recaptrue = true;

					}
				})
			}
		},
		watch: {
			recaptrue: function(newval,oloval){
				let _this = this;
				if(newval){
					this.loading = true
					
					this.$ajax.get('/ai/cation.php',{
						params: {
							gomenu: this.gomenu
						}
					}).then( (res) => {
						if(res.data.cation){
							setTimeout(function(){
								_this.loading = false;
								_this.recaptrue = null;
								_this.cationlist = res.data.cation;
							},300)
							console.log(_this.cationlist);
						}
					})
				}
			}
		},
		components: {
			cationView,
			cationEdit
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
</style>