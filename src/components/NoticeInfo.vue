<template>
	<div id="minheight">
    <!--弹窗-->
    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="dialogVisible">
      <span>撤回后不可恢复，确定撤回吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sure()">确 定</el-button>
  </span>
    </el-dialog>
    <!--弹窗end-->
    <div class="title">
      <span><span style="cursor: pointer" @click="goBack">当前位置 : 管理平台 /</span><span class="currentTable"> 通知详情</span></span>
      <span>
        <span class="search" @click="goEdit()" v-if="list.isEdit">编辑</span>
        <span class="search" @click="delect()" v-if="list.isEdit">撤回</span>
      </span>
    </div>
    <div class="navTitleInfo"><span v-if="list.isNews">【最新发布】</span><span>{{list.title}}</span></div>
    <div class="titleInfo">
      <span v-if="list.publisher"><span class="orgoverflow">发布人：{{list.publisher}}</span><span class="notice-org orgoverflow">{{list.org}}</span></span>
      <span class="notice-org orgoverflow">更新时间：{{list.publishTime | timeChange}}</span>
    </div>
    <div class="infoContent">
      <div class="infoContent-div ql-editor" v-html="list.content"></div>
      <div style="margin-top: 30px" v-if="files.length!=0">附件：<a v-for="l in files" class="fiels" :href="encodeURI(encodeURI('/api/download?path=' + l.uploadUrl))" target="_blank">{{l.fileName+';'}}</a></div>
    </div>
  </div>
</template>

<script>
  import {getNoticeInfo,delectDetail} from '@/service/api'
  import config from '@/service/config'
	export default {
    data(){
      return{
        list:{},
        height:0,
        files:[],
        baseUrl: config.server(process.env.NODE_ENV),
        dialogVisible:false
      }
    },
    methods:{
      goBack(){
        this.$router.push({path: '/page/notice'});
      },
      getNoticeInfo() {
        let param = {
          id:this.$route.query.id
        }
        getNoticeInfo(param, (data) => {
          this.list = data
          this.files = JSON.parse(this.list.url)
          },(msg,data)=>{
          if(data.code=='d_003'){
            this.$message.warning(msg)
            this.$router.push({path: '/page/notice'});
          }
        })
        },
//      编辑
      goEdit(){
        this.$router.push({path: '/page/writenotice',query:{id:this.$route.query.id}});
      },
//      删除
      delect(){
        this.dialogVisible = true

      },
      sure(){
        delectDetail({id:this.$route.query.id}, (data) => {
          this.$message({
            message: '撤回成功！',
            type: 'success'
          });
          this.$router.push({path: '/page/notice'});
        },(msg,data)=>{
          if(data.code=='d_003'){
            this.$message.warning(msg)
            this.$router.push({path: '/page/notice'});
          }
        })
      },
    },
	  mounted () {
	    this.$nextTick(() => {
        document.getElementById('minheight').style.minHeight = (document.body.clientHeight - 416)+'px'
        this.getNoticeInfo()
	    })
	  }
	}
</script>
<style scoped>
  .notice-org{
    margin-left: 20px;
  }
  .infoContent{
    padding: 25px;
    word-break: break-all;
    white-space: pre-wrap;
    overflow: hidden;
  }
</style>
