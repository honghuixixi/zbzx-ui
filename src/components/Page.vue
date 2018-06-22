<template>
  <div class="app_content">
    <MyHead :user="user" :supervise="true"/>
    <img v-bind:src="require('../assets/images/background.png')" alt="" style="margin-top: 15px">
  	<router-view></router-view>

   </div>
</template>

<script>
  import MyHead from '@/components/Head'

	export default{
    data() {
      return {
        user: JSON.parse(localStorage.getItem('userInfo'))
      };
    },
    components: {
      MyHead

    },
     // beforeRouteUpdate (to, from, next) {
     //  console.log("page uuuuuuuuuuu")
     //  this.$data.user = JSON.parse(localStorage.getItem('userInfo'))
     //  console.log(this.$data.user)
     //  next()
     // },
     beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // console.log("page llllllllllll")
      // console.log(this)
      this.$data.user = JSON.parse(localStorage.getItem('userInfo'))
      // console.log(this.$data.user)
      next()
  }
	}
</script>
<style scope>
  .app_content{

  }
</style>
