import axios from 'axios'
import config from '@/service/config'
import { Message } from 'element-ui';
const ajax = (option, success, fail, error) => {
  option.headers = {'X-AEK56-Token': localStorage.getItem('Token')}

  option.url = config.server(process.env.NODE_ENV) + option.url

  axios.request(option).then((response) => {

    let data = response.data
    if (+data.code === 200) {
      success(data.data)
    }else if(data.code==401 ||　data.code==302　){
      localStorage.clear()
      window.location.href = '/'
    } else {
      if (fail) {
        fail(data.msg, data)
      }else{
        Message({
          message: data.msg,
          type: 'error'
        })
      }
    }
  }).catch((err) => {
    if (error) {
      error(err)
    }
  })
}

const get = (url, success, fail, error, param) => {
	let option = {
		url: url,
		method: 'get',
	}
	if(param) {
		option.params = param
	}
	ajax(option, success, fail, error)
}

const post = (url, success, fail, error, param) => {
  let option = {
    url: url,
    method: 'post',
    data: param
  }
  ajax(option, success, fail, error)
}

// 获取用户信息
export const getUserInfo = (success, fail, error) => {
   get("/cms/cmsContentUser/getCurrentUser", success, fail, error)
}
// 获取数据个数
export const getStatistics = (success, fail, error) => {
  get("/cms/cmsContent/stats", success, fail, error)
}
// 获取通知列表
export const getNoticeList = (param, success, fail, error) => {
	 get("/cms/cmsContent/getNoticeList", success, fail, error, param)
}
// 获取消息列表
export const getNewsList = (param, success, fail, error) => {
	 get("/cms/cmsContent/getNewsList", success, fail, error, param)
}
// 获取资料列表
export const getArticleList = (param, success, fail, error) => {
	 get("/cms/cmsContent/getArticleList", success, fail, error, param)
}
// 获取投诉与不良事件列表
export const getcomplaintList = (param, success, fail, error) => {
   get("/cms/cmsContent/getComplaintList", success, fail, error, param)
}
// 获取咨询列表
export const getconsulteList = (param, success, fail, error) => {
   get("/cms/cmsContent/getConsultationList", success, fail, error, param)
}
// 获取通知详情
  export const getNoticeInfo = (param, success, fail, error) => {
     get("/cms/cmsContent/getDetail", success, fail, error, param)
  }
// 获取消息详情
export const getNewsInfo = (param, success, fail, error) => {
   get("/cms/cmsContent/getDetail", success, fail, error, param)
}

// 获取资料详情
export const getArticleInfo = (param, success, fail, error) => {
   get("/cms/cmsContent/getDetail", success, fail, error, param)
}

// 获取资料评论
export const getArticlecomment = (param, success, fail, error) => {
   get("/cms/cmsReply/getArticleReplyList", success, fail, error, param)
}
// 提交资料评论
export const subArticlecomment = (param, success, fail, error) => {
   post("/cms/cmsReply/addArticleReply", success, fail, error, param)
}
// 删除资料评论
export const delArticlecomment = (param, success, fail, error) => {
   get("/cms/cmsReply/deletReply", success, fail, error, param)
}
// 获取投诉与不良事件详情
export const getComplaInfo = (param, success, fail, error) => {
  get("/cms/cmsContent/getBadAsk", success, fail, error, param)
}

// 获取投诉与不良事件回复
export const getComplacomment = (param, success, fail, error) => {
   get("/cms/cmsReply/getBadAskReplyList", success, fail, error, param)
}

// 投诉与不良事件回复
export const subComplacomment = (param, success, fail, error) => {
   post("/cms/cmsReply/addBadAskReply", success, fail, error, param)
}
// 获取咨询详情
export const getConsulInfo = (param, success, fail, error) => {
   get("/cms/cmsContent/getConsult", success, fail, error, param)
}

// 获取咨询回复
export const getConsulcomment = (param, success, fail, error) => {
   get("/cms/cmsReply/getBadAskReplyList", success, fail, error, param)
}

