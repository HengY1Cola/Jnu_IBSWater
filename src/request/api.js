import { get, post } from './http'

export const homeMsg = (params) => get('api/IBSJnuWeb/home', params); // 首页大盘
export const totalCount = (params) => get('api/IBSJnuWeb/total_count', params); // 流量统计
export const getBalance = (path, params) => get('api/IBSJnuWeb/balance/' + path, params); // 查询余额
export const getRecord = (path, params) => get('api/IBSJnuWeb/status/' + path, params); // 获取消费记录
export const getCode = (params) => post('api/IBSJnuWeb/getCode', params); // 获取验证码
export const insertOrUpdate = (params) => post('api/IBSJnuWeb/switch', params); // 插入或者更新状态
export const getCaptcha = (params) => get('api/IBSJnuWeb/get_captcha', params); // 获取行为验证码
