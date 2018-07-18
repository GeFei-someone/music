import Vue from 'vue';
import Router from 'vue-router';
import home from 'components/home/home';
import login from 'components/login/login';
import syst from 'components/system/system';

Vue.use(Router)

export default new Router({
	routes: [
	    {
			path: '/',
			name: 'login',
			component: login
	    },
	    {
		    path: '/home',
		    name: 'home',
		    component: home
	    },
	    {
	    	path: '/syst',
	    	name: 'syst',
	    	component: syst
	    }
	]
})
