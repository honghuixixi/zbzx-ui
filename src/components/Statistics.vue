<template>
  		<div class="statistics">
  			<a :class="{'active': active === 1}" @click="link('/page/notice')">
          <span>
            <i class="hasMsg" v-if="notice.hasNews"></i>通知
          </span>
          <span class="msgCount">{{notice.count?notice.count:'0'}} </span>
        </a>
  			<a :class="{'active': active === 2}" @click="link('/page/news')">
          <span><i class="hasMsg" v-if="news.hasNews"></i>消息</span>
          <span class="msgCount">{{news.count?news.count:'0'}} </span>
        </a>
  			<a :class="{'active': active === 3}" @click="link('/page/article')">
          <span><i class="hasMsg" v-if="article.hasNews"></i>资料</span>
          <span class="msgCount">{{article.count?article.count:'0'}} </span>
        </a>
  			<a :class="{'active': active === 4}" @click="link('/page/complaint')">
          <span ><i class="hasMsg" v-if="complaint.hasNews"></i>售后与不良事件</span>
          <span class="msgCount">{{complaint.count?complaint.count:'0'}} </span>
        </a>
  			<a :class="{'active': active === 5}" @click="link('/page/consultation')">
          <span><i class="hasMsg" v-if="consultation.hasNews"></i>技术咨询</span>
          <span class="msgCount">{{consultation.count?consultation.count:'0'}} </span>
        </a>
  		</div>
   </div>
</template>

<script>
	import {getStatistics} from '@/service/api'
	export default{
    props: ['active'],
		data () {
		  return {
		  	statistics: {},
        notice:{},
        news:{},
        article:{},
        complaint:{},
        consultation:{},
        index:1//点击切换的边框类控制变量
		  }
		},
    methods:{
      link(url) {
        this.$router.push({path: url})
      },
		  getNew(){
        getStatistics((data) => {
          //console.log(data)
          this.statistics = data
          this.notice=this.statistics.notice
          this.news=this.statistics.news
          this.article=this.statistics.article
          this.complaint=this.statistics.complaint
          this.consultation=this.statistics.consultation
        })
      }
    },
		mounted () {
		  this.$nextTick(() => {
          this.getNew()
		  })
		}
	}
</script>
<style scoped>
  .statistics{
    height: 90px;
  }
  .statistics a{
    width: 180px;
    height: 70px;
    padding-top: 14px;
    float: left;
    margin-top: 20px;
    text-align: center;
    box-sizing:border-box;
    background: #1bacc9;
    color: #fff;
    cursor: pointer;
  }
  .statistics a + a {
    margin-left: 20px;
  }
  .statistics .active{
    background: #007cb5;
  }
  .statistics a span{
    position: relative;
  }
  .msgCount{
    display: block;
  }

</style>
