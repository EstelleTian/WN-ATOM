/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-06-09 13:37:55
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
  let { systemCnName = "" } = flightTableData;
  let title = "";
  if (systemCnName.indexOf("CDM") > -1) {
    title = convertNameToTitle(systemCnName);
  }
  if (systemCnName === "") {
    //从用户的region中取
    const user = props.systemPage.user || {};
    const region = user.region || "";
    switch (region) {
      case "ZLXY":
        title = "西北地区协同放行(西安)";
        break;
      case "ZLLL":
        title = "西北地区协同放行(兰州)";
        break;
      case "ZLIC":
        title = "西北地区协同放行(银川)";
        break;
      case "ZLXN":
        title = "西北地区协同放行(西宁)";
        break;
    }
  }
  if (systemCnName !== "") {
    document.title = title;
  }

  return (
    <div className="layout-nav-left layout-row ">
      <div className="system_icon"></div>
      <span className="system_title">{title}</span>
    </div>
  );
}

export default inject("flightTableData", "systemPage")(observer(LeftTitleNav));
