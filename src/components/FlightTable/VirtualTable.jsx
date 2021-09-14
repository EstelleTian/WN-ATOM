/*
 * @Author: your name
 * @Date: 2020-12-23 20:10:27
 * @LastEditTime: 2021-09-14 15:00:46
 * @LastEditors: liutianjiao
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\VirtualTable.jsx
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import classNames from "classnames";
import { ConfigProvider, Empty, Table } from "antd";
import _ from "lodash";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {
  isValidVariable,
  getDayTimeFromString,
  getTimeAndStatus,
  isValidObject
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

const getColumnWidth = (index, columns) => {
  const columnsItem = columns[index] || {};
  const children = columnsItem.children || [];
  let width = "";
  if (children.length > 0) {
    width = children[0].width;
  } else {
    width = columnsItem.width;
  }

  if (!isValidVariable(width)) {
    if (columnsItem.dataIndex == "FLIGHTID") {
      width = 120;
    } else if (columnsItem.dataIndex == "ALARM") {
      width = 140;
    } else if (
      columnsItem.dataIndex == "DEPAP" ||
      columnsItem.dataIndex == "ARRAP" ||
      columnsItem.dataIndex == "CTOT" ||
      columnsItem.dataIndex == "FFIXT" ||
      columnsItem.dataIndex == "CTO" ||
      columnsItem.dataIndex == "EAW" ||
      columnsItem.dataIndex == "OAW"
    ) {
      width = 95;
    } else if (columnsItem.dataIndex == "FFIX") {
      width = 110;
    } else if (
      columnsItem.dataIndex == "SOBT" ||
      columnsItem.dataIndex == "TOBT" ||
      columnsItem.dataIndex == "EOBT" ||
      columnsItem.dataIndex == "AGCT" ||
      columnsItem.dataIndex == "AOBT" ||
      columnsItem.dataIndex == "NCTOT" ||
      columnsItem.dataIndex == "RCTOT"
    ) {
      width = 90;
    } else {
      width = 90;
    }
  }

  return width ? width : 90;
};

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

//处理横向滚动，表头自动重置到初始位置问题
const syncHeaderScroll = () => {
  const header = document.getElementsByClassName("ant-table-header");
  const grid = document.getElementsByClassName("virtual-grid");
  header[0].addEventListener("scroll", function (e) {
    // console.log("header", e.currentTarget.scrollLeft, grid[0].scrollLeft);
    if (e.currentTarget.scrollLeft !== grid[0].scrollLeft) {
      e.currentTarget.scrollLeft = grid[0].scrollLeft;
    }
  });
};

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
    collaboratePopoverData,
    targetFlight,
    tableHeight,
    tableWidth
  } = props;
  const gridRef = useRef();
  const fixedGridRef = useRef();
  const [targetNum, setTargetNum] = useState(0);

  //重置Grid
  const resetVirtualGrid = () => {
    fixedGridRef.current.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true
    });
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
    // console.log("targetNum", targetNum);
    scrollTopById(targetNum, "virtual-grid");
    scrollTopById(targetNum, "fixed-virtual-grid");
  }, []);
  useEffect(() => resetVirtualGrid, [tableWidth]);

  useEffect(() => {
    if (flightTableData.autoScroll && isValidVariable(targetFlight.id)) {
      console.log("航班表格渲染 自动滚动定位");
      scrollCallback(targetFlight.id, rawData);
    }
  }, [targetFlight.id]);

  if (rawData === undefined) {
    rawData = [];
  }
  const fiexdColumns = columns.slice(0, 2);
  let fiexdColumnsWidth = _.reduce(
    fiexdColumns,
    function (sum, n) {
      return sum + n.width * 1;
    },
    0
  );
  // 监听滚动条同步
  useEffect(() => {
    syncHeaderScroll();
  }, []);
  return (
    <>
      <ScrollSyncPane>
        <Grid
          ref={fixedGridRef}
          className="fixed-virtual-grid sticky"
          columnCount={fiexdColumns.length}
          columnWidth={(index) => {
            return getColumnWidth(index, columns);
          }}
          height={tableHeight - 17}
          rowCount={rawData.length}
          rowHeight={() => {
            const h = screenWidth > 1920 ? 45 : 34;
            return h;
          }}
          width={fiexdColumnsWidth || 200}
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
                // className="sticky"
              />
            );
          }}
        </Grid>
      </ScrollSyncPane>
      <ScrollSyncPane>
        <Grid
          ref={gridRef}
          className="virtual-grid"
          columnCount={columns.length}
          columnWidth={(index) => {
            return getColumnWidth(index, columns);
          }}
          height={tableHeight}
          rowCount={rawData.length}
          rowHeight={() => {
            const h = screenWidth > 1920 ? 45 : 34;
            return h;
          }}
          width={tableWidth > 0 ? tableWidth : 0}
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
      </ScrollSyncPane>
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
        data.width > 0 ? data.width : 0;
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
      <ScrollSync>
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
                { ...props, tableHeight, tableWidth, columns }
              )
          }}
        />
      </ScrollSync>
    </ResizeObserver>
  );
}
export default VirtualTable;
