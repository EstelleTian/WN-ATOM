/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect} from 'react'
import {Tag, Descriptions, Checkbox, Space, Card, Row, Col, Badge, Tooltip } from 'antd'
import { formatTimeString, isValidVariable, isValidObject} from '../../utils/basic-verify'

//方案详情页面流控模块
function FlowcontrolDetailCard(props) {

    // 流控信息对象
    const {flowcontrolDataList=[], title="", index, showBadge, } = props;


    // 依据流控限制方式取流控限制数值方法
    const restrictionModeData = {
        "AH": {
            label: "AH",
            key: "restrictionMITValue",
            unit: "",
        },
        "MIT": {
            label: "MIT",
            key: "restrictionMITValue",
            unit: "",
        },
        "AFP": {
            label: "AFP",
            key: "restrictionAFPValueSequence",
            unit: "架/小时",
        },
        "GS": {
            label: "GS",
            key: "",
            unit: "",
        }
    };

    const getTitle =()=> {
        if(showBadge){
            return title;
            // return <span><Badge count={ index } style={{ backgroundColor: '#1890ff' }} /> <span>{ title }</span></span>
        }else{
            return title;
        }
    }

    const drawSingleFlowcontrolData = (flowcontrolData, index)=> {
        const {flowControlName,  flowControlTimeInfo = {}, flowControlMeasure = {},
            TrafficFlowDomainMap = {}, flowControlPublishType, flowControlReason, id,
        } = flowcontrolData;
        // 流控开始时间(12位字符串)
        let flowControlStartTime = flowControlTimeInfo.startTime || "";
        // 流控开始时间(12位字符串)
        let flowControlEndTime = flowControlTimeInfo.endTime || "";

        const {restrictionMode = "", restrictionMITValueUnit=""} = flowControlMeasure;
        let modeData = restrictionModeData[restrictionMode] || {};
        
        // 流控限制方式
        let restrictionModeLable = modeData.label || "";

        // 流控限制数值
        let restrictionModeKey = modeData.key || "";
        let restrictionModeValue = flowControlMeasure[restrictionModeKey] || "";
        // 流控限制数值单位
        let restrictionModeUnit = modeData.unit || "";
        // MIT和AH限制类型的限制单位取值
        if(restrictionMode ==="MIT" || restrictionMode ==="AH" ){
            if(restrictionMITValueUnit ==="T"){
                restrictionModeUnit= "分钟"
            }else if(restrictionMITValueUnit ==="D"){
                restrictionModeUnit= "公里"
            }
        }
        

        return(
            <div className="info-content flowcontrol-list" data-id={id} key={index}>
                <Row className="info-row">
                    <Col span={24}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                <label className="ant-form-item-no-colon" title="流控名称">流控名称</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">{`${flowControlName}`}</div>
                                </div>
                            </div>
                        </div>

                    </Col>
                </Row>
                <Row className="info-row">
                    <Col span={8}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                <label className="ant-form-item-no-colon" title="开始时间">开始时间</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">{formatTimeString(flowControlStartTime)}</div>
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
                                    <div className="ant-form-item-control-input-content">{formatTimeString(flowControlEndTime)}</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                <label className="ant-form-item-no-colon" title="限制方式">限制方式</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">{restrictionModeLable}</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="info-row">
                    <Col span={8}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                <label className="ant-form-item-no-colon" title="限制值">限制值</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">
                                        { isValidVariable(restrictionModeValue) ? `${restrictionModeValue} ${restrictionModeUnit}` : '' }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Col>
                </Row>
            </div>
        )
    }

    return (

        <Col span={24}>
            <Card title={ title } size="small" className="advanced-card" bordered={false}>

                {
                    flowcontrolDataList.map((item, index) =>{
                       return drawSingleFlowcontrolData(item, index);
                    })
                }

            </Card>

        </Col>
    )
}


export default FlowcontrolDetailCard;


