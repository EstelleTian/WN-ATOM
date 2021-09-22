/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-09-22 13:24:52
 * @LastEditors: liutianjiao
 * @Description: 表格列表组件
 * @FilePath: \WN-ATOM\src\components\FlightTable\FlightTableContainer.jsx
 */

import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { inject, observer } from "mobx-react";
import { isValidVariable } from "utils/basic-verify";

// import { getColumns, scrollTopById, highlightRowByDom } from "./TableColumns";
// import FTable from "./FlightTable";

import {
  getColumns,
  scrollTopById,
  highlightRowByDom
} from "./VirtualTableColumns";
import VirtualTable from "./VirtualTable";
import Tables from "./Tables";

import "./FlightTable.scss";
import { isValidObject } from "../../utils/basic-verify";

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

function FContainer({
  flightTableData,
  schemeListData,
  collaboratePopoverData,
  systemPage,
  ATOMConfigFormData,
  columnConfig
}) {
  const onCellFilter = useCallback((name, value) => {
    console.log(name, value);
    flightTableData.setFilterValues(name, value);
  }, []);
  //列配置
  let columns = getColumns(
    columnConfig.displayColumnData,
    systemPage.systemKind,
    collaboratePopoverData,
    true,
    onCellFilter
  );

  //显示航班
  let obj = flightTableData.getShowFlights;
  let targetFlight = obj.targetFlight || {};
  let showList = obj.showList || [];

  const calcShowList = () => {
    let schemeListObj = schemeListData.getTimeRange;
    let activeSchemeId = schemeListObj.activeSchemeId || "";
    let schemeStartTime = schemeListObj.schemeStartTime || "";
    let schemeEndTime = schemeListObj.schemeEndTime || "";
    const systemName = flightTableData.systemName || "";
    const sortKey = flightTableData.sortKey || "";
    if (isValidVariable(activeSchemeId)) {
      let newShowList = [];
      showList.map((record) => {
        let orgdataStr = record["orgdata"] || "{}";
        let orgdata = JSON.parse(orgdataStr);
        let FFIXTField = record.FFIXT || {};
        let FFIXT = FFIXTField.value || "";
        let type = FFIXTField.type || "";
        let id = record.id || "";
        let atomConfigValue = record.atomConfigValue || "";
        let isOutterFlight = false;

        if (atomConfigValue * 1 === 300) {
          if (orgdata.areaStatus === "OUTER" && type === "N") {
            isOutterFlight = true;
          }
        } else {
          if (
            orgdata.areaStatus === "OUTER" &&
            (type === "N" || type === "R")
          ) {
            isOutterFlight = true;
          }
        }
        if (
          systemName.indexOf("CRS") > -1 &&
          sortKey === "FFIXT" &&
          isValidVariable(activeSchemeId) &&
          !isOutterFlight
        ) {
          if (isValidVariable(FFIXT) && FFIXT.length >= 12) {
            FFIXT = FFIXT.substring(0, 12);
          }
          let sTime = "";
          if (
            isValidVariable(schemeStartTime) &&
            schemeStartTime.length >= 12
          ) {
            sTime = schemeStartTime.substring(0, 12);
          }
          if (sTime * 1 <= FFIXT * 1) {
            let eTime = "";
            if (isValidVariable(schemeEndTime)) {
              eTime = schemeEndTime.substring(0, 12);
              if (FFIXT * 1 <= eTime * 1) {
                record["cellClass"] = "in_range";
              }
            } else {
              record["cellClass"] = " in_range";
            }
          }
        }
        newShowList.push(record);
      });
      showList = newShowList;
    }
  };
  calcShowList();

  useEffect(() => {
    //表头第一个tr
    const table = document.getElementsByClassName("virtual-table");
    const thead = table[0].getElementsByClassName("ant-table-thead");
    const lastTr = thead[0].lastChild;
    const firstTr = thead[0].firstChild;
    console.log("lastTr", lastTr, "firstTr", firstTr);
    let h = lastTr.offsetHeight;
    let filterH = firstTr.offsetHeight;
    const dom = document.getElementsByClassName("fixed-virtual-grid");
    if (table.length > 0) {
      const head = table[0].getElementsByClassName("ant-table-thead");
      let newStyleArr = [];
      if (head.length > 0) {
        const tr = head[0].firstChild;
        if (dom.length > 0) {
          let style = dom[0].getAttribute("style");
          let styleArr = style.split(";");

          for (let i = 0; i < styleArr.length; i++) {
            const str = styleArr[i] || "";
            if (str.indexOf("top") > -1 && str.indexOf("-top") === -1) {
            } else {
              newStyleArr.push(str);
            }
          }
        }
        if (flightTableData.filterable) {
          //显示表头第一个tr
          let trStyle = tr.getAttribute("style");
          tr.setAttribute("style", "display:table-row;");
          if (dom.length > 0) {
            let newStyle =
              newStyleArr.join(";") + " top:" + (h * 1 + filterH) + "px;";
            dom[0].setAttribute("style", newStyle);
          }
        } else {
          //隐藏表头第一个tr
          let trStyle = tr.getAttribute("style");
          tr.setAttribute("style", "display:none;");
          if (dom.length > 0) {
            let newStyle = newStyleArr.join(";") + " top:" + h + "px;";
            dom[0].setAttribute("style", newStyle);
          }
        }
      }
    }
  }, [flightTableData.filterable]);

  // useEffect(() => {
  //   calcShowList();
  // }, [flightTableData.sortKey]);
  // console.log("航班表格container渲染 " + flightTableData.focusFlightId);
  return (
    <>
      <VirtualTable
        columns={columns}
        dataSource={showList}
        targetFlight={targetFlight}
        flightTableData={flightTableData}
        collaboratePopoverData={collaboratePopoverData}
        schemeListData={schemeListData}
        scroll={{
          // y: boxContentHeight,
          y: 800,
          x: "100vw"
        }}
      />
    </>
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
