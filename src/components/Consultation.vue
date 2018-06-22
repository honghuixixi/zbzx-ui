<template>
  <div>
    <Statistics :active="5"/>
    <div class="titleSelect">
      <span>当前位置 : 管理平台 /<span class="currentTable"> 技术咨询</span></span>
      <div>
        <el-select v-model="type" placeholder="全部">
          <el-option
            v-for="item in optionsList"
            :key="item.typeID"
            :label="item.name"
            :value="item.typeID"
            @click.native="search(1)"
          >
          </el-option>
        </el-select>
        <input type="text"  placeholder="输入标题关键字" v-model="keyword" v-if="userInfo.part==2">
        <input type="text"  placeholder="输入标题关键字/机构名称" v-model="keyword" v-if="userInfo.part==1">
        <span class="search" @click="search(1)">搜索</span>
        <span class="announce" v-if="userInfo.part==2" @click="writeconsultation">
          <img src="../assets/images/msg.png" alt="">
          <span>我要咨询</span>
        </span>
      </div>
    </div>
    <div class="navTitle">
      <span>技术咨询</span>
      <span>
        <span v-for="(l,index) in ststusList" @click="status(index)" :class="{current:order==index}">{{l}}</span>
      </span>
    </div>
    <div v-if="list.length==0" class="nodata" id="consulInfo">
      <img src="../assets/images/nores.png" alt="">
      <div>暂无数据</div>
    </div>
    <div id="consulInfo">
    <big-item :list="list"  @goInfo="goInfo" v-if="list.length!=0"></big-item>
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
  import {getconsulteList} from '@/service/api'
  import Statistics from '@/components/Statistics'
  import BigItem from './Consulitem.vue'
  export default {
    data ()  {
      return  {
        order:0,
        type:'',
        typeName:'全部',
        keyword: '',
        list: [],
        page: {
          pageNo: 1,
          pageSize: 8,
          total: 0
        },
        optionsList:[
          {typeID:0,name:'全部'},
          {typeID:1,name:'采购计划'},
          {typeID:2,name:'验收管理'},
          {typeID:3,name:'使用管理'},
          {typeID:4,name:'巡检质控'},
          {typeID:5,name:'信息化'},
          {typeID:6,name:'其它'},
        ],
        optionShow:false,//下拉列表控制显示隐藏
        ststusList:['默认','已回复','待回复'],
        userInfo:JSON.parse(localStorage.getItem('userInfo'))
      }
    },
    components:{Statistics, BigItem},
    methods:{
      optionClick(typeID,typeName){
        this.type = typeID
        this.typeName = typeName
        this.optionShow = false
      },
      inputFocus(){
        this.optionShow = true
      },
      status(index){
        this.order = index
        this.search(1)
      },
      search (index) {
        let param = {
          pageNo: index,
          pageSize: this.page.pageSize,
          order:this.order,
        }
        if(this.type>0){
          param.type = this.type
        }
        if(this.keyword){
          param.keyword = this.keyword
        }
        getconsulteList(param, (data) => {
          this.page.pageNo = index
          this.page.total = data.total
          this.list = data.records
        })
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
      // 点击跳转详情页
      goInfo(id){
        this.$router.push({path: '/page/consulinfo', query:{id: id}});
      },
//      我要咨询页面
      writeconsultation(){
        this.$router.push({path: '/page/writeconsultation'});
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
  .titleSelect>div{
    text-align: right;
  }
  .titleSelect{
    border-bottom: 3px solid #007cb5;
    padding: 24px 0;
  }
  .titleSelect>span{
    float: left;
    font-size: 14px;
    color: #999;
    line-height: 32px;
  }

</style>
