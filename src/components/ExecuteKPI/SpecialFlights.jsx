/*
 * @Author: your name
 * @Date: 2021-01-07 20:19:37
 * @LastEditTime: 2021-04-26 14:13:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\ExecuteKPI\ImpactFlights.jsx
 */
import React, { Fragment } from "react";
import { Col, Row, Spin } from "antd";
import { inject, observer } from "mobx-react";
import SpecialFlightsTable from "./SpecialFlightsTable";

const subKeys = [
  "exempt",
  "interval",
  "critical",
  "pool",
  "coordination",
  "closeWait",
];

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
  const halfInterval = Array.isArray(halfIntervalFlights)
    ? halfIntervalFlights.length
    : "N/A";
  // 临界
  const critical = Array.isArray(criticalFlights)
    ? criticalFlights.length
    : "N/A";
  // 申请协调航班
  const coordination = Array.isArray(coordinationFlights)
    ? coordinationFlights.length
    : "N/A";
  // 入池
  const inPool = Array.isArray(inPoolFlights) ? inPoolFlights.length : "N/A";
  // 关舱门等待
  const closeWait = Array.isArray(closeWaitFlights)
    ? closeWaitFlights.length
    : "N/A";

  return (
    <Fragment>
      <Spin spinning={loading}>
        <Row className="row_model">
          <Col span={24} className="impact block">
            <div className="block-title">特殊航班</div>
          </Col>
          <Col span={24} className="block">
            <Row>
              <Col
                span={8}
                className="impact_sub block hot-point "
                onClick={(e) => {
                  props.performanceKPIData.setShowTableName("exempt");
                }}
              >
                <div className="block-title">豁免</div>
                <div className="block-content flex">
                  <div className="layout-row">
                    <div className="num layout-column justify-content-center">
                      {exempt}
                    </div>
                    <div className="unit layout-column ">架次</div>
                  </div>
                </div>
              </Col>
              <Col
                span={8}
                className="impact_sub block hot-point"
                onClick={(e) => {
                  props.performanceKPIData.setShowTableName("interval");
                }}
              >
                <div className="block-title">半数</div>
                <div className="block-content flex">
                  <div className="layout-row">
                    <div className="num layout-column justify-content-center">
                      {halfInterval}
                    </div>
                    <div className="unit layout-column ">架次</div>
                  </div>
                </div>
              </Col>
              <Col
                span={8}
                className="impact_sub block hot-point"
                onClick={(e) => {
                  props.performanceKPIData.setShowTableName("critical");
                }}
              >
                <div className="block-title">临界</div>
                <div className="block-content flex">
                  <div className="layout-row">
                    <div className="num layout-column justify-content-center">
                      {critical}
                    </div>
                    <div className="unit layout-column ">架次</div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                span={8}
                className="impact_sub block hot-point"
                onClick={(e) => {
                  props.performanceKPIData.setShowTableName("pool");
                }}
              >
                <div className="block-title">入池</div>
                <div className="block-content flex">
                  <div className="layout-row ">
                    <div className="num layout-column justify-content-center">
                      {inPool}
                    </div>
                    <div className="unit layout-column ">架次</div>
                  </div>
                </div>
              </Col>
              <Col
                span={8}
                className="impact_sub block hot-point"
                onClick={(e) => {
                  props.performanceKPIData.setShowTableName("coordination");
                }}
              >
                <div className="block-title">协调</div>
                <div className="block-content flex">
                  <div className="layout-row">
                    <div className="num layout-column justify-content-center">
                      {coordination}
                    </div>
                    <div className="unit layout-column ">架次</div>
                  </div>
                </div>
              </Col>
              <Col
                span={8}
                className="impact_sub block hot-point"
                onClick={(e) => {
                  props.performanceKPIData.setShowTableName("closeWait");
                }}
              >
                <div className="block-title">关舱门等待</div>
                <div className="block-content flex">
                  <div className="layout-row">
                    <div className="num layout-column justify-content-center">
                      {closeWait}
                    </div>
                    <div className="unit layout-column ">架次</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Spin>
      {subKeys.map((key) => {
        if (props.performanceKPIData.showTableName.indexOf(key) > -1) {
          return <SpecialFlightsTable key={key} tableName={key} />;
        }
      })}
    </Fragment>
  );
}

export default inject("performanceKPIData")(observer(SpecialFlights));
