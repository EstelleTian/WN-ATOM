/*
 * @Author: your name
 * @Date: 2020-12-22 18:26:34
 * @LastEditTime: 2021-04-26 11:26:38
 * @LastEditors: Please set LastEditors
 * @Description: 调用客户端方法
 * @FilePath: \WN-CDM\src\utils\global.js
 */
//消息模块-计数
const updateMessageNum = (num) => {
    try{
        // 计数
        jsEntity.updateMessageNum(num+"");
    }catch (e){
        console.error(e);
    }
}
//消息模块-【查看容流监控】
const sendMsgToClient = (str) => {
    try{
        // 内容监控按钮点击发送
        jsEntity.genMessage(JSON.stringify(str));
    }catch (e){
        console.error(e);
    }
}
//消息模块-【查看放行监控】
const openTimeSlotFrame = (str) => {
    try{
        // 放行监控按钮点击发送
        jsEntity.openTimeSlotFrame(JSON.stringify(str));
    }catch (e){
        console.error(e);
    }
}
//消息模块-【查看容量管理】
const openTclientFrameForMessage =( name = "") => {
    try {
        //方案id
        // alert("跳转到容量管理=>name:" +name);
        jsEntity.openTclientFrameForMessage(name);
    }catch(error){
        console.error(error);
    }
};
//消息模块-【查看MDRS管理】
const openTclientFrameForMDRS =( name = "") => {
    try {
        //方案id
        // alert("跳转到MDRS管理=>name:" +name);
        jsEntity.openTclientFrameForMDRS(name);
    }catch(error){
        console.error(error);
    }
};
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
//点击 【异常航班信息】查看航班详情
const openDetails = (str) => {
    try{
        jsEntity.openDetails(JSON.stringify(str))
    }catch (e){
        console.error(e);
    }
}
//点击 【异常航班信息】查看航班定位
const openLocation = (str, dataCode) => {
    try{
        jsEntity.openLocation(JSON.stringify(str), dataCode)
    }catch (e){
        console.error(e);
    }
}
//点击方案执行情况
const openRunningControlFlow = (id) => {
    try{
        // 调用客户端方法，传入方案id
        jsEntity.openRunningControlFlow(id)
    }catch (e){
        console.error(e);
    }
}
 
//点击铃铛
const openMessageDlg = (message) => {
    try{
        // 打开消息中心
        jsEntity.openMessageDlg(message);
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
        jsEntity.importControlForUpdate(oldId, newId);
    }catch(error){
        console.error(error);
    }
};

//模拟状态的方案调整
const handleUpdateFlowControl =(id) => {
    try {
        jsEntity.updateFlowControl(id);
    }catch(error){
        console.error(error);
    }
};


//方案列表--点击方案终止
const handleStopControl =(id) => {
    try {
        //传递被终止方案id
        jsEntity.stopControlFlow(id);
    }catch(error){
        console.error(error);
    }
};
//发送用户名-密码-选中模块
const saveUserInfo =(username, password, name) => {
    try {
        // alert("用户名："+username+"  密码："+password+"  选中模块："+name)
        //传递方案id
        // jsEntity.saveUserInfo(username, password, name);
        jsEntity.saveUserInfo(username, password, name);
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
//方案-航图关联
const openFilterFrame =(id, tacticName, targetUnits, interVal) => {
    // alert(id+"            "+ tacticName+"      "+ targetUnits+"            "+ interVal)
    try {
        jsEntity.openFilterFrame(id, tacticName, targetUnits, interVal);
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
        // alert("跳转到放行监控页面openTimeSlotFrameWithFlightId=>schemeId:" +schemeId+"  flightId:"+flightId);
        jsEntity.openTimeSlotFrameWithFlightId(schemeId+"", flightId+"");
    }catch(error){
        console.error(error);
    }
};

//总体监控-缩略地图-查看详情点击
const openMapFrame =(area) => {
    try {
        jsEntity.openMapFrame(area);
    }catch(error){
        console.error(error);
    }
};

//总体监控-容流监控单元-查看详情点击
const openCapacityFlowMonitorUnitTclientFrame =(unit) => {
    try {
        jsEntity.openTclientFrame(unit);
    }catch(error){
        console.error(error);
    }
};
//单个方向数据更新
const handleUpdateDirectionData =(str) => {
    try {
        // console.log(str);
        jsEntity.openProjectModeling(str);
    }catch(error){
        console.error(error);
    }
};
//登录窗口关闭
const exitSystem =() => {
    try {
        jsEntity.exitSystem();
    }catch(error){
        console.error(error);
    }
}
export {
    updateMessageNum, sendMsgToClient, openTimeSlotFrame, openTclientFrameForMessage, closeMessageDlg, openMessageDlg, openControlDetail, handleImportControl, saveUserInfo,
    closeCreateDlg, openBaseSchemeFrame, closeControlDetail,
    openConfirmFrame, openTimeSlotFrameWithFlightId, handleImportControlForUpdate, handleStopControl, handleUpdateFlowControl,
    openMapFrame, openCapacityFlowMonitorUnitTclientFrame, openFilterFrame,handleUpdateDirectionData, exitSystem, openRunningControlFlow,openDetails,
    openLocation,openTclientFrameForMDRS
}