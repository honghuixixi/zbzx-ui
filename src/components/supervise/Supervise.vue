<template>
  <div class="app_content" style="width:100%;min-width:1360px;">
    <MyHead :user="user" :supervise="false"/>
  	<router-view></router-view>
   </div>
</template>

<script>
  import MyHead from '@/components/Head'

	export default{
    data() {
      return {
        height: document.body.clientHeight,
        user: JSON.parse(localStorage.getItem('userInfo'))
      };
    },
    components: { MyHead },
    beforeRouteLeave (to, from, next) {
      this.$data.user = JSON.parse(localStorage.getItem('userInfo'))
      next()
    }
	}
</script>