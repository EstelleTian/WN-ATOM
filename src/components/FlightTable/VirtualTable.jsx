/*
 * @Author: your name
 * @Date: 2020-12-23 20:10:27
 * @LastEditTime: 2021-09-09 15:40:45
 * @LastEditors: liutianjiao
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\VirtualTable.jsx
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import classNames from "classnames";
import { ConfigProvider, Empty, Table } from "antd";
import _ from "lodash";
import zh_CN from "antd/lib/locale-provider/zh_CN";
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

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

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
  // const fixedGridRef = useRef();
  const [targetNum, setTargetNum] = useState(0);

  //重置Grid
  const resetVirtualGrid = () => {
    // fixedGridRef.current.resetAfterIndices({
    //   columnIndex: 0,
    //   shouldForceUpdate: true
    // });
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
  // useEffect(() => {
  //   if (isValidVariable(flightTableData.focusFlightId)) {
  //     console.log("航班表格渲染 自动滚动定位");
  //     scrollCallback(flightTableData.focusFlightId, rawData);
  //   }
  // }, [flightTableData.focusFlightId]);
  // ref.current = connectObject;
  if (rawData === undefined) {
    rawData = [];
  }
  // const domDiv = document.getElementsByClassName("virtual-grid");
  // const fiexdColumns = columns.slice(0, 2);
  // let fiexdColumnsWidth = _.reduce(
  //   fiexdColumns,
  //   function (sum, n) {
  //     return sum + n.width * 1;
  //   },
  //   0
  // );
  return (
    <>
      {/* <Grid
        ref={fixedGridRef}
        className="fixed-virtual-grid"
        columnCount={fiexdColumns.length}
        columnWidth={(index) => {
          const { width } = fiexdColumns[index];
          return width;
        }}
        height={tableHeight}
        rowCount={rawData.length}
        rowHeight={() => {
          const h = screenWidth > 1920 ? 45 : 34;
          return h;
        }}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          // domDiv[0].scrollTop = domDiv[1].scrollTop;
          onScroll({
            scrollLeft
          });
        }}
      >
        {({ columnIndex, rowIndex, style }) => {
          // console.log(style);
          //列名称
          const columnName = fiexdColumns[columnIndex].dataIndex;
          // 单元格的值
          if (rawData === undefined) {
            rawData = [];
          }
          const columnsLen = fiexdColumns.length;
          return (
            <>
              <VirtualCell
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                style={style}
                columnName={columnName}
                rawData={rawData[rowIndex] || {}}
                columnsLen={columnsLen}
              ></VirtualCell>
            </>
          );
        }}
      </Grid> */}
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={columns.length}
        columnWidth={(index) => {
          const { width } = columns[index];
          return width;
        }}
        height={tableHeight}
        rowCount={rawData.length}
        rowHeight={() => {
          const h = screenWidth > 1920 ? 45 : 34;
          return h;
        }}
        
        width={tableWidth>0?tableWidth:0}
        onScroll={({ scrollLeft }) => {
          // domDiv[0].scrollTop = domDiv[1].scrollTop;
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
            <>
              <VirtualCell
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                style={style}
                columnName={columnName}
                rawData={rawData[rowIndex] || {}}
                columnsLen={columnsLen}
              ></VirtualCell>
            </>
          );
        }}
      </Grid>
    </>
  );
};

function VirtualTable(props) {
  let { columns, scroll, flightTableData, targetFlight } = props;
  //表格宽度
  const [tableWidth, setTableWidth] = useState(0);
  const [tableHeight, setTableHeight] = useState(scroll.y);
  const onChange = useCallback((pagination, filters, sorter, extra) => {
    flightTableData.setSortOrder(sorter.order);
    flightTableData.setSortKey(sorter.columnKey);
  }, []);
  
  return (
    <ResizeObserver
      onResize={(data) => {
        data.width>0?data.width:0
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
        onChange={onChange}
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
