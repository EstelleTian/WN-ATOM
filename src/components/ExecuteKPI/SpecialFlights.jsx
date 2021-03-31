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


//特殊航班
function SpecialFlights(props) {
    const performanceKPIData = props.performanceKPIData || {};
    const { loading } = performanceKPIData;
    const performanceData = performanceKPIData.performanceData || {};

    // 豁免航班
    let exemptFlights = performanceData.exemptFlights || {};
    // 半数间隔
    let halfIntervalFlights = performanceData.halfIntervalFlights || {};
    // 临界航班
    let criticalFlights = performanceData.criticalFlights || {};
    // 入池航班
    let inPoolFlights = performanceData.inPoolFlights || {};
    // 协调航班
    let coordinationFlights = performanceData.coordinationFlights || {};
    // 关舱门等待航班
    let closeWaitFlights = performanceData.closeWaitFlights || {};


    // 影响
    // const impact = Array.isArray(impactALL) ? impactALL.length : "N/A";

    // 豁免
    const exempt = Array.isArray(exemptFlights) ? exemptFlights.length : "N/A";
    // 半数间隔
    const halfInterval = Array.isArray(halfIntervalFlights) ? halfIntervalFlights.length : "N/A";
    // 临界
    const critical = Array.isArray(criticalFlights) ? criticalFlights.length : "N/A";
    // 申请协调航班
    const coordination = Array.isArray(coordinationFlights) ? coordinationFlights.length : "N/A";
    // 入池
    const inPool = Array.isArray(inPoolFlights) ? inPoolFlights.length : "N/A";
    // 关舱门等待
    const closeWait = Array.isArray(closeWaitFlights) ? closeWaitFlights.length : "N/A";
    
    return (
        <Spin spinning={loading} >
            <Row className="row_model">
                <Col span={10} className="impact block">
                    <div className="block-title">特殊航班</div>
                    <div className="block-content flex justify-content-center layout-column">
                        <div className="num text-center">{ }</div>
                        <div className="unit text-center">架次</div>
                    </div>

                </Col>
                <Col span={14} className="block">
                    <Row>
                        <Col span={12} className="impact_sub block">
                            <div className="block-title">豁免航班</div>
                            <div className="block-content flex">
                                <div className="layout-row">
                                    <div className="num layout-column justify-content-center">{exempt}</div>
                                    <div className="unit layout-column ">架次</div>
                                </div>

                            </div>

                        </Col>
                        <Col span={12} className="impact_sub block">
                            <div className="block-title">半数航班</div>
                            <div className="block-content flex">
                                <div className="layout-row">
                                    <div className="num layout-column justify-content-center">{halfInterval}</div>
                                    <div className="unit layout-column ">架次</div>
                                </div>
                            </div>

                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="impact_sub block">
                            <div className="block-title">临界航班</div>
                            <div className="block-content flex">
                                <div className="layout-row">
                                    <div className="num layout-column justify-content-center">{critical}</div>
                                    <div className="unit layout-column ">架次</div>
                                </div>
                            </div>
                        </Col>
                        <Col span={12} className="impact_sub block">
                            <div className="block-title">入池航班</div>
                            <div className="block-content flex">
                                <div className="layout-row ">
                                    <div className="num layout-column justify-content-center">{inPool}</div>
                                    <div className="unit layout-column ">架次</div>
                                </div>
                            </div>
                        </Col>

                    </Row>
                    <Row>

                        <Col span={12} className="impact_sub block">
                            <div className="block-title">申请协调航班</div>
                            <div className="block-content flex">
                                <div className="layout-row">
                                    <div className="num layout-column justify-content-center">{coordination}</div>
                                    <div className="unit layout-column ">架次</div>
                                </div>
                            </div>

                        </Col>
                        <Col span={12} className="impact_sub block">
                            <div className="block-title">关舱门等待航班</div>
                            <div className="block-content flex">
                                <div className="layout-row">
                                    <div className="num layout-column justify-content-center">{closeWait}</div>
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

export default inject("performanceKPIData")(observer(SpecialFlights));