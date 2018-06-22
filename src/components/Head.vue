<template>
  <div class="header">
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div class="name">
        <div >
          <div class="loginInput"><img src="../assets/images/yh.png" alt="">
            <input type="text" v-model="userTelemail" placeholder="手机号"  style="width: 75%" readonly >
            <div style="height: 30px;line-height: 25px;">
              <div class="colorred">{{msg1}}</div>
            </div>
          </div>

          <div class="loginInput yanzhengma" style="margin-top: 30px"><img src="../assets/images/yzm.png" alt="">
            <input type="text" v-model="phonemessage" class="phonemessage" placeholder="验证码" @blur="codeBlur()" style="width: 40%">
            <button v-show="!isCountDown" @click="getCaptchaCode()"  class="active" style="width: 32%">{{txt}}</button>
            <input type="text" class="countdownInput" v-model="countDownTime" v-show="isCountDown" readonly="readonly" />
            <div style="height: 30px;line-height: 25px;">
              <div class="colorred">{{msg2}}</div>
            </div>
          </div>
          <div class="loginInput marginBottom"><img src="../assets/images/mm.png" alt="">
            <input type="text" v-model="userpassword" placeholder="请输入8~16位新密码" @blur="newPsd()" maxlength="16" style="width: 75%">
            <div style="height: 30px;line-height: 25px;">
              <div class="colorred">{{msg3}}</div>
            </div>
          </div>
          <div @click="resetPassword()"  class="search changeMsg" >确定</div>
          <div class="changeMsg search changeMsg2"  @click="goLogin()" >返回登录</div>
        </div>
      </div>
      <div style="margin-top: 40px;display: inline-block;border-top: 1px dashed #dedede;padding-top: 15px;text-align: center">如有其他疑问，请联系浙江医学装备中心，邮箱zjyxzb@126.com，联系人：张吉 13306534826</div>
    </el-dialog>
    <img v-bind:src="require('../assets/images/logoNew.svg')" alt="" style="width: 420px;height: 100px;margin-top: 10px;">
    <div class="layout" v-if="user">
      <div class="ellipsis">{{user.name | nameuser}}</div>
      <div class="ellipsis">{{user.org | nameuser}}</div>
      <div>

        <div class="search search1" @click="goHome">退出</div>
        <div class="search search1" @click="reset()">修改密码</div>
      </div>

    </div>
   <!--  <a href="/supervise/list" target="_blank" v-if="user && user.part==1"><img src="../assets/images/tree.png" alt="" class="tree" ></a> -->
    <router-link to="/supervise/list" target="_blank"  v-if="user && user.part==1 && supervise"><img src="../assets/images/tree.png" alt="" class="tree" ></router-link>

  </div>
</template>

