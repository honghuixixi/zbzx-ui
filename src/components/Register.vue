<template>
  <div>
    <div class="title">
      <span>当前位置 : 管理平台 /<span class="currentTable"> 注册</span></span>
      <span></span>
    </div>
    <div class="content">
      <div class="register">已有账号，<router-link to="/">返回登录</router-link></div>
      <div class="login">
        <img src="../assets/images/bline.png" alt="">
        <div class="loginCont">
          <div class="userInfo">

            <div class="infoTitle"><span class="line"></span>用户信息</div>
            <span class="label"><span class="error">*</span>登录名：</span>
            <input type="text"   placeholder="40个字符以内，不支持中文和空格" v-model="loginName" @blur="loginNameBlur"  maxlength="40">
            <div class="br">
              <span class="error" v-if="loginEmit">请输入登录名</span>
              <span class="error" v-if="loginError">登录名格式不正确(40个字符以内，不支持中文和空格)</span>
              <span class="error" v-if="loginExit">登录名已存在</span>
            </div>
            <span class="label"><span class="error">*</span>用户姓名：</span>
            <input type="text"   @blur="nameBlur" v-model="userName">
            <div class="br">
              <span class="error" v-if="nameEmit">请输入用户姓名</span>
            </div>
            <span class="label"><span class="error">*</span>手机号：</span>
            <input type="text"   placeholder="请输入手机号" v-model="phone" @blur="phoneBlur">
            <div class="br">
              <span class="error" v-if="phoneEmit">请输入手机号</span>
              <span class="error" v-if="phoneError">手机号格式不正确</span>
              <span class="error" v-if="phoneExit">手机号已存在</span>
            </div>
            <span class="label"><span class="error">*</span>验证码：</span>
            <input type="text"  class="yanzhengma" v-model="code" @blur="codeBlur">
            <span class="search" @click="getCode" v-if="canGet">获取验证码</span>
            <span class="search searchno" v-if="!canGet">{{num + 's'}}</span>
            <div class="br">
              <span class="error" v-if="codeEmpty">请输入验证码</span>
              <span class="error" v-if="codeError">请输入正确的验证码</span>
              <span class="error" v-if="codeMax">{{codeerrorTxt}}</span>
            </div>
            <span class="label"><span class="error">*</span>密码：</span>
            <input type="text"  placeholder="8~16位字符" @blur="psdBlur" v-model="password" minlength="8" maxlength="16">
            <div class="br">
              <span class="error" v-if="psdEmpty">请输入8~16位密码</span>
            </div>
          </div>
          <div class="orgInfo">
            <div class="infoTitle"><span class="line"></span>机构信息</div>
            <span class="label"><span class="error">*</span>机构名称：</span>
            <input type="text"  v-model="org"  @blur="orgBlur">
            <div class="br">
              <span class="error" v-if="orgEmpty">请输入机构名称</span>
              <span class="error" v-if="orgExit">机构名称已存在</span>
            </div>
            <span class="label"><span class="error">*</span>所在地区：</span>
            <!--v-model的值就是value的值-->
            <el-select v-model="provinceId" placeholder="省份" style=" margin-right: 14px;"  >
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                @click.native = provinceChange(item.id)
              >
              </el-option>
            </el-select>
            <el-select v-model="cityId" placeholder="城市" style=" margin-right: 14px;">
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                @click.native = cityChange(item.id)
              >
              </el-option>
            </el-select>
            <el-select v-model="countyId" placeholder="区县" >
              <el-option
                v-for="item in countyList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <div class="br">
              <span class="error" v-if="palce">请选择所在地区</span>
            </div>
            <span class="label "><span class="error">*</span>上级行政单位：</span>
            <el-select v-model="upunitId" placeholder="请选择" style="width: 490px">
              <el-option
                v-for="item in orgList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                style="width: 488px;overflow: hidden"
              >
              </el-option>
            </el-select>
            <div class="br">
              <span class="error" v-if="upunitEmpty">请选择上级行政单位</span>
            </div>
            <span class="label "><!-- <span class="error">*</span> -->医疗机构代码：</span>
            <input type="text" v-model="hplCode" @blur="hplCodeBlur">
            <div class="br">
              <span class="error" v-if="hplcodeEmpty">请输入医疗机构代码</span>
              <span class="error" v-if="hplCodeErr">{{hplcodeTxt}}</span>
            </div>
            <span class="label ">组织机构代码：</span>
            <input type="text" v-model="orgCode">
            <div class="br"></div>
            <span class="label ">医疗机构类型：</span>
            <el-select v-model="orgTypeId" placeholder="请选择" style="width: 490px">
              <el-option
                v-for="item in tenantType"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="br"></div>
            <span class="label ">经济类型：</span>
            <el-select v-model="economicTypenameId" placeholder="请选择" style="width: 490px">
              <el-option
                v-for="item in economicType"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="br"></div>
            <span class="label ">机构分类管理类型：</span>
            <el-select v-model="manageTypenameId" placeholder="请选择" style="width: 490px">
              <el-option
                v-for="item in manageType"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="br"></div>
            <span class="label">医院等级：</span>
            <!--v-model的值就是value的值-->
            <el-select v-model="gradenameId" placeholder="级别" style=" margin-right: 14px;">
              <el-option
                v-for="item in grade"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="hierarchynameId" placeholder="等次" >
              <el-option
                v-for="item in hierarchy"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span style="display: inline-block;width: 168px;"></span>
            <div class="br"></div>
          </div>
          <span class="search loginBtn" @click="submit">提交注册</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import MyFooter from '@/components/Footer'
  import config from '@/service/config'
  export default{
    data(){
      return {
        manageTypenameId:'',
        gradenameId:'',
        hierarchyname:'',
        userName:'',//用户名称
        nameEmit:false,//用户名为空
        optionsList:[
          {typeID:0,name:'全部'},
          {typeID:1,name:'售后服务'},
          {typeID:2,name:'质量缺陷'},
          {typeID:3,name:'操作使用'},
          {typeID:4,name:'产品配置'},
          {typeID:5,name:'其它'}
        ],
        phone:'',//手机号
        phoneEmit:false,//手机号为空
        phoneError:false,//手机号格式不正确
        phoneExit:false,//手机号已经存在
        num:60,//倒计时
        canGet:true,
        code:'',//验证码
        codeEmpty:'',//请输入验证码
        psdEmpty:false,//密码为空
        password:'',//密码
        division:'',//所在科室
        divEmpty:'',//科室为空
        org:'',//机构
        orgEmpty:false,//机构名称
        orgExit:false,//机构存在
        provinceList:[],//获取省份
        cityList:[],
        countyList:[],
        provinceId:'',
        cityId:'',
        palce:false,
        orgList:[],//上级行政机构
        upunit:'',//上级单位选择
        upunitEmpty:false,//上级单位为空提醒
        hplcodeEmpty:false,//医疗机构代码为空
        hplCode:'',//医疗机构代码
        orgCode:'',//组织机构代码
        tenantType : [
          {id:0,name:'请选择'},
          {id:1,name:'医疗机构'},
          {id:2,name:'基层医疗卫生机构部'},
          {id:3,name:'疾病预防控制中心'}],
        tenantTypename:'',//机构类型
        economicType : [
            {id: 0, name: '请选择'},
            {id: 1, name: '公立'},
            {id: 2, name: '民营'}],
        economicTypename:'',
        manageType :[
          {id: 0, name: '请选择'},
          {id: 1, name: '营利性'},
          {id: 2, name: '非营利性'},
          {id: 3, name: '其它'}],
        grade :[
         {id: 0, name: '请选择'},
         {id: 1, name: '一级'},
         {id: 2, name: '二级'},
         {id: 3, name: '三级'},
         {id: 4, name: '未定级'}],
        gradename:'',
        hierarchy : [{id: 0, name: '请选择'},
          {id: 1, name: '特等'},
          {id: 2, name: '甲等'},
          {id: 3, name: '乙等'},
          {id: 4, name: '丙等'},
          {id: 6, name: '未评'}],
        hierarchyname:'',
        orgType:'',
        countyId:'',
        upunitId:'',
        orgTypeId:'',
        economicTypenameId:'',
        hierarchynameId:'',
        codeError:false,
        hplcodeTxt:'',
        hplCodeErr:false,
        codeMax:false,//发送的验证码已经超过次数了
        codeerrorTxt:'',
        loginName:'',//登录名
        loginEmit:'',
        loginExit:'',
        loginMsg:'',
        loginError:false,
        isSave: true
      }
    },
    components: {
      MyFooter
    },
    created(){
//      获取省份
      axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/area/province')
        .then(res=> {
          if(res.data.code==200 ){
            this.provinceList = res.data.data
          }
        })
        .catch(err=>{
          console.log(err);
        }),
//        上级行政机构
       axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/tenant/all/manageTenant')
          .then(res=> {
            if(res.data.code==200 ){
              this.orgList = res.data.data
            }
          })
          .catch(err=>{
            console.log(err);
          })
    },
    methods: {
//      用户名称失焦
      nameBlur(){
        if (this.userName) {
          this.nameEmit = false
        } else {
          this.nameEmit = true
        }
      },
//      登录名失焦校验
      loginNameBlur(){
        if(this.loginName){
          var reg = /^[^\u4E00-\u9FA5\s]{1,40}$/
          // 发送请求，判断等绿名是否存在

          if(reg.test(this.loginName)) {
            axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/user/checkLoginName?loginName=' + this.loginName.toLowerCase())
              .then(res=> {
                if (res.data.code == 200 && res.data.data) {
                  this.loginEmit = false
                  this.loginExit = true
                  this.loginError = false
                }
              })
              .catch(err=> {
                console.log(err);
              })
          }else{
            this.loginEmit = false
            this.loginExit = false
            this.loginError = true
          }
        }else{
            this.loginEmit = true
            this.loginExit = false
            this.loginError = false
        }
      },
//      手机号失去焦点
      phoneBlur(){
        if (this.phone) {
          var reg = /^(1[3-8][0-9])\d{8}$/
          if (reg.test(this.phone)) {
//            发送请求，判断手机号是否存在
            // axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/tenant/mobileCheck?mobile=' + this.phone)
            //   .then(res=> {
            //     if (res.data.code == 200 && res.data.data) {
            //       this.phoneExit = true
            //       this.phoneError = false
            //       this.phoneEmit = false
            //     }
            //   })
            //   .catch(err=> {
            //     console.log(err);
            //   })
          } else {
            this.phoneError = true
            this.phoneEmit = false
            this.phoneExit = false
          }
        } else {
          this.phoneEmit = true
          this.phoneError = false
          this.phoneExit = false
        }

      },
//      获取验证码
      getCode(){
        this.num=60
        if (this.phone && !this.phoneEmit && !this.phoneError && !this.phoneExit) {
//          发送验证码请求
          axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/index/sendRstCode?account=' + this.phone)
            .then(res=> {
              if (res.data.code == 200) {
                this.canGet = false
                var timer = setInterval(()=> {
                  this.num--
                  if (this.num <= 0) {
                    clearInterval(timer)
                    this.canGet = true
                  }
                }, 1000)
              } else{
                //this.$message.error(res.data.msg);
                this.codeerrorTxt = res.data.msg
                this.codeMax = true
              }
            })
            .catch(err=> {
              console.log(err);
            })
        }
      },
//      验证码失去焦点校验
      codeBlur(){
        if (!this.code) {
          this.codeEmpty = true
          this.codeMax = false
        } else {
          this.codeEmpty = false
          this.codeMax = false
        }
      },
//      密码校验
      psdBlur(){
        if (!this.password || this.password.length<8 || this.password.length>16) {
          this.psdEmpty = true
        } else {
          this.psdEmpty = false
        }
      },
//      所在科室失去焦点校验
      divBlur(){
        if (!this.division) {
          this.divEmpty = true
        } else {
          this.divEmpty = false
        }
      },
//      机构名称失去焦点
      orgBlur(){
        if (!this.org) {
          this.orgEmpty = true
        } else {
          this.orgEmpty = false
//          发送请求
          axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/tenant/tenantNameCheck?tenantName=' + this.org)
            .then(res=> {
              if (res.data.code == 200 && res.data.data) {
                this.orgExit = true
              }
            })
            .catch(err=> {
              console.log(err);
            })
        }
      },
//      省份获取id
      provinceChange(id){
        this.cityId = ''
        this.countyId = ''
        axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/area/' + id + '/city')
          .then(res=> {
            if (res.data.code == 200) {
              this.cityList = res.data.data
            }
          })
          .catch(err=> {
            console.log(err);
          })
      },
      cityChange(id){
        this.countyId = ''
        axios.get(config.server(process.env.NODE_ENV) + '/zbzxsys/area/' + id + '/region')
          .then(res=> {
            if (res.data.code == 200) {
              this.countyList = res.data.data
            }
          })
          .catch(err=> {
            console.log(err);
          })
      },
      //医疗机构代码的失去焦点事件
      hplCodeBlur(){
        // if (!this.hplCode) {
        //   this.hplcodeEmpty = true
        // } else {
        //   this.hplcodeEmpty = false
        // }
        this.hplcodeEmpty = false
      },
//      提交事件
      submit(){
        if(!this.loginName){
          this.loginEmit = true
        }else if (!this.userName) {
          this.nameEmit = true
        } else if (!this.phone) {
          this.phoneEmit = true
        } else if (!this.code) {
          this.codeEmpty = true
        } else if (!this.password) {
          this.psdEmpty = true
        } else if (!this.org) {
          this.orgEmpty = true
        } else if (!this.provinceId || !this.cityId || !this.countyId) {
          this.palce = true
        } else if (!this.upunitId) {
          this.upunitEmpty = true
        } /*else if (!this.hplCode) {
          this.hplcodeEmpty = true
        }*/
        if (!this.loginEmit && !this.loginExit && !this.loginError && !this.nameEmit && !this.phoneEmit && !this.phoneError && !this.phoneExit && !this.codeEmpty && !this.psdEmpty
          && !this.divEmpty && !this.orgEmpty && !this.orgExit && !this.palce && !this.upunitEmpty && !this.hplcodeEmpty
          && !this.codeError && !this.hplCodeErr && !this.codeMax) {
          if(this.isSave){
            this.isSave = false;
            axios.post(config.server(process.env.NODE_ENV) + '/zbzxsys/tenant/createTrialSubTenantForZjzx', {
              realName: this.userName,
              mobile: this.phone,
              verifyCode: this.code,
              password: this.password,
              name: this.org,
              province: this.provinceId,
              city: this.cityId,
              county: this.countyId,
              manageTenantId: this.upunitId,
              license: this.orgCode,
              loginName:this.loginName.toLowerCase(),
              hplTenant: {
                orgCode: this.hplCode,
                manageType: this.manageTypenameId,
                category: this.orgTypeId,
                economicType: this.economicTypenameId,
                grade: this.gradenameId,
                hierarchy: this.hierarchynameId,
              },
              createAdmin: true,
              createBy: 0,
              origin: 2,
              parentId: 1,
              trial: 0,
              subTenantLimit: 0,
              updateBy: 0,
              commercialUse:0,
              tenantType:1
            }).then(res=> {
              this.isSave = true;
              if (res.data.code == 200) {
                this.$router.push({path: '/'});
              } else if (res.data.code == 'L_007') {
                this.codeError = true
              } else if (res.data.code == 'L_003') {
                this.codeError = true
              } else if (res.data.code == 'O_016') {
                this.hplcodeTxt = res.data.msg;
                this.hplCodeErr = true;
              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        }
      }
    },
    watch:{
      loginName:function (oldVlue, newVlue) {
        this.loginName = this.loginName.replace(/&/,'')
        this.loginEmit = false
        this.loginExit = false
        this.loginError = false
      },
      userName:function (oldVlue, newVlue) {
        this.nameEmit = false
      },
      phone: function (oldVlue, newVlue) {
        this.phoneEmit = false,
          this.phoneError = false,
          this.phoneExit = false
      },
      code: function (oldVlue, newVlue) {
        this.codeEmpty = false
        this.codeError = false
        this.codeMax = false
      },
      password: function (oldVlue, newVlue) {
        this.psdEmpty = false
      },
      org: function (oldVlue, newVlue) {
        this.orgExit = false
        this.orgEmpty = false
      },
      provinceId:function(oldVlue, newVlue){
        this.palce = false
      },
      cityId:function(oldVlue, newVlue){
        this.palce = false
      },
      countyId:function(oldVlue, newVlue){
        this.palce = false
      },
      upunitId:function(oldVlue, newVlue){
        this.upunitEmpty = false
      },
      hplCode:function(oldVlue, newVlue){
        this.hplcodeEmpty = false
        this.hplCodeErr = false
      }
    }
  }
</script>
<style scoped>
  .title{
    border-bottom: 0 !important;
  }
  .content{
    width: 819px;
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
    margin-bottom: 60px;
    border: 1px solid #dcdcdc;
    border-top:0;
    margin-top: -11px;
    text-align: center;
    padding-top: 80px;
  }
  #app input{
    border: 1px solid #dcdcdc;
    width: 480px;
  }
  #app input.yanzhengma{
    width: 350px;
  }
  #app .br{
    height: 30px;
    line-height: 30px;
    text-align: left;
    padding-left: 250px;
  }

  #app .loginBtn{
    width: 480px;
    margin-top: 40px;
    margin-bottom: 60px;
  }
  input:focus{
    border: 1px solid #dcdcdc;
    width: 480px;
  }
  .loginBtn{
    width: 339px;
    background: #007cb5;
  }
  .infoTitle{
    font-size: 18px;
    text-align: left;
    padding-left: 102px;
    height: 40px;
  }
  .line{
    background: #007cb5;
    width:2px ;
    display: inline-block;
    height:18px;
    vertical-align: middle;
    margin-right: 10px;
  }
  .label{
    width: 165px;
    text-align: right;
    display: inline-block;
  }
  .search{
    width: 120px;
  }
  .el-select{
   width: 150px;

  }
  .searchno{
    background: #bebebe !important;
  }
</style>