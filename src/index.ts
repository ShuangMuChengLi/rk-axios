import http, {AxiosRequestConfig} from 'axios'
import {getCookie} from 'rk-cookie'
import { parse } from 'querystring'
import rkUtil from 'rk-util'
const { noNoneGetParams } = rkUtil
interface ErrorCallback {
  (e: Error): void;
}
export interface BeforeRequireReturn {
  data?: string | JSON;
  option?: AxiosRequestConfig;
}
interface BeforeRequire {
  (option?: AxiosRequestConfig, data?: string | JSON): BeforeRequireReturn;
}
let errorCallback: ErrorCallback
let beforeRequire: BeforeRequire
const util = {
  /**
   * 处理异常  登录过期  跳转登录页
   * @param e
   */
  handleError(e): void {
    if(errorCallback){
      errorCallback(e)
    }
  }
}
/**
 * 往url中添加query参数
 * @param url
 * @param query
 * @returns {*}
 */
function addQueryToUrl (url, query): string {
  if (typeof url !== 'string') return ''

  if (!url.includes('http')) {
    url = window.location.origin + url
  }

  const urlObj = new URL(url)
  if (typeof query === 'string') {
    query = parse(query)
  }
  for (const key in query) {
    if(!Object.prototype.hasOwnProperty.call(query, key))continue

    urlObj.searchParams.set(key, query[key])
  }
  return urlObj.toString()
}
/**
 * 构建数据格式,默认form提交
 * @param inputData 数据
 * @param inputOption  http选项
 * @returns {*}
 */
const getParams = (inputData, inputOption): string | JSON=>{
  const type = typeof inputData
  if (type === 'string') {
    return inputData
  }
  const ContentType = inputOption && inputOption.headers && inputOption.headers['Content-Type']
  if(!ContentType) {
    // 默认Form提交
    return noNoneGetParams(inputData)
  }
  // JSON提交
  if(ContentType.indexOf('application/json') !== -1) {
    return noNoneGetParams(inputData, true)
  }
  // 文件提交
  if(ContentType.indexOf('multipart/form-data') !== -1){
    return inputData
  }
  // 默认Form提交
  return noNoneGetParams(inputData)
}

/**
 * 构建options，添加token信息
 * @param option http选项
 * @returns {*}
 */
const getOption = (option?: AxiosRequestConfig): BeforeRequireReturn => {
  const Authorization = getCookie('token')
  if(!Authorization){
    return option
  }
  if(!option) {
    option = {
      headers: {
        'Authorization':Authorization
      }
    }
  }
  if(!option.headers){
    option.headers = {}
  }
  option.headers['Authorization'] = Authorization
  return {option}
}

/**
 * post put patch公用方法
 * @param type  方法：post、put、patch
 * @param url 路径
 * @param data 数据
 * @param option http选项
 * @returns {Promise<*>}
 */
async function dataMethod(type, url, data, option): Promise<void> {
  let axiosOption
  if(beforeRequire){
    const result = beforeRequire(option, data)
    if(result && result.data){
      data = result.data
    }
    if(result && result.option){
      axiosOption = result.option
    }
  }

  if(!axiosOption){
    axiosOption = getOption(option) // 添加token
  }

  let params = null
  if (data) {
    params = getParams(data, option)// 重构数据
  }
  return await http[type](url, params, axiosOption).then((res) => {
    return res
  }).catch((e) => {
    util.handleError(e)
    throw e
  })
}

/**
 * get delete 公用方法。将data格式化后，拼接到url后面
 * @param type  方法：get、delete
 * @param url 路径
 * @param data 数据
 * @param option http选项
 * @returns {Promise<*>}
 */
async function urlMethod(type, url, data, option): Promise<void> {
  let axiosOption
  if(beforeRequire){
    const result = beforeRequire(option, data)
    if(result && result.data){
      data = result.data
    }
    if(result && result.option){
      axiosOption = result.option
    }
  }

  if(!axiosOption){
    axiosOption = getOption(option) // 添加token
  }

  if (data) {
    let params = null
    const dataType = typeof data
    if (dataType === 'string') {
      params = data
    } else {
      params = noNoneGetParams(data)
    }
    url = addQueryToUrl(url, params)
  }
  return await http[type](url, axiosOption).then((res) => {
    return res
  }).catch((e) => {
    util.handleError(e)
    throw e
  })
}
export const rkAxios = {
  /**
   * 错误请求时回调
   * @param callback ErrorCallback: (e: Error): void;
   */
  setErrorCallback(callback: ErrorCallback): void{
    errorCallback = callback
  },
  /**
   * 设置请求前钩子
   * @param callback BeforeRequire (option?: AxiosRequestConfig, data?: string | JSON): BeforeRequireReturn;
   * BeforeRequireReturn: {
      data?: string | JSON;
      option?: AxiosRequestConfig;
    }
   */
  setBeforeRequire(callback: BeforeRequire): void{
    beforeRequire = callback
  },

  /**
   * post请求
   * @param url 路径
   * @param data 数据
   * @param option http选项
   * @returns {Promise<*>}
   */
  post: async (url, data?, option?): Promise<void> => dataMethod('post', url, data, option),
  /**
   * patch请求
   * @param url 路径
   * @param data 数据
   * @param option http选项
   * @returns {Promise<*>}
   */
  patch: async (url, data?, option?): Promise<void> => dataMethod('patch', url, data, option),
  /**
   * put请求
   * @param url 路径
   * @param data 数据
   * @param option http选项
   * @returns {Promise<*>}
   */
  put: async (url, data?, option?): Promise<void> => dataMethod('put', url, data, option),
  /**
   * get请求
   * @param url 路径
   * @param data 数据
   * @param option http选项
   * @returns {Promise<*>}
   */
  get: async (url, data?, option?): Promise<void> => urlMethod('get', url, data, option),
  /**
   * delete请求
   * @param url 路径
   * @param data 数据
   * @param option http选项
   * @returns {Promise<*>}
   */
  delete: async (url, data?, option?): Promise<void> => urlMethod('delete', url, data, option)

}

/**
 * axios中JSON提交的config配置
 * @type {{headers: {Content-Type: string}}}
 */
export const JSONHeader = {
  headers:{
    'Content-Type':'application/json'
  }
}
/**
 * axios中multipart/form-data提交的config配置
 * @type {{headers: {Content-Type: string}}}
 */
export const fileHeader = {
  headers:{
    'Content-Type':'multipart/form-data'
  }
}
export default rkAxios
