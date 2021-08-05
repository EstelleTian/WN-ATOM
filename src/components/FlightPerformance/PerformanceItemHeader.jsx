/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2021-08-05 13:29:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React from "react";
import { message, Col, Row, Spin, Tooltip } from "antd";
import { openTclientFrame } from "utils/client";

import "./PerformanceItemHeader.scss";
const PerformanceItemHeader = (props) => {
  const {
    style = {},
    title = "",
    value = "",
    unit = "",
    tooltipContent = "",
    setActiveTabPane,
    TabPaneConfig,
  } = props;
  // 显示tab面板
  const showTabPane = () => {
    if (setActiveTabPane) {
      setActiveTabPane(TabPaneConfig);
    }
    if (title === "限制") {
      openTclientFrame();
    }
  };
  return (
    <div className="header" onClick={showTabPane}>
      <div className="title" style={style}>
        {title}
      </div>
      {/* <div className="description" style={{ color: style.color }}>

                <Tooltip title={tooltipContent}>
                    <div className="text-wrapper">
                        <span className="value">{ value }</span>
                        <span className="unit">{ unit }</span>
                    </div>
                </Tooltip>

            </div> */}
    </div>
  );
};

export default PerformanceItemHeader;
