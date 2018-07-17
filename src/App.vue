<template>
  <div id="app">
  
	 <router-view @identity="identity"></router-view>
  </div>
</template>

<script>
import headur from 'components/head/head';
export default {
  name: 'App',
  data() {
  	return {
  	}
  },
  methods: {
  	identity(data) {
  		console.log(data);
  	}
  }
}
</script>

<style>
 #app{
 	font-family: "微软雅黑"
 }
 
</style>
