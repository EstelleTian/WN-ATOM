/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-07-02 11:13:56
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, { useState, useEffect } from "react";

function useAutoSize(flightTableData) {
  let [tableWidth, setWidth] = useState(0);
  let [tableHeight, setHeight] = useState(0);
  useEffect(() => {
    const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
    const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
    const tableHeader =
      flightCanvas.getElementsByClassName("ant-table-header")[0];
    const tableBody = flightCanvas.getElementsByClassName("ant-table-body")[0];
    const tableBodyStyle = tableBody.getAttribute("style");
    tableBody.setAttribute("style", tableBodyStyle + "min-height: 0px;");
    tableBody.style.minHeight = tableBody.style.maxHeight;
    console.log("minHeight", tableBody.style.minHeight);
    let width = boxContent.offsetWidth;
    let height = boxContent.offsetHeight;
    // height -= 40;//标题高度“航班列表”
    // height -= 45;//表头高度
    height -= tableHeader.offsetHeight; //表头高度
    if (Math.abs(tableHeight - height) > 5) {
      setHeight(height);
    }
    setWidth(width);
    console.log(111);
    flightCanvas.oncontextmenu = function () {
      return false;
    };
  }, [tableWidth, tableHeight, flightTableData.filterable]);

  return { tableWidth, tableHeight, setHeight };
}

export default useAutoSize;
