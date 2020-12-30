
import React, { Suspense } from  'react'
import {Form, Input, Button, Checkbox, Spin, Row, Col} from "antd";
import ATOMDetail  from 'components/RestrictionDetail/ATOMDetail'
import NTFMDetail  from 'components/RestrictionDetail/NTFMDetail'
import RestrictionForm  from 'components/RestrictionForm/RestrictionForm'
import './RestrictionPage.scss'

//限制详情
function RestrictionPage( props ) {
    const msgStr =sessionStorage.getItem("message");
    let message =  JSON.parse(msgStr)
    let { dataCode, source } = message;
    console.log(dataCode);
    let newTypeCn = "";
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
    return (
        <Suspense fallback={ <div className="load_spin"><Spin tip="加载中..."/></div> }>
            <div style={{ color: '#eb6650' }}>{ newTypeCn }流控 -> 数据来源--{source}</div>
            {
                ( dataCode === "AFAO" || dataCode === "AFAI") ?
                    <Row className="res_canvas">
                        <Col span={12} className="res_left">
                            <Row className="title">
                                <span>流控详情({source})</span>
                            </Row>
                            {
                                source === "ATOM" ? <ATOMDetail/> : ""
                            }
                            {
                                source === "NTFM" ? <NTFMDetail/> : ""
                            }
                        </Col>
                        <Col span={12} className="res_right">
                            <Row className="title">
                                <span>流控导入</span>
                                <Button onClick={ function(e){  } } >流控关联</Button>
                            </Row>
                            <RestrictionForm />
                        </Col>
                    </Row>
                    : ""
            }
            {
                ( dataCode === "UFAO" || dataCode === "UFAI") ?
                    <Row className="res_canvas">
                        <Col span={12} className="res_left">
                            <Row className="title">
                                <span>源流控详情({source})</span>
                            </Row>
                            <Row>
                                <Col>
                                    {
                                        source === "ATOM" ? <ATOMDetail/> : ""
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
                                        source === "ATOM" ? <ATOMDetail/> : ""
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
                                        source === "ATOM" ? <ATOMDetail/> : ""
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