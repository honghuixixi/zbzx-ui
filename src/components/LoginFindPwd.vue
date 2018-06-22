<template>
	<div style="text-align: left;">
		<span class="forgetpsd" @click="displayModal('忘记密码', '下一步', 1)" style="top: 85px;right: 300px;">忘记密码？</span>
        <span class="forgetpsd" @click="displayModal('找回账号', '确定', 2)" style="top: 85px;right:200px;">找回账号？</span>
        <el-dialog
	      :title="title"
	      :visible.sync="showModal"
	      width="500px"
	    >
	      <div class="name">
	        <div v-show="step == 1">
	          <div class="loginInput">
	          	<img src="../assets/images/yh.png" alt="">
	            <input type="text" v-model="phone" placeholder="手机号" @blur="phoneBlur()" style="width: 75%">
	            <div style="height: 30px;line-height: 25px; color: red;">{{msg1}}</div>
	          </div>

	          <div class="loginInput yanzhengma" style="margin-top: 30px">
	          	<img src="../assets/images/yzm.png" alt="">
	            <input type="text" v-model="code" class="code" placeholder="验证码" @blur="codeBlur()" style="width: 40%">
	            <button @click="getCaptchaCode()" :class="{'active': isPhoneExist && !isTime}" style="width: 32%">{{txt}}</button>
	            <div style="height: 30px;line-height: 25px; color: red;">{{msg2}}</div>
	          </div>
	          <span @click="findAccount()"  class="search changeMsg" style="margin-top: 50px;">{{btnText}}</span>
	          <span class="changeMsg search changeMsg2"  @click="closeModal" >返回登录</span>
	        </div>
	      </div>
	      <div v-show="step == 2">
	      	<div style="position: relative;" v-for="v in users">
		        <dl class="user-dl">
		          <dt>机构名称：</dt>
		          <dd>{{v.tenantName}}&nbsp;</dd>
		          <dt>登录名：</dt>
		          <dd>{{v.loginName}}&nbsp;</dd>
		        </dl>
		        <div class="user-reset" v-if="type == 1" @click="showStep3(v)">重置密码</div>
	        </div>
	        <span class="changeMsg search changeMsg2"  style="margin-top: 40px;" @click="closeModal" >返回登录</span>
	      </div>
	      <div v-if="step == 3">
	      	<dl class="user-dl" style="border: 0;">
		        <dt>机构名称：</dt>
		        <dd>{{currentUser.tenantName}}&nbsp;</dd>
		        <dt>登录名：</dt>
		        <dd style="margin-bottom: 20px;">{{currentUser.loginName}}&nbsp;</dd>
		        <dt style="margin-top:4px;">新密码：</dt>
		        <dd style="margin-bottom: 0;">
		        	<input type="password"  placeholder="请输入8~16位新密码" style="border: 1px solid #dcdcdc;" v-model="pwd" @blur="pwdBlur">
		        	<div style="height: 30px;line-height: 25px; color: red;">{{msg3}}</div>
		        </dd>
		        <dt style="margin-top:4px;">确认密码：</dt>
		        <dd style="margin-bottom: 0;">
		        	<input type="password"  placeholder="请输入确认密码" style="border: 1px solid #dcdcdc;" v-model="pwd2" @blur="pwd2Blur">
		        	<div style="height: 30px;line-height: 25px; color: red;">{{msg4}}</div>
		        </dd>
		    </dl>
		    <span class="search changeMsg" style="margin-top: 10px;" @click="resetPassword">确定修改</span>
	        <span class="changeMsg search changeMsg2"  @click="closeModal" >返回登录</span>
	      </div>
	      <span style="margin-top: 40px;display: inline-block;border-top: 1px dashed #dedede;padding-top: 15px;text-align: center">如有其他疑问，请联系浙江医学装备中心，邮箱zjyxzb@126.com，联系人：张吉 13306534826</span>
	    </el-dialog>
	</div>
