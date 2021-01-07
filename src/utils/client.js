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
        jsEntity.openMessageDlg("");
    }catch (e){
        console.error(e);
    }
}
//流控详情--点击--导入
const handleImportControl =(str) => {
    try {
        //传递方案id
        jsEntity.importControl(str);
    }catch(error){
        console.error(error);
    }
};
//发送用户名-密码
const saveUserInfo =(username, password) => {
    try {
        alert("用户名："+username+"  密码："+password)
        //传递方案id
        jsEntity.saveUserInfo(username, password);
    }catch(error){
        console.error(error);
    }
};
export { sendMsgToClient, openTimeSlotFrame, closeMessageDlg, openMessageDlg, openControlDetail, handleImportControl, saveUserInfo}