<template>
	<div>
		<el-button type="primary" @click="addmenu('todialog')">添加主菜单</el-button>
		<el-button type="primary" :disabled="todisabled" @click="addmenu('dialogVisible')">添加二级菜单</el-button>
		<el-button type="success" :disabled="sondisabled" @click="addmenu('sondialog')">添加子菜单</el-button>
		<el-button type="info" style="float:right;" :disabled="eidtdisabled" @click="addmenu('editdialog')">编辑</el-button>
		<el-button type="danger" style="float:right;" :disabled="eidtdisabled" @click="delmenu">删除</el-button>

		<go-dialog></go-dialog>
		<son-dialog></son-dialog>
		<to-dialog></to-dialog>
		<edit-dialog></edit-dialog>

		<div class="paramlist">
			<div class="param_tree">
				<div class="param_head">
					<ul>
						<li class="param_head_list"></li>
						<li class="param_head_list">菜单名称</li>
						<li class="param_head_list">URL</li>
						<li class="param_head_list">图标</li>
						<li class="param_head_list">启用</li>
						<li class="param_head_list">ID</li>
					</ul>
				</div>
				<ul class="param_list" >

					<li v-for="(menuitem,menuindex) in menulicontentall" :key="menuitem.fid">
						<div class="colucontent" :class="[menuindex == paraindex ? 'activeindex' : '' ]"  @click="parammenu(menuindex,menuitem.fid)">
							<span class="serial">{{menuindex}}</span>
							<span >{{ menuitem.name }}</span>
							<span >{{ menuitem.to }}</span>
							<span>{{ menuitem.icourl }}</span>
							<span>{{ menuitem.fso }}</span>
							<span >{{ menuitem.fid }}</span>
						</div>
						<div>
							<ul>
								<li v-for="(columenuitem,columeindex) in menuitem.coluMenu" :key="columenuitem.id">
									<div class="colucontent soncolumenu" :class="[columenuitem.id == activeindex  ? 'activeindex' : '' ]" @click="soncolumenu(menuitem.fid,columenuitem.id)">
										<span class="serial">{{ menuindex }} - {{ columeindex }}</span>
										<span>{{ columenuitem.menutitle }}</span>
										<span>{{ columenuitem.router }}</span>
										<span>{{ columenuitem.icourl }}</span>
										<span>{{ columenuitem.so}}</span>
										<span>{{ columenuitem.id }}</span>
									</div>
									<div>
										<ul>
											<li v-for="(sonmenuitem,sonindex) in columenuitem.sonmenu" :key="sonmenuitem.ID">

												<div class="colucontent sonbuttonmenu" :class="[sonmenuitem.ID == sonactiveindex ? 'activeindex' : '']" @click="sonmenuactive(sonmenuitem.ID)">
													<span class="serial">{{ menuindex }} - {{ columeindex }} - {{ sonindex }}</span>
													<span>{{ sonmenuitem.name }}</span>
													<span>{{ sonmenuitem.router}}</span>
													<span>{{ sonmenuitem.icourl }}</span>
													<span>{{ sonmenuitem.menuswitch }}</span>
													<span>{{ sonmenuitem.ID }}</span>
												</div>


											</li>
										</ul>
									</div>
								</li>
							</ul>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import Bus from 'common/bus';
import goDialog from 'components/sidebar/addmenu/godialog/godialog';
import sonDialog from 'components/sidebar/addmenu/sondialog/sondialog';
import toDialog from 'components/sidebar/addmenu/todialog/todialog';
import editDialog from 'components/sidebar/addmenu/editdialog/editdialog';

