

const sendMsgToClient = (str) => {
    console.log("发送：", str);
    jsEntity.genMessage(str);
}

export {sendMsgToClient}