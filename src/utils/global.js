/*
 * @Author: your name
 * @Date: 2020-12-22 18:26:34
 * @LastEditTime: 2021-06-09 13:37:17
 * @LastEditors: Please set LastEditors
 * @Description: 暴露给客户端方法
 * @FilePath: \WN-CDM\src\utils\global.js
 */
let NWGlobal = {
    setSchemeId: function(){}, //定位方案id
    setMsg: function(){}, //回传消息对象
    setUserInfo: function(){}, //回传用户对象
    targetToFlight: function(){}, //放行监控  用于定位到航班  方案idsetSchemeId(方案id), flightId(航班id),
    setCapacityPane: function(){},
    setEditDirectionData: function(){}, // 回传方向数据
}
window.NWGlobal = NWGlobal;


//客户端名称转换
const convertNameToTitle = (name)=>{
    let title = name;
    if(name.indexOf("西安CDM")> -1){
        title = "西安咸阳机场协同放行"
    }else if(name.indexOf("兰州CDM")> -1){
        title = "兰州中川机场协同放行"
    }else if(name.indexOf("银川CDM")> -1){
        title = "银川河东机场协同放行"
    }else if(name.indexOf("西宁CDM")> -1){
        title = "西宁曹家堡机场协同放行"
    }
    
    return title;
}

export { NWGlobal,convertNameToTitle }

