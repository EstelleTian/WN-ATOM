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
    TIMEHHmm : /^([0-1]+[0-9]|2[0-3])([0-5][0-9])$/,
    // 时间 YYYYMMDDHHmm
    DATETTIME12:  /^((((19|20)\d{2})(0?(1|[3-9])|1[012])(0?[1-9]|[12]\d|30))|(((19|20)\d{2})(0?[13578]|1[02])-31)|(((19|20)\d{2})0?2(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0?229))([0-1][0-9]|2[0-3])[0-5]{1}[0-9]{1}$/,
    //0-999数字
    NUMBER3: /^[1-9][0-9]{0,2}$/,
};

export { REGEXP };
