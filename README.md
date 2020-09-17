axios的封装：
1. 暴露出两个方法：错误时回调函数：setErrorCallback，请求前的钩子函数setBeforeRequire。
2. 对get函数进行封装，第二个参数是数据，第三个参数是AxiosRequestConfig
3. 对所有请求的data数据进行封装，传递json格式即可，库会进行转换
# Install
````
yarn add rk-axios
````
# Usage
````
import rkAxios from 'rk-axios'
rkAxios.get('https://www.linchaoqun.com/html/cms/content.jsp',{
  menu : 'index',
  id: '02b84ae2-b29e-46e6-8b06-2db5c99d3772'
}).then(()=>{
})
````
# API
````
import { AxiosRequestConfig } from 'axios';
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
export declare const rkAxios: {
    /**
     * 错误请求时回调
     * @param callback ErrorCallback: (e: Error): void;
     */
    setErrorCallback(callback: ErrorCallback): void;
    /**
     * 设置请求前钩子
     * @param callback BeforeRequire (option?: AxiosRequestConfig, data?: string | JSON): BeforeRequireReturn;
     * BeforeRequireReturn: {
        data?: string | JSON;
        option?: AxiosRequestConfig;
      }
     */
    setBeforeRequire(callback: BeforeRequire): void;
    /**
     * post请求
     * @param url 路径
     * @param data 数据
     * @param option http选项
     * @returns {Promise<*>}
     */
    post: (url: any, data?: any, option?: any) => Promise<void>;
    /**
     * patch请求
     * @param url 路径
     * @param data 数据
     * @param option http选项
     * @returns {Promise<*>}
     */
    patch: (url: any, data?: any, option?: any) => Promise<void>;
    /**
     * put请求
     * @param url 路径
     * @param data 数据
     * @param option http选项
     * @returns {Promise<*>}
     */
    put: (url: any, data?: any, option?: any) => Promise<void>;
    /**
     * get请求
     * @param url 路径
     * @param data 数据
     * @param option http选项
     * @returns {Promise<*>}
     */
    get: (url: any, data?: any, option?: any) => Promise<void>;
    /**
     * delete请求
     * @param url 路径
     * @param data 数据
     * @param option http选项
     * @returns {Promise<*>}
     */
    delete: (url: any, data?: any, option?: any) => Promise<void>;
    /**
     * 终止请求
     *
     * */
    cancelSource: (url: any, msg?: string) => void;
};
/**
 * axios中JSON提交的config配置
 * @type {{headers: {Content-Type: string}}}
 */
export declare const JSONHeader: {
    headers: {
        'Content-Type': string;
    };
};
/**
 * axios中multipart/form-data提交的config配置
 * @type {{headers: {Content-Type: string}}}
 */
export declare const fileHeader: {
    headers: {
        'Content-Type': string;
    };
};
export default rkAxios;

````