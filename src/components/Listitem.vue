<template>
  <div>
    <ul>
    <li v-for="v in list" class="listItem">
        <span class="listLeft">
          <span class="listLeftTop">
            <span class="hasNotive" v-if="!v.isRead"></span>
            <span class="titleHover" @click="goInfo(v.id)"><span v-if="v.isNew">【最新发布】</span>{{v.title}}</span>
          </span>
          <br>
            <span class="listLeftBtm" >
              发布人：{{v.publisher | list}} <span style="display: inline-block;width: 20px"></span> {{v.org | list}}<span style="display: inline-block;width: 10px"></span> | <span style="display: inline-block;width: 10px"></span>更新时间：{{v.publishTime | timeChange}}
            </span>
        </span>
      <span  class="listRight" @click="goInfo(v.id)">
        查看 >>
      </span>
    </li>
    </ul>
  </div>

</template>
<script>
    export default{
      props: ['list'],
      methods:{
        goInfo(id) {
          this.$emit('goInfo',id)
        }
      }
    }
</script>
<style scoped>
  .listItem{
    height: 45px;
    padding: 25px 20px;
    border-bottom: 1px solid #e5e5e5;
    word-break: break-all;
  }
  .listLeft {
    width: 879px;
    float: left;
  }
  .listLeftTop{
    font-size: 16px;
    color: #555;
    cursor: pointer;
    position: relative;
  }
  .listLeftBtm{
    font-size: 14px;
    color: #999;
    margin-top: 10px;
    display: inline-block;
  }
  .listRight{
    line-height: 45px;
    cursor: pointer;
    font-size: 14px;
    color: #007cb5;
    float: right;
  }
  .titleHover:hover{
    color: #f9731e;
  }
</style>
