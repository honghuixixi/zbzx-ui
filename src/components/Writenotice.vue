<template>
  <div>
    <publish-template @sub="sub" @edit="edit" @noexit="noexit" :uri="'/page/notice'" @goback="goBack">
      <span slot="slot1"> {{title}}</span>
      <span slot="slot2"> {{title}}</span>
      <span slot="slot3"> 发布通知</span>
    </publish-template>
  </div>
</template>
<script>
  import PublishTemplate from '@/components/Publishtemplate'
  import {publishNotice, editNotice} from '@/service/api'
  export default{
    data() {
      return {
        id: 0,
        title: "发布通知",
        isSave: true
      }
    },
    components: {
      PublishTemplate
    },
    methods: {
      noexit(){
        // console.log('我被触发了')
        this.$router.push({path: '/page/notice'});
      },
      goBack(){
        this.$router.go(-1);
      },
      // 发布通知
      sub(param){
        if(this.isSave){
          this.isSave = false;
          publishNotice(param, (data) => {
            this.isSave = true;
            this.$router.push({path: '/page/notice'});
          },(msg,data)=>{
            this.isSave = true;
            if(data.code=='d_003'){
              this.$message.warning(msg)
              this.$router.push({path: '/page/notice'});
            }
          })
        }
      },
      // 编辑通知
      edit(param){
        if(this.isSave){
          this.isSave = false;
          editNotice(param, (data) => {
            this.isSave = true;
            this.$router.push({path: '/page/notice'});
          },(msg,data)=>{
            this.isSave = true;
            if(data.code=='d_003'){
              this.$message.warning(msg)
              this.$router.push({path: '/page/notice'});
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
          this.title = "编辑通知"
        }
      })
    }
  }
</script>
<style scoped>
</style>
