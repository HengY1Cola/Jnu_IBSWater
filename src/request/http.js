// 在http.js中引入axios
import axios from 'axios'; // 引入axios
import store from '@/store/index';


// 基础axios设置
if (process.env.NODE_ENV === 'production') { // 线上环境
    axios.defaults.baseURL = 'https://api.hengy1.top';
}
else { // 线下环境
    axios.defaults.baseURL = 'http://127.0.0.1:6789';
}
axios.defaults.timeout = 7000; // 请求超时时间为7s
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; // post请求头设置

// 请求拦截器
axios.interceptors.request.use( // 这里不使用为空
config => {
    const token = store.state.token;
    token && (config.headers.Authorization = token);
    return config;
}, error => {
    return Promise.error(error);
})

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200 && response.data.errno === 1) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
});

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)
        })
    });}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err =>{
                reject(err.data)
            })
    });
}