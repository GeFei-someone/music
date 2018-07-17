//全局注册组件
import sidebar from './sidebar.vue';
import addMenu from './addmenu/addmenu.vue';
import addComm from './comm/comm.vue';
import cation from './cation/cation.vue';
import layout from './layout/layout.vue';
import palaces from './palaces/palaces.vue';



function plugin(Vue){
	if(plugin.installed) {
		return;
	}

	Vue.component('sidebar',sidebar);
	Vue.component('addmenu',addMenu);
	Vue.component('comm',addComm);
	Vue.component('cation',cation);
	Vue.component('palaces',palaces);
	
}

export default plugin;