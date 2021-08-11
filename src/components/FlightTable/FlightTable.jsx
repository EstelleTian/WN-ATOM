/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-07-02 11:12:42
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, { useEffect, useCallback } from "react";
import { Table } from "antd";
import { highlightRowByDom } from "components/FlightTable/TableColumns";
import { isValidVariable } from "utils/basic-verify";
import useAutoSize from "./useAutoSize";

import "./FlightTable.scss";

function FTable({
  columns,
  showList,
  targetFlight,
  flightTableData,
  schemeListData,
}) {
  const { tableWidth, tableHeight, setHeight } = useAutoSize(flightTableData);

  const onChange = useCallback((pagination, filters, sorter, extra) => {
    console.log("onChange");
    flightTableData.setSortOrder(sorter.order);
    flightTableData.setSortKey(sorter.columnKey);
  }, []);

  const handleRow = useCallback((event, record) => {
    // 点击行
    const dom = event.currentTarget;
    highlightRowByDom(dom);
  }, []);

  console.log("航班表格渲染 " + showList.length + "条");

  let schemeListObj = schemeListData.getTimeRange;
  let activeSchemeId = schemeListObj.activeSchemeId || "";
  let schemeStartTime = schemeListObj.schemeStartTime || "";
  let schemeEndTime = schemeListObj.schemeEndTime || "";

  //设置表格行的 class
  const setRowClassName = useCallback(
    (
      record,
      index,
      systemName,
      sortKey,
      activeSchemeId,
      schemeStartTime,
      schemeEndTime
    ) => {
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
        if (orgdata.areaStatus === "OUTER" && (type === "N" || type === "R")) {
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
        if (isValidVariable(schemeStartTime) && schemeStartTime.length >= 12) {
          sTime = schemeStartTime.substring(0, 12);
        }
        if (sTime * 1 <= FFIXT * 1) {
          let eTime = "";
          if (isValidVariable(schemeEndTime)) {
            eTime = schemeEndTime.substring(0, 12);
            if (FFIXT * 1 <= eTime * 1) {
              id += " in_range";
            }
          } else {
            id += " in_range";
          }
        }
      }
      // if (isOutterFlight) {
      //   id += " groupb";
      // }

      if (index % 2 === 0) {
        id += " even";
      } else {
        id += " odd";
      }

      return id;
    },
    []
  );
  console.log("renderFlightsTime 开始计时", tableHeight);
  console.time("renderFlightsTime");
  useEffect(() => {
    console.timeEnd("renderFlightsTime");
  });
  return (
    <Table
      columns={columns}
      dataSource={[]}
      size="small"
      bordered
      pagination={false}
      scroll={{
        x: tableWidth,
        y: tableHeight,
      }}
      // loading={flightTableData.loading}
      onChange={onChange}
      rowClassName={(record, index) => {
        return setRowClassName(
          record,
          index,
          flightTableData.systemName,
          flightTableData.sortKey,
          activeSchemeId,
          schemeStartTime,
          schemeEndTime
        );
      }}
      onRow={(record) => {
        return {
          onClick: (event) => {
            // 点击行
            handleRow(event, record);
          },
          onContextMenu: (event) => {
            // 点击行
            handleRow(event, record);
          },
        };
      }}
    />
  );
}

export default FTable;
