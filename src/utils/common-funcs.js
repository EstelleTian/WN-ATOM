/*
 * @Author: your name
 * @Date: 2021-01-14 16:08:02
 * @LastEditTime: 2021-06-07 14:54:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\utils\common-funcs.js
 */
import { notification } from 'antd'
import { isValidVariable } from './basic-verify';

const closeNoticeByType = (str, num=1)=>{
    //消息类，只显示一个
    const noticeDom = document.getElementsByClassName("ant-notification-notice "+str);
    if(noticeDom.length === num ){
        noticeDom[0].remove()
    }
}
const customNotice = ({ type, message="", description = "", placement="topLeft", duration = 30, msgType="" }) =>{
    if( !isValidVariable(message) ){
        return;
    }
    //异步消息类，只显示一个
    closeNoticeByType("noti_async", 10);
    
    //成功消息类，只显示一个
    closeNoticeByType("custom_noti_success");
    //失败消息类，只显示一个
    closeNoticeByType("custom_noti_error");
    //告警消息类，只显示一个
    closeNoticeByType("custom_noti_info");
    //告警消息类，只显示一个
    closeNoticeByType("custom_noti_warning");
    //告警消息类，只显示一个
    closeNoticeByType("custom_noti_warn");
    
    //拼接class名
    let className = "custom_noti"
    if(msgType==="async"){
        className+=" noti_"+msgType
    }else{
        className+=" custom_noti_"+type
    }
    

    //type: success error info warning warn
    notification[type]({
        message,
        description,
        placement,
        duration,
        className
    });
}
export { customNotice }