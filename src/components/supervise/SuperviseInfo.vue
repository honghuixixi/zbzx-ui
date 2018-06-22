<template>
	<div style="background: #f4fafa;padding-top: 20px;">
    <div style="background: #fff;min-height: 600px" >
      <div class="hd_treetitle">
        <span>监管机构详情</span>
        <div class="changediv">
          <span @click="showAccountDialog">修改账号</span>
          <span @click="dialog.showPwd=true">重置密码</span>
        </div>
      </div>
      <div class="hd_treetitle" >{{tenant.name}}</div>
      <table style="border-bottom: 1px solid #d5d5d5;">
        <tbody>
        <tr >
          <td >ID</td>
          <td >{{tenant.id}}</td>
          <td >原始管理员</td>
          <td >{{tenantAdmin.realName}}</td>
        </tr>
        <tr >
          <td >创建人</td>
          <td >{{msg.createName}}</td>
          <td >手机号</td>
          <td >{{tenantAdmin.mobile}}</td>
        </tr>
        <tr>

          <td >创建时间</td>

          <td >{{createTime}}</td>
          <td>邮箱</td>
          <td >{{tenantAdmin.email}}</td>
        </tr>
        </tbody>
      </table>
      <table>
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
          <td>所在地区</td>
          <td>{{tenant.province}}-{{tenant.city}}-{{tenant.county}}</td>
          <td>上级行政单位</td>
          <td>{{tenant.manageTenantName}}</td>
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
  import {getsupDetail, changeLoginName, zbzxresetPwd} from '../../service/api'
  import { Message } from 'element-ui';
  import config from '@/service/config'
	export default {
    data(){
      return {
        dialog: {
          oldAccount: 'cccccccc',
          newAccount: '',
          newAccount2: '',
          err: '',
          showAccount: false,
          showPwd: false
        },
        msg:{},
        tenant:{},
        tenantAdmin:{},
        expireTime:'',
        createTime:''
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
            this.getsupDetail()
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
            this.dialog.showPwd = false;
            // this.msg2 = msg
            Message({
              message: msg,
              type: 'error'
            })
        });
      },
      getsupDetail(){
        getsupDetail(this.id,data=>{
          this.msg = data
          this.tenant = data.tenant
          this.tenantAdmin = data.tenantAdmin
          this.expireTime = data.tenant.expireTime ?data.tenant.expireTime.slice(0, 10):''
          this.createTime = data.tenant.createTime? data.tenant.createTime.slice(0, -3):''
          this.dialog.adminId = data.tenantAdmin.id || 0
          this.dialog.oldAccount = data.tenantAdmin.loginName || ''
        })
      }
    },
//    created(){
//      this.getsupDetail()
//    },
		mounted(){
			this.$nextTick(() => {
				this.getsupDetail()
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
  table{
   padding: 20px ;
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
</style>
