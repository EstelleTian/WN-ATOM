

const sendMsgToClient = (str) => {
    try{
        // 内容监控按钮点击发送
        jsEntity.genMessage(JSON.stringify(str));
    }catch (e){
        console.error(e);
    }
}
const openTimeSlotFrame = (str) => {
    try{
        // 放行监控按钮点击发送
        jsEntity.openTimeSlotFrame(JSON.stringify(str));
    }catch (e){
        console.error(e);
    }
}
const closeMessageDlg = () => {
    try{
        // 放行监控按钮点击发送
        jsEntity.closeMessageDlg();
    }catch (e){
        console.error(e);
    }
}
export { sendMsgToClient, openTimeSlotFrame, closeMessageDlg}