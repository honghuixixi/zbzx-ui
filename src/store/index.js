import Vue from 'vue'
import Vuex from 'vuex'
import { getMedical } from '@/service/api'

Vue.use(Vuex)

const state = {
  type: 1, // 1:省；2：市；3：区
  showCity: false,
  area: null, // 当前选中区
  pageNo: 1,
  pageSize: 16,
  category: '',
  tenantId: '',
  keyword: '',
  list: [],
  total: 0
}

const getters = {
  list: state => state.list
}

const actions = {
  changeType({ commit }, type) {
    commit('changeType', type)
  },
  // 区选择
  changeArea({ commit }, obj) {
    commit('changeArea', obj)
  },
  // 监管树节点变更
  changeTenant({ commit }, obj) {
    commit('changeTenant', obj)
  },
  // 页码切换
  changePage({ commit }, obj) {
    commit('changePage', obj)
  },
  // 搜索条件变更
  changeCondition({ commit }, obj) {
    commit('changeCondition', obj)
  },
  // 医疗机构检索
  changeList({ commit, state }, tenantId) {
    // if (!tenantId) {
    //   tenantId = JSON.parse(localStorage.getItem('userInfo')).tenantId
    // }
    let param = {
      pageNo: state.pageNo,
      pageSize: state.pageSize,
      category: state.category,
      tenantId: tenantId,
      keyword: state.keyword
    }
    getMedical(param, (data) => {
      commit('changeList', data)
    })
  }
}

const mutations = {
  changeType(state, type) {
    state.type = type
  },
  // 区选择
  changeArea(state, obj) {
    state.area = obj
    state.category = ''
    state.keyword = ''
  },
  // 监管树节点变更
  changeTenant(state, obj) {
    state.pageNo = 1
    state.category = ''
    state.keyword = ''
    state.showCity = obj.showCity
    state.tenantId = obj.id
  },
  // 页码切换
  changePage(state, obj) {
    state.pageNo = obj.pageNo
    state.pageSize = obj.pageSize
  },
  // 搜索条件变更
  changeCondition(state, obj) {
    state.pageNo = 1
    // state.category = obj.category
    // state.keyword = obj.keyword
  },
  // 医疗机构检索
  changeList(state, data) {
    state.list = data.records
    state.total = data.total
  },
  changeCategory(state, val) {
    state.category = val
  },
  changeKeyword(state, val) {
    state.keyword = val
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
