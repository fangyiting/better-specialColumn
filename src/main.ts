import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

const codeName = '534181848BF037A4'
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  // 添加请求时的loading
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  // get请求添加到url中
  config.params = { ...config.params, icode: codeName }
  // 其它请求添加到body中
  //  如果是上传文件，添加到FormData中
  if (config.data instanceof FormData) {
    config.data.append('icode', codeName)
  } else {
    // 普通的body对象， 添加到data中
    config.data = { ...config.data, icode: codeName }
  }
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
