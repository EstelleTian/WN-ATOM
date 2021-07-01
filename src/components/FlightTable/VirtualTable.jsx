/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-07-01 15:46:26
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, { useState, useEffect, useCallback } from "react";
import { Tag, Tooltip, Input } from "antd";
import classNames from "classnames";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import { highlightRowByDom } from "components/FlightTable/TableColumns";
import {
  isValidVariable,
  getDayTimeFromString,
  getTimeAndStatus,
} from "utils/basic-verify";
import { FlightCoordination, PriorityList } from "utils/flightcoordination.js";
import FmeToday from "utils/fmetoday";

import "rsuite-table/lib/less/index.less";
import "./VirtualTable.scss";

function useAutoSize() {
  let [tableWidth, setWidth] = useState(0);
  let [tableHeight, setHeight] = useState(0);
  useEffect(() => {
    console.log("tableWidth, tableHeight: ", tableWidth, tableHeight);
    const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
    const boxContent = flightCanvas.getElementsByClassName("box_content")[0];

    let width = boxContent.offsetWidth;
    let height = boxContent.offsetHeight;
    // height -= 40; //表头高度
    if (Math.abs(tableHeight - height) > 5) {
      setHeight(height);
    }
    setWidth(width);

    flightCanvas.oncontextmenu = function () {
      return false;
    };
  }, [tableWidth, tableHeight]);

  return { tableWidth, tableHeight, setHeight };
}

