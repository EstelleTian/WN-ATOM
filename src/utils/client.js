

const sendMsgToClient = (str) => {
    console.log("发送：", str);
    try{
        jsEntity.genMessage(str);
    }catch (e){

    }

}

export {sendMsgToClient}