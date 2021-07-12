/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-07-12 14:19:08
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
  const { systemPage } = props;
  let { activeSystem = {} } = systemPage;
  let systemFullName = activeSystem.systemFullName || "";

  if (systemFullName !== "") {
    // document.title = systemFullName;
  } else {
    systemFullName = "";
  }

  return (
    <div className="layout-nav-left layout-row ">
      <div className="system_icon"></div>
      <span className="system_title">{systemFullName}</span>
    </div>
  );
}

export default inject("flightTableData", "systemPage")(observer(LeftTitleNav));
