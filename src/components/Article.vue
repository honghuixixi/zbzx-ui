<template>
  <div>
    <Statistics :active="3"/>
    <div class="title">
      <span>当前位置 : 管理平台 /<span class="currentTable"> 资料</span></span>
      <span>
        <input type="text"  placeholder="输入标题关键字/机构名称" v-model="keyword">
        <span class="search" @click="search(1)">搜索</span>
        <span class="announce" v-if="userInfo.part==1" @click="gopublish">
          <img src="../assets/images/issue.png" alt="">
          <span>发布资料</span>
        </span>
      </span>
    </div>
    <div class="navTitle">资料</div>
    <div v-if="list.length==0" class="nodata" id="consulInfo">
      <img src="../assets/images/nores.png" alt="">
      <div>暂无数据</div>
    </div>
    <div id="consulInfo">
    <list-item :list="list" @goInfo="goInfo" v-if="list.length!=0"></list-item>
    <!--分页-->
    <div class="pageInfo" v-if="list.length!=0">
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
  </div>
</template>

<script>
  import {getArticleList} from '@/service/api'
  import {formatDate} from '@/service/dateutil'
  import Statistics from '@/components/Statistics'
  import ListItem from '@/components/Listitem'
  export default {
    data ()  {
      return  {
        keyword: '',
        list: [],
        page: {
          pageNo: 1,
          pageSize: 8,
          total: 0
        },
        userInfo:JSON.parse(localStorage.getItem('userInfo'))
      }
    },
    components:{Statistics, ListItem},
    methods: {
      search (index) {
        let param = {
          pageNo: index,
          pageSize: this.page.pageSize
        }
        if(this.keyword.length){
          param.keyword = this.keyword
        }
        getArticleList(param, (data) => {
          this.page.pageNo = index
          this.page.total = data.total
          this.list = data.records
        })
      },
      //      跳转到详情页
      goInfo(id){
        this.$router.push({path: '/page/articleinfo', query:{id: id}});
      },
      //      分页方法
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.page.pageSize = val
        this.search(1)
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.search(val)
      },
      gopublish(){
        this.$router.push({path: '/page/writearticle'});
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.getElementById('consulInfo').style.minHeight = (document.body.clientHeight - 765) + 'px'
        this.search(1)
      })
    }
  }
</script>
<style scoped>
input{
  width: 230px;
}

</style>

