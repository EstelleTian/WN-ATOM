
//tip提示已起飞等颜色
const cgreen = 'rgba(104,142,151,0.98)';
const cred = "rgba(151,59,52,0.9)";
//关闭协调窗口popover
const closePopover = () => {
    // 创建事件
    const evt = document.createEvent("MouseEvents");
    // 初始化 事件名称必须是mousedown
    evt.initEvent("mousedown", true, true);
    // 触发, 即弹出文字
    document.dispatchEvent(evt);
}


export { closePopover, cgreen, cred }