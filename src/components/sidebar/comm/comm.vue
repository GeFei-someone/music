<template>
	<div class="comm">
		<el-button style="float:left;" type="primary" @click="addcomm('commpushtrue')">添加商品</el-button>
		<add-comm @recaptrue="recapdata"></add-comm>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item>
				<el-input v-model="search" style="margin-left: 30px" placeholder="搜索"></el-input>
			</el-form-item>
		</el-form>
		<!-- 商品列表 -->
		<div class="commlist">
				<el-table :data="list" border style="width: 100%" v-loading="loading">
					<el-table-column align="center" type="index" :index="indexMethod" width="60" label=" "></el-table-column>
					<el-table-column  align="center" prop="imgurl" width="180" label="商品图片">
						 <template slot-scope="scope">
					      <img  :src="scope.row.imgurl" alt="" style="width: 100px;height: 100px;margin: 0 auto;float: none">
					    </template>
					</el-table-column>
					<el-table-column  align="center" prop="title" width="130" label="商品名称"></el-table-column>
					<el-table-column  align="center" prop="cationid" width="60" label="商品分类"></el-table-column>
					<el-table-column  align="center" prop="region" width="70" label="商品区域"></el-table-column>
					<el-table-column  align="center" prop="original" width="60" label="商品原价"></el-table-column>
					<el-table-column  align="center" prop="Present" width="60" label="商品现价"></el-table-column>
					<el-table-column  align="center" prop="color" width="233" label="商品颜色"></el-table-column>
					<el-table-column  align="center" width="180" label="操作">
						<template slot-scope="scope">
							<el-button @click="edit(scope.row.id)" size="mini">编辑</el-button>
							<el-button size="mini" @click="commdel(scope.row.id)" type="danger">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog title="删除" :visible.sync="del" width="30%">
					<span>确定删除</span>
					<span slot="footer" class="dialog-footer">
					    <el-button @click="del = false">取 消</el-button>
					    <el-button type="primary" @click="deltrue">确 定</el-button>
					</span>
				</el-dialog>
			</div>
			<updata-edit @recaptrue="recapdata"></updata-edit>
		</div>
	</div>
</template>

<script>
	import Bs from 'common/bus.js';
	import addComm from 'components/sidebar/comm/addcomm/addcomm';
	import updataEdit from 'components/sidebar/comm/editdialogcomm/editdialogcomm'
	export default {
		data() {
			return {
				commpush: true,
				commlistall: [],
				commlist: [],
				del: false,
				listid: null,
				gomenu: false,
				search: "",
				loading: false,
				editdata: true,
				recaptrue: false,
				cationlist: [],
			}
		},
		mounted() {
			let _this = this;
			this.data();
		},
		computed: {
			list: function(){
				let _this = this;
				let arr = [];
				for(let i = 0; i < _this.commlistall.length; i++){
					if(_this.commlistall[i].title.search(_this.search) != -1){
						_this.loading = true;
						setTimeout(function(){
							arr.push(_this.commlistall[i]);
							_this.loading = false;
						},1000)
					}
				}
				return arr;
			}
		},
		methods: {
			data() {
				let _this = this;
				_this.$ajax.get("/ai/millet/cation.php",{
					params: {
						gomenu: _this.gomenu
					}
				}).then( (res)=> {
					_this.cationlist = res.data.cation;
				})
				_this.$ajax.get("/ai/millet/selecomm.php").then( (res)=> {
					for(let i = 0; i < res.data.comm.length; i++){
						for(let j = 0; j < _this.cationlist.length; j++){
							if(res.data.comm[i].cationid == _this.cationlist[j].id){
								res.data.comm[i].cationid = _this.cationlist[j].title;
								let regionarr = _this.cationlist[j].region.split(',');
								for(let h = 0; h < regionarr.length; h++){
									if(res.data.comm[i].region == h){
										res.data.comm[i].region = regionarr[h];
									}
								}
							}
						}
					}
					_this.commlistall = res.data.comm;
					
				})
			},
			addcomm(data) {
				
				Bs.$emit(data,this.commpush);
			},
			indexMethod(index) {
				return index + 1;
			},
			commdel(id){
				this.listid = id;
				this.del = true;
			},
			edit(id) {
				Bs.$emit("edit",this.editdata);
				Bs.$emit("id",id)
			},
			deltrue(){
				let _this = this;
				let imgall;	//图片
				// 获取图片名字
				for(let i = 0; i < _this.commlist.length; i++){
					if(_this.commlist[i].id == _this.listid){
						// console.log(_this.commlist[i]);
						let cimg = _this.commlist[i].colorimg.split(',');
						let uimg = ".." + _this.commlist[i].imgurl.slice(3,_this.commlist[i].imgurl.length);
						let parimg = _this.commlist[i].productimg.split(',');
						let parimgal = [];
						let cimgal = [];
						for(let j = 0; j < parimg.length; j++){
							let parimglength = parimg[j].length;
							parimgal.push(parimg[j].slice(1,parimglength-1));
						}
						for(let h = 0; h < cimg.length; h++){
							let cimglength = cimg[h].length;
							cimgal.push(cimg[h].slice(1,cimglength-1));
						}
						imgall = parimgal.concat(uimg,cimgal);
					}	
				}
				_this.$ajax.get("/ai/millet/delcomm.php",
						{
							params: {
								gomenu: _this.gomenu,
								id: _this.listid,
								imgall: imgall
							}
						}
					).then( (res) => {
						console.log(res);
					if(res.data == 1){
						_this.del = false;
						_this.recaptrue = true
					}
				})
			},
			recapdata(data) {
				this.recaptrue = data;
			}
		},
		watch: {
			"recaptrue": function(newval,oloval){
				let _this = this;
				if(newval){
					this.loading = true
					
					this.$ajax.get('/ai/millet/selecomm.php',{
						params: {
							gomenu: this.gomenu
						}
					}).then( (res) => {
						_this.$ajax.get("/ai/millet/cation.php",{
							params: {
								gomenu: _this.gomenu
							}
						}).then( (res)=> {
							_this.cationlist = res.data.cation;
						})
						for(let i = 0; i < res.data.comm.length; i++){
							for(let j = 0; j < _this.cationlist.length; j++){
								if(res.data.comm[i].cationid == _this.cationlist[j].id){
									res.data.comm[i].cationid = _this.cationlist[j].title;
									let regionarr = _this.cationlist[j].region.split(',');
									for(let h = 0; h < regionarr.length; h++){
										if(res.data.comm[i].region == h){
											res.data.comm[i].region = regionarr[h];
										}
									}
								}
							}
						}
						_this.commlistall = res.data.comm;
						if(res.data.comm){
							setTimeout(function(){
								_this.loading = false;
								_this.recaptrue = null;
							},300)
						}
						
					})
				}
			}
		},
		components: {
			addComm,
			updataEdit
		}
	}
</script>

<style scoped lang="sass">
	.comm
		width: 100%;
		.commlist
			width: 100%;
			margin-top: 30px;
		
</style>