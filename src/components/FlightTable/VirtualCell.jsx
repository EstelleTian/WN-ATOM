import React, { useState, useCallback } from "react";
import { Tag, Tooltip, Input } from "antd";
import classNames from "classnames";
import {
  isValidVariable,
  getDayTimeFromString,
  getTimeAndStatus
} from "utils/basic-verify";
import FmeToday from "utils/fmetoday";
import { FlightCoordination, PriorityList } from "utils/flightcoordination.js";
import RenderVirtualCell from "./RenderVirtualCell";
import { inject, observer } from "mobx-react";
import {
  getColumns,
  scrollTopById,
  highlightRowByDom,
  handleRightClickCell
} from "./VirtualTableColumns";

const { getAlarmValueZh } = FlightCoordination;

const formatAlarmValue = (values) => {
  let arr = values.map((item) => {
    return getAlarmValueZh(item);
  });
  return arr;
};
/**
 * 告警列单元格渲染格式化
 * */
const renderAlarmCellChildren = (alarms) => {
  // 置空title属性,解决title显示[object,object]问题
  return (
    <div className={`alarm_cell`}>
      {formatAlarmValue(alarms).map((item, index) => (
        // <div key={item.key} title={item.descriptions}>
        <Tag
          title={item.descriptions}
          className={`alarm-tag alarm_${item.key} alarm_pos_${item.pos} `}
          key={`${index}-${item.key}`}
          color={item.color}
        >
          {item.zh}
        </Tag>
        // </div>
      ))}
    </div>
  );
};

