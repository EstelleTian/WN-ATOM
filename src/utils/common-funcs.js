/*
 * @Author: your name
 * @Date: 2021-01-14 16:08:02
 * @LastEditTime: 2021-03-04 14:32:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\utils\common-funcs.js
 */
import { notification } from 'antd'

const customNotice = ({ type, message, description = "", placement="topLeft", duration = null }) =>{
    notification.destroy();
    notification[type]({
        message,
        description,
        placement,
        duration: null,
        className: 'custom_noti custom_noti_'+type
    });
}
export { customNotice }