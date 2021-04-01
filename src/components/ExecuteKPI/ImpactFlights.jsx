/*
 * @Author: your name
 * @Date: 2021-01-07 20:19:37
 * @LastEditTime: 2021-03-05 11:00:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\ExecuteKPI\ImpactFlights.jsx
 */
import React from 'react'
import { Col, Row, Spin } from "antd";
import { inject, observer } from 'mobx-react'


//影响航班
function ImpactFlights(props) {

    const executeKPIData = props.executeKPIData || {};
    const executeData = executeKPIData.executeData || {};
    let tacticProcessInfo = executeData.tacticProcessInfo || {};
    let kpi = tacticProcessInfo.kpi || {};
    let impactFlightCount = kpi.impactFlightCount || {};
    // 影响航班集合
    let impactALL = impactFlightCount['AF'];
    // 已执行航班集合
    let executedFlight = kpi.executedFlight || [];
    // 执行中航班集合
    let inExecutionFlight = kpi.inExecutionFlight || [];
    // 待放行航班集合
    let nonExecutionFlight = kpi.nonExecutionFlight || [];

    // 影响
    const impact = Array.isArray(impactALL) ? impactALL.length : "N/A";
    // 已执行
    const executed = Array.isArray(executedFlight) ? executedFlight.length : "N/A";
    // 执行中
    const inExecution = Array.isArray(inExecutionFlight) ? inExecutionFlight.length : "N/A";
    // 待放行
    const nonExecution = Array.isArray(nonExecutionFlight) ? nonExecutionFlight.length : "N/A";
    const { loading } = executeKPIData;

    return (
        <Spin spinning={loading} >
        <Row className="row_model">
            <Col span={8} className="impact block">
                <div className="block-title">影响航班</div>
                <div className="block-content flex justify-content-center layout-column">
                    <div className="num text-center">{impact}</div>
                    <div className="unit text-center">架次</div>
                </div>

            </Col>
            <Col span={16} className="block">
                <Row>
                    <Col span={12} className="impact_sub block">
                        <div className="block-title">已执行</div>
                        <div className="block-content flex">
                            <div className="layout-row">
                                <div className="num layout-column justify-content-center">{executed}</div>
                                <div className="unit layout-column ">架次</div>
                            </div>

                        </div>

                    </Col>
                    <Col span={12} className="impact_sub block">
                        <div className="block-title">执行中</div>
                        <div className="block-content flex">
                            <div className="layout-row">
                                <div className="num layout-column justify-content-center">{inExecution}</div>
                                <div className="unit layout-column ">架次</div>
                            </div>
                        </div>

                    </Col>
                </Row>
                <Row>
                    <Col span={12} className="impact_sub block">
                        <div className="block-title">待放行</div>
                        <div className="block-content flex">
                            <div className="layout-row ">
                                <div className="num layout-column justify-content-center">{nonExecution}</div>
                                <div className="unit layout-column ">架次</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
        </Spin>
    )

}

export default inject("executeKPIData")(observer(ImpactFlights));