/*
 * @Author: your name
 * @Date: 2020-12-22 18:26:34
 * @LastEditTime: 2020-12-22 18:29:07
 * @LastEditors: Please set LastEditors
 * @Description: 暴露给客户端方法
 * @FilePath: \WN-CDM\src\utils\global.js
 */
let NWGlobal = {
    setSchemeId: function(){}, //定位方案id
    setMsg: function(){}, //回传消息对象
    setUserInfo: function(){}, //回传用户对象
}
window.NWGlobal = NWGlobal;

export { NWGlobal }

