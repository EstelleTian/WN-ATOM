/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-07-29 16:14:48
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: \WN-CDM\src\components\ExecuteKPI\ExecuteKPI.jsx
 */
import React, { useEffect, useCallback, useState } from "react";
import { Row, Spin } from "antd";
import { inject, observer } from "mobx-react";
import ImpactFlights from "./ImpactFlights";
import SpecialFlights from "./SpecialFlights";

import ImpactLevel from "./ImpactLevel";
import CTOTRate from "./CTOTRate";
import PreDelay from "./PreDelay";
import FlightListModal from "components/ExecuteKPI/FlightListModal.jsx";

import "./ExecuteKPI.scss";

//单个方案执行KPI模块
const ExecuteKPI = (props) => {
  // const executeKPIData = props.executeKPIData;
  // const { loading } = executeKPIData;

  return (
    // <Spin spinning={loading} >
    <div className="kpi_canvas">
      <ImpactFlights />
      <SpecialFlights />
      <ImpactLevel />
      <PreDelay />
      {/* <CTOTRate  /> */}
      {/* <FlightListModal /> */}
    </div>
    // </Spin>
  );
};

export default ExecuteKPI;