// 提交咨询回复
export const subConsulcomment = (param, success, fail, error) => {
   post("/cms/cmsReply/addBadAskReply", success, fail, error, param)
}

// 我要发起投诉
export const postWritecomplaint = (param, success, fail, error) => {
   post("/cms/cmsContent/newBadAsk", success, fail, error, param)
}
// 我要发起咨询
export const postWriteconsulta = (param, success, fail, error) => {
   post("/cms/cmsContent/newConsult", success, fail, error, param)
}

// 获取监管树
export const supertree = (success, fail, error) => {
   get("/cms/cmsContent/getManageTree", success, fail, error)
}
// 25.获取医疗机构
export const getorg = (param, success, fail, error) => {
   get("/cms/cmsContent/getHospital", success, fail, error, param)
}
// 18.发布通知
export const  publishNotice= (param, success, fail, error) => {
   post("/cms/cmsContent/newNotice", success, fail, error, param)
}
// 19.发布消息
export const  publishNews= (param, success, fail, error) => {
   post("/cms/cmsContent/newNews", success, fail, error, param)
}
// 20.发布资料
export const  publishArticle= (param, success, fail, error) => {
   post("/cms/cmsContent/newArticle", success, fail, error, param)
}
// 21.编辑是需要调取的详情 getEditInfo
export const getEditInfo = (param, success, fail, error) => {
  get("/cms/cmsContent/getContentReturn", success, fail, error, param)
}
// 编辑消息
export const  editNews= (param, success, fail, error) => {
  post("/cms/cmsContent/editNews", success, fail, error, param)
}
// 编辑通知
export const  editNotice= (param, success, fail, error) => {
  post("/cms/cmsContent/editNotice", success, fail, error, param)
}
// 编辑资料
export const  editArticle= (param, success, fail, error) => {
  post("/cms/cmsContent/editArticle", success, fail, error, param)
}
// 删除发布的内容/deleteById
export const  delectDetail= (param, success, fail, error) => {
  get("/cms/cmsContent/deleteById", success, fail, error, param)
}
// 删除发布的内容/deleteById
export const  delectDetailend= (param, success, fail, error) => {
  get("/cms/cmsContent/deleteBadConsultById", success, fail, error, param)
}

/************
*
* 监管树
*
***********/
// 获取省级监管树
export const getProvinceSupervise = (tenantId, success, fail, error) => {
  get("/zbzxsys/tenant/manageTree?tenantId=" + tenantId, success, fail, error)
}

// 获取监管机构下的医疗机构
export const getMedical = (param, success, fail, error) => {
  get('/zbzxsys/tenant/manageTreeTable', success, fail, error, param)
}
// 获取监管机构详情
export const getsupDetail = (tenantId, success, fail, error) => {
  get('/zbzxsys/tenant/view/'+tenantId, success, fail, error)
}
// 获取医疗机构详情
export const getmedDetail = (tenantId, success, fail, error) => {
  get('/zbzxsys/tenant/viewTreeTable/'+tenantId, success, fail, error)
}
// 获取医疗机构的列表
export const getmedList = (param, success, fail, error) => {
  get('/assets/assetsInfo/getPageAssets', success, fail, error,param)
}
// 获取医疗机构详情的状态
export const getmedStatus = (success, fail, error) => {
  get('/assets/assetsInfo/getAssetsVerifyStatus', success, fail, error)
}
// 获取医疗机构的基本模块
export const getmedBaseOrg = (success, fail, error) => {
  get('/zbzxsys/basedata/staticVariable', success, fail, error)
}

// 获取监管树
export const supertreeHelp = (success, fail, error) => {
   get("/cms/cmsContent/getManageTreeHelp", success, fail, error)
}

// 更改机构管理员账号
export const changeLoginName = (param, success, fail, error) => {
  get('/zbzxsys/user/changeLoginName', success, fail, error,param)
}

// 重置机构管理员密码
export const  zbzxresetPwd = (param, success, fail, error) => {
  get('/zbzxsys/user/resetPwd', success, fail, error,param)
}