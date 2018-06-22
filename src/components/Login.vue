<template>
  <div id="login">
    <!-- main  -->
    <div class="title">
      <span>当前位置 : 管理平台 /<span class="currentTable"> 登录</span></span>
      <span></span>
    </div>
    <div class="content">
      <div class="register">还没账号，<router-link to="/register" >立即注册</router-link></div>
      <div class="login">
        <img src="../assets/images/line.png" alt="">
        <div class="loginCont">
          <span>账号：</span><input type="text" placeholder="登录名" v-model="username" @blur="blurCheck" id="userName" maxlength="40">
          <img src="../assets/images/right.png" alt="" class="right" v-if="nameRight">
          <div class="br">
            <span class="error" v-if="regError">格式不正确</span>
            <span class="error" v-if="phoneEmpty">请输入登录名</span>
            <span class="error" v-if="phoneEmit">账号不存在</span>
          </div>
          <span>密码：</span><input type="password" maxlength="16" minlength="8" placeholder="8~16位字符" id="password" v-model="password"  @blur="psdBlur">
          <div class="br" style="position: relative">
            <span class="error" v-if="msgNo" style="margin-left: -95px">请输入8~16位密码</span>
            <span class="error" v-if="msgError"> {{msg}}</span>
            <LoginFindPwd></LoginFindPwd>
          </div>
          <span class="search loginBtn" @click="login">登录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import {getUserInfo} from '@/service/api'
  import config from '@/service/config'
  import LoginFindPwd from './LoginFindPwd'
  export default{
    data(){
      return {
        username: '',
        password: '',
        deviceId: '',//设备唯一标识ID
        regError: false,//手机号格式不正确变量
        msgError: false,//密码错误
        msgNo: false,//请输入密码
        nameRight: false,
        msg: '',
        phoneEmpty: false,
        phoneEmit: false
      }
    },
    components: {
      LoginFindPwd
    },
    methods: {
    // 弹窗方法end
    setRandom(){
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    getDeviceUnqinId(){
      return (this.setRandom() + this.setRandom() + "-" + this.setRandom() + "-" + this.setRandom() + "-" + this.setRandom() + "-" + this.setRandom() + this.setRandom() + this.setRandom());
    },
    UserInfo(){
      getUserInfo((data) => {
        localStorage.setItem('userInfo', JSON.stringify(data))
        this.$router.push({path: '/page/notice'});
      })
    },
    blurCheck(fun){
      if (this.username) {
        var reg2 = /^[^\u4E00-\u9FA5\s]{1,40}$/
        if (reg2.test(this.username)) {
          //  发送请求，判断dengluming是否存在
          axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/user/checkLoginName?loginName=' + this.username.toLowerCase())
            .then(res=> {
              if (res.data.code == 200 && res.data.data) {
                this.regError = false
                this.nameRight = true
                this.phoneEmpty = false
                this.phoneEmit = false
                if(typeof fun === 'function') {
                  fun()
                }
              } else {
                this.regError = false
                this.nameRight = false
                this.phoneEmpty = false
                this.phoneEmit = true
              }
            })
            .catch(err=> {
              console.log(err);
            })
        } else {
          this.regError = true
          this.nameRight = false
          this.phoneEmpty = false
          this.phoneEmit = false
        }
        this.phoneEmpty = false
      } else {
        this.phoneEmpty = true
        this.regError = false
        this.nameRight = false
        this.phoneEmit = false
      }
    },
    psdBlur(){
      if (!this.password || this.password.length < 8 || this.password.length > 16) {
        this.msgNo = true
      } else {
        this.msgNo = false
      }
    },
    login(){
      this.username = document.getElementById("userName").value
      this.password = document.getElementById("password").value
      this.blurCheck( ()=> {
        if (!this.username) {
          this.phoneEmpty = true
        } else if (!this.password) {
          this.msgNo = true
        }
        if (this.password && this.nameRight && !this.msgNo) {
          axios.post(config.server(process.env.NODE_ENV) + '/zbzx/oauth/authByLoginName', {
            "username": this.username.toLowerCase(),
            "password": this.password,
            "deviceId": this.getDeviceUnqinId()
          })
            .then(res=> {
              if (res.data.code == 200) {
                localStorage.setItem('Token', res.data.token)
                this.UserInfo()
              } else {
                this.msgError = true
                this.msg = res.data.msg
              }
            })
            .catch(err=> {
              console.log(err);
            })
        }
      })
    }
    },
    watch: {
      username: function (oldVlue, newVlue) {
        this.username = this.username.replace(/&/, '')
        this.regError = false
        this.nameRight = false
        this.phoneEmpty = false
        this.phoneEmit = false
      },
      password: function (oldVlue, newVlue) {
        this.msgNo = false
        this.msgError = false
      }
    }
  }
</script>
<style scoped>
  .title{
    border-bottom: 0 !important;
  }
  .content{
    width: 585px;
    margin: 35px auto 187px;
  }
  .register{
    text-align: right;
    font-size: 14px;
    color: #999;
  }
  .content a{
    color: #0fa1dc;
    cursor: pointer;
  }
  .loginCont{
    height: 250px;
    border: 1px solid #dcdcdc;
    border-top:0;
    margin-top: -11px;
    text-align: center;
    padding-top: 80px;
  }
  input{
    border: 0;
    border-bottom: 1px solid #dcdcdc;
    width: 248px;
    border-radius: 0;
  }
  input:focus{
    border: 0;
    border-bottom: 1px solid #dcdcdc;
  }
  .br{
    height: 40px;
  }
  .right{
    margin-left: 20px;
    position: absolute;
    margin-top: 5px;
  }
  .error{
    display: inline-block;
    text-align: left;
    margin-left: -134px;
  }
  .loginBtn{
    width: 226px;
    background: #66b0d3;
  }
  .forgetpsd{
    color: #007cb5;
    font-size: 14px;
    position: absolute;
    right: 136px;
    top: 10px;
    cursor: pointer;
  }
</style>