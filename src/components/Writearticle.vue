<template>
  <div>
    <publish-template @sub="sub" @edit="edit" @noexit="noexit" :uri="'/page/article'" @goback="goBack">
      <span slot="slot1"> {{title}}</span>
      <span slot="slot2"> {{title}}</span>
      <span slot="slot3"> 发布资料</span>
    </publish-template>
  </div>
</template>
<script>
  import PublishTemplate from '@/components/Publishtemplate'
  import {publishArticle,editArticle} from '@/service/api'
  export default{
    data() {
      return {
        id: 0,
        title: "发布资料",
        isSave: true
      }
    },
    components: {
      PublishTemplate
    },
    methods: {
      noexit(){
        // console.log('我被触发了')
        this.$router.push({path: '/page/article'})
      },
      goBack(){
        this.$router.go(-1);
      },
      // 提交事件
      sub(param){
        if(this.isSave){
          this.isSave = false;
          publishArticle(param, (data) => {
            this.isSave = true;
            this.$router.push({path: '/page/article'});
          },(msg,data)=>{
            this.isSave = true;
            if(data.code=='d_003'){
              this.$message.warning(msg)
               this.$router.push({path: '/page/article'});
            }
          })
        }
      },
      // 编辑
      edit(param){
        if(this.isSave){
          this.isSave = false;
          editArticle(param, (data) => {
            this.isSave = true;
            this.$router.push({path: '/page/article'});
          },(msg,data)=>{
            this.isSave = true;
            if(data.code=='d_003'){
              this.$message.warning(msg)
              this.$router.push({path: '/page/article'});
            }
          })
        }
      }
    },
  mounted () {
    this.$nextTick(() => {
      // 获取参数
      this.id = this.$route.query.id
      if(this.id > 0){
        this.title = "编辑资料"
      }
    })
  }
  }
</script>
<style scoped>
</style>
