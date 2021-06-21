/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, { useEffect } from 'react'
import { Tag, Descriptions, Checkbox, Space, Card, Row, Col, Divider, Tooltip, Form, Input, } from 'antd'
import { getFullTime, formatTimeString, isValidVariable, isValidObject } from '../../utils/basic-verify'
import FlowcontrolDetailCard from 'components/SchemeList/FlowcontrolDetailCard'

import './SchemeDetail.scss'

//方案详情模块
function SchemeDetail(props) {

    const reasonType = {
        "AIRPORT": "机场",
        "MILITARY": "军事活动",
        "CONTROL": "流量",
        "WEATHER": "天气",
        "AIRLINE": "航空公司",
        "SCHEDULE": "航班时刻",
        "JOINT_INSPECTION": "联检",
        "OIL": "油料",
        "DEPART_SYSTEM": "离港系统",
        "PASSENGER": "旅客",
        "PUBLIC_SECURITY": "公共安全",
        "MAJOR_SECURITY_ACTIVITIES": "重大保障活动",
        "OTHER": "其它",
    };

    const { flowData = {}, } = props;
    // 方案数据对象
    let tacticProcessInfo = isValidObject(flowData.tacticProcessInfo) ? flowData.tacticProcessInfo : {};
    // 方案基本信息数据对象
    let basicTacticInfo = isValidObject(tacticProcessInfo.basicTacticInfo) ? tacticProcessInfo.basicTacticInfo : {};
    // 方案时间信息对象
    let tacticTimeInfo = isValidObject(basicTacticInfo.tacticTimeInfo) ? basicTacticInfo.tacticTimeInfo : {};
    // 方案原始流控
    let basicFlowcontrol = isValidObject(basicTacticInfo.basicFlowcontrol) ? basicTacticInfo.basicFlowcontrol : {};
    // 方案方向信息
    let directionList = isValidVariable(basicTacticInfo.directionList) ? basicTacticInfo.directionList : [];

    const { tacticName, tacticPublishUnit, tacticPublishUser, tacticPublishUserCH, id, basicTacticInfoReason, relationAp, relationArea } = basicTacticInfo;
    let flowcontrolList = [];
    if (isValidVariable(tacticProcessInfo.flowcontrolList)) {
        flowcontrolList = tacticProcessInfo.flowcontrolList
    }

    const { startTime = "", endTime = "", startCalculateTime = "", endCalculateTime = "" } = tacticTimeInfo;

    // 流控方向领域对象
    const directionListData = directionList[0] || {};
    const { targetUnit, formerUnit, behindUnit, exemptPreUnit, exemptbehindUnit, } = directionListData;

    const basicTacticInfoReasonZh = reasonType[basicTacticInfoReason] || "";


    let basicFlowcontrolList = [];
    basicFlowcontrolList.push(basicFlowcontrol)


    return (
        <Row className="scheme-detail">
            <Col span={24}>
                <Form
                    className="advanced_form sample_form"
                    colon={false}
                    labelAlign="left"
                >
                    <Card title="方案基本信息" size="small" className="advanced-card" bordered={false}>
                        <div className="info-content">
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="方案名称">方案名称</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{tacticName}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="方案关联机场">方案关联机场</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{relationAp}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="方案关联区域">方案关联区域</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{relationArea}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="发布单位">发布单位</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{tacticPublishUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="发布用户">发布用户</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{tacticPublishUserCH}</div>
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
                                                <div className="ant-form-item-control-input-content">{formatTimeString(startTime)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="结束时间">结束时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{formatTimeString(endTime)}</div>
                                            </div>
                                        </div>
                                    </div>

                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="开始计算时间">开始计算时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{formatTimeString(startCalculateTime, 1)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>

                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="结束计算时间">结束计算时间</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{formatTimeString(endCalculateTime)}</div>
                                            </div>
                                        </div>
                                    </div>

                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>

                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="前序单元">前序单元</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{formerUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="基准单元">基准单元</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    {targetUnit}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="后序单元">后序单元</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{behindUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="豁免前序">豁免前序</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{exemptPreUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="豁免后序">豁免后序</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{exemptbehindUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>

                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="原因">原因</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{basicTacticInfoReasonZh}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                            </Row>
                        </div>

                    </Card>
                    <FlowcontrolDetailCard flowcontrolDataList={basicFlowcontrolList} title="基础流控信息" > </FlowcontrolDetailCard>
                    <FlowcontrolDetailCard flowcontrolDataList={flowcontrolList} title="流控信息" showBadge={true}  ></FlowcontrolDetailCard>
                </Form>
            </Col>
        </Row>
    )
}


export default SchemeDetail;


