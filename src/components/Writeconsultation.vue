<template>
  <div >
    <div class="title">
      <span><span style="cursor: pointer" @click="goBack">当前位置 : 管理平台 /</span><span class="currentTable"> 我要咨询</span></span>
      <span></span>
    </div>
    <div class="writeCont">
      <div class="userInfo" v-if="userInfo">
        <span class="usertitle">申请人信息：</span><br>
        <span class="color999 "><span style="display: inline-block;width: 90px;text-align: right">申请人：</span>{{userInfo.name}}</span><span class="weixin color999">手机号：{{userInfo.phone}}</span><br>
        <span class="color999 "><span style="display: inline-block;width: 90px;text-align: right">机构信息：</span>{{userInfo.org}}</span><br>
        <span class="userCont"><span style="display: inline-block;width: 50px;text-align: right">邮箱  </span> <span class="emailInput"> <input type="text" placeholder="请输入正确的邮箱" @blur="blur" v-model="email"><span class="error" v-if="emailError">*邮箱格式不正确</span></span></span><img src="../assets/images/right.png" alt=""  v-show="emailRight">
        <span class="weixin">微信  <input type="text" placeholder="请输入个人微信号" maxlength="40" v-model="wx"></span>
      </div>
      <div class="suggest">
        <div style="height: 40px"></div>
        <span class="usertitle">咨询内容：</span><br>
        <div style="height: 40px"></div>
        <span ><img src="../assets/images/master.png" alt=""><span > 产品 <input type="text" placeholder="产品名称，40个字符以内" maxlength="40" v-model="productor" @blur="proBlur"></span></span>
        <div ><span class="error errorLeft" v-if="productorEmpty">*请输入产品名称</span></div>
        <span><img src="../assets/images/master.png" alt=""><span> 厂商 <input type="text" placeholder="厂商名称，40个字符以内" maxlength="40" v-model="manufacturer" @blur="manBlur"></span></span>
        <div ><span class="error errorLeft" v-if="manufacturerEmpty">*请输入厂商名称</span></div>
        <span><img src="../assets/images/master.png" alt="">
          <span >
            类型 <el-select v-model="type" placeholder="请选择咨询类型"  @change="selectchange">
          <el-option
            v-for="item in optionsList"
            :key="item.typeID"
            :label="item.name"
            :value="item.typeID">
          </el-option>
        </el-select>
          </span>
        </span>
        <div ><span class="error errorLeft" v-if="typeEmpty">*请选择咨询类型</span></div>
        <span><img src="../assets/images/master.png" alt=""><span > 标题 <input type="text" placeholder="标题名称，50个字符以内" maxlength="50" v-model="title" @blur="titleBlur"></span></span>
        <div ><span class="error errorLeft" v-if="titleEmpty">*请输入标题</span></div>
        <span><img src="../assets/images/master.png" alt="" style="vertical-align: top;margin-top: 5px">
          <span> 
            <span style="vertical-align: top" > 内容</span> 
              <div class="vueeditor">
                <quill-editor 
                    ref="myTextEditor"
                    v-model="content"
                    :options="editorOption"
                    @blur="onEditorBlur($event)">
                </quill-editor>
                <el-upload
                  class="avatar-uploader"
                  :action="baseUrl + '/upload/zbzx'"
                  accept=".jpg,.jpeg,.png,.gif"
                  name="files"
                  :show-file-list="false"
                  :on-success="uploadEditorSuccess"     
                  :before-upload="beforeEditorUpload">
                </el-upload>
              </div>
        </span>
      </span>
        <div ><span class="error errorLeft" v-if="contentEmpty">*请输入内容</span></div>
        <span style="padding-top: 20px;display: inline-block;height: auto">
           <span style="padding-left: 12px">附件  </span>
          <div class="filesUl">
            <el-upload
              class="upload-demo"
              :action="baseUrl + '/upload/zbzx'"
              :on-change="change"
              :before-upload="beforeUpload"
              :on-remove="remove"
              multiple
              :limit="20"
              :on-exceed="handleExceed"
              :file-list="files"
              name="files"
              :on-success="upload3">
              <span v-if="btnHidden">
                 <el-button size="small" type="primary" ><img src="../assets/images/files.png" alt="" style="position: relative;top: 3px;">
                  <span v-if="btnHidden">上传附件</span></el-button>
              </span>

        <div slot="tip" class="el-upload__tip">*单个文件20M以内，最多上传20个</div>
      </el-upload>
          </div>
      </span>
        <div class="comment" >
          <span class="announce subcomment" @click="sub">提交咨询</span><span class="announce subcomment cancel" @click="goBack">取消并返回</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {postWriteconsulta} from '@/service/api'
  import config from '@/service/config'
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    // ['blockquote', 'code-block'],
    // [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    // [{'direction': 'rtl'}],                         // text direction
    // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    // [{'font': []}],
    [{'align': []}],
    // ['align-right'],
    ['image']                                        // remove formatting button
  ]
  export default{
    data(){
      return {
        isSave: true,
        userInfo:JSON.parse(localStorage.getItem('userInfo')),
        email:'',
        wx:'',
        emailError:false,
        type:'',
        typeEmpty:'',
        emailRight:false,
        optionsList:[
          {typeID:1,name:'采购计划'},
          {typeID:2,name:'验收管理'},
          {typeID:3,name:'使用管理'},
          {typeID:4,name:'巡检质控'},
          {typeID:5,name:'信息化'},
          {typeID:6,name:'其它'},
        ],
        files: [],
        productorEmpty:false,
        productor:'',
        manufacturer:'',
        manufacturerEmpty:false,
        title:'',
        titleEmpty:false,
        content:'',
        contentEmpty:false,
        btnHidden:true,
        filesGet:[],
        baseUrl: config.server(process.env.NODE_ENV).replace('api', 'zuul/api'),
        editorOption: {
            placeholder: '请输入咨询内容，10000个字符以内',
            modules: {
              toolbar: {
                container: toolbarOptions,  // 工具栏
                handlers: {
                  'image': function (value) {
                    if (value) {
                      // alert(1)
                      document.querySelector('.avatar-uploader input').click()
                    } else {
                      this.quill.format('image', false);
                    }
                  }
                }
              }
            }
        }
      }
    },
    methods:{
      onEditorBlur(quill) {
        this.contentEmpty = this.content.length < 1;
      },
      goBack(){
        this.$router.push({path: '/page/consultation'});
      },
      blur(){
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(this.email) {
          if (myreg.test(this.email)) {
            this.emailRight = true
            this.emailError = false
          } else {
            this.emailRight = false
            this.emailError = true
          }
        }
      },
      proBlur(){
        if(!this.productor){
          this.productorEmpty = true
        }else{
          this.productorEmpty = false
        }
      },
      manBlur(){
        if(!this.manufacturer){
          this.manufacturerEmpty = true
        }else{
          this.manufacturerEmpty = false
        }
      },
      titleBlur(){
        if(!this.title){
          this.titleEmpty = true
        }else{
          this.titleEmpty = false
        }
      },
      contBlur(){
        if(!this.content){
          this.contentEmpty = true
        }else{
          this.contentEmpty = false
        }
      },
      selectchange(){

        if(this.type){
          this.typeEmpty = false
        }else{
          this.typeEmpty = true
        }
      },
//        上传方法
      upload3(res,file,filesList){
        this.filesGet =this.filesGet.concat(res.data)
      },
      handleExceed(files, fileList) {
        //console.log(this.files)
        this.$message.warning('文件只能上传20个');
      },
      beforeUpload(file){
        if(file.size/(1024*1024)>20){
          this.$message.warning('单个文件20M以内')
          return false
        }
      },
      change(file, fileList){
        if(fileList.length==20){
          this.btnHidden = false
        }
      },
      remove(file, fileList){
        if(fileList.length<20){
          this.btnHidden = true
        }
        const _length = this.filesGet.length
        for(let i=0;i<_length;i++){
          if(this.filesGet[i].fileName===file.name){
            this.filesGet.splice(i,1)
            break
          }
        }
      },

//      取消并返回
      goback(){
        this.$router.push({path: '/page/complaint'});
      },
//      提交事件
      sub(){
        if(!this.productor){
          this.productorEmpty = true
        }else if(!this.manufacturer){
          this.manufacturerEmpty = true
        }else if(!this.type){
          this.typeEmpty = true
        }else if(!this.title){
          this.titleEmpty = true
        }else if(!this.content){
          this.contentEmpty = true
        }
        if(this.productor && this.manufacturer && this.type && this.title && this.content && !this.emailError){
          let param = {
            productor: this.productor,
            manufacturer: this.manufacturer,
            type:this.type,
            title:this.title,
            content:this.content
          }
          if(this.email){
            param.email = this.email
          }
          if(this.wx){
            param.wx = this.wx
          }
          if(this.filesGet.length!=0){
            param.files=this.filesGet
          }
          if(this.isSave){
            this.isSave = false;
            postWriteconsulta(param, (data) => {
              this.isSave = true;
              this.$router.push({path: '/page/consultation'});
            })
          }
        }
      },
      beforeEditorUpload(file){
        if(file.size/(1024*1024)>2){
          this.$message.warning('图片文件2M以内')
          return false
        }
        if(file.type.split('/')[0] !== 'image'){
          this.$message.warning('文件格式不正确')
          return false
        }
      },
      uploadEditorSuccess (res, file, fileslist){
        console.log(res);
        // 获取富文本组件实例
        let quill = this.$refs.myTextEditor.quill
        // 如果上传成功
        if ((res.code + '') === '200' && res.data !== null) {
            // 获取光标所在位置
            let length = quill.getSelection().index;
            // 插入图片  res.info为服务器返回的图片地址
            quill.insertEmbed(length, 'image', config.server(process.env.NODE_ENV) + '/file' + res.data[0].uploadUrl)
            // 调整光标到最后
            quill.setSelection(length + 1)
        } else {
            this.$message.error('图片插入失败')
        }
      }
    },
    watch:{
      email:function(oldVlue,newVlue){
        this.emailError = false
      }
    },
    components: {
      quillEditor
    }
  }
