/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-08-18 09:14:27
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { lazy, Suspense } from "react";
import { inject, observer } from "mobx-react";
import ExecuteKPIModal from "components/ExecuteKPI/ExecuteKPIModal";
import { DoubleLeftOutlined, CloseOutlined } from "@ant-design/icons";

import TodoTable from "./TodoTable";
import SubTable from "./SubTable";
import "./LeftMultiCanvas.scss";

function LeftMultiCanvas(props) {
  const { systemPage } = props;
  const { leftActiveName, setLeftActiveName } = systemPage;

  return (
    <div className="left_left_top">
      <div
        className="unfold_icon"
        onClick={() => {
          props.systemPage.setLeftActiveName("");
        }}
      >
        <CloseOutlined />
      </div>
      <ExecuteKPIModal />
      {/* {leftActiveName === "kpi" ? <ExecuteKPIModal /> : ""} */}
      {/* {
                ( leftActiveName !== "kpi") 
                ? <SubTable name={leftActiveName} key={leftActiveName} leftActiveName={leftActiveName} />
                : <ExecuteKPIModal />
            } */}
    </div>
  );
}

export default inject("systemPage")(observer(LeftMultiCanvas));
