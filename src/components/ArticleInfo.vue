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
      <span><span style="cursor: pointer" @click="goBack">当前位置 : 管理平台 /</span><span class="currentTable"> 资料详情</span></span>
      <span>
         <span class="search" @click="goEdit()" v-if="list.isEdit">编辑</span>
        <span class="search" @click="delect()" v-if="list.isEdit">撤回</span>
      </span>
    </div>
    <div class="navTitleInfo"><span v-if="list.isNews">【最新发布】</span><span>{{list.title}}</span></div>
    <div class="titleInfo">
      <span v-if="list.publisher"><span class="orgoverflow">发布人：{{list.publisher}}</span><span class="org orgoverflow">{{list.org}}</span></span>
      <span class="org orgoverflow">更新时间：{{list.publishTime | timeChange}}</span>
    </div>
    <div class="infoContent">
      <!-- <div>
        {{list.content}}
      </div> -->
      <div class="infoContent-div ql-editor" v-html="list.content"></div>
      <div style="margin-top: 30px" v-if="files.length!=0">附件：<a v-for="l in files" class="fiels" :href="encodeURI(encodeURI('/api/download?path=' + l.uploadUrl))" target="_blank">{{l.fileName+';'}}</a></div>
    </div>
    <div class="comment" >
      <textarea  placeholder="请输入回复内容，1000字以内" v-model="content" maxlength="1000"></textarea>
      <span class="announce subcomment" @click="subCommont">发表我的看法</span>
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
               <span>{{l.org}}</span>
              <span>发布时间：{{l.replyTime | timeChange}}</span>
            </span>
            <span v-if="canDel" @click="delcomment(l.id)">
              <img src="../assets/images/del.png" alt="">
              <span>删除</span>
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
  import {getArticleInfo,delectDetail} from '@/service/api'
  import {getArticlecomment} from '@/service/api'
  import {subArticlecomment} from '@/service/api'
  import {delArticlecomment} from '@/service/api'
  import { Message } from 'element-ui';
  import { MessageBox } from 'element-ui';
  import config from '@/service/config'
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
        files:[],
        content:'',
        canDel:'',
        baseUrl: config.server(process.env.NODE_ENV),
        dialogVisible:false
      }
    },
    methods:{
      goBack(){
        this.$router.push({path: '/page/article'});
      },
//      获取资料详情
      getArticleInfo() {
        let param = {
         id:this.$route.query.id
        }
        getArticleInfo(param, (data) => {
          this.list = data
        this.files = JSON.parse(this.list.url)
        },(msg,data)=>{
          if(data.code=='d_003'){
            Message({
              message: msg,
              type: 'error'
            })
            this.$router.push({path: '/page/article'});
          }
        })
      },
//      获取资料回复
      getArticlecomment (index) {
        let param = {
          id:this.$route.query.id,
          pageNo: index,
          pageSize: this.page.pageSize
        }
        getArticlecomment(param, (data) => {
          this.page.index = index
          this.page.total = data.total
          this.replayList = data.records
          this.canDel = data.canDel
        },(msg,data)=>{
          if(data.code=='d_003'){
            Message({
              message: msg,
              type: 'error'
            })
            this.$router.push({path: '/page/article'});
          }
        })
      },
//      提交评论
      subCommont(){
        if(this.content){
          let param = {
            id:this.$route.query.id,
            content:this.content
          }
          subArticlecomment(param, (data) => {
//          成功之后再掉回复接口，并且提示
            this.content=''
            this.$message({
              message: '发表成功！',
              type: 'success'
            });
            this.getArticlecomment(1)
          },(msg,data)=>{
            if(data.code=='d_003'){
              Message({
                message: msg,
                type: 'error'
              })
              this.$router.push({path: '/page/article'});
            }
          })
        }else{
          this.$message({
            message: '请输入内容！',
            type: 'warning'
          });
        }
      },
//      删除评论
      delcomment(id){
//        提示
        this.$confirm('回复删除后,不可恢复,确定删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            articleId:parseInt(this.$route.query.id),
            commentId:id
          }
          delArticlecomment(param, (data) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
//          成功之后再掉回复接口，
            this.getArticlecomment(1)
          },(msg,data)=>{
            if(data.code=='d_003'){
              this.$message.warning(msg)
              this.$router.push({path: '/page/article'});
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //      分页方法
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.page.pageSize = val
        this.getArticlecomment(1)
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.getArticlecomment(val)
      },
      //      编辑
      goEdit(){
        this.$router.push({path: '/page/writearticle',query:{id:this.$route.query.id}});
      },
//      删除
      delect(){
        this.dialogVisible = true
      },

    sure(){
      this.dialogVisible = false
      delectDetail({id:this.$route.query.id}, (data) => {
        this.$message({
          message: '撤回成功！',
          type: 'success'
        });
        this.$router.push({path: '/page/article'});
      },(msg,data)=>{
        if(data.code=='d_003'){
          this.$message.warning(msg)
          this.$router.push({path: '/page/article'});
        }
      })
    }
    },
    mounted () {
      this.$nextTick(() => {
        document.getElementById('consulInfo').style.minHeight = (document.body.clientHeight - 416) + 'px'
        this.getArticleInfo()
        this.getArticlecomment(1)
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
</style>