</script>
<style scoped>
  input{
    padding-left: 15px;
  }
  .writeCont{
    padding: 25px;
    padding-bottom: 40px;
  }
  .userInfo input{
    width: 305px;
  }
  .suggest input{
    width: 833px;
  }
  .userInfo{
    padding-bottom: 30px;
    border-bottom: 1px dashed #dcdcdc;
    line-height: 40px;
  }
  .emailInput{
    position: relative;
    margin-right: 10px;
  }
  .emailInput span{
    position: absolute;
    top:32px;
    left: 0;
    right: 0;
  }
  .weixin{
    margin-left: 40px;
  }
  .color999{
    color: #999;
  }
  .error{
    line-height: 16px;
  }
  .writeCont .usertitle{
    font-size: 18px;
    font-weight: bold;
    margin-left: 0 !important;
  }
  .userCont{
    padding-left: 25px;
  }
  .suggest>span{
    height: 80px;
    margin-left: 20px;
  }
  .errorLeft{
    margin-left: 70px;
  }
  .errorLefts{
    margin-left: 40px;
    cursor: pointer;
  }
  .el-select{
    width: 850px;
  }
  textarea{
    height: 160px;
    width: 828px;
  }
  .filesUl{
    width: 846px;
    position: relative;
    left: 53px;
    top:-24px;
  }
  .filesUl li{
    height: 40px;
    color: #007cb5;
  }
  .upload{
    background: #fff;
    color: #555;
    border: 1px solid #dcdcdc;
    margin-left: 73px;
  }
  .suggest .comment{
    height: 100px;
    margin-right: 100px;
  }
  .subcomment{
    float: right;
    margin-top: 30px;

  }
  .cancel{
    background: #fff;
    color: #555;
    border: 1px solid #e5e5e5;
  }
  .color999{
    font-size: 14px;
    /*margin-left: 20px;*/
  }
  .el-button--primary {
    background: #fff;
    border-color: #dcdcdc;
    color: #555;
    height: 30px;
    line-height: 30px;
  }
  .el-button{
    padding: 0 20px;
  }
  .suggest>div{
    height: 30px;
  }
  .vueeditor {
    margin-left: 72px;
    margin-top: -20px;
  }
</style>
