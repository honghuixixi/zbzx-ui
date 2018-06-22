<template>
  <div id="consulInfo">
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
      <span><span style="cursor: pointer" @click="goBack">当前位置 : 管理平台 /</span><span class="currentTable"> 售后与不良事件详情</span></span>
      <span >
          <span class="search" @click="dialogVisible = true" v-if="list.isDel">撤回</span>
      </span>
    </div>
    <div class="navTitleInfo">
      <span v-if="list.isNews">【已回复】</span><span v-if="!list.isNews">【未回复】</span><span>{{list.title}}</span>
      <span class="tag" v-if="list.type==1">售后服务</span>
      <span class="tag" v-if="list.type==2">质量缺陷</span>
      <span class="tag" v-if="list.type==3">操作使用</span>
      <span class="tag" v-if="list.type==4">产品配置</span>
      <span class="tag" v-if="list.type==5">其它</span>
    </div>
    <div class="titleInfo">
      <span v-if="list.publisher">
        <span>申请人：{{list.publisher}}</span>
        <span class="org">手机号：{{list.phone}}</span>
        <span class="org" v-if="list.email" style="word-break: break-all">邮箱：{{list.email |orgLong}}</span>
        <span style="display: inline-block;width: 20px"></span>
        <span  v-if="list.email">微信号：{{list.wx}}</span><br>
        <span>机构信息：{{list.org | list}}</span>
        <span class="org">部门信息：{{list.deptName | list}}</span>
        <span class="org">提交时间：{{list.publishTime | timeChange}}</span><br>
        <span>产品：{{list.productor | list}}</span>
        <span class="org">厂商：{{list.manufacturer | list}}</span>
      </span>
    </div>
    <div class="infoContent">
      <div class="ql-editor" v-html="list.content"></div>
      <div style="margin-top: 30px" v-if="files.length!=0">附件：<a v-for="l in files" class="fiels" :href="encodeURI(encodeURI('/api/download?path=' + l.uploadUrl))" target="_blank">{{l.fileName+';'}}</a></div>
    </div>
    <div class="comment" v-if="list.replyLimit">
      <textarea  placeholder="请输入回复内容，1000字以内" v-model="content" maxlength="1000"></textarea>
      <span class="announce subcomment" @click="subCommont">回复</span><span class="announce subcomment cancel" @click="goback()">取消并返回</span>
    </div>
    <div class="replay">
      <div class="replayTitle">
        最新回复
      </div>
      <div v-if="replayList.length==0" class="nodata">
        <img src="../assets/images/nores.png" alt="">
        <div>暂无回复</div>
      </div>
      <ul v-if="replayList.length!=0">
        <li class="itemInfo" v-for="l in replayList">
          <span class="replayName">{{l.replyName}}</span>
          <br>
          <span class="replaycont">{{l.content }}</span>
          <br>
          <span class="repalyTime">
            <span class="replayMsg">
               <span>{{l.org | list}}</span>
              <span>发布时间：{{l.replyTime | timeChange}}</span>
            </span>
          </span>
        </li>
      </ul>
    </div>
    <!--分页-->
    <div class="pageInfo" v-if="replayList.length!=0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNo"
        :page-sizes="[8,16,32]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import config from '@/service/config'
  import {getComplaInfo,delectDetailend} from '@/service/api'
  import {getComplacomment} from '@/service/api'
  import {subComplacomment} from '@/service/api'
  import { Message } from 'element-ui';
  import { MessageBox } from 'element-ui';
  export default {
    data(){
      return{
        list:{},
        replayList:[],
        page: {
          pageNo: 1,
          pageSize: 8,
          total: 0
        },
        content:'',
        files:[],
        baseUrl: config.server(process.env.NODE_ENV),
        dialogVisible:false
      }
    },
    methods:{
//      确定删除
      sure(){
        this.dialogVisible = false
        delectDetailend({id:this.$route.query.id}, (data) => {
          this.$message({
            message: '撤回成功！',
            type: 'success'
          });
          this.$router.push({path: '/page/complaint'});
        },(msg,data)=>{
          if(data.code=='d_003'){
            this.$message.warning(msg)
            this.$router.push({path: '/page/complaint'});
          }
        })
      },
      goBack(){
        this.$router.push({path: '/page/complaint'});
      },
//      获取投诉与不良事件详情
      getComplaInfo() {
        let param = {
          id:this.$route.query.id
        }
        getComplaInfo(param, (data) => {
          this.list = data
          this.files = JSON.parse(this.list.url)
        },(msg,data)=>{
          if(data.code=='d_003'){
            this.$message.warning(msg)
            this.$router.push({path: '/page/complaint'});
          }
        })
      },
//      获取投诉与不良事件回复
      getComplacomment (index) {
        let param = {
          id:this.$route.query.id,
          pageNo: index,
          pageSize: this.page.pageSize
        }
        getComplacomment(param, (data) => {
          this.page.pageNo = index
          this.page.total = data.total
          this.replayList = data.records
          this.canDel =data.canDel
        })
      },
//      提交投诉与不良事件
      subCommont(){
        if(this.content){
          let param = {
            id:this.$route.query.id,
            content:this.content
          }
          subComplacomment(param, (data) => {
//          成功之后再掉回复接口，并且提示
            this.$message({
              message: '回复成功！',
              type: 'success'
            });
            //this.getComplacomment(1)
            this.$router.go(0)
          },(msg,data)=>{
            if(data.code=='d_003'){
              this.$message.warning(msg)
              this.$router.push({path: '/page/complaint'});
            }
          })
        }
      },
      //      分页方法
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.page.pageSize = val
        this.getComplacomment(1)
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.getComplacomment(val)
      },
//      返回事件
      goback(){
        this.$router.push({path: '/page/complaint'});
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.getElementById('consulInfo').style.minHeight = (document.body.clientHeight - 416) + 'px'
        this.getComplaInfo()
        this.getComplacomment(1)
      })
    },
    watch:{
      content:function(newv,oldv){
        this.content = this.content.replace(/^\s*/g, "")
      }
    }
  }
</script>
<style scoped>
  input{
    width: 230px;
  }
  .org{
    margin-left: 20px;
  }
  .infoContent{
    padding: 25px;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .comment{
    padding: 25px;
    height: 265px;
  }
  textarea{
    resize: none;
    height: 175px;
    width:907px;
    padding: 10px;
    font-size: 16px;
  }
  .subcomment{
    float: right;
    margin-top: 30px;
  }
  .replayTitle{
    height: 45px;
    background: #f4fafa;
    font-size: 18px;
    line-height: 45px;
  }
  .itemInfo{
    padding: 25px 20px;
    border-bottom: 1px solid #dcdcdc;
  }
  .replaycont{
    font-weight: bold;
    margin-top: 15px;
    display: inline-block;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .repalyTime{
    font-size: 14px;
    color: #999;
    margin-top: 15px;
    display: inline-block;
    width: 940px;
  }
  .replayMsg{
    float: left;
  }
  .replayMsg + span{
    float: right;
    cursor: pointer;
  }
  .replayMsg + span img{
    vertical-align: middle;
  }
  .replayMsg span{
    margin-right: 25px;
  }
  .titleInfo{
    height: 85px;
    padding: 25px;
    line-height: 30px;
  }
  .cancel{
    background: #fff;
    color: #555;
    border: 1px solid #e5e5e5;
  }
  .cancel:hover{
    color: #007cb5;
    border: 1px solid #007cb5;
  }
  .fiels{
    color: #007cb5;
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
  }
</style>