const VirtualCell = ({
  columnIndex,
  rowIndex,
  style,
  columnName,
  rawData,
  mergedColumnsLen,
  collaboratePopoverData,
  flightTableData
}) => {
  //显示值
  let cellData = rawData[columnName];
  let text = cellData;
  // 显示值如果是对象，取value
  if (typeof cellData === "object") {
    text = text.value || "";
  }
  let color = "";
  let cellClass = rawData.cellClass || "";
  //航班号
  let id = rawData["id"] || "";
  cellClass += " " + id + "_" + columnName + " " + id + " " + columnName;
  if (flightTableData.focusFlightId === id) {
    cellClass += " active_row";
  }
  if ((rowIndex * 1) % 2 === 0) {
    // 偶数行
    cellClass += " even";
  } else {
    // 奇数行
    cellClass += " odd";
  }

  let popover = (
    // <Tooltip placement="bottom" title={text}>
    <div className="text_cell_center">{text}</div>
    // </Tooltip>
  );
  if (columnName === "orgdata") {
    cellClass += " notshow";
  } else if (columnName === "rowNum") {
    popover = <div>{rowIndex + 1}</div>;
  } else if (columnName === "FLIGHTID") {
    let { orgdata = "{}" } = rawData;
    if (isValidVariable(orgdata)) {
      orgdata = JSON.parse(orgdata);
    }
    let { priority = "" } = orgdata;
    const fmeToday = orgdata.fmeToday || {};
    let areaStatusStr = ""; //航班在本区域内
    let areaStatus = orgdata.areaStatus || "";
    if (areaStatus === "INNER") {
      areaStatusStr = "区内";
    } else if (areaStatus === "OUTER") {
      areaStatusStr = "区外";
    }
    let isInPoolFlight = FlightCoordination.isInPoolFlight(orgdata); //航班是否在等待池中
    let isCoordinationResponseWaitingFlight =
      FlightCoordination.isCoordinationResponseWaitingFlight(orgdata); //航班是否在协调响应等待中
    let getCoordinationResponseWaitingType =
      FlightCoordination.getCoordinationResponseWaitingType;
    let flyStatusStr = "";
    let flyStatus = orgdata.flyStatus || "";
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
      colorClass += " in_pool " + orgdata.poolStatus;
    }
    if (isCoordinationResponseWaitingFlight) {
      colorClass += " WAIT";
    }

    popover = (
      // <Tooltip
      //   placement="bottom"
      //   title={`${
      //     PriorityList[priority] || ""
      //   } ${areaStatusStr} ${flyStatusStr} ${
      //     isCoordinationResponseWaitingFlight
      //       ? `${getCoordinationResponseWaitingType(orgdata)}协调中`
      //       : ""
      //   }`}
      // >
      <div
        className={` ${colorClass}`}
        title={`${
          PriorityList[priority] || ""
        } ${areaStatusStr} ${flyStatusStr} ${
          isCoordinationResponseWaitingFlight
            ? `${getCoordinationResponseWaitingType(orgdata)}协调中`
            : ""
        }`}
      >
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
      // </Tooltip>
    );
  } else if (
    columnName === "SOBT" ||
    columnName === "EOBT" ||
    columnName === "FEAL" ||
    columnName === "FEAT" ||
    columnName === "ALDT" ||
    columnName === "EFPS_RWY" ||
    columnName === "EFPS_TAXI" ||
    columnName === "EFPS_ASRT" ||
    columnName === "EFPS_ASAT"
  ) {
    popover = (
      // <Tooltip placement="bottom" title={getDayTimeFromString(text, "", 2)}>
      <div
        title={getDayTimeFromString(text, "", 2)}
        className="text_cell_center"
      >
        {getDayTimeFromString(text)}
      </div>
      // </Tooltip>
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
    popover = <RenderVirtualCell cellData={cellData} columnName={columnName} />;
  } else if (columnName === "ALARM") {
    popover = renderAlarmCellChildren(cellData);
  } else if (columnName === "FFIXT") {
    let {
      source = "",
      value = "",
      type = "",
      title = "",
      meetIntervalValue = ""
    } = cellData;
    let ftime = "";
    if (isValidVariable(value) && value.length >= 12) {
      type = type === null ? "" : type;
      ftime = getDayTimeFromString(value) + " " + type;
    }
    const getTitle = (title) => {
      if (!isValidVariable(title)) return "";
      const titleArr = title.split("#");
      return (
        <div>
          {titleArr.map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      );
    };
    popover = (
      // <Tooltip placement="bottom" title={getTitle(title)}>
      <div
        className={`full-cell time_${ftime} ${
          isValidVariable(value) && source
        }`}
        title={title}
      >
        <div className={`interval ${ftime !== "" && source}`}>
          <span
            className={`${
              meetIntervalValue === "200" && ftime !== "" && "interval_red"
            }`}
          >
            {ftime}
          </span>
        </div>
      </div>
      // </Tooltip>
    );
  } else if (columnName === "RWY" || columnName === "POS") {
    let { source = "", value = "", type = "", title = "" } = cellData;
    const getTitle = (title) => {
      if (!isValidVariable(title)) return "";
      const titleArr = title.split("#");
      return (
        <div>
          {titleArr.map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      );
    };
    popover = (
      // <Tooltip placement="bottom" title={getTitle(title)}>
      <div
        col-key={columnName}
        className={`full-cell ${
          isValidVariable(value) && source
        } ${columnName}`}
        title={title}
      >
        <div className={`${isValidVariable(value) ? "" : "empty_cell"}`}>
          <span className="">{value}</span>
        </div>
      </div>
      // </Tooltip>
    );
  } else if (columnName === "SLOT") {
    // 时隙分配状态

    // 行原始数据
    let { orgdata = "{}" } = rawData;
    if (isValidVariable(orgdata)) {
      orgdata = JSON.parse(orgdata);
    }
    // 未分配时隙原因
    let unSlotStatusReason = orgdata.unSlotStatusReason || "";
    popover = (
      // <Tooltip
      //   placement="bottom"
      //   title={`${
      //     isValidVariable(unSlotStatusReason) ? unSlotStatusReason : ""
      //   }`}
      // >
      <div
        col-key={columnName}
        className={`full-cell ${columnName}`}
        title={`${
          isValidVariable(unSlotStatusReason) ? unSlotStatusReason : ""
        }`}
      >
        <div className={`${isValidVariable(text) ? "" : "empty_cell"}`}>
          <span className="">{text}</span>
        </div>
      </div>
      // </Tooltip>
    );
  }
  const handleRow = useCallback((event, record) => {
    const id = record.id || "";
    const focusFlightId = flightTableData.focusFlightId;
    if (focusFlightId === id) {
      flightTableData.focusFlightId = "";
    } else {
      flightTableData.focusFlightId = id;
    }
  }, []);

  if (flightTableData.systemName === "CDM") {
    if (flightTableData.sortKey !== "ATOT") {
      cellClass = cellClass.replace("in_range", "");
    }
  } else {
    if (flightTableData.sortKey !== "FFIXT") {
      cellClass = cellClass.replace("in_range", "");
    }
  }
  return (
    <div
      className={`virtual-table-cell ${
        columnIndex === mergedColumnsLen - 1 && "virtual-table-cell-last"
      } ${cellClass}`}
      style={{ ...style, lineHeight: style.height + "px" }}
      onContextMenu={(event) => {
        handleRow(event, rawData);
        handleRightClickCell(
          event,
          rawData,
          columnName,
          collaboratePopoverData
        );
        event.preventDefault();
      }}
      onClick={(event) => {
        handleRow(event, rawData);
      }}
    >
      {popover}
    </div>
  );
};

export default inject(
  "collaboratePopoverData",
  "flightTableData"
)(observer(VirtualCell));
