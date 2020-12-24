

const sendMsgToClient = (str) => {
    console.log("发送：", str);
    try{
        // jsEntity.genMessage(str);
        jsEntity.genMessage("cookie发:"+str);
    }catch (e){

    }

}

export {sendMsgToClient}