</template>
<script>
	import axios from 'axios'
	import config from '@/service/config'
	export default {
		data() {
			return {
				type: 1,	// 1：忘记密码 2：找回账号
				title: '忘记密码', // 对话框标题
				btnText: '下一步', // 步骤一确定按钮显示文本
				showModal: false,
				step: 1,	// 1：获取验证码 2：显示账号  3：重置密码
				phone: '',	// 手机号
				pwd: '',	// 新密码
				pwd2: '',	// 确认密码
				code: '',	// 验证码
				msg1: '',	// 手机号和验证手机号码是否存在错误提示
				msg2: '',	// 验证码和接口验证错误提示
				timeCount: 60, // 倒计时时长
				timeFun: null, // 倒计时函数
				isTime: false, // 是否是在倒计时
				isPhoneExist: false, // 手机号是否存在
				txt: '获取验证码', // 获取验证码按钮显示文本
				users: [], // 手机号相关联的用户列表
				currentUser: null, // 当前重置密码的用户
				msg3: '', // 新密码错误提示
				msg4: ''  // 确认密码错误提示
			}
		},
		watch: {
			phone(){
				this.msg1 = '';
				this.msg2 = '';
			},
			code() {
				this.msg1 = '';
				this.msg2 = '';
			},
			pwd() {
				this.msg3 = '';
				this.msg4 = '';
			},
			pwd2() {
				this.msg3 = '';
				this.msg4 = '';
			}
		},
		methods: {
			reset() {
				this.step = 1;
				this.phone = '';
				this.code = '';
				this.pwd = '';
				this.pwd2 = '';
				this.msg1 = '';
				this.msg2 = '';
				this.timeCount = 60;
				this.isTime= false;
				this.isPhoneExist = false;
				this.txt = '获取验证码';
				this.uses = [];
				this.currentUser = null;
				this.msg3 ='';
				this.msg4 = '';
				if(this.timeFun){
					clearInterval(this.timeFun);
				}
			},
			displayModal(title, txt, type) {
				this.type = type;
				this.title = title;
				this.btnText = txt;
				this.reset();
				this.showModal = true;
			},
			closeModal() {
				this.reset();
				this.showModal = false;
			},
			checkPhoneInput() {
				this.msg1 = '';
		        var reg = /^(1[3-8][0-9])\d{8}$/
		        if (!this.phone) {
		          this.msg1 = '请输入手机号';
		          return false;
		        } else if (!reg.test(this.phone)) {
		          this.msg1 = '手机号格式不正确';
		          return false;
		        }
		        return true;
			},
			checkCodeInput() {
				this.msg2 = '';
				if(!this.code){
		          this.msg2 = '请输入验证码'
		          return false;
		        }
		        return true;
			},
			checkPwdInput() {
				var reg2 = /^[0-9a-zA-Z]{8,16}$/
				this.msg3 = '';
				if(!this.pwd){
					this.msg3 = '请输入8~16位新密码';
					return false;
				}else if (this.pwd.length < 8 ) {
		          this.msg3 = '新密码至少8位';
		          return false;
		        }else if(!reg2.test(this.pwd)){
		          this.msg3 = '新密码只能是数字或字母';
		          return false;
		        }
				return true;
			},
			checkPwd2Input() {
				this.msg4 = '';
				if(!this.pwd2){
					this.msg4 = '请输入确认密码';
					return false;
				}else if(this.pwd != this.pwd2){
					this.msg4 = '新密码与确认密码不一致';
					return false;
				}
				return true;
			},
			// 重置密码失去焦点校验
		    phoneBlur:function(){		
		    	this.isPhoneExist = false;    	
		    	if(this.checkPhoneInput()){
		    		axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/user/checkMobile?mobile=' + this.phone)
		            .then(res=> {
		              if (res.data.code == 200 && res.data.data) {
		                this.isPhoneExist = true
		              } else {
		                this.msg1 = '手机号不存在'
		              }
		            })
		            .catch(err=> {
		              console.log(err);
		            })
		    	}
		    },
		    codeBlur(){		    	
		        this.checkCodeInput();
		    },
		    pwdBlur() {
		    	this.checkPwdInput();
		    },
		    pwd2Blur() {
		    	this.checkPwd2Input();
		    },
		    showStep3(user) {
		    	this.currentUser = user;
		    	this.step = 3;
		    },
		    getCaptchaCode(){
		      	this.msg2 = ''
		      	if(this.checkPhoneInput() && this.isPhoneExist){
		      		axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/index/sendCode?account=' + this.phone)
		            .then(res=> {
		              if (res.data.code == 200 ) {
		              	this.txt = this.timeCount + 's';
		              	this.isTime = true;
		                this.timeFun = window.setInterval(() => {
		                	this.timeCount--;
		                	this.txt = this.timeCount + 's';
		                	if(this.timeCount <= 0){
		                		this.txt = "重新获取验证码";
		                		this.isTime = false;
		                		this.timeCount = 60;
		                		window.clearInterval(this.timeFun);
		                	}
		                }, 1000)
		              }else{
		                this.msg2 = res.data.msg
		              }
		            })
		            .catch(err=> {
		              console.log(err);
		            })
		      	}
		    },
			findAccount: function () { 
				if(this.checkPhoneInput() && this.checkCodeInput() && this.isPhoneExist){
					let param = {
		                "account": this.phone,
		                "code": this.code
		            };
		          	axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/index/validateCode', { params: param })
			        .then(res=> {
			            if (res.data.code == 200 ) {
			            	this.reset();
			                this.step = 2;
			                this.users = res.data.data;
			            } else{
			                this.msg2 = res.data.msg
			            }
			        })
			        .catch(err=> {
			            console.log(err);
			        })
				}  
		    },
		    resetPassword(){
		    	if(this.checkPwdInput() && this.checkPwd2Input()){
		    		let param = {
		                    "userId": this.currentUser.id,
		                    "password": this.pwd,
		                    "confirmPassword": this.pwd2
		          	}
		          	axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/index/resetPassword',{ params: param })
		            .then(res=> {
		              if (res.data.code == 200 ) {
		              	this.reset();
		                this.showModal = false;
		              } else{
		                  this.msg4 = res.data.msg
		              }
		            })
		            .catch(err=> {
		              console.log(err);
		            })

		    	}
		    }
		}
	}
</script>
<style scoped>
  .el-dialog .el-dialog__body{
    height: 100px;
    padding: 20px;
  }
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
    position: relative;
  }
  .yanzhengma .countdownInput{
    position: absolute;
    height:  32px;
    border: none;
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
  .yanzhengma button{
    float: right;
    background-color: #bebebe;
    color: #fff;
    border: 0;
    height:32px;
    font-size:14px ;
    line-height:32px;
    border-radius: 3px;
    width:28%;
  }
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
  .yanzhengma button.active{
    background-color: #007cb5
  }
  .user-dl {
    margin: 0 0 10px 0;
    padding: 0 0 10px 0;
    border-bottom: 1px solid #dcdcdc;
    overflow: hidden;
  }
  .user-dl dt {
    float: left;
    width: 80px;
    text-align: right;
  }
  .user-dl dd {
    margin-left: 80px;
    margin-bottom: 5px;
  }
  .user-reset {
  	position: absolute;
  	top: 10px;
  	right: 0;
  	z-index: 10;
  	width: 90px;
  	height: 34px;
  	font-size: 14px;
  	line-height: 34px;
  	text-align: center;
  	border-radius: 5px;
  	background-color: #007cb5;
  	color: #fff;
  	cursor: pointer;
  }
</style>