
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect} from 'react'
import { Form, Descriptions, Checkbox , Space, Card, Row, Col  } from 'antd'
import {formatTimeString, getDayTimeFromString, isValidVariable } from '../../utils/basic-verify'
import './ATOMDetail.scss'

//顶部导航模块
function ATOMDetail(props){

    const options = [
        { label: '是否同一高度', value: 'sameHeight' },
        { label: '起飞申请', value: 'takeoffApply' },
        { label: '禁航', value: 'noFly' },
    ];

    console.log(props);
    const { flowData = {}, flowType, title } = props;
    const { atomFlowInfo = {}, formerAtomFlowInfo={} } = flowData;
    let flowInfo = {};
    if(flowType ==="ATOMData"){
        flowInfo = atomFlowInfo;
    }else if (flowType ==="FormerATOMData"){
        flowInfo = formerAtomFlowInfo;
    }

    let { id, flowId, beginTime, endTime, flowName, forwardingtype,  sendUnit, recvUnit,
        reason, sendSubUnit, content, arrAirport, arrExempt, depAirport,  inArea, route, depExempt,
        contlPoint, controltype, dataStatus, delay, effective, flyArea, remark, sameHeight, takeoffApply,  noFly,
        htype, hvalue,
    } = flowInfo;

    const checkedVal = [];
    if(sameHeight === "Y"){
        checkedVal.push(sameHeight);
    }
    if(takeoffApply === "Y"){
        checkedVal.push(takeoffApply);
    }
    if(noFly === "Y"){
        checkedVal.push(noFly);
    }



    return (
        <Row>
            <Col span={24}>
                <Form
                    className="advanced_form ATOM__detail_form bordered-form"
                    colon={false}
                    labelAlign="left"
                >
                    <Card title={title} size="small" className="advanced-card" bordered={false} >
                        <div className="info-content">
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="流控名称">流控名称</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{flowName}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="流控ID">流控ID</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{id}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="流控类型">流控类型</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{forwardingtype}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="发布单位">发布单位</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{sendUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="受控单位">受控单位</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{recvUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="流控原因">流控原因</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{reason}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="事发地">事发地</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{sendSubUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="交接点(入点)">交接点(入点)</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{contlPoint}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="开始时间">开始时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{formatTimeString( beginTime )}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="结束时间">结束时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{formatTimeString( endTime )}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="交接点(出点)">交接点(出点)</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="开始时间">开始时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="结束时间">结束时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="起飞机场">起飞机场</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{depAirport}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="飞越区域">飞越区域</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{flyArea}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="起飞机场豁免">起飞机场豁免</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{depExempt}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="落地机场">落地机场</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{arrAirport}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="进...区域">进...区域</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{inArea}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="落地机场豁免">落地机场豁免</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{arrExempt}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="高度限制">高度限制</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    <Space size={ 50 }>
                                                        <span>
                                                            { hvalue }
                                                        </span>
                                                        <span>
                                                            <Checkbox.Group options={options} defaultValue={checkedVal} disabled/>
                                                        </span>
                                                    </Space>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="航路">航路</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{route}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="持续时间">持续时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    {isValidVariable(effective) ? `${effective} 分钟` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="迟发时间">迟发时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    {isValidVariable(delay) ? `${delay} 分钟` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="自由编辑">自由编辑</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    { content }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="备注">备注</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    { remark }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Form>
            </Col>
        </Row>
    )
}


export default ATOMDetail;