export default {
	data() {
		return {
			menulicontentall: [],
			dialogVisible: true,
			activeindex: null,
			sonactiveindex: null,
			todisabled: true,
			sondisabled: true,
			eidtdisabled: true,
			deldisabled: true,
			paraindex: null,
			fid: null,
			activefid: null,
			active: false,
			setup: 0,
			parid: 0,
			gomenu: true,
			switchtrue: "不可见"

		}
	},
	mounted() {
		let _this = this;
				//获取栏目
		_this.$ajax.get("/ai/parantselect.php").then((res) => {
			_this.menulicontentall = res.data.coluse
			for(let i = 0; i < res.data.coluse.length; i++){
				if(res.data.coluse[i].coluMenu){
					for(let j = 0; j < res.data.coluse[i].coluMenu.length; j++){
						let icourl = res.data.coluse[i].coluMenu[j].icourl; //截取ico名
						let icosplist = icourl.split('.')[2].split('/')[2];
						_this.menulicontentall[i].coluMenu[j].icourl = icosplist;

						//改变状态
						if(_this.menulicontentall[i].coluMenu[j].so == 1){
							_this.menulicontentall[i].coluMenu[j].so = "可见"
						}else{
							_this.menulicontentall[i].coluMenu[j].so = "不可见"
						}


					}
				}
				//改变状态
				if(_this.menulicontentall[i].fso == 1){
					_this.menulicontentall[i].fso = "可见"
				}else{
					_this.menulicontentall[i].fso = "不可见"
				}
			}

		})
	},
	methods: {
		addmenu(name) {
			Bus.$emit(name,this.dialogVisible);
			Bus.$emit("menuid",this.fid);
			Bus.$emit("newID",this.activeindex);
			Bus.$emit("setup",this.setup);
			Bus.$emit("parid",this.parid);
			Bus.$emit("psonid",this.sonactiveindex);
		},
		soncolumenu(fid,id) {
			this.activeindex = id;
			this.paraindex = null;
			this.sonactiveindex = null;
			this.sondisabled = false;
			this.todisabled = true;
			this.eidtdisabled = false;
			this.fid = id;
			this.parid = fid;
			// console.log(fid);
			this.setup = 2;
			//传参数
		},
		parammenu(index,id) {
			this.fid = id;
			this.paraindex = index;
			this.activeindex = null;
			this.sonactiveindex = null;
			this.todisabled = false;
			this.sondisabled = true;
			this.eidtdisabled = false;
			this.setup = 1;
			this.parid = id;
		},
		delmenu(){	//删除
			// console.log(this.activeindex)
			// 删除子
			let _this = this;
			if(this.activeindex){
				console.log(2)
				let sondata = 1;
				this.$ajax.get('/ai/delmenu.php',
					{
						params: {
							gomenu: _this.gomenu,
							son: sondata,
							id: _this.activeindex
						}
					}
				).then((res) => {
					if(res.data == 1){
						_this.$message({
							message: '删除成功',
							type: 'success'
						});
					}
				})

			}else if(this.sonactiveindex){
				let sondata = 3;
				this.$ajax.get('/ai/delmenu.php',
						{
							params: {
								gomenu: _this.gomenu,
								son: sondata,
								id: _this.sonactiveindex
							}
						}
					).then( (res) => {
						if(res.data == 1){
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
						}
				})
			}else{
				let sondata = 0;
				this.$ajax.get('/ai/delmenu.php',
						{
							params: {
								gomenu: _this.gomenu,
								son: sondata,
								id: _this.parid
							}
						}
					).then( (res) => {
						if(res.data == 1){
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
						}
				})
			}

		},
		// 子菜单
		sonmenuactive(ID) {
			this.sonactiveindex = ID;
			this.activeindex = null;
			this.paraindex = null;
			this.eidtdisabled = false;
			this.sondisabled = true;
			this.setup = 3;
		}
	},
	components: {
		goDialog,
		toDialog,
		sonDialog,
		editDialog
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
	.param_tree{
		width: 100%;
		margin-top: 30px;
	}
	.param_head{
		width: 100%;
		height: 30px;
		border: 1px solid #eee;
	}
	.param_head ul{
		display: flex;
		overflow: hidden;
	}
	.param_list{
		width: 100%;
		border: 1px solid #eee;
		border-top: 0 none;
		border-bottom: 0 none;
	}
	.activeindex{
		background: #eee;
	}
	.param_list li{
		/*padding: 20px 40px;*/

	}
	.param_head .param_head_list{
		flex: auto;
		font-size: 14px;
		height: 30px;
		line-height: 30px;
		border-right: 1px solid #eee;
		text-align: center;
	}
	.param_head .param_head_list:first-of-type{
		flex: 0 0 70px;
	}
	.param_head .param_head_list:nth-of-type(2){
		flex: 0 0 245px;
	}
	.param_head .param_head_list:nth-of-type(3){
		flex: 0 0 218px;
	}
	.param_head .param_head_list:nth-of-type(4){
		flex: 0 0 217px;
	}
	.param_head .param_head_list:nth-of-type(5){
		flex: 0 0 218px;
	}
	.param_head .param_head_list:last-of-type{
		border-right: 0 none;
	}
	.colucontent .serial{
		float: left;
		border-bottom: 1px solid #eee;
		text-align: right;
		line-height: 30px;
		padding-right: 5px;
	}
	.serial:last-of-type{
		border-bottom: 0 none;
	}
	.colucontent{
		/*float: left;*/
		display: flex;
	}

	.colucontent span{
		flex: auto;
		text-align: center;
		height: 30px;
		line-height: 30px;
		border-right: 1px solid #eee;
	}
	.colucontent span:first-of-type{
		flex: 0 0 65px;
		/*text-align: left;*/
	}
	.colucontent span:nth-of-type(2){
		flex: 0 0 215px;
		text-align: left;
		padding-left: 30px;
		line-height: 30px;
		border-bottom: 1px solid #eee;
	}
	.colucontent span:nth-of-type(3){
		flex:  0 0 218px;
		border-bottom: 1px solid #eee;
	}
	.colucontent span:nth-of-type(4){
		flex:  0 0 217px;
		border-bottom: 1px solid #eee;
	}
	.colucontent span:nth-of-type(5){
		flex:  0 0 218px;
		border-bottom: 1px solid #eee;
	}
	.colucontent span:nth-of-type(6){
		flex:  auto;
		border-bottom: 1px solid #eee;
		border-right: 0 none;
	}
	.soncolumenu span:nth-of-type(2){
		padding-left: 80px;
		flex: 0 0 165px;
	}
	.sonbuttonmenu span:nth-of-type(2){
		padding-left: 120px;
		flex: 0 0 125px;
	}
	.el-dialog__body{
		padding: 30px 20px 0 20px;
	}

	.el-button:focus, .el-button:hover{
		background: #66b1ff;
		color: #ffffff;
	}
	.el-button--success:focus, .el-button--success:hover{
		background: #85ce61;
		color: #ffffff;
	}
	.paramlist{
		width: 100%;
	}
</style>