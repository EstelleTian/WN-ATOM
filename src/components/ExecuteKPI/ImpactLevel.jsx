import React from 'react'
import { Col, Empty, Row, Spin } from "antd";
import { AlertOutlined, WarningOutlined, BulbOutlined } from "@ant-design/icons";
import ReactEcharts from "echarts-for-react";
import { inject, observer } from 'mobx-react'
import { isValidVariable } from "../../utils/basic-verify";

//影响程度
function ImpactLevel(props) {
    const levelData = {
        "H": {
            "label": "高",
            "levelClassName": "level-high",
            "icon": (<AlertOutlined />)

        },
        "M": {
            "label": "中",
            "levelClassName": "level-middle",
            "icon": (<WarningOutlined />)
        },
        "L": {
            "label": "低",
            "levelClassName": "level-Low",
            "icon": (<BulbOutlined />)
        },
    };
    const executeKPIData = props.executeKPIData || {};
    const executeData = executeKPIData.executeData || {};
    let tacticProcessInfo = executeData.tacticProcessInfo || {};
    let kpi = tacticProcessInfo.kpi || {};
    // 全区DCB
    let regionDCB = kpi.tacticDCB || {};
    // 区内DCB
    let insideDCB = kpi.inDCB || {};
    // 区外DCB
    let outsideDCB = kpi.outDCB || {};
    const DCBData = {
        regionDCB,
        insideDCB,
        outsideDCB,
    }

    let { impactDegree } = kpi;
    let level = levelData[impactDegree] || {}
    const label = level.label || "";
    const levelClassName = level.levelClassName || "";
    const icon = level.icon || "";
    const { loading } = executeKPIData;

    return (
        <Spin spinning={loading} >
            <Row className="row_model">
                <Col span={8} className="block">
                    <div className="block-title">影响程度</div>
                    <div className={`${levelClassName} impact-level flex justify-content-center layout-column`}>
                        <AlertOutlined className={`level_icon`} />
                        <div className={`text-center`}>{label}</div>
                    </div>
                </Col>
                <Col span={16} className="block">
                    <div className="block-title">DCB</div>
                    <div className=" DCB-flex-box flex justify-content-center layout-column">
                        <DCBLineChart dcb={DCBData} />
                    </div>
                </Col>
            </Row>
        </Spin>
    )

}

//DCB
function DCBLineChart(props) {
    // DCB数据集合
    let { dcb } = props;
   
    if (!isValidVariable(dcb)) {
        dcb = {};
    }
    // 取出全区DCB 区内DCB 区外DCB 集合
    const { regionDCB, insideDCB, outsideDCB } = dcb;
    // X轴数据
    let dcbkeys = [];
    dcbkeys = Object.keys(regionDCB).sort();

    const getOption = function () {
        let dcbKeyArr = [];
        // 全区DCB Y轴数据
        let regionDCBValArr = [];
        // 区内DCB Y轴数据
        let insideDCBValArr = [];
        // 区外DCB Y轴数据
        let outsideDCBValArr = [];

        for (let i = 0; i < dcbkeys.length; i++) {
            const key = dcbkeys[i] || "";
            const regionDCBVal = regionDCB[key] || null;
            const insideDCBVal = insideDCB[key] || null;
            const outsideDCBVal = outsideDCB[key] || null;
            let xKey = key;
            if (key.length >= 12) {
                xKey = key.substring(0, 12);
                xKey = xKey.substring(8, 12);
            }
            dcbKeyArr.push(xKey);
            regionDCBValArr.push(regionDCBVal);
            insideDCBValArr.push(insideDCBVal);
            outsideDCBValArr.push(outsideDCBVal);
        }
        const option = {
            color: [ "#1b9acd", "#44d4e6","#6e95f7", "#f6a748", ],
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
                height: '140'
                // containLabel: false
            },
            xAxis: [
                {
                    type: 'category',
                    data: dcbKeyArr,
                    axisLine: {
                        lineStyle: {
                            color: "#8F959E"
                        }
                    },
                    axisTick: {
                        // show: false
                    },
                    axisLabel: {
                        // show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#8F959E"
                        }
                    },
                    axisTick: {
                        // show: false
                    },
                    splitLine: {
                        // show: false
                    },
                }
            ],
            series: [
                {
                    name: '全区DCB',
                    type: 'line',
                    // stack: '1',
                    data: regionDCBValArr
                },
                {
                    name: '区内DCB',
                    type: 'line',
                    // stack: '1',
                    data: insideDCBValArr
                },{
                    name: '区外DCB',
                    type: 'line',
                    // stack: '1',
                    data: outsideDCBValArr
                }
            ]
        };

        return option;
    }

    return (
        <div style={{ height: '170px' }}>
            {
                Object.keys(dcb).length === 0
                    ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ color: "#fff" }} />
                    : <ReactEcharts
                        option={getOption()}
                        className='react_for_echarts' />

            }
        </div>

    )
}

export default inject("executeKPIData")(observer(ImpactLevel));