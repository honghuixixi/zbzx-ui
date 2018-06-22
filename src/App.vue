<template>
  <div id="app">

    <router-view></router-view>
    <MyFooter/>
  </div>
</template>

<script>
require('./assets/style/index.less')
import MyFooter from '@/components/Footer'
export default {
  name: 'app',
  components:{
    MyFooter
  }
}
</script>
<style>
  #app{
    width: 100%;
    height: 100%;
    background: #fff;
    color: #555;
    font-size: 16px;
  }
  .app_content{
    width: 980px;
    margin: 0 auto;
  }
  #app ul li{
    list-style: none;
  }
  .el-button--primary{
     background:#007cb5;
    border-color:#007cb5
  }
  .el-button--primary:focus, .el-button--primary:hover{
    background:#007cb5;
    border-color:#007cb5;

  }
  .el-pager li.active {
    border-color: #007cb5;
    background-color: #007cb5;
  }
  .el-select-dropdown__item.selected {
    color: #fff;
    background-color: #007cb5;
  }
  .el-select .el-input .el-input__icon{
    color: #bcbcbc;
  }
  .el-select:hover .el-input__inner {
    border-color: #007cb5;
  }
  input{
    font-size: 14px !important;
  }
  #app .el-input__inner{
    border: 1px solid #dcdcdc;
    color: #555;
    height: 32px !important;
    line-height: 32px;
  }
  .el-select{
    width: 104px;

  }
  .el-pager li.active {
    color: #fff;
  }
  .el-popper .popper__arrow, .el-popper .popper__arrow::after{
    display: none;
  }
  .fiels{
    color: #007cb5;
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
  }
  input:focus{
    outline: 0;
  }
  button{
    outline: 0;
  }
</style>
