
import React, { Suspense, useState, useEffect } from  'react'
import {Spin, Row, Col, message as antdMessage, Button} from "antd";
// import ATOMDetail  from 'components/RestrictionDetail/ATOMDetail'
import ATOMAdd  from 'components/RestrictionDetail/ATOM/ATOMAdd'
import ATOMUpdate  from 'components/RestrictionDetail/ATOM/ATOMUpdate'
import ATOMTermination  from 'components/RestrictionDetail/ATOM/ATOMTermination'

import './RestrictionPage.scss'


//限制详情
function RestrictionPage( props ) {
    // let [ messageStr, setMessageStr ] = useState("");
    let [ message, setMessage ] = useState({});
    let [ disabledForm, setDisabledForm] = useState(true);
    // let [flowData, setFlowData] = useState({})
    
    // //更新方案列表数据
    // const updateData = data => {
    //     let {  status } = data;
    //     if( status === 500 ){
    //         antdMessage.error('获取的流控数据为空');
    //     }else{
    //         setFlowData(data);
    //     }
    // }
    // const requestErr = (err, content) => {
    //     antdMessage.error({
    //         content,
    //         duration: 4,
    //     });
    // }
    // const requestATOMData = (id) => {
    //     let user = localStorage.getItem("user");
    //     user = JSON.parse(user);
    //
    //     const opt = {
    //         url: ReqUrls.ATOMDataUrl + id,
    //         method:'GET',
    //         params:{
    //             userId: user.id
    //         },
    //         resFunc: (data)=> updateData(data),
    //         errFunc: (err)=> requestErr(err, '流控数据获取失败' ),
    //     };
    //     request(opt);
    // }

    useEffect(() => {
        let msgStr = localStorage.getItem("message");
        let json = JSON.parse(msgStr);
        setMessage(json);
        // let { data = {} } = json;
        // data = JSON.parse(data);
        // const id = data.id;
        // console.log("id:", id);
        // requestATOMData(id);
    }, [])

    let newTypeCn = "";
    let dataCode = "";
    let source = "";
   if( message !== null && message.hasOwnProperty("dataCode") ){
        dataCode = message.dataCode || "";
        source = message.source || "";
        console.log(dataCode);
        if( dataCode === "AFAO" ){
            newTypeCn = "新增外区流控信息";
        }else if( dataCode === "UFAO" ){
            newTypeCn = "变更外区流控信息";
        }else if( dataCode === "TFAO" ){
            newTypeCn = "终止外区流控信息";
        }else if( dataCode === "AFAI" ){
            newTypeCn = "新增区内流控信息";
        }else if( dataCode === "UFAI" ){
            newTypeCn = "变更区内流控信息";
        }else if( dataCode === "TFAI" ){
            newTypeCn = "终止区内流控信息";
        }
        document.title = newTypeCn;
    }

    let pageType ="";
    // 新增
    if(dataCode === "AFAO" || dataCode === "AFAI"){
        if(source === "ATOM" ){
            pageType ="ATOMAdd"
        }else if(source === "NTFM" ){
            pageType ="NTFMAdd"
        }
    } else if(dataCode === "UFAO" || dataCode === "UFAI"){ // 更新
        if(source === "ATOM" ){
            pageType ="ATOMUpdate"
        }else if(source === "NTFM" ){
            pageType ="NTFMUpdate"
        }
    } else if(dataCode === "TFAO" || dataCode === "TFAI"){ // 终止
        if(source === "ATOM" ){
            pageType ="ATOMTerminate"
        }else if(source === "NTFM" ){
            pageType ="NTFMTerminate"
        }
    }

    return (
        <Suspense fallback={ <div className="load_spin"><Spin tip="加载中..."/></div> }>
            {/*<div>messageStr:{messageStr}</div>*/}          
            {
                //新增
                ( pageType === "ATOMAdd") ?
                    <ATOMAdd
                        title={ `${newTypeCn}(${source})` }
                        disabledForm={disabledForm}
                        setDisabledForm={setDisabledForm}
                    />
                    : ""
            }
            { //更新
                ( pageType === "ATOMUpdate") ?
                    <ATOMUpdate
                        title={ `${newTypeCn}(${source})` }
                        disabledForm={disabledForm}
                        setDisabledForm={setDisabledForm}
                    />
                    : ""
            }
            { //终止
                ( pageType === "ATOMTerminate") ?
                    <ATOMTermination
                        title={ `${newTypeCn}(${source})` }
                    />
                    : ""
            }

        </Suspense>

    )

}

export default RestrictionPage