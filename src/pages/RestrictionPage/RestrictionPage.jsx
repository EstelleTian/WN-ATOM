
import React, { Suspense, useState } from  'react'
import {Spin, Row, Col, message as antdMessage} from "antd";
import ATOMDetail  from 'components/RestrictionDetail/ATOMDetail'
import NTFMDetail  from 'components/RestrictionDetail/NTFMDetail'
import RestrictionForm  from 'components/RestrictionForm/RestrictionForm'
import FlowRelation  from 'components/RestrictionForm/FlowRelation'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { NWGlobal } from "utils/global";
import './RestrictionPage.scss'


//限制详情
function RestrictionPage( props ) {
    // let [ messageStr, setMessageStr ] = useState("");
    let [ message, setMessage ] = useState({});
    let [ disabledForm, setDisabledForm] = useState(true);
    let [flowData, setFlowData] = useState({})

    //TODO 测试数据，交由客户端后去除---start
    // message = sessionStorage.getItem('message')
    // message = JSON.parse(message)
    // console.log(message)
    //TODO 测试数据，交由客户端后去除---end
    NWGlobal.setMsg = function(str){
        // setMessageStr(str)
        // alert("收到字符串:"+str);
        let json = JSON.parse(str);
        setMessage(json);
        // alert("转json:"+json);
        const { data= {} } = json;
        const id = data.id;
        // alert("id:"+ id);
        requestATOMData(id);
    };

    //更新方案列表数据
    const updateData = data => {
        let {  status } = data;
        if( status === 500 ){
            antdMessage.error('获取的流控数据为空');
        }else{
            setFlowData(data);
        }
    }
    const requestErr = (err, content) => {
        antdMessage.error({
            content,
            duration: 4,
        });
    }
    const requestATOMData = (id) => {
        let user = localStorage.getItem("user");
        user = JSON.parse(user);

        const opt = {
            url: ReqUrls.ATOMDataUrl + id,
            method:'GET',
            params:{
                userId: user.id
            },
            resFunc: (data)=> updateData(data),
            errFunc: (err)=> requestErr(err, '流控数据获取失败' ),
        };
        request(opt);
    }

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
            newTypeCn = "更新外区流控信息";
        }else if( dataCode === "TFAO" ){
            newTypeCn = "终止外区流控信息";
        }else if( dataCode === "AFAI" ){
            newTypeCn = "新增区内流控信息";
        }else if( dataCode === "UFAI" ){
            newTypeCn = "更新区内流控信息";
        }else if( dataCode === "TFAI" ){
            newTypeCn = "终止区内流控信息";
        }
    }

    return (

        <Suspense fallback={ <div className="load_spin"><Spin tip="加载中..."/></div> }>
            {/*<div>messageStr:{messageStr}</div>*/}
            <div style={{ color: '#eb6650' }}>{ newTypeCn }流控 -&gt; 数据来源--{source}</div>
            {
                ( dataCode === "AFAO" || dataCode === "AFAI") ?
                    <Row gutter={12} className="res_canvas">
                        <Col span={12} className="res_left">
                            <Row className="title">
                                <span>流控详情({source})</span>
                            </Row>
                            {
                                source === "ATOM" ? <ATOMDetail flowData={ flowData } message={message}  /> : ""
                            }
                            {
                                source === "NTFM" ? <NTFMDetail/> : ""
                            }
                        </Col>
                        <Col span={12} className="res_right">
                            <Row className="title">
                                <span>流控导入</span>
                                <FlowRelation  setDisabledForm = {setDisabledForm} flowData={ flowData }  disabledForm = {disabledForm} message={message} />
                            </Row>
                            <RestrictionForm  pageType="IMPORT" disabledForm = {disabledForm} 
                            setDisabledForm = {setDisabledForm} flowData={ flowData } message={message}  showIgnoreBtn={true} />
                        </Col>
                    </Row>
                    : ""
            }
            { //更新
                ( dataCode === "UFAO" || dataCode === "UFAI") ?
                    <Row gutter={12} className="res_canvas">
                        <Col span={12} className="res_left">
                            <Row className="title">
                                <span>原流控详情({source})</span>
                            </Row>
                            <Row>
                                <Col>
                                    {
                                        source === "ATOM" ? <ATOMDetail flowData={ flowData }  message={ message } /> : ""
                                    }
                                    {
                                        source === "NTFM" ? <NTFMDetail flowData={ flowData } message={ message } /> : ""
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12} className="res_right">
                            <Row className="title">
                                <span>变更流控详情({source})</span>
                            </Row>
                            <Row>
                                <Col>
                                    {
                                        source === "ATOM" ? <ATOMDetail  flowData={ flowData }  message={ message } /> : ""
                                    }
                                    {
                                        source === "NTFM" ? <NTFMDetail flowData={ flowData } message={ message } /> : ""
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    : ""
            }
            { //终止
                ( dataCode === "TFAO" || dataCode === "TFAI") ?
                    <Row gutter={12} className="res_canvas">
                        <Col span={12} className="res_left">
                            <Row className="title">
                                <span>流控详情({source})</span>
                            </Row>
                            <Row>
                                <Col>
                                    {
                                        source === "ATOM" ? <ATOMDetail flowData={ flowData } message={ message }  /> : ""
                                    }
                                    {
                                        source === "NTFM" ? <NTFMDetail  flowData={ flowData } message={ message } /> : ""
                                    }
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                    : ""
            }

        </Suspense>

    )

}

export default RestrictionPage