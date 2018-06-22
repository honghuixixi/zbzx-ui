<template>
  <div style="background: #f4fafa;padding-top: 20px">
    <div style="background: #fff;min-height: 600px">
      <div class="hd_treetitle" style="overflow: hidden;">
        <span>医疗机构详情</span>
        <div class="changediv">
          <span @click="showAccountDialog">修改账号</span>
          <span @click="dialog.showPwd=true">重置密码</span>
        </div>
      </div>
      <div class="hd_tdetailnav">
        <span :class="{active:index==0}" @click="tabChange(0)">医疗机构详情</span>
        <span style="margin-left: -6px" :class="{active:index==1}" @click="tabChange(1)">设备信息</span>
      </div>
      <div v-if="index==0">
        <div class="hd_treetitle">{{tenant.name}}<span v-if="!tenant.enable"class='dis-span'>已停用</span></div>
        <table class="info" style="border-bottom: 1px solid #d5d5d5;">
          <tbody>
          <tr >
            <td >ID</td>
            <td >{{tenant.id}}</td>
            <td >原始管理员</td>
            <td >{{tenantAdmin.realName}}</td>
          </tr>
          <tr >
            <td >来源</td>
            <td >
              <span v-if="tenant.origin==1 ">后台创建</span>
              <span v-if="tenant.origin==2 ">前台注册</span>
              <span v-if="tenant.origin==3 ">其他 </span>
            </td>
            <td >手机号</td>
            <td >{{tenantAdmin.mobile}}</td>
          </tr>
          <tr>
            <td >审核状态</td>
            <td >
              <span v-if="tenant.auditStatus==1 ">待审核</span>
              <span v-if="tenant.auditStatus==2 ">自动通过</span>
              <span v-if="tenant.auditStatus==3 ">人工通过</span>
              <span v-if="tenant.auditStatus==4 ">已拒绝</span>
            </td>
            <td>邮箱</td>
            <td >{{tenantAdmin.email}}</td>

          </tr>
          <tr >
            <td >创建人</td>
            <td >{{msg.createName}}</td>
            <td ><span> </span></td>
            <td ><span> </span></td>
          </tr>
          </tr>
          <tr >
            <td >创建时间</td>
            <td >{{createTime}}</td>
            <td ><span> </span></td>
            <td ><span> </span></td>
          </tr>
          </tbody>
        </table>
        <table class="info" style="border-bottom: 1px solid #d5d5d5;">
          <tbody>
          <tr>
            <td>机构类型</td>
            <td>
              <span v-if="tenant.tenantType == 1">医疗机构</span>
              <span v-if="tenant.tenantType == 2">监管机构</span>
              <span v-if="tenant.tenantType == 3">设备供应商</span>
              <span v-if="tenant.tenantType == 4">设备维修商</span>
              <span v-if="tenant.tenantType == 5">配件供应商</span>
            </td>
            <td>账户类型</td>
            <td>
              <span v-if="tenant.commercialUse">正式</span>
              <span v-if="!tenant.commercialUse">试用</span>
            </td>
          </tr>
          <tr>
            <td>是否测试机构</td>
            <td>
              <span v-if="tenant.trial==0">是</span>
              <span v-if="tenant.trial==1">否</span>
            </td>
            <td>子机构</td>
            <td>
              <span v-if="tenant.subTenantLimit == 0 ">不可创建</span>
              <span v-if="tenant.subTenantLimit != 0">已创建{{tenant.subTenant }}个/可创建{{tenant.subTenantLimit}}个</span>
            </td>
          </tr>
          <tr>
            <td>到期时间</td>
            <td>
              <span v-if="expireTime">{{expireTime}}</span>
              <span v-if="!expireTime">永久有效</span>
            </td>
            <td><span> </span></td>
            <td><span> </span></td>
          </tr>
          </tbody>
        </table>

        <table class="info">
          <tbody>
          <tr>
            <td>组织机构代码</td>
            <td>{{tenant.license }}</td>
            <td><span></span></td>
            <td><span></span></td>
          </tr>
          <tr>
            <td>机构类别</td>
            <td>{{category}}</td>
            <td><span></span></td>
            <td><span></span></td>
          </tr>
          <tr>
            <td>机构分类管理类型</td>
            <td>
              <span v-if="!hplTenant.manageType"></span>
              <span v-if="hplTenant.manageType==1">营利性</span>
              <span v-if="hplTenant.manageType==2">非营利性</span>
              <span v-if="hplTenant.manageType==3">其他</span>
            </td>
            <td><span></span></td>
            <td><span></span></td>
          </tr>
          <tr>
            <td>医院等级</td>
            <td>{{grade}}{{hierarchy}}</td>
            <td><span></span></td>
            <td><span></span></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-if="index==1">
        <div class="supervise-search">
          <el-select class="select" style="float:left;" placeholder="选择机构类别" v-model="value">
            <el-option
              v-for="item in options"
              :key="item.status"
              :label="item.statusName"
              :value="item.status">
            </el-option>
          </el-select>
          <input class="input" style="float:left;" type="text" placeholder="请输入设备名称/编号" v-model="keyword">
          <span class="btn" style="float:left;" @click="search">搜索</span>
        </div>
        <div style="margin: 20px;">
          <table class="list">
            <thead>
            <tr style="background-color: #f5f5f5;">
              <td style="width: 18%;white-space:nowrap;">设备编号</td>
              <td style="width: 15%;white-space:nowrap;">设备名称</td>
              <td style="width: 18%;white-space:nowrap;">规格型号</td>
              <td style="width: 18%;white-space:nowrap;">生产商</td>
              <td style="width: 15%;white-space:nowrap;">状态</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="l in list " v-if="list.length!=0">
              <td >{{l.assetsNum}}</td>
              <td>{{l.assetsName}}</td>
              <td>{{l.assetsSpec}}</td>
              <td>{{l.factoryName}}</td>
              <td>{{l.statusName}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="empty" v-if="list.length < 1">
          <img :src="require('@/assets/images/nocontent.png')">暂无数据
        </div>
        <!--分页-->
        <div class="pageInfo" v-if="list.length!=0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[8,16,32]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>

    </div>
  <!-- 修改账号  -->
  <el-dialog
      title="修改账号"
      :visible.sync="dialog.showAccount"
      width="500px"
    >
    <div class="reset-row"><span>当前账号：</span> {{dialog.oldAccount}}</div>
    <div class="reset-row">
      <span>新账号：</span>
      <input type="text" v-model="dialog.newAccount" @input="dialog.err=''" maxlength="40" placeholder="40个字符以内，不支持中文和空格">
    </div>
    <div class="reset-row">
      <span>确认新账号：</span>
      <input type="text" v-model="dialog.newAccount2" @input="dialog.err=''" maxlength="40" placeholder="40个字符以内，不支持中文和空格">
    </div>
    <div style="min-height:20px;padding-left:93px;margin-bottom:10px;font-size:14px;line-height:20px;color:#f00;">{{dialog.err}}</div>
    <div class="reset-btns">      
      <span class="reset-btns-cancle" @click="dialog.showAccount=false;">取消</span>
      <span class="reset-btns-ok" @click="resetAccount">确定</span>
    </div>
    </el-dialog>
  <!-- 重置密码  -->
  <el-dialog
      title="重置密码"
      :visible.sync="dialog.showPwd"
      width="400px"
    >
    <div style="text-align: center;">重置后，默认密码为11111111；</div>
    <div style="margin-bottom: 20px;text-align: center;">确定要重置该用户的登录密码吗？</div>
    <div class="reset-btns">
      <span class="reset-btns-cancle" @click="dialog.showPwd=false;">取消</span>
      <span class="reset-btns-ok" @click="resetPwd">确定</span>
    </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import {getmedDetail, getmedList, getmedStatus, getmedBaseOrg, changeLoginName, zbzxresetPwd} from '../../service/api'
  import { Message } from 'element-ui';
  import config from '@/service/config'
  export default {
    data(){
      return {
        dialog: {
          adminId: 0,
          oldAccount: 'cccccccc',
          newAccount: '',
          newAccount2: '',
          err: '',
          showAccount: false,
          showPwd: false
        },
        value:'',
        msg:'',
        index:0,
        category:'',
        hierarchy:'',
        grade:'',
        keyword:'',
        options:[
          {status:'',statusName:'全部状态'}
        ],
        list:[],
        pageNo:1,
        pageSize:16,
        tenant:{},
        tenantAdmin:{},
        expireTime:'',
        createTime:'',
        hplTenant:'',
        total:'',
        baseOrg:''
      }
    },
    props: ['id'],
    methods:{
      showAccountDialog() {
        this.dialog.newAccount = '';
        this.dialog.newAccount2 = '';
        this.dialog.err = '';
        this.dialog.showAccount = true;
      },
      resetAccount() {
        var reg = /^[^\u4E00-\u9FA5\s]{1,40}$/
        if(this.dialog.newAccount == ''){
          this.dialog.err = '请输入新账号';
          return;
        }
        if(!reg.test(this.dialog.newAccount)) {
          this.dialog.err = '新账号格式不正确(40个字符以内，不支持中文和空格)';
          return;
        }
        if(this.dialog.newAccount2 == ''){
          this.dialog.err = '请输入确认新账号';
          return;
        }
        if(this.dialog.newAccount != this.dialog.newAccount2){
          this.dialog.err = '新账号与确认新账号不一致';
          return;
        }
        if(this.dialog.newAccount == this.dialog.oldAccount){
          this.dialog.err = '新账号与当前账号一致';
          return;
        }
        changeLoginName({userId: this.dialog.adminId, loginName: this.dialog.newAccount}, (json) => {
            this.dialog.showAccount = false;
            Message({
              message: "账号修改成功",
              type: 'success'
            })
            this.getmedDetail()
        }, (msg) => {
            this.dialog.err = msg
        });
      },
      resetPwd() {
        zbzxresetPwd({userId: this.dialog.adminId}, (data) => {
            this.dialog.showPwd = false;
            Message({
              message: "密码重置成功",
              type: 'success'
            })
        }, (msg) => {
            // this.msg2 = msg
            this.dialog.showPwd = false;
            Message({
              message: msg,
              type: 'error'
            })
        });
      },
      getmedDetail(){
        getmedDetail(this.id,data=>{
          this.msg = data
          this.category = this.getTypeName(data.tenant.hplTenant.category,this.baseOrg.tenantCategory);
          this.hierarchy = this.getTypeName(data.tenant.hplTenant.hierarchy,this.baseOrg.tenantHierarchy);
          this.grade = this.getTypeName(data.tenant.hplTenant.grade,this.baseOrg.tenantGrade);
          this.tenant = data.tenant
          this.tenantAdmin = data.tenantAdmin
          this.expireTime = data.tenant.expireTime ?data.tenant.expireTime.slice(0, 10):''
          this.createTime = data.tenant.createTime? data.tenant.createTime.slice(0, -3):''
          this.hplTenant = data.tenant.hplTenant
          this.dialog.adminId = data.tenantAdmin.id || 0
          this.dialog.oldAccount = data.tenantAdmin.loginName || ''
          console.log(this.category)
        })
      },
//      列表请求
      getmedList(){
        let params={
          status:this.value,
          tenantId:this.id,
          'page.size':this.pageSize,
          keyword:this.keyword,
          'page.current':this.pageNo
        }
        getmedList(params,data=>{
          this.list = data.records
          this.total = data.total
        })
      },
//      类型处理
     getTypeName(id, arr) {
       if(arr){
         return arr[id];
       }else{
         return ''
       }
    },
//      tab切换
      tabChange(index){
        this.index=index
        if(this.index==1){
            this.getmedList()
        }
      },
//      点击搜索
      search(){
        this.pageNo = 1
        this.getmedList()
      },
//      分页
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.getmedList()
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.getmedList()
      },
//      获取状态
      getmedStatus(){
        getmedStatus(data=>{
          this.options=this.options.concat(data)
        })
      },
//      获取基础模块
      getmedBaseOrg(){
        getmedBaseOrg(data=>{
          this.baseOrg = data
          // console.log(this.baseOrg)
          this.getmedDetail()
        })
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.getmedStatus()
        this.getmedBaseOrg()
      })
    }
  }
