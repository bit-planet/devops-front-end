import axios from 'axios';
// @ts-ignore
import JSONBIG from 'json-bigint';

import { Loading } from 'element-ui'

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: '',
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
  transformResponse: [function (data) {
    const json = JSONBIG({
      storeAsString: true,
    });
    const res = json.parse(data)
    return res
  }]
});
let loading = null;
// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么 token
    // if (Session.get('token')) {
    //   // @ts-ignore
    //   config.headers.common['Authorization'] = `${Session.get('token')}`;
    // }
    if (config.method !== 'get') {
      loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }


    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    loading?loading.close():null;
    // 对响应数据做点什么
    const res = response.data;
    if (res.code && res.code != 2000) {
      // `token` 过期或者账号已在别处登录
      if (res.code == 4000) {
        alert(res.msg);
      }

      if (res.code == 401 || res.code == 4001) {
        window.location.href = '/'; // 去登录页
        alert('你已被登出，请重新登录')
      }
      return Promise.reject(service.interceptors.response);
    } else {
      return res;
    }
  },
  (error) => {
    loading?loading.close():null;
    // 对响应错误做点什么
    if (error.message.indexOf('timeout') != -1) {
      alert('网络超时...');
    } else if (error.message == 'Network Error') {
      alert('网络连接错误');
    } else {
      if (error.response)
        alert(error.response.statusText);
      else alert('接口路径找不到');
    }
    return Promise.reject(error);
  }
);

// 导出 axios 实例
export default service;
