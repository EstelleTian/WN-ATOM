/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-09-09 13:53:15
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

  // useEffect(() => {
  //   calcShowList();
  // }, [flightTableData.sortKey]);
  console.log("航班表格container渲染 " + flightTableData.focusFlightId);
  return (
    // <FTable
    //   columns={columns}
    //   showList={showList}
    //   targetFlight={targetFlight}
    //   flightTableData={flightTableData}
    //   schemeListData={schemeListData}
    // />
    <>
      {/* <div className='felxDev'>
      <Tables
        columns={columns}
        dataSource={showList}
        targetFlight={targetFlight}
        flightTableData={flightTableData}
        schemeListData={schemeListData}
        scroll={{
          // y: boxContentHeight,
          y: 800,
          x: "100vw"
        }}
    />
    </div> */}
      <VirtualTable
        columns={columns}
        dataSource={showList}
        targetFlight={targetFlight}
        flightTableData={flightTableData}
        schemeListData={schemeListData}
        scroll={{
          // y: boxContentHeight,
          y: 800,
          x: "100vw"
        }}
      />
     
    </>

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