<script>
  import axios from 'axios'
  import config from '@/service/config'
  export default {
    data(){
      return{
          userTelemail: '',         //用户的手机或者邮箱
          phonemessage: '',         //用户收到的短信验证码
          userpassword: '',         //用户设置的新密码
          countDownTime: '60s',     //倒计时的时间
          isCountDown: false,       //是否进行倒计时
          timeOut2: null,             //定时器
          msg1: '',
          msg2: '',
          msg3: '',
          dialogVisible:false,
          isActive:false,
          txt:'获取验证码'
      }
    },
    created(){
      console.log(this.userTelemail)
    },
    props: ['user', 'supervise'],
    methods:{
      reset:function(){
        this.txt = '获取验证码'
        this.countDownTime='60s'
        clearInterval(this.timeOut2)
        this.dialogVisible=true
        this.userTelemail =JSON.parse(localStorage.getItem('userInfo')).phone
        this.phonemessage = ''
        this.userpassword = ''
        this.isCountDown = false
        this.msg1 = ''
        this.msg2 = ''
        this.msg3 = ''
      },
      goLogin(){
        localStorage.clear();
        this.dialogVisible  = false;
        this.$router.push({path: '/login'});
      },

      goHome(){
        localStorage.clear()
        window.location.href = 'http://www.zjyxzb.org.cn/f'
      },
      codeBlur(){
        if(!this.phonemessage){
          this.msg2 = '请输入验证码'
        }
      },
      //      重置密码失去焦点校验
      resetBlur:function(){
        var reg = /^(1[3-8][0-9])\d{8}$/
        if (!this.userTelemail) {
//          如果没有输入手机号
          this.msg1 = '请输入手机号'
        } else if (!reg.test(this.userTelemail)) {
//        如果是格式不正确的
          this.msg1 = '手机号格式不正确'
        } else if (reg.test(this.userTelemail)) {
          // 手机号是否存在
          axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/user/checkMobile?mobile=' + this.userTelemail)
            .then(res=> {
              if (res.data.code == 200 && res.data.data) {
                this.msg1 = ''
                this.isActive = true
              } else {
                this.msg1 = '手机号不存在'
              }
            })
            .catch(err=> {
              console.log(err);
            })
        }
      },
      newPsd(){
        var reg2 = /^[0-9a-zA-Z]{8,16}$/
        if ( this.userpassword.length < 8 ) {
          this.msg3 = '新密码至少8位'
        }else if(!reg2.test(this.userpassword)){
          this.msg3 = '新密码只能数字或字母'
        }
      },
      getCaptchaCode(){
        this.msg2 = ''
        var reg = /^(1[3-8][0-9])\d{8}$/
        if (!this.userTelemail) {
//          如果没有输入手机号
          this.msg1 = '请输入手机号'
        } else if (!reg.test(this.userTelemail)) {
//        如果是格式不正确的
          this.msg1 = '手机号格式不正确'
        }
        if (!this.msg1 && this.userTelemail && reg.test(this.userTelemail)) {
          let param = {
            "account": this.userTelemail
          }
//          发送验证码
          axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/index/sendCode?account=' + this.userTelemail)
            .then(res=> {
              if (res.data.code == 200 ) {
                this.countDown()
              }else{
                this.msg2 = res.data.msg
              }
            })
            .catch(err=> {
              console.log(err);
            })

        }

      },
      resetPassword(){
        var reg = /^(1[3-8][0-9])\d{8}$/
        var reg2 = /^[0-9a-zA-Z]{8,16}$/
        if(!this.userTelemail){
          this.msg1 = '请输入手机号'
        }else if (!reg.test(this.userTelemail)) {
//        如果是格式不正确的
          this.msg1 = '手机号格式不正确'
        }else if(!this.phonemessage){
          this.msg2 = '请输入验证码'
        }else if(!this.userpassword){
          this.msg3 = '请输入新密码'
        }else if(this.userpassword.length < 8 || this.userpassword.length > 16){
          this.msg3 = '新密码至少8位'
        }else if(!reg2.test(this.userpassword)){
          console.log(reg2.test(this.userpassword))
          this.msg3 = '新密码只能数字或字母'
        }
        if(reg.test(this.userTelemail) && this.phonemessage && this.userpassword && !this.msg1 && !this.msg2 && !this.msg3){
                let param = {
                  "userId": this.user.userId,
                  "mobile": this.userTelemail,
                  "code": this.phonemessage,
                  "password": this.userpassword
        }

          axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/index/modifyPassword', {   ///zbzxsys/index/resetPassword',{
            params: param,
            headers: {'X-AEK56-Token': localStorage.getItem('Token')}
          })
            .then(res=> {
              if (res.data.code == 200 ) {
                this.dialogVisible = false;
                localStorage.clear();
                this.$router.push({path: '/login'});
              } else{
                this.msg3 = res.data.msg
              }
            })
            .catch(err=> {
              console.log(err);
            })
        }

      },
      countDown(){
        this.isCountDown = true
        this.timeOut2 = setInterval(this.updataTime, 1000)
      },
      updataTime(){
        this.countDownTime = parseInt(this.countDownTime)
        if (this.countDownTime <= 0) {
          this.countDownTime = '60s'
          this.isCountDown = false
          this.isActive = true
          this.txt = '重新获取验证码'
          clearInterval(this.timeOut2)
        } else {
          this.countDownTime--
          this.countDownTime = this.countDownTime + 's'
        }
      },
      //        弹窗方法end
    },
    watch: {
      userTelemail: function (val) {
        console.log(val)
        this.msg1 = ''
        this.msg3 = ''
        this.isActive = false
      }
      ,
      phonemessage: function (val) {
        this.msg2 = ''
        this.msg3 = ''
      }
      ,         //用户收到的短信验证码
      userpassword:function (val) {
        this.msg3 = ''
      }
      ,

    },
  }
