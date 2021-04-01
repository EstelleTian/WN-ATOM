/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-04-01 18:51:13
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect, useState, useCallback, useMemo} from 'react'
import {Tag, Descriptions, Checkbox, Space, Card, Row, Col, Divider, Tooltip, Form,  message, Spin} from 'antd'
import {getFullTime, formatTimeString, isValidVariable, isValidObject} from '../../utils/basic-verify'
import { ReqUrls } from '../../utils/request-urls'
import { requestGet } from '../../utils/request'
import FlowcontrolDetailCard  from 'components/SchemeList/FlowcontrolDetailCard'

import './RunwayDetail.scss'

//方案详情模块
function RunwayDetail(props) {
    
    const { airportName, data = "" } = props;

    const {
        sign0,
        startTime,
        endTime,
        generateTime,
        updateTime,
        operationModeStr,
    } = useMemo(function(){
        const sign0 = data.sign0 || ""; //配置状态

        const listRWGapInfoDefault = data.listRWGapInfoDefault || [];
        let startTime = "";
        let endTime = "";
        let generateTime = "";
        let updateTime = "";
        let operationModeStr = "";//运行模式
        listRWGapInfoDefault.map( item => {
            const startTimeStr = item.startTime || ""; //起始时间
            const endTimeStr = item.endTime || ""; //结束时间
            const generateTimeStr = item.generateTime || ""; //创建时间
            const updateTimeStr = item.updateTime || "";//终止时间
            if( startTimeStr.length >= 12 ){
                startTime = startTimeStr.substring(0,8) + ' ' + startTimeStr.substring(8);
            }
            if( endTimeStr.length >= 12 ){
                endTime = endTimeStr.substring(0,8) + ' ' + endTimeStr.substring(8);
            }
            if( generateTimeStr.length >= 12 ){
                generateTime = generateTimeStr.substring(0,8) + ' ' + generateTimeStr.substring(8);
            }
            if( updateTimeStr.length >= 12 ){
                updateTime = updateTimeStr.substring(0,8) + ' ' + updateTimeStr.substring(8);
            }
            const operationMode = item.operationmode; 
            
            if( operationMode != "" ){
                if( operationMode*1 == 100){
                    operationModeStr = "就近模式";
                }else if( operationMode*1 == 200){
                    operationModeStr = "走廊口模式";
                }
            }
        })

        return {
            sign0,
            startTime,
            endTime,
            generateTime,
            updateTime,
            operationModeStr,
        }
        
        
    }, [data])
    

    return (
        
            <Row className="runway-detail">
            <Card title="方案基本信息" size="small" className="advanced-card" bordered={false}>
                <div className="info-content">
                    <Row className="info-row">
                        <Col span={12}>
                            <div className="ant-row ant-form-item">
                                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                    <label className="ant-form-item-no-colon" title="起始时间">起始时间</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <div className="ant-form-item-control-input">
                                        <div className="ant-form-item-control-input-content">{startTime}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="ant-row ant-form-item">
                                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                    <label className="ant-form-item-no-colon" title="结束时间">结束时间</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <div className="ant-form-item-control-input">
                                        <div className="ant-form-item-control-input-content">{endTime}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="info-row">
                        <Col span={12}>
                            <div className="ant-row ant-form-item">
                                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                    <label className="ant-form-item-no-colon" title="创建时间">创建时间</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <div className="ant-form-item-control-input">
                                        <div className="ant-form-item-control-input-content">{generateTime}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="ant-row ant-form-item">
                                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                    <label className="ant-form-item-no-colon" title="终止时间">终止时间</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <div className="ant-form-item-control-input">
                                        <div className="ant-form-item-control-input-content">{updateTime}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="info-row">
                        <Col span={12}>
                            <div className="ant-row ant-form-item">
                                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                    <label className="ant-form-item-no-colon" title="配置状态">配置状态</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <div className="ant-form-item-control-input">
                                        <div className="ant-form-item-control-input-content">{sign0}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="ant-row ant-form-item">
                                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                    <label className="ant-form-item-no-colon" title="运行模式">运行模式</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <div className="ant-form-item-control-input">
                                        <div className="ant-form-item-control-input-content">{operationModeStr}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                   
                </div>

            </Card>
            </Row>
        
    )
}


export default RunwayDetail;


