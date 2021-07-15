/*
 * @Author: your name
 * @Date: 2021-01-25 09:06:54
 * @LastEditTime: 2021-01-27 10:05:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\utils\regExpUtil.js
 */

//正则
const REGEXP = {
    //时间 HHmm
    TIMEHHmm :  /(^[0-1][0-9]|^2[0-3])[0-5]{1}[0-9]{1}$/,
    // 日期YYYYMMDD
    DATE8: /^(19|20)\d\d(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/,
    //0-999数字(支持前缀0,如01,001)
    NUMBER3: /^[0-9]{1,3}$/,
    //0-999数字(不支持前缀0,如01,001)
    INTEGER0_999: /^(0|[1-9][0-9]{0,2})$/,
    //1-999数字(不支持前缀0,如01,001)
    INTEGER1_999: /^([1-9][0-9]{0,2})$/,
    // 组合字符(字母不分大小写、数字、问号、逗号、分号、中划线、空格、加号)
    COMBINEDCHARSET:/^[\da-zA-Z\?\,\;\ \-\+]+$/g,
};

export { REGEXP };