</script>
<style scoped>
.el-dialog .el-dialog__body {
    height: auto;
    padding: 20px;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .search1{
    float: right;
    width: auto;
    padding: 0 20px;
  }
  .header{
    height: 120px;
    position: relative;
    background: #f4fafa;
  }
  .header span{
    position: absolute;
    top:60px;
    left: 428px;
  }
  .layout{
    text-align: right;
    float: right;
    width: 330px;
    margin-right: 20px;
    line-height: 30px;
    height: 100px;
    padding: 10px 20px 10px;
  }
  .tree{
    width: 60px;
    height: 60px;
    float: right;
    margin-top: 23px;
  }
  /*弹窗的样式*/
  .name{
    height: 100%;
    background: #fff;
  }
  .loginImg{
    text-align: center;
  }
  .loginImg img{
    width:156px;
    height:58px;
  }
  .loginTitle{
    margin: 20px auto 40px;
    width: 560px;
    text-align: center;
    font-size:36px ;
    color: #333;
  }
  .loginInput{
    margin: 20px auto 0;
    width: 80%;
    height:40px;
    border-bottom:1px solid #e5e5e5;
    padding:0 15px;
    padding-right: 0;
    line-height:40px;
  }
  .loginInput input{
    width: 156px;
    height: 40px;
    font-size:28px ;
    margin-left: 15px;
    width: 50%;
    border: 0;
    color: #666;
  }
  .loginInput img{
    margin-top: -5px;
    width: 15px;
    height: 17px;
  }
  .changeMsg{
    display:inherit;
    margin: 30px auto 0px;
    width: 60%;
    text-align: center;
    font-size:14px ;
    color: #fff;
  }
  .changeMsg2{
    margin: 10px auto 0px;
    font-size:14px ;
    color: #007cb5;
    background: #fff;
    border: 1px solid #007cb5;
  }
  .yanzhengma{
    /*padding-right:0;*/
    position: relative;
  }
  .yanzhengma .countdownInput{
    position: absolute;
    height:  32px;
    /* padding: 0 15px;*/
    border: none;
    /*margin-top: -5px;*/
    border-radius: 3px;
    color: #fff;
    background-color:#BEBEBE;
    float: right;
    text-align: center;
    font-size:14px;
    margin-left: 0;
    right: 0;
    width:28%;
  }
.yanzhengma button.active{
  background-color: #007cb5
  }
  .yanzhengma button{
    float: right;
    background-color: #bebebe;
    color: #fff;
    border: 0;
    height:32px;
    font-size:14px ;
    /* padding: 0 15px;*/
    line-height:32px;
    border-radius: 3px;
    width:28%;
  }
  /*.yanzhengma input.phonemessage{*/
    /*width: 200px;*/
  /*}*/
  .marginBottom{
    margin-bottom: 55px;
    margin-top: 30px;
  }
  .content .current{
    background: #faae5c;
  }
  .yanzhengma .light{
    background: #f8931f;
  }
  #app .colorred{
    color: red;

  }

</style>