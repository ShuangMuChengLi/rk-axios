import rkAxios, {BeforeRequireReturn} from '../src/index'
import {getCookie, setCookie} from 'rk-cookie'
import {AxiosRequestConfig} from "axios"
setCookie('token', 'test token')
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
rkAxios.setBeforeRequire(getOption)
rkAxios.get('https://www.linchaoqun.com/html/cms/content.jsp',{
  menu : 'index',
  id: '02b84ae2-b29e-46e6-8b06-2db5c99d3772'
}).then((res)=>{
  console.log(res)
})
rkAxios.cancelSource('https://www.linchaoqun.com/html/cms/content.jsp')
