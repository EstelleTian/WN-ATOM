/*
 * @Author: your name
 * @Date: 2021-01-07 20:19:37
 * @LastEditTime: 2021-04-21 14:29:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\ExecuteKPI\ImpactFlights.jsx
 */
import React from "react";
import { Col, Row, Spin } from "antd";
import { inject, observer } from "mobx-react";

//影响航班
function ImpactFlights(props) {
  const {
    loading,
    impactFlight,
    executedFlight,
    inExecutionFlight,
    nonExecutionFlight,
  } = props.executeKPIData;
  // 影响
  const impact = Array.isArray(impactFlight) ? impactFlight.length : "N/A";
  // 已执行
  const executed = Array.isArray(executedFlight)
    ? executedFlight.length
    : "N/A";
  // 执行中
  const inExecution = Array.isArray(inExecutionFlight)
    ? inExecutionFlight.length
    : "N/A";
  // 待放行
  const nonExecution = Array.isArray(nonExecutionFlight)
    ? nonExecutionFlight.length
    : "N/A";
  // 更新航班列表数据展示
  const updateFlightData = (category, title) => {
    props.executeKPIData.toggleFlightListModalVisible(true);
    props.executeKPIData.updateFlightListCategory(category);
    props.executeKPIData.updateFlightListCategoryZh(title);
  };

  return (
    <Spin spinning={loading}>
      <Row className="row_model">
        <Col
          span={8}
          className="impact block hot-point"
          onClick={() => updateFlightData("impactFlight", "影响航班列表")}
        >
          <div className="block-title">影响航班</div>
          <div className="block-content flex justify-content-center layout-column ">
            <div className="num text-center">{impact}</div>
            <div className="unit text-center">架次</div>
          </div>
        </Col>
        <Col span={16} className="block">
          <Row>
            <Col
              span={12}
              className="impact_sub block hot-point"
              onClick={() =>
                updateFlightData("executedFlight", "已执行航班列表")
              }
            >
              <div className="block-title">已执行</div>
              <div className="block-content flex">
                <div className="layout-row">
                  <div className="num layout-column justify-content-center">
                    {executed}
                  </div>
                  <div className="unit layout-column ">架次</div>
                </div>
              </div>
            </Col>
            <Col
              span={12}
              className="impact_sub block hot-point"
              onClick={() =>
                updateFlightData("inExecutionFlight", "执行中航班列表")
              }
            >
              <div className="block-title">执行中</div>
              <div className="block-content flex">
                <div className="layout-row">
                  <div className="num layout-column justify-content-center">
                    {inExecution}
                  </div>
                  <div className="unit layout-column ">架次</div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              span={12}
              className="impact_sub block hot-point"
              onClick={() =>
                updateFlightData("nonExecutionFlight", "待放行航班列表")
              }
            >
              <div className="block-title">待放行</div>
              <div className="block-content flex">
                <div className="layout-row ">
                  <div className="num layout-column justify-content-center">
                    {nonExecution}
                  </div>
                  <div className="unit layout-column ">架次</div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Spin>
  );
}

export default inject("executeKPIData")(observer(ImpactFlights));