</script>
<style scoped>
  .changediv {
    float: right;
  }
  .changediv span {
    display: inline-block;
    width: 80px;
    height: 30px;
    margin-right: 10px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    background-color: #007cb5;
    color: #fff;
    cursor: pointer;    
  }
  .reset-row {
    margin-bottom: 10px;
    overflow: hidden;
  }
  .reset-row span {
    display: inline-block;
    width: 90px;
    text-align: right;
  }
  .reset-row input[type="text"] {
    min-width: 240px;
  }
  .reset-btns {
    overflow: hidden;
  }
  .reset-btns span {
    display: inline-block;
    float: right;
    width: 70px;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    cursor: pointer;
  }
  .reset-btns-cancle {
    border: 1px solid #007cb5;
    color: #007cb5;
  }
  .reset-btns-ok {
    margin-right: 15px;
    border: 1px solid #007cb5;
    background-color: #007cb5;
    color: #fff;
  }
  .list td{
    text-align: center;
    border: 1px solid #dcdcdc;
  }
  .info td {
    padding-left: 20px;
  }
  table{
    padding: 20px ;
    border-collapse: collapse;
    width: 100%;
    font-size: 13px;
  }
  td{
    height: 40px;
  }
  tbody tr td:first-child{
    width: 10%;
  }
  tbody tr td:nth-child(2){
    width: 40%;
  }
  tbody tr td:nth-child(3){
    width: 10%;
  }
  tbody tr td:nth-child(2n){
    color: #999;
  }
  .hd_tdetailnav{
    height: 55px;
    line-height: 75px;
    border-bottom: 1px solid #d5d5d5;
    padding-left: 20px;
  }
  .hd_tdetailnav>span{
    display: inline-block;
    width: 114px;
    height: 32px;
    border: 1px solid #d5d5d5;
    color: #666;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border-bottom: 0;
  }
  .hd_tdetailnav .active{
    color: #fff;
    background: #007cb5;
  }
  .supervise-search {
    margin: 20px;
    font-size: 14px;
    line-height: 32px;
    overflow: hidden;
  }
  .supervise-search .select {
    float: right;
    width: 220px;
  }
  .supervise-search .input {
    float: right;
    width: 250px;
    margin: 0 10px;
  }
  .supervise-search .btn {
    float: right;
    display: inline-block;
    width: 60px;
    height: 32px;
    background: #007cb5;
    color: #fff;
    text-align: center;
    line-height: 32px;
    border-radius: 3px;
    font-size: 14px;
    cursor: pointer;
  }
  .supervise-table {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 240px;
    z-index: 1;
    background-color: #fff;
    overflow: auto;
  }
  .showCity-table {
    left: 481px;
  }
  .supervise-table table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #dcdcdc;
    font-size: 14px;
  }
  .supervise-table table td {
    padding: 10px 15px;
    border-left: 1px solid #dcdcdc;
    border-top: 1px solid #eaeff0;
    text-align: center;
  }
  .supervise-table table thead td {
    background-color: #f5f5f5;
    line-height: 25px;
  }
  .supervise-table tbody tr:hover td {
    border-top:1px solid #f7931e;
    border-bottom:1px solid #f7931e;
  }
  .supervise-table tbody tr:hover .first {
    border-left:1px solid #f7931e;
  }
  .supervise-table tbody tr:hover .last {
    border-right:1px solid #f7931e;
  }
  .supervise-table table td a {
    text-decoration: none;
    cursor: pointer;
    color: #4baaf6;
  }
  .empty {
    font-size: 14px;
    line-height: 60px;
    text-align: center;
  }
  .empty img {
    margin-right: 10px;
    vertical-align: middle;
  }
</style>
