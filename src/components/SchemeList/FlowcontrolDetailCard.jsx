/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect} from 'react'
import {Tag, Descriptions, Checkbox, Space, Card, Row, Col, Badge} from 'antd'
import { getDayTimeFromString, isValidVariable, isValidObject} from '../../utils/basic-verify'

//方案详情页面流控模块
function FlowcontrolDetailCard(props) {

    // 流控信息对象
    const {flowcontrolData = {}, title="", index, showBadge } = props;
    const {flowControlName, flowControlTimeInfo = {}, flowControlMeasure = {},
        TrafficFlowDomainMap = {}, flowControlPublishType, flowControlReason,
    } = flowcontrolData;
    // 流控开始时间(12位字符串)
    let flowControlStartTime = flowControlTimeInfo.startTime || "";
    // 流控开始时间(12位字符串)
    let flowControlEndTime = flowControlTimeInfo.endTime || "";

    const {restrictionMode = "",} = flowControlMeasure;

    // 依据流控限制方式取流控限制数值方法
    const restrictionModeData = {
        "MIT": {
            label: "MIT",
            key: "restrictionMITValue",
            unit: "分钟",
        },
        "AFP": {
            label: "AFP",
            key: "restrictionAFPValueSequence",
            unit: "架次",
        },
        "GS": {
            label: "GS",
            key: "",
            unit: "",
        }
    };
    let modeData = restrictionModeData[restrictionMode] || {};
    // 流控限制方式
    let restrictionModeLable = modeData.label || "";

    // 流控限制数值
    let restrictionModeKey = modeData.key || "";
    let restrictionModeValue = flowControlMeasure[restrictionModeKey] || "";
    // 流控限制数值单位
    let restrictionModeUnit = modeData.unit || "";
    const getTitle =()=> {
        if(showBadge){
            return <span><Badge count={ index } style={{ backgroundColor: '#1890ff' }} /> <span>{ title }</span></span>
        }else{
            return title;
        }
    }


    return (
        <Col span={24}>
            <Card title={ getTitle() } size="small" className="advanced-card" bordered={false}>
                <Descriptions size="small" bordered column={4} contentStyle={{ width: 120 }}>
                    <Descriptions.Item label="流控名称" span={4}>
                        {flowControlName}
                    </Descriptions.Item>
                    <Descriptions.Item label="开始时间">
                        { getDayTimeFromString( flowControlStartTime )}
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间">
                        { getDayTimeFromString( flowControlEndTime )}
                    </Descriptions.Item>
                    <Descriptions.Item label="限制方式">
                        { restrictionModeLable }
                    </Descriptions.Item>
                    <Descriptions.Item label="限制值">
                        { isValidVariable(restrictionModeValue) ? `${restrictionModeValue} ${restrictionModeUnit}` : '' }
                    </Descriptions.Item>
                </Descriptions>
            </Card>

        </Col>
    )
}


export default FlowcontrolDetailCard;


