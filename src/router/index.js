import Vue from 'vue'
import Router from 'vue-router'

const Page = () => import('@/components/Page')
const Notice = () => import('@/components/Notice')
const News = () => import('@/components/News')
const Article = () => import('@/components/Article')
const Complaint = () => import('@/components/Complaint')
const Consultation = () => import('@/components/Consultation')
const NoticeInfo = () => import('@/components/NoticeInfo') //通知详情
const NewsInfo = () => import('@/components/NewsInfo') //消息详情
const ArticleInfo = () => import('@/components/ArticleInfo') //资料详情
const ComplaInfo = () => import('@/components/ComplaInfo') //不良事件详情
const ConsulInfo = () => import('@/components/ConsulInfo') //咨询详情
const WriteComplaint = () => import('@/components/Writecomplaint') //我要投诉
const WriteConsultation = () => import('@/components/Writeconsultation') //我要咨询
const WriteNotice = () => import('@/components/Writenotice') //发布通知
const WriteNews = () => import('@/components/Writenews') //发布消息
const WriteArticle = () => import('@/components/Writearticle') //发布资料
const Login = () => import('@/components/Login') //登录
const Register = () => import('@/components/Register') //注册
const Supervise = () => import('@/components/supervise/Supervise')
const SuperviseList = () => import('@/components/supervise/List')
const SuperviseInfo = () => import('@/components/supervise/Info')
Vue.use(Router)
const router = new Router({

  linkActiveClass: "active",
  routes: [{
    path: '/',
    component: Page,
    redirect: '/login',
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register },
    ]
  }, {
    path: '/page',
    component: Page,
    redirect: '/page/notice',
    children: [
      { path: 'notice', name: 'Notice', component: Notice },
      { path: 'news', name: 'News', component: News },
      { path: 'article', name: 'Article', component: Article },
      { path: 'complaint', name: 'Complaint', component: Complaint },
      { path: 'consultation', name: 'Consultation', component: Consultation },
      { path: 'noticeinfo', name: 'NoticeInfo', component: NoticeInfo },
      { path: 'newsinfo', name: 'NewsInfo', component: NewsInfo },
      { path: 'articleinfo', name: 'ArticleInfo', component: ArticleInfo },
      { path: 'complainfo', name: 'ComplaInfo', component: ComplaInfo },
      { path: 'consulinfo', name: 'ConsulInfo', component: ConsulInfo },
      { path: 'writecomplaint', name: 'WriteComplaint', component: WriteComplaint },
      { path: 'writeconsultation', name: 'WriteConsultation', component: WriteConsultation },
      { path: 'writenotice', name: 'WriteNotice', component: WriteNotice },
      { path: 'writenews', name: 'WriteNews', component: WriteNews },
      { path: 'writearticle', name: 'WriteArticle', component: WriteArticle }
    ]
  }, {
    path: '/supervise',
    component: Supervise,
    redirect: '/supervise/list',
    children: [
      {path: 'list', name: 'SuperviseList', component: SuperviseList},
      {path: 'info', name: 'SuperviseInfo', component: SuperviseInfo}
    ]
  }]
})

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    if (localStorage.getItem('Token')) {
      next('/page/notice')
    } else {
      next()
    }

  } else {
    if (localStorage.getItem('Token') || to.path === '/register') {
      next()
    } else {
      next('/login')
    }
  }
   // next()
})

export default router
