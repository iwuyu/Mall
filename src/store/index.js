import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

// 安装插件
Vue.use(Vuex);

// 创建state对象
const state = {
  cartList: []
}

// 创建store对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

// 挂载到Vue实例上
export default store;