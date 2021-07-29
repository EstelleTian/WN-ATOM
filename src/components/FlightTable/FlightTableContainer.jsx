/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-07-29 16:36:16
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, { useEffect, useCallback, useMemo } from "react";
import { inject, observer } from "mobx-react";
import { isValidVariable } from "utils/basic-verify";

import { getColumns, scrollTopById, highlightRowByDom } from "./TableColumns";
import FTable from "./FlightTable";

// import {
//   getColumns,
//   scrollTopById,
//   highlightRowByDom,
// } from "./VirtualTableColumns";
// import VirtualTable from "./VirtualTable";

import "./FlightTable.scss";
import { isValidObject } from "../../utils/basic-verify";

function FContainer({
  flightTableData,
  schemeListData,
  collaboratePopoverData,
  systemPage,
  ATOMConfigFormData,
  columnConfig,
}) {
  const onCellFilter = useCallback((name, value) => {
    console.log(name, value);
    flightTableData.setFilterValues(name, value);
  }, []);
  //列配置
  let columns = useMemo(() => {
    console.log("航班表格 filterable切换", flightTableData.filterable);
    // 从columnConfig store 中获取display为1的列数据
    let displayColumnList = columnConfig.displayColumnData;
    // if (!isValidObject(displayColumnList)) {
    //   return [];
    // }
    if (flightTableData.filterable) {
      // setHeight(tableHeight - 45);
      return getColumns(
        displayColumnList,
        systemPage.systemKind,
        collaboratePopoverData,
        true,
        onCellFilter
      );
    } else {
      // setHeight(tableHeight + 45);
      return getColumns(
        displayColumnList,
        systemPage.systemKind,
        collaboratePopoverData,
        false,
        () => {}
      );
    }
  }, [flightTableData.filterable, columnConfig.displayColumnData]);
  // }, []);

  //显示航班
  let obj = flightTableData.getShowFlights;

  let showList = obj.showList || [];
  // let showList = useMemo(() => {
  //   console.log(schemeListData.activeSchemeId);
  //   let list = obj.showList || [];
  //   return list;
  // }, [obj, schemeListData.activeSchemeId]);
  let targetFlight = obj.targetFlight || {};

  const focusFlight = useCallback(() => {
    if (isValidVariable(flightTableData.focusFlightId)) {
      console.log("航班定位");
      //高亮航班
      const flightCanvas = document.getElementsByClassName("flight_canvas");
      const boxContent = flightCanvas[0].getElementsByClassName("box_content");
      const tr = boxContent[0].getElementsByClassName(
        flightTableData.focusFlightId
      );
      if (tr.length > 0) {
        highlightRowByDom(tr[0]);
        scrollTopById(flightTableData.focusFlightId, "flight_canvas");
        // flightTableData.focusFlightId = "";
      }
    }
  }, [flightTableData.focusFlightId]);

  useEffect(() => {
    console.log("航班表格渲染 targetFlight变了", targetFlight.FLIGHTID);
    if (flightTableData.autoScroll && isValidVariable(targetFlight.id)) {
      console.log("航班表格渲染 滚动定位");
      scrollTopById(targetFlight.id, "flight_canvas");
    }
  }, [targetFlight.id]);

  useEffect(() => {
    focusFlight();
  });
  console.log("航班表格container渲染 " + flightTableData.focusFlightId);
  return (
    <FTable
      columns={columns}
      showList={showList}
      targetFlight={targetFlight}
      flightTableData={flightTableData}
      schemeListData={schemeListData}
    />
    // <VirtualTable
    //   columns={columns}
    //   showList={showList}
    //   targetFlight={targetFlight}
    //   flightTableData={flightTableData}
    //   schemeListData={schemeListData}
    // />
  );
}

const FTableContainer = inject(
  "flightTableData",
  "schemeListData",
  "collaboratePopoverData",
  "systemPage",
  "ATOMConfigFormData",
  "columnConfig"
)(observer(FContainer));
export default FTableContainer;
