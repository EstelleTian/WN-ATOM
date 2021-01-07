/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect} from 'react'
import {Tag, Descriptions, Checkbox, Space, Card, Row, Col, Divider} from 'antd'
import {getFullTime, getDayTimeFromString, isValidVariable, isValidObject} from '../../utils/basic-verify'
import FlowcontrolDetailCard  from 'components/SchemeList/FlowcontrolDetailCard'

import './SchemeDetail.scss'

//方案详情模块
function SchemeDetail(props) {


    const {flowData = {}, showImportBtn} = props;
    // 方案数据对象
    const {tacticProcessInfo = {}} = flowData;
    const {basicTacticInfo = {}, } = tacticProcessInfo;

    const {tacticName, tacticPublishUnit, tacticPublishUser, id, tacticTimeInfo = {}, sourceFlowcontrol = {}, directionList = []} = basicTacticInfo;
    let flowcontrolList = [];
    if(isValidVariable(tacticProcessInfo.flowcontrolList)){
        flowcontrolList = tacticProcessInfo.flowcontrolList
    }

    const {startTime = "", endTime = "", startCalculateTime = "", endCalculateTime = ""} = tacticTimeInfo;


    const {flowControlName, flowControlTimeInfo = {}, flowControlMeasure = {}, TrafficFlowDomainMap = {}, flowControlPublishType, flowControlReason,} = sourceFlowcontrol; // 流控信息对象
    // 流控开始时间(12位字符串)
    let flowControlStartTime = flowControlTimeInfo.startTime || "";
    // 流控开始时间(12位字符串)
    let flowControlEndTime = flowControlTimeInfo.endTime || "";

    // 流控方向领域对象
    const directionListData = directionList[0] || {};
    const {targetUnit, preorderUnit, behindUnit, exemptPreUnit, exemptbehindUnit, highLimit} = directionListData;


    return (
        <Row>
            <Col span={24}>
                <Card title="基本信息" size="small" className="advanced-card" bordered={false}>
                    <Descriptions size="small" bordered column={4}>
                        <Descriptions.Item label="方案名称" span={4}>
                            {tacticName}
                        </Descriptions.Item>
                        <Descriptions.Item label="发布单位">
                            {tacticPublishUnit}
                        </Descriptions.Item>
                        <Descriptions.Item label="发布用户">
                            { tacticPublishUnit }
                        </Descriptions.Item>
                        <Descriptions.Item label="开始时间">
                            { getDayTimeFromString(startTime) }
                        </Descriptions.Item>
                        <Descriptions.Item label="结束时间">
                            { getDayTimeFromString(endTime) }
                        </Descriptions.Item>
                        <Descriptions.Item label="开始计算时间">
                            { getDayTimeFromString(startCalculateTime) }
                        </Descriptions.Item>
                        <Descriptions.Item label="结束计算时间">
                            { getDayTimeFromString(endCalculateTime) }
                        </Descriptions.Item>
                        <Descriptions.Item label="基准单元">
                            <div className="cell">{ targetUnit }</div>

                        </Descriptions.Item>
                        <Descriptions.Item label="前序单元">
                            <div className="cell">{ preorderUnit }</div>
                        </Descriptions.Item>
                        <Descriptions.Item label="后续单元">
                            <div className="cell">{ behindUnit }</div>
                        </Descriptions.Item>
                        <Descriptions.Item label="豁免前序">
                            <div className="cell">{ exemptPreUnit }</div>
                        </Descriptions.Item>
                        <Descriptions.Item label="豁免后续">
                            <div className="cell">{ exemptbehindUnit }</div>
                        </Descriptions.Item>
                        <Descriptions.Item label="限制高度">
                            <div className="cell">{ highLimit }</div>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
            <FlowcontrolDetailCard flowcontrolData={ sourceFlowcontrol } title="原始流控信息" > </FlowcontrolDetailCard>
            <Divider orientation="left"> {`流控信息`}</Divider>

            {
                flowcontrolList.map( (item, index) => (
                    <FlowcontrolDetailCard key={index} flowcontrolData={ item }  showBadge={ true } index={ index +1 } ></FlowcontrolDetailCard>
                    )
                )

            }


        </Row>
    )
}


export default SchemeDetail;

