import axios from 'axios'


export function request(config) {
    // 1.创建axios实例
    const instance = axios.create({
      baseURL: 'http://152.136.185.210:8000/api/n3',
      timeout: 5000
    })
    
    // 2.axios的拦截器
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 释放拦截
      return config;
    },error => {
      console.log(error)
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
      
      // 释放拦截
      return res.data;
    },error => {
      console.log(error);
    })

    // 3.发送真正的网络请求
    return instance(config);
}