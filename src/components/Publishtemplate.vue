<template>
  <div >
    <ChoosePart
      :show="dialogFormVisible"
      :list="checkList"
      @close="closeDialog"></ChoosePart>
    <!--弹窗END-->

    <div class="title">
      <span><span style="cursor: pointer" @click="goback1">当前位置 : 管理平台 /</span><span class="currentTable"> <slot name="slot1"></slot></span></span>
      <span></span>
    </div>
    <div class="writeCont">
      <div class="userInfo" v-if="userInfo">
        <span class="usertitle">个人信息：</span><br>
        <span class="color999 "><span class="textright">发布人：</span>{{userInfo.name}}</span><span class="weixin color999">手机号：{{userInfo.phone}}</span><br>
        <span class="color999 "><span  class="textright">机构信息：</span>{{userInfo.org}}</span><br>
      </div>
      <div class="suggest">
        <div style="height: 40px"></div>
        <span class="usertitle"><slot name="slot2"></slot></span><br>
        <div style="height: 40px"></div>
        <span ><span class="textright"><img src="../assets/images/master.png" alt=""><span > 选择范围 </span></span>
          <span class="announce write" @click="choose">
          <img src="../assets/images/organiz.png" alt="">
          <span>选择机构</span>
          </span>
           <span class="announce write" style="margin-left: 20px">
            <img src="../assets/images/wdel.png" alt="">
          <span @click="checkList=[]">清空机构</span>
          </span><br>
          <div :class="{ 'orgList': !activeNew, 'orgListActive':activeNew }" v-if="checkList.length!=0" id='nameList'>
            {{names}}
              <img src="../assets/images/xxjt.png" alt="" @click="activeNew = true" v-if="!activeNew">
             <img src="../assets/images/xsjt.png" alt="" @click="activeNew = false" v-if="activeNew">
          </div>
        </span>
        <div ><span class="error errorLeft" v-if="orgEmpty">*请选择机构</span></div>
        <span>
          <span class="textright"><img src="../assets/images/master.png" alt=""> 标题 </span>
          <input type="text" placeholder="标题名称,50个字符以内" maxlength="50" v-model="title" @blur="titleBlur">
        </span>
        <div ><span class="error errorLeft" v-if="titleEmpty">*请输入标题</span></div>
        <span>
          <span class="textright alinetop"><img src="../assets/images/master.png" alt="" > 内容</span>

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
        </span>
        <span style="padding-top: 20px;display: inline-block;height: auto;padding-left: 40px">
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
              :on-success="upload3"
            >
              <span v-if="btnHidden">
                 <el-button size="small"  type="primary"><img src="../assets/images/files.png" alt="" style="position: relative;top: 3px;">
                  <span v-if="btnHidden">上传附件</span></el-button>
              </span>

        <div slot="tip" class="el-upload__tip">*单个文件20M以内，最多上传20个</div>
      </el-upload>
          </div>
      </span>
        <div class="comment" >
          <span class="announce subcomment" @click="sub"><slot name="slot3"></slot></span><span class="announce subcomment cancel" @click="goback()">取消并返回</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ChoosePart from '@/components/ChoosePart'
  import {publishNotice} from '@/service/api'
  import {postWritecomplaint} from '@/service/api'
  import {getEditInfo} from '@/service/api'
  import config from '@/service/config'
  import {getNewsInfo} from '@/service/api'
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
    props:['uri'],
    data(){
      return {
        id: 0,
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        title: '',
        titleEmpty: false,
        orgEmpty:false,
        content: '',
        contentEmpty: false,
        dialogFormVisible: false,//弹窗变量
        manageId: '',
        checkList: [],
        files: [],
        files2: [],
        filesGet:[],
        btnHidden:true,
        baseUrl: config.server(process.env.NODE_ENV).replace('api', 'zuul/api'),
        hasHolder: true,
        activeNew:false,
        editorOption: {
          placeholder: '请输入内容，10000个字符以内',
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
    computed: {
      names() {
        let arr = this.checkList.map((item) => {
          return item.name
        })
        return arr.join("；")
      },
      ids(){
        let arr = this.checkList.map((item) => {
          return item.id
        })
        return arr
      }
    },
    components: {
      ChoosePart,
      quillEditor
    },

    methods: {
      onEditorBlur(quill) {
        this.contentEmpty = this.content.length < 1;
      },
      closeDialog(list) {
        this.dialogFormVisible = false
        if (list) {
          this.checkList = list
          setTimeout(() => {
            console.log(document.getElementById('nameList').offsetHeight)
          }, 100)
          
        }
      },
      // 失去焦点校验
      titleBlur(){
        if (!this.title) {
          this.titleEmpty = true
        } else {
          this.titleEmpty = false
        }
      },
      contBlur(){
        if (!this.content) {
          this.contentEmpty = true
        } else {
          this.contentEmpty = false
        }
      },
      // 取消并返回
      goback1(){
        this.$router.push({path: this.uri});
      },
      // 点击弹窗
      choose(){
        this.dialogFormVisible=true
        this.orgEmpty = false
      },
      // 提交事件
      sub(){
        // this.content = this.getContent();
        if(this.checkList.length==0){
          this.orgEmpty = true
        } else if (!this.title) {
          this.titleEmpty = true
        } else if (!this.content) {
          this.contentEmpty = true
        } else if(this.content.length < 1){
          this.contentEmpty = true
        }else {
          this.$emit(this.id ? 'edit' : 'sub', this.getParam(this.title, this.content,this.ids,this.filesGet))
        }
      },
      goback(){
        this.$emit('goback')
      },
      // 检测文件类型和大小
      checkImgType(file){
        // console.log(file)
        let arr = ['.jpg', '.jpeg', '.png'];
        let suffix = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
        let isImg = false
        for(var i=0,len=arr.length; i<len; i++){
          if(arr[i] === suffix){
            isImg = true
            break
          }
        }
        if(!isImg){
          this.$message.warning('格式不正确，仅支持jpg、jpeg、png格式的图片插入')
          return false
        }
        if(file.size/(1024*1024)>5){
          this.$message.warning('单个文件5M以内')
          return false
        }
      },
      // 上传方法
      handleExceed(files, fileList) {
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
      upload3(res,file,filesList){
        this.filesGet =this.filesGet.concat(res.data)
      },
      upload32(res,file,filesList){
        this.hasHolder = false
        document.getElementById("editDiv").focus()
        this.insertAtCursor('<img src="' + config.server(process.env.NODE_ENV) + '/file' + res.data[0].uploadUrl + '">')
      },
      getParam(title,content,ids,filesGet){
        let param = {
          title: title,
          content: content,
          ids: ids
        }
        if(filesGet.length!=0){
          param.files=filesGet
        }
        if(this.id > 0){
          param.id = this.id
        }
        return param
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
      title:function(newv,oldv){
        this.title = this.title.replace(/^\s*/g, "")
      },
      content:function(newv,oldv){
        this.content = this.content.replace(/^\s*/g, "")
      }
    },
    mounted () {
      this.$nextTick(() => {
        // 获取参数
        this.id = this.$route.query.id
        if(this.id > 0){
          getEditInfo({id:this.id}, (item) => {
            this.title = item.title
            this.content = item.content
            this.checkList = item.tenants;
            this.files = item.files ? item.files.map((item) => {return {name: item.fileName, url: item.uploadUrl}}) : []
            this.filesGet = item.files || []
            this.hasHolder = false
            if(this.files.length==20){
              console.log(this.files.length)
              this.btnHidden = false
            }
          },(msg,data)=>{
            if(data.code=='d_003'){
              this.$message.warning( msg )
              this.$emit('noexit')
            }
          })
        }
        console.log(this.checkList)
      })
    }
  }
</script>
<style scoped>
  .orgList{
    height: 88px;
    padding: 20px;
    width: 760px;
    background: #e5e5e5;
    margin-left: 104px;
    margin-top: 20px;
    position: relative;
    overflow: hidden;
  }
  .orgList img,.orgListActive img{
    position: absolute;
    bottom: 10px;
    right: 5px;
    cursor: pointer;
  }
  .orgListActive{
    height: auto;
    padding: 20px;
    width: 760px;
    background: #e5e5e5;
    margin-left: 104px;
    margin-top: 20px;
    position: relative;
  }
  .alinetop{
    vertical-align: top;
  }
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
    width: 804px;
  }
  .userInfo{
    height: 155px;
    border-bottom: 1px dashed #dcdcdc;
    line-height: 40px;
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
  .suggest>span{
    height: 80px;
    margin-left: 10px;
  }
  .errorLeft{
    margin-left: 103px;
  }
  textarea{
    height: 160px;
    width: 800px;
  }

  .filesUl li{
    height: 40px;
    color: #007cb5;
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
    margin-left: 20px;
  }
  .suggest>div{
    height: 30px;
  }
  .write{
    background: #fff;
    color: #555;
    border:1px solid #dcdcdc;
    margin-left: 0;
  }
  .write:hover{
    border:1px solid #007cb5;
  }
  .textright{
    display: inline-block;
    width: 90px;
    text-align: right;
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
  .edit-div {
    position: relative;
    margin-left: 105px;
    margin-top: -20px;
    font-size: 16px;
    border-radius: 3px;
  }
  .edit-div-content {
    min-height: 160px;
    width: 800px;
    padding: 10px;
    border: 1px solid #ccc;
    overflow-y: auto;
    white-space: pre-line;
 /*   user-modify: read-write-plaintext-only;*/
  }
  .edit-div-tool {
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    z-index: 1;
    height: 30px;
    /*background-color: #f5f5f5;*/
    display: none;
  }
  .edit-div-tool button {
    width: 80px;
    height: 28px;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  .edit-div:hover .edit-div-tool{
    display: block;
  }
  .edit-div-holder {
    position: absolute;
    top: 5px;
    left: 10px;
    z-index: 0;
    font-size: 14px;
    color: #ccc;
  }
  .vueeditor {
    margin-left: 105px;
    margin-top: -20px;
  }
</style>