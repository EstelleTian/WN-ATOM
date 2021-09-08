/*
 * @Author: your name
 * @Date: 2020-12-23 20:10:27
 * @LastEditTime: 2021-09-08 19:27:20
 * @LastEditors: liutianjiao
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\VirtualTable.jsx
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import classNames from "classnames";
import { Table } from "antd";
import _ from "lodash";
import {
  isValidVariable,
  getDayTimeFromString,
  getTimeAndStatus
} from "utils/basic-verify";
import { FlightCoordination, PriorityList } from "utils/flightcoordination.js";
import RenderCell from "./RenderCell";
import VirtualCell from "./VirtualCell";
import FmeToday from "utils/fmetoday";
import {
  getColumns,
  scrollTopById,
  highlightRowByDom
} from "./VirtualTableColumns";
import "./VirtualTable.scss";

//虚拟内容渲染
const renderVirtualList = (
  rawData = [],
  { scrollbarSize, ref, onScroll },
  props
) => {
  let {
    columns,
    scroll,
    flightTableData,
    targetFlight,
    tableHeight,
    tableWidth
  } = props;
  const gridRef = useRef();
  const [targetNum, setTargetNum] = useState(0);

  const [connectObject] = useState(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => null,
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft
          });
        }
      }
    });
    return obj;
  });
  //重置Grid
  const resetVirtualGrid = () => {
    gridRef.current.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true
    });
  };
  const scrollCallback = useCallback((id, rawData) => {
    // 计算目标航班所在行
    let targetNum = 0;
    let finished = false;
    rawData.map((item) => {
      if (!finished) {
        targetNum += 1;
        if (item.id === id) {
          finished = true;
        }
      }
    });
    console.log("targetNum", targetNum);
    scrollTopById(targetNum, "virtual-grid");
  }, []);
  useEffect(() => resetVirtualGrid, [tableWidth]);
  useEffect(() => {
    if (flightTableData.autoScroll && isValidVariable(targetFlight.id)) {
      console.log("航班表格渲染 自动滚动定位");
      scrollCallback(targetFlight.id, rawData);
    }
  }, [rawData]);

  useEffect(() => {
    if (isValidVariable(flightTableData.focusFlightId)) {
      console.log("航班表格渲染 自动滚动定位");
      scrollCallback(flightTableData.focusFlightId, rawData);
    }
  }, [flightTableData.focusFlightId]);
  ref.current = connectObject;
  if (rawData === undefined) {
    rawData = [];
  }
  const totalHeight = rawData.length * 45;
  // if (flightTableData.autoScroll && isValidVariable(targetFlight.id)) {
  //   // 计算目标航班所在行
  //   let newTargetNum = 0;
  //   let finished = false;
  //   rawData.map((item) => {
  //     if (!finished) {
  //       newTargetNum += 1;
  //       if (item.id === targetFlight.id) {
  //         finished = true;
  //       }
  //     }
  //   });
  //   console.log("targetNum", newTargetNum);
  //   flightTableData.targetNum = newTargetNum;
  //   // if (newTargetNum > 0) {
  //   //   // scrollTopById(newTargetNum, "virtual-grid");
  //   //   setTargetNum(newTargetNum);
  //   // }
  // }

  return (
    <Grid
      ref={gridRef}
      className="virtual-grid"
      columnCount={columns.length}
      columnWidth={(index) => {
        const { width } = columns[index];
        return totalHeight > scroll.y && index === columns.length - 1
          ? width - scrollbarSize - 1
          : width;
      }}
      height={tableHeight}
      rowCount={rawData.length}
      rowHeight={() => 45}
      width={tableWidth}
      onScroll={({ scrollLeft }) => {
        onScroll({
          scrollLeft
        });
      }}
    >
      {({ columnIndex, rowIndex, style }) => {
        //列名称
        const columnName = columns[columnIndex].dataIndex;
        // 单元格的值
        if (rawData === undefined) {
          rawData = [];
        }
        const columnsLen = columns.length;
        return (
          <VirtualCell
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            style={style}
            columnName={columnName}
            rawData={rawData[rowIndex] || {}}
            columnsLen={columnsLen}
          ></VirtualCell>
        );
      }}
    </Grid>
  );
};

function VirtualTable(props) {
  let { columns, scroll, flightTableData, targetFlight } = props;
  //表格宽度
  const [tableWidth, setTableWidth] = useState(0);
  const [tableHeight, setTableHeight] = useState(scroll.y);
  return (
    <ResizeObserver
      onResize={(data) => {
        setTableWidth(data.width);
        const flightCanvas =
          document.getElementsByClassName("flight_canvas")[0];
        const boxContent =
          flightCanvas.getElementsByClassName("box_content")[0];
        const tableHeader =
          flightCanvas.getElementsByClassName("ant-table-header")[0];
        let boxContentHeight = boxContent.offsetHeight;
        boxContentHeight -= tableHeader.offsetHeight; //表头高度
        if (tableHeight * 1 !== boxContentHeight * 1) {
          setTableHeight(boxContentHeight);
        }
      }}
    >
      <Table
        {...props}
        className="virtual-table"
        columns={columns}
        pagination={false}
        components={{
          body: (rawData = [], { scrollbarSize, ref, onScroll }) =>
            renderVirtualList(
              rawData,
              { scrollbarSize, ref, onScroll },
              { ...props, tableHeight, tableWidth }
            )
        }}
      />
    </ResizeObserver>
  );
}
export default VirtualTable;