const getTitle = (title) => {
  if (!isValidVariable(title)) return "";
  if (title * 1 > 0 && title.length >= 12) {
    return <div>{getDayTimeFromString(title, "", 2)}</div>;
  } else {
    const titleArr = title.split("#");
    return (
      <div>
        {titleArr.map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </div>
    );
  }
};
const CustomCell = ({ rowData, dataKey, columnName, ...props }) => {
  let text = rowData[columnName];
  let orgData = rowData["orgdata"] || "{}";
  if (isValidVariable(orgData)) {
    orgData = JSON.parse(orgData);
  }
  let color = "";
  let popover = null;
  if (columnName === "FLIGHTID") {
    let { priority = "" } = orgData;
    const fmeToday = orgData.fmeToday || {};
    let hadDEP = FmeToday.hadDEP(fmeToday); //航班已起飞
    let hadARR = FmeToday.hadARR(fmeToday); //航班已落地
    let hadFPL = FmeToday.hadFPL(fmeToday); //航班已发FPL报
    let areaStatusStr = ""; //航班在本区域内
    let areaStatus = orgData.areaStatus || "";
    if (areaStatus === "INNER") {
      areaStatusStr = "区内";
    } else if (areaStatus === "OUTER") {
      areaStatusStr = "区外";
    }
    let isInPoolFlight = FlightCoordination.isInPoolFlight(orgData); //航班是否在等待池中
    let isCoordinationResponseWaitingFlight =
      FlightCoordination.isCoordinationResponseWaitingFlight(orgData); //航班是否在协调响应等待中
    let getCoordinationResponseWaitingType =
      FlightCoordination.getCoordinationResponseWaitingType;
    let flyStatusStr = "";
    let flyStatus = orgData.flyStatus || "";
    if (flyStatus === "SKY") {
      flyStatusStr = "空中";
    } else if (flyStatus === "GROUND") {
      flyStatusStr = "地面";
    }
    let colorClass = "";
    if (isValidVariable(priority) && priority * 1 > 0) {
      colorClass = "priority_" + priority;
    }
    if (isInPoolFlight) {
      colorClass += " in_pool " + orgData.poolStatus;
    }
    if (isCoordinationResponseWaitingFlight) {
      colorClass += " WAIT";
    }

    popover = (
      <Cell {...props}>
        <Tooltip
          placement="bottom"
          title={`${
            PriorityList[priority] || ""
          } ${areaStatusStr} ${flyStatusStr} ${
            isCoordinationResponseWaitingFlight
              ? `${getCoordinationResponseWaitingType(orgData)}协调中`
              : ""
          }`}
        >
          <div className={` ${colorClass}`}>
            <div
              className={`text_cell_center ${
                isValidVariable(text) ? "" : "empty_cell"
              }`}
            >
              <span className={`${areaStatus}`}>{text}</span>
            </div>

            <div
              title={`${flyStatusStr}`}
              className={`status_flag ${flyStatus}`}
            ></div>
          </div>
        </Tooltip>
      </Cell>
    );
  } else if (
    columnName === "SOBT" ||
    columnName === "EOBT" ||
    columnName === "FEAL"
  ) {
    popover = (
      <Cell {...props}>
        <Tooltip placement="bottom" title={getDayTimeFromString(text, "", 2)}>
          <div className="text_cell_center">{getDayTimeFromString(text)}</div>
        </Tooltip>
      </Cell>
    );
  } else if (
    columnName === "CTO" ||
    columnName === "ETO" ||
    columnName === "EAWT" ||
    columnName === "OAWT" ||
    columnName === "ATOT" ||
    columnName === "TOBT" ||
    columnName === "AOBT" ||
    columnName === "ASBT" ||
    columnName === "COBT" ||
    columnName === "CTOT" ||
    columnName === "AGCT" ||
    columnName === "NCOBT" ||
    columnName === "NCTOT" ||
    columnName === "RCOBT" ||
    columnName === "RCTOT"
  ) {
    let {
      source = "",
      value = "",
      type = "",
      title = "",
      sourceZH = "",
      effectStatus = "",
      meetIntervalValue = "",
    } = text;
    let showVal = "";
    if (isValidVariable(value) && value.length >= 12) {
      type = type === null ? "" : type;
      showVal = getDayTimeFromString(value) + " " + type;
    }
    if (!isValidVariable(title) && isValidVariable(value)) {
      title = value;
    }
    popover = (
      <Cell {...props}>
        <Tooltip placement="bottom" title={getTitle(title)}>
          <div
            className={`full-cell ${columnName} ${
              isValidVariable(value) ? source : ""
            }  ${columnName}_${source}`}
          >
            <div className={`${isValidVariable(value) ? "" : "empty_cell"}`}>
              <span className="">{showVal}</span>
            </div>
          </div>
        </Tooltip>
      </Cell>
    );
  } else if (columnName === "ALARM") {
    popover = (
      <Cell {...props}>
        <div className="alarm_cell" title="">
          {text}
        </div>
      </Cell>
    );
  } else if (columnName === "FFIXT") {
    let {
      source = "",
      value = "",
      type = "",
      title = "",
      sourceZH = "",
      meetIntervalValue = "",
    } = text;
    let fTime = "";
    if (isValidVariable(value) && value.length >= 12) {
      type = type === null ? "" : type;
      fTime = getDayTimeFromString(value) + " " + type;
    }
    popover = (
      <Cell {...props}>
        <Tooltip placement="bottom" title={getTitle(title)}>
          <div
            className={`full-cell time_${fTime} ${
              isValidVariable(value) && source
            }`}
          >
            <div className={`interval ${fTime !== "" && source}`}>
              <span
                className={`${
                  meetIntervalValue === "200" && fTime !== "" && "interval_red"
                }`}
              >
                {fTime}
              </span>
            </div>
          </div>
        </Tooltip>
      </Cell>
    );
  } else if (columnName === "RWY" || columnName === "POS") {
    let {
      source = "",
      value = "",
      type = "",
      title = "",
      sourceZH = "",
    } = text;

    popover = (
      <Cell {...props}>
        <Tooltip placement="bottom" title={getTitle(title)}>
          <div
            className={`full-cell ${
              isValidVariable(value) && source
            } ${columnName}`}
          >
            <div className={`${isValidVariable(value) ? "" : "empty_cell"}`}>
              <span className="">{value}</span>
            </div>
          </div>
        </Tooltip>
      </Cell>
    );
  } else if (columnName === "SLOT") {
    // 未分配时隙原因
    let unSlotStatusReason = orgData.unSlotStatusReason || "";
    popover = (
      <Cell {...props}>
        <Tooltip
          placement="bottom"
          title={`${
            isValidVariable(unSlotStatusReason) ? unSlotStatusReason : ""
          }`}
        >
          <div className={`full-cell ${columnName}`}>
            <div className={`${isValidVariable(text) ? "" : "empty_cell"}`}>
              <span className="">{text}</span>
            </div>
          </div>
        </Tooltip>
      </Cell>
    );
  } else {
    popover = (
      <Cell {...props}>
        <Tooltip placement="bottom" title={text}>
          <div className="text_cell_center">{text}</div>
        </Tooltip>
      </Cell>
    );
  }

  return popover;
};

function VirtualTable({
  columns,
  showList,
  targetFlight,
  flightTableData,
  schemeListData,
}) {
  const { tableWidth, tableHeight, setHeight } = useAutoSize();

  const onChange = useCallback((pagination, filters, sorter, extra) => {
    console.log("onChange");
    flightTableData.setSortOrder(sorter.order);
    flightTableData.setSortKey(sorter.columnKey);
  }, []);

  const handleRow = useCallback((event, rowData) => {
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
      rowData,
      index,
      systemName,
      sortKey,
      activeSchemeId,
      schemeStartTime,
      schemeEndTime
    ) => {
      let orgdataStr = rowData["orgData"] || "{}";
      let orgData = JSON.parse(orgdataStr);
      let FFIXTField = rowData.FFIXT || {};
      let FFIXT = FFIXTField.value || "";
      let type = FFIXTField.type || "";
      let id = rowData.id || "";
      let atomConfigValue = rowData.atomConfigValue || "";
      let isOutterFlight = false;
      if (atomConfigValue * 1 === 300) {
        if (orgData.areaStatus === "OUTER" && type === "N") {
          isOutterFlight = true;
        }
      } else {
        if (orgData.areaStatus === "OUTER" && (type === "N" || type === "R")) {
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
  console.log("renderFlightsTime 开始计时");
  console.time("renderFlightsTime");
  useEffect(() => {
    console.timeEnd("renderFlightsTime");
  });
  return (
    <Table
      // bordered
      virtualized
      data={showList}
      style={{ fontSize: "16px" }}
      height={tableHeight}
      width={tableWidth}
    >
      {columns.map((column) => {
        if (column.fixed !== "") {
          return (
            <Column
              width={column.width}
              key={column.key}
              sortable
              fixed={column.fixed}
              resizable
            >
              <HeaderCell title={column.title}>{column.dataIndex}</HeaderCell>
              <CustomCell columnName={column.dataIndex} />
            </Column>
          );
        } else {
          return (
            <Column
              width={column.width}
              key={column.key}
              sortable
              // fixed={column.fixed || ""}
              resizable
            >
              <HeaderCell title={column.title}>{column.dataIndex}</HeaderCell>
              <Cell dataKey={column.dataIndex} />
            </Column>
          );
        }
      })}
    </Table>
  );
}

export default VirtualTable;
