/*
 * @Author: your name
 * @Date: 2020-12-22 18:26:34
 * @LastEditTime: 2021-02-04 11:45:34
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
        jsEntity.openControlDetail(JSON.stringify(str), str.id)
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
const handleImportControl =(str, massageId) => {
    try {
        // alert("传入的id是："+massageId);
        //传递方案id和消息id
        jsEntity.importControl(str, massageId);
    }catch(error){
        console.error(error);
    }
};
//方案列表--点击方案调整
const handleImportControlForUpdate =(oldId, newId) => {
    try {

        //传递被修改方案id和修改后的新方案id
        jsEntity.importControlForUpdate(oldId, oldId);
    }catch(error){
        console.error(error);
    }
};
//发送用户名-密码
const saveUserInfo =(username, password) => {
    try {
        // alert("用户名："+username+"  密码："+password)
        //传递方案id
        jsEntity.saveUserInfo(username, password);
    }catch(error){
        console.error(error);
    }
};
//发送关闭窗口
const closeCreateDlg =() => {
    try {

        jsEntity.closeCreateDlg();
    }catch(error){
        console.error(error);
    }
};
//决策依据
const openBaseSchemeFrame =(id) => {
    try {
        jsEntity.openBaseSchemeFrame(id);
    }catch(error){
        console.error(error);
    }
};
//忽略-按钮-点击
const closeControlDetail =(id) => {
    try {
        jsEntity.closeControlDetail(id);
    }catch(error){
        console.error(error);
    }
};
//工作流-主办-跳转到容流监控
const openConfirmFrame =(schemeId = "") => {
    try {
        //方案id
        // alert("跳转到容流监控=>schemeId:" +schemeId);
        jsEntity.openConfirmFrame(schemeId);
    }catch(error){
        console.error(error);
    }
};
//工作流-主办-跳转到放行监控页面
const openTimeSlotFrameWithFlightId =(schemeId = "", flightId = "") => {
    try {
        // alert("跳转到放行监控页面=>schemeId:" +schemeId+"  flightId:"+flightId);
        jsEntity.openTimeSlotFrameWithFlightId(schemeId, flightId);
    }catch(error){
        console.error(error);
    }
};

export {
    sendMsgToClient, openTimeSlotFrame, closeMessageDlg, openMessageDlg, openControlDetail, handleImportControl, saveUserInfo,
    closeCreateDlg, openBaseSchemeFrame, closeControlDetail,
    openConfirmFrame, openTimeSlotFrameWithFlightId, handleImportControlForUpdate
}