import Vue from 'vue'
// 时间转换
Vue.filter('timeChange',value=>{
  var time = new Date(value);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d)+' '+(h<10?'0'+h:h)+':'+(mm<10?'0'+mm:mm);
})
// 截取字数加上...
Vue.filter('content',value=>{
  if(value&&value.length>113){
    return value.substr(0,113)+'...'
  }else{
    return value
  }
})
// 截取数字，最新回复的机构名称
Vue.filter('replyOrg',value=>{
  if(value&&value.length>10){
    return value.substr(0,9)+'...'
  }else{
    return value
  }
})
// 截取数字，提交人姓名
Vue.filter('publisher',value=>{
  if(value&&value.length>4){
    return value.substr(0,3)+'...'
  }else{
    return value
  }
})
// 截取数字，提交人机构
Vue.filter('org',value=>{
  if(value&&value.length>6){
    return value.substr(0,5)+'...'
  }else{
    return value
  }
})
Vue.filter('list',value=>{
  if(value&&value.length>20){
    return value.substr(0,20)+'...'
  }else{
    return value
  }
})
Vue.filter('repalyCont',value=>{
  if(value&&value.length>80){
    return value.substr(0,80)+'...'
  }else{
    return value
  }
})
Vue.filter('name',value=>{
  if(value&&value.length>10){
    return value.substr(0,10)+'...'
  }else{
    return value
  }
})
Vue.filter('nameuser',value=>{
  if(value&&value.length>20){
    return value.substr(0,20)+'...'
  }else{
    return value
  }
})
Vue.filter('title',value=>{
  if(value&&value.length>35){
    return value.substr(0,35)+'...'
  }else{
    return value
  }
})
Vue.filter('orgLong',value=>{
  if(value&&value.length>40){
    return value.substr(0,40)+'...'
  }else{
    return value
  }
})
