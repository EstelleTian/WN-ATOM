/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-04-01 19:42:34
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useMemo} from 'react'
import {Card, Row, Col} from 'antd'
import { RunwayConfigUtil } from "utils/runway-config-util";

import './RunwayDetail.scss'

//用途
const getDirName = (isDepRW) =>{
    let dirName = "";
    switch (isDepRW *1){
        case -1: dirName = "降落";break;
        case 0: dirName = "关闭";break;
        case 1: dirName = "起飞";break;
        case 2: dirName = "起降";break;
    }
    return dirName
}

//起飞间隔和默认滑行
const getDepInterval = (item) => {
    let logicRWDef = item.logicRWDef || "";
    let logicRWNameA = item.logicRWNameA || "";
    let logicRWNameB = item.logicRWNameB || "";
    let logicRWValueA = item.logicRWValueA || "";
    let logicRWValueB = item.logicRWValueB || "";
    let logicRWTaxitimeA = item.logicRWTaxitimeA || "";
    let logicRWTaxitimeB = item.logicRWTaxitimeB || "";

    let logicVal1 = "";
    if( logicRWDef == logicRWNameA ){
        logicVal1 = logicRWValueA + "分钟";
    }else if( logicRWDef == logicRWNameB ){
        logicVal1 = logicRWValueB + "分钟";
    }
    let logicVal2 = "";
    if( logicRWDef == logicRWNameA ){
        logicVal2 = logicRWTaxitimeA + "分钟";
    }else if( logicRWDef == logicRWNameB ){
        logicVal2 = logicRWTaxitimeB + "分钟";
    }
    return { logicVal1, logicVal2 }
}

const formatTime = ( timeStr, type ) => {
    let str = timeStr;
    if( timeStr.length >= 12 ){
        if(type === 2){
            str = timeStr.substring(6,8) + '/' + timeStr.substring(8,10) + ":" +timeStr.substring(10);
        }else{
            str = timeStr.substring(0,8) + ' ' + timeStr.substring(8);
        }
    }
    return str
}
//跑道详情模块
function RunwayDetail(props) {
    
    const { airportName, data = "", type } = props;

    const {
        listRWGapInfo,
        sign0,
        statusZh,
        startTime,
        endTime,
        generateTime,
        updateTime,
        operationModeStr,
    } = useMemo(function(){

        const runwayConEditBean = data.runwayConEditBean || [];
        const sign0 = runwayConEditBean.sign0 || ""; //配置状态
        

        

        const listRWGapInfoDefault = data.listRWGapInfoDefault || [];
        const listRWGapInfoDynamic = data.listRWGapInfoDynamic || [];
        let startTime = "";
        let endTime = "";
        let generateTime = "";
        let updateTime = "";
        let operationModeStr = "";//运行模式
        let listRWGapInfo = [];
        // 状态
        let status = "";
        // 跑道执行状态中文
        let statusZh ="";
        if(type === RunwayConfigUtil.TYPE_DEFAULT ){
            listRWGapInfo = listRWGapInfoDefault;
        }else if(type === RunwayConfigUtil.TYPE_DYNAMIC ){
            listRWGapInfo = listRWGapInfoDynamic;
        }
        listRWGapInfo.map( item => {
             startTime = item.startTime || ""; //起始时间
             endTime = item.endTime || ""; //结束时间
             generateTime = item.generateTime || ""; //创建时间
             updateTime = item.updateTime || "";//终止时间
            
            const operationMode = item.operationmode; 
            // 跑道执行状态中文
            statusZh = RunwayConfigUtil.getExecutionStatusZH(item, type);
            if( operationMode != "" ){
                if( operationMode*1 == 100){
                    operationModeStr = "就近模式";
                }else if( operationMode*1 == 200){
                    operationModeStr = "走廊口模式";
                }
            }
        })

        return {
            listRWGapInfo,
            sign0,
            statusZh,
            startTime,
            endTime,
            generateTime,
            updateTime,
            operationModeStr,
        }
        
        
    }, [data])
    

    return (
        
            <Row className="runway-detail">
                <Col span={24}>
                    <div style={{
                        fontSize: "1.2rem",
                        textAlign: "center"
                    }}>
                       <span> 有效时间：{formatTime(startTime,2)}-{formatTime(endTime,2)}</span>
                       <span style={{
                        paddingLeft: "1rem",
                    }}>{sign0}</span>
                    </div>
                </Col>
                <Card title="基本信息" size="small" className="advanced-card" bordered={false}>
                    <div className="info-content">
                        <Row className="info-row">
                            <Col span={12}>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                        <label className="ant-form-item-no-colon" title="起始时间">起始时间</label>
                                    </div>
                                    <div className="ant-col ant-form-item-control">
                                        <div className="ant-form-item-control-input">
                                            <div className="ant-form-item-control-input-content">{formatTime(startTime)}</div>
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
                                            <div className="ant-form-item-control-input-content">{formatTime(endTime)}</div>
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
                                            <div className="ant-form-item-control-input-content">{formatTime(generateTime)}</div>
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
                                            <div className="ant-form-item-control-input-content">{formatTime(updateTime)}</div>
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
                                            <div className="ant-form-item-control-input-content">{statusZh}</div>
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
                <Card title="跑道配置" size="small" className="table-card" bordered={false}>
                    <div className="info-content">
                        <Row className="info-row">
                            <Col span={3}>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                        <label className="ant-form-item-no-colon" title="跑道">跑道</label>
                                    </div>
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                        <label className="ant-form-item-no-colon" title="默认方向">默认方向</label>
                                    </div>
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                        <label className="ant-form-item-no-colon" title="用途">用途</label>
                                    </div>
                                </div>
                            </Col>
                            <Col span={9}>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                        <label className="ant-form-item-no-colon" title="走廊口">走廊口</label>
                                    </div>
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                        <label className="ant-form-item-no-colon" title="起飞间隔">起飞间隔</label>
                                    </div>
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                        <label className="ant-form-item-no-colon" title="默认滑行">默认滑行</label>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {
                            listRWGapInfo.map( item => {
                                return <Row className="info-row" key={item.id}>
                                <Col span={3}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{item.rwName}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{item.logicRWDef}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{getDirName(item.isDepRW)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={9}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{item.wayPoint}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{ getDepInterval(item).logicVal1 }</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{getDepInterval(item).logicVal2}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        
                            } )
                        }
                        </div>
                </Card>
            </Row>
        
    )
}


export default RunwayDetail;


