<template>
  <div>
    <ul class="bigList">
      <li class="item" v-for="l in list">
        <span class="itemTop" @click="goInfo(l.id)">
          <span class="hasNotive" v-if="!l.isRead"></span>
          <span v-if="l.reply==1">【已回复】</span>
          <span v-if="l.reply==2">【待回复】</span>
          <span v-if="l.title">{{l.title | title}}</span>
          <span class="tag" v-if="l.type==1">售后服务</span>
          <span class="tag" v-if="l.type==2">质量缺陷</span>
          <span class="tag" v-if="l.type==3">操作使用</span>
          <span class="tag" v-if="l.type==4">产品配置</span>
          <span class="tag" v-if="l.type==5">其它</span>
          <span class="look">查看>></span>
        </span>
        <br>
        <span class="itemCenter" v-if="l.replyContent">
          {{'回复内容 : '+ l.replyContent | content}}
        </span>
        <br v-if="l.replyContent">
        <span class="itembtm">
          <span style="float: left;width:430px;line-height: 25px;height: 40px">
             <span v-show="l.replyOrg">最新回复：<span>{{l.replyOrg | replyOrg}}</span></span>
            <span style="display: inline-block;width: 6px"></span>
            <span v-show="l.replyTime">回复时间：<span>{{l.replyTime | timeChange}}</span></span>
          </span>
         <span style="float: right;width: 420px;line-height: 25px;height: 40px">
           <span v-show="l.publisher" class="lastSpan">提交人：<span>{{l.publisher | publisher}}</span><span class="pubOrg">{{l.org |org}}</span></span>
           <span style="display: inline-block;width: 6px"></span>
          <span v-show="l.publishTime" class="lastSpan">提交时间：<span>{{l.publishTime | timeChange}}</span></span>
         </span>

        </span>
      </li>
    </ul>
  </div>
</template>
<script>
    export default{
      props: ['list'],
      methods:{
        goInfo(id) {
          this.$emit('goInfo',id)
        }
      }
    }
</script>
<style scoped>
 .item{
    padding: 30px 20px;
    border-bottom: 1px solid #e5e5e5;
    word-break: break-all;
   padding-bottom: 4px;
  }
  .item>span{
    width: 100%;
  }
  .itemTop{
    font-size: 18px;
    color: #555;
    position: relative;
  }

  .look{
    float: right;
    font-size: 14px;
    color: #007cb5;
    cursor: pointer;
  }
  .itemCenter{
    font-size: 16px;
    color: #555;
    display: inline-block;
    margin-top: 15px;
    white-space: pre-line;
  }
  .itembtm{
    font-size: 14px;
    color: #999;
    display: inline-block;
    margin-top: 10px;
  }
  .itembtm>span{
    width: 25%;
    float: left;
  }
  /*.itembtm .lastSpan{*/
    /*text-align: right;*/
  /*}*/
  .pubOrg{
    margin-left: 25px;
  }
  .hasNotive{
    left: -5px;
  }
  .itemTop:hover{
    color: #f9731e;
    cursor: pointer;
  }
  .tag:hover{
    color: #fff;
  }
</style>
