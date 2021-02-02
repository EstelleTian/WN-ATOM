/*
 * @Author: your name
 * @Date: 2020-12-22 18:26:34
 * @LastEditTime: 2021-02-02 09:53:22
 * @LastEditors: Please set LastEditors
 * @Description: 暴露给客户端方法
 * @FilePath: \WN-CDM\src\utils\global.js
 */
let NWGlobal = {
    setSchemeId: function(){}, //定位方案id
    setMsg: function(){}, //回传消息对象
    setUserInfo: function(){}, //回传用户对象
    targetToFlight: function(){}, //放行监控  用于定位到航班  方案idsetSchemeId(方案id), flightId(航班id)
}
window.NWGlobal = NWGlobal;

export { NWGlobal }

