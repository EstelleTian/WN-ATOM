import React from 'react'
import {Col, Empty, Row, Spin} from "antd";
import {AlertOutlined, WarningOutlined, BulbOutlined} from "@ant-design/icons";
import ReactEcharts from "echarts-for-react";
import { inject, observer } from 'mobx-react'
import {isValidVariable} from "../../utils/basic-verify";

//影响程度
function ImpactLevel(props){
    const levelData = {
        "H":{
            "label": "高",
            "levelClassName": "level-high",
            "icon": (<AlertOutlined />)

        },
        "M":{
            "label": "中",
            "levelClassName": "level-middle",
            "icon": (<WarningOutlined />)
        },
        "L":{
            "label": "低",
            "levelClassName": "level-Low",
            "icon": (<BulbOutlined />)
        },
    };
    const executeKPIData = props.executeKPIData || {};
    const KPIData = executeKPIData.KPIData || {};
    let tacticProcessInfo = KPIData.tacticProcessInfo || {};
    let kpi = tacticProcessInfo.kpi || {};
    let dcb = kpi.tacticDCB || {};
    let { impactDegree} = kpi;
    let level = levelData[impactDegree] || {}
    const label = level.label || "";
    const levelClassName = level.levelClassName || "";
    const icon = level.icon || "";

    return <Row className="row_model">
        <Col span={8} className="block">
            <div className="block-title">影响程度</div>
            <div className={`${levelClassName} impact-level flex justify-content-center layout-column`}>
                <AlertOutlined className={ `level_icon`}/>
                <div className={ `text-center`}>{label}</div>
            </div>
        </Col>
        <Col span={16} className="block">
            <div className="block-title">DCB</div>
            <div className="warn flex justify-content-center layout-column">
                <DCBLineChart dcb={dcb}/>
            </div>

        </Col>
    </Row>
}

//DCB
function DCBLineChart(props){
    let { dcb } = props;
    let dcbkeys = [];
    if( !isValidVariable(dcb) ){
        dcb = {};
    }
    dcbkeys = Object.keys( dcb ).sort();
    const getOption = function(){
        let dcbKeyArr = [];
        let dcbValArr = [];
        for(let i = 0; i < dcbkeys.length; i++ ){
            const key = dcbkeys[i] || "";
            const val = dcb[key] || null;
            let xKey = key;
            if( key.length >= 12 ){
                xKey = key.substring(0,12);
                xKey = xKey.substring(8,12);
            }
            dcbKeyArr.push(xKey);
            dcbValArr.push(val);
        }
        const option = {
            color: ["#35A5DA"],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['DCB'],
                show: false
            },
            grid: {
                top: '10px',
                // left: '5px',
                // right: '5px',
                bottom: '10px',
                height: '140px'
                // containLabel: false
            },
            xAxis: [
                {
                    type: 'category',
                    data: dcbKeyArr,
                    axisLine:{
                        lineStyle:{
                            color: "#8F959E"
                        }
                    },
                    axisTick: {
                        // show: false
                    },
                    axisLabel:{
                        // show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color: "#8F959E"
                        }
                    },
                    axisTick: {
                        // show: false
                    },
                    splitLine:{
                        // show: false
                    },
                }
            ],
            series: [
                {
                    name: 'DCB',
                    type: 'line',
                    // stack: '1',
                    data: dcbValArr
                }
            ]
        };

        return option;
    }

    return (
        <div style={{height: '170px'}}>
            {
                Object.keys( dcb ).length === 0
                    ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ color:"#fff"}} />
                    : <ReactEcharts
                        option={getOption()}
                        className='react_for_echarts' />

            }
        </div>

        )
}

export default inject("executeKPIData")(observer(ImpactLevel));