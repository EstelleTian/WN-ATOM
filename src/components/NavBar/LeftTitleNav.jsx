/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-06-09 08:57:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, { useMemo, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Radio, Tag } from "antd";
import { convertNameToTitle } from "utils/global";

//顶部 左导航模块
function LeftTitleNav(props) {
  const [dateRangeStr, setDateRangeStr] = useState("");
  const { flightTableData } = props;
  // const { systemName } = flightTableData;
  let { systemCnName = "" } = flightTableData;
  if (systemCnName.indexOf("CDM") > -1) {
    systemCnName = systemCnName.replace("CDM", "机场");
  } else if (systemCnName.indexOf("CRS") > -1) {
    systemCnName = systemCnName.replace("CRS", "区域");
  }
  if (systemCnName === "") {
    //从用户的region中取
    const user = props.systemPage.user || {};
    const region = user.region || "";
    switch (region) {
      case "ZLXY":
        systemCnName = "西安区域";
        break;
      case "ZLLL":
        systemCnName = "兰州区域";
        break;
      case "ZLIC":
        systemCnName = "银川区域";
        break;
      case "ZLXN":
        systemCnName = "西宁区域";
        break;
    }
  }
  if (systemCnName !== "") {
    document.title = systemCnName + "协同放行";
  }

  return (
    <div className="layout-nav-left layout-row ">
      <div className="system_icon"></div>
      <span className="system_title">{`${systemCnName}协同放行`}</span>
    </div>
  );
}

export default inject("flightTableData", "systemPage")(observer(LeftTitleNav));
