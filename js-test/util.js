/**
 * Created by lin on 2017/7/28.
 */

import moment from 'moment';
import _ from 'lodash';
import querystring from 'querystring';
import {mathUtil} from './math-util.js';
export const util = {
  /**
     * 移除对象中值为空的键值对
     * @param obj
     */
  objectRemoveValueIsNull(obj) {
    for (let i in obj) {
      let item = obj[i];
      if (this.isNull(item)) {
        delete obj[i];
      }
    }
  },
  /**
     * 判断为空
     * @param arg1
     * @returns {boolean}
     */
  isNull(arg1) {
    return !arg1 && arg1 !== 0 && typeof arg1 !== 'boolean';
  },
  /**
     * 判断对象为无属性对象
     * @param e
     * @returns {boolean} 如果为空对象，返回true  如果为非空对象，返回false
     */
  isEmptyObject(e) {
    return Object.getOwnPropertyNames(e).length === 0;
  },
  /**
     * 计算年龄
     * @param birthday   1999-10-08 |Date
     * @returns {Number}
     */
  getAge(birthday) {
    let birthdayTimestamp = moment(birthday, 'YYYY-MM-DD').toDate().getTime();
    let nowTimestamp = new Date().getTime();
    let tempTime = nowTimestamp - birthdayTimestamp;
    return Math.floor(tempTime / 1000 / 60 / 60 / 24 / 365);
  },
  /**
     * 回车键事件
     * @param e  事件
     * @param fn  回调函数
     */
  keydownEnter(e, fn) {
    let theEvent = e || window.event;
    let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code === 13) {
      fn();
    }
  },

  /**
     * 超出省略(wjh)
     * @param s 字符串
     * @param len 最大长度
     * @returns {String}
     */
  beyondShowDot(s, len) {
    if (s) {
      let stringLength = s.length;
      if (stringLength <= len) {
        return s;
      } else {
        return s.substr(0, len) + '...';
      }
    } else {
      return '';
    }
  },
  /**
   * 删除请求参数的空值（lcq)
   * @param params
   * @param isJSON
   * @return {string | *}
   */
  noNoneGetParams(params, isJSON) {
    let result = {};
    params = params || {};

    for (let key in params) {
      if (params[key] !== '' &&
        params[key] !== null && typeof params[key] !== 'undefined'
        || params[key] === '0' || params[key] === 0 ) {
        result[key] = params[key];
      }
    }
    if (isJSON) {
      return result;
    } else {
      return querystring.stringify(result);
    }
  },
  /**
   * 数字前补零(wjh)
   * @param num
   * @param length
   * @return {string}
   */
  addZero(num, length) {
    return (Array(length).join(0) + num).slice(-length);
  },
  /**
   * 获取时间区间各个月份(wjh)
   * @param data
   * @return {Array}
   */
  getMonthArray(data) {
    let timeline = [];
    let minMonth = null;
    let maxMonth = null;
    for (let item of data) {
      let itemMoment = moment(item);
      if (!minMonth) {
        minMonth = itemMoment;
        maxMonth = itemMoment;
        continue;
      }
      if (itemMoment.isBefore(minMonth)) {
        minMonth = itemMoment;
        continue;
      }
      if (itemMoment.isAfter(maxMonth)) {
        maxMonth = itemMoment;
      }
    }
    let formatMinMonth = minMonth.format('YYYY-MM');
    let formatMaxMonth = maxMonth.format('YYYY-MM');
    timeline.push(formatMaxMonth);
    while (formatMaxMonth !== formatMinMonth) {
      let date = moment(formatMaxMonth).subtract(1, 'month');
      let dateMonthYear = date.format('YYYY-MM');
      timeline.push(dateMonthYear);
      formatMaxMonth = dateMonthYear;
    }
    timeline.reverse();
    return timeline;
  },
  /**
   * 将图片转成base64(lcq)
   * @param img(图片对象)
   * @returns {string}(base64)
   */
  picToBase64(img) {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let dataUrl = canvas.toDataURL();
    return dataUrl;
  },
  /**
   * 将base64转成文件(lcq)
   * @param img,base64
   * @returns {File}
   */
  base64toFile(img, name){
    let bstr = atob(img.split(',')[1]);
    let mime = img.split(',')[0].match(/:(.*?);/)[1];
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    let file = new File([u8arr], name, {type:mime});
    return file;
  },
};
