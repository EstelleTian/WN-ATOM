/*
 * @Author: your name
 * @Date: 2020-12-22 18:26:34
 * @LastEditTime: 2020-12-22 18:29:07
 * @LastEditors: Please set LastEditors
 * @Description: 调用客户端方法
 * @FilePath: \WN-CDM\src\utils\global.js
 */
//点击容流监控按钮-发送消息
const sendMsgToClient = (str) => {
    try{
        // 内容监控按钮点击发送
        jsEntity.genMessage(JSON.stringify(str));
    }catch (e){
        console.error(e);
    }
}
//点击放行监控按钮点击-发送消息
const openTimeSlotFrame = (str) => {
    try{
        // 放行监控按钮点击发送
        jsEntity.openTimeSlotFrame(JSON.stringify(str));
    }catch (e){
        console.error(e);
    }
}
//点击关闭按钮
const closeMessageDlg = (str) => {
    try{
        // 关闭消息中心
        jsEntity.closeMessageDlg(str);
    }catch (e){
        console.error(e);
    }
}
//点击 查看流控详情
const openControlDetail = (str) => {
    try{
        // 点击 查看流控详情
        jsEntity.openControlDetail(str)
    }catch (e){
        console.error(e);
    }
}
//点击铃铛
const openMessageDlg = () => {
    try{
        // 打开消息中心
        jsEntity.openMessageDlg();
    }catch (e){
        console.error(e);
    }
}
export { sendMsgToClient, openTimeSlotFrame, closeMessageDlg, openMessageDlg, openControlDetail}