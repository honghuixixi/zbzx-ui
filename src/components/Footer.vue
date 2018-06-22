<template>
  <div>
    <div class="footer">
      <div class="footer_con">
        <div class="footer_left">
          <ul>
            <li class="redhover">
              <a href="javascript:void(0)">首页 |</a>
              <a href="javascript:void(0)">关于我们 |</a>
              <a href="javascript:void(0)">在线问答 |</a>
              <a href="javascript:void(0)">联系我们</a>
            </li>
            <li>Copyright(c)2016 浙江省医学装备管理中心</li>
            <li>浙江省医学装备管理中心版权所有</li>
          </ul>
        </div>
        <div class="footer_mid" style="margin-top: 12px;margin-left: 181px;">
          <img class="footer_img" src="../assets/images/footer_logo.png" alt="">
        </div>
        <div class="footer_right">
          <ul>
            <li>任何建议或意见请联系：zjyxzb@126.com</li>
            <li>备案序号：浙ICP备14037888号</li>
            <li>公安机关备案号：33010602008803</li>
          </ul>
        </div>
        <div class="link_div">
          <div>友情链接：
            <a>国家卫生和计划生育委员会</a>
            <a>浙江省卫生和计划生育委员会</a>
            <a>中国医学装备协会</a>
            <a>国家食品药品监督管理局</a>
          </div>
          <div>
            <a>浙江省食品药品监督管理局</a>
            <a>中国医疗器械行业协会</a>
            <a>中国医疗器械信息网</a>
            <a>医蜂云服</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default{}
</script>
<style scoped>
  .footer {
    border-top: 2px solid #007CB5;
    height: 158px;
    line-height: 20px;
    font-size: 12px;
    color: #787878;
  }
  .footer .footer_con>div {
    float: left;
  }
  .footer .footer_con .footer_right {
    float: right;
    margin: 0px 95px 0px 0px;
  }
  .footer .footer_con {
    width: 980px;
    margin: 0 auto;
    color: #787878;
    height: 158px;
    margin-top: 10px;
    padding-left: 47px;
  }
  .footer .link_div {
    clear: both;
    width: 100%;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 25px;
  }
  .footer .link_div {
    clear: both;
    width: 100%;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 25px;
  }
  footer, footer a, .footer, footer .footer_nav a {
    line-height: 20px;
    font-size: 12px;
    color: #787878;
  }
  .redhover a:hover{
    color: #ff0000;
    text-decoration: underline !important;
  }
  .link_div a{
    color: #2fa4e7
  }

</style>
