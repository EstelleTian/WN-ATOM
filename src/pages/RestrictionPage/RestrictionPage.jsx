
import React, { Suspense, useState } from  'react'
import {Form, Input, Button, Checkbox, Spin, Row, Col} from "antd";
import ATOMDetail  from 'components/RestrictionDetail/ATOMDetail'
import NTFMDetail  from 'components/RestrictionDetail/NTFMDetail'
import RestrictionForm  from 'components/RestrictionForm/RestrictionForm'
import FlowRelation  from 'components/RestrictionForm/FlowRelation'
import { request } from 'utils/request'

import './RestrictionPage.scss'
import {NWGlobal} from "../../utils/global";

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
        alert("收到字符串:"+str);
        let json = JSON.parse(str);
        setMessage(json);
        alert("转json:"+json);
        const { data= {} } = json;
        const id = data.id;
        alert("id:"+ id);
        requestATOMData(id);
    };

    //更新方案列表数据
    const updateData = data => {
        let {  status } = data;
        if( status === 500 ){
            message.error('获取的流控数据为空');
        }else{
            setFlowData(data);
        }
    }
    const requestErr = (err, content) => {
        message.error({
            content,
            duration: 4,
        });
    }
    const requestATOMData = (id) => {
        // id = "2460915";
        const opt = {
            url:'http://192.168.194.21:58189/hydrogen-scheme-flow-server/restrictions/' + id,
            method:'GET',
            params:{
                // status: "RUNNING",
                // startTime: "",
                // endTIme: "",
                userId: "443"
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
            <div style={{ color: '#eb6650' }}>{ newTypeCn }流控 -> 数据来源--{source}</div>
            {
                ( dataCode === "AFAO" || dataCode === "AFAI") ?
                    <Row className="res_canvas">
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
                                <FlowRelation setDisabledForm = {setDisabledForm} flowData={ flowData }  disabledForm = {disabledForm} message={message} />
                            </Row>
                            <RestrictionForm  disabledForm = {disabledForm}  flowData={ flowData }  />
                        </Col>
                    </Row>
                    : ""
            }
            {
                ( dataCode === "UFAO" || dataCode === "UFAI") ?
                    <Row className="res_canvas">
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
                                        source === "NTFM" ? <NTFMDetail/> : ""
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
                                        source === "NTFM" ? <NTFMDetail/> : ""
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    : ""
            }
            {
                ( dataCode === "TFAO" || dataCode === "TFAI") ?
                    <Row className="res_canvas">
                        <Col span={12} className="res_left">
                            <Row className="title">
                                <span>流控详情({source})</span>
                            </Row>
                            <Row>
                                <Col>
                                    {
                                        source === "ATOM" ? <ATOMDetail message={ message }  /> : ""
                                    }
                                    {
                                        source === "NTFM" ? <NTFMDetail/> : ""
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