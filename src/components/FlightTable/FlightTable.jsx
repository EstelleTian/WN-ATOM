/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-06-23 12:09:59
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Suspense,
  Fragment,
} from "react";
import { inject, observer } from "mobx-react";
import { Table, Input, Checkbox, message, Spin, Switch } from "antd";
import ModalBox from "components/ModalBox/ModalBox";
import {
  getColumns,
  formatSingleFlight,
  scrollTopById,
  highlightRowByDom,
} from "components/FlightTable/TableColumns";

import { isValidVariable, formatTimeString } from "utils/basic-verify";
import debounce from "lodash/debounce";

import "./FlightTable.scss";
function useAutoSize() {
  let [tableWidth, setWidth] = useState(0);
  let [tableHeight, setHeight] = useState(0);
  useEffect(() => {
    const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
    const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
    const tableHeader =
      flightCanvas.getElementsByClassName("ant-table-header")[0];
    let width = boxContent.offsetWidth;
    let height = boxContent.offsetHeight;
    // height -= 40;//标题高度“航班列表”
    // height -= 45;//表头高度
    height -= tableHeader.offsetHeight; //表头高度
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

function FTable({
  columns,
  showList,
  targetFlight,
  flightTableData,
  // schemeListObj,
  schemeListData,
}) {
  const { tableWidth, tableHeight, setHeight } = useAutoSize();

  const onChange = useCallback((pagination, filters, sorter, extra) => {
    console.log("onChange");
    flightTableData.setSortOrder(sorter.order);
    flightTableData.setSortKey(sorter.columnKey);
  }, []);

  const handleRow = useCallback((event, record) => {
    // 点击行
    const dom = event.currentTarget;
    // const refVal = dom.getAttribute("data-row-key");
    // flightTableData.toggleSelectFlight(refVal);
    // console.log("toggleSelectFlight", refVal)
    highlightRowByDom(dom);
  }, []);
  console.log("航班表格渲染 " + showList.length + "条");
  let schemeListObj = schemeListData.getTimeRange;
  // let schemeListObj = {};
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
      if (isOutterFlight) {
        id += " groupb";
      }

      if (index % 2 === 0) {
        id += " even";
      } else {
        id += " odd";
      }

      return id;
    },
    []
  );

  return (
    <Table
      columns={columns}
      dataSource={showList}
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
function FTableContainer({
  flightTableData,
  schemeListData,
  collaboratePopoverData,
  systemPage,
  ATOMConfigFormData,
}) {
  const onCellFilter = useCallback((name, value) => {
    // console.log(name,value);
    flightTableData.setFilterValues(name, value);
  }, []);
  //列配置
  let columns = useMemo(() => {
    console.log("航班表格 filterable切换", flightTableData.filterable);
    if (flightTableData.filterable) {
      // setHeight(tableHeight - 45);
      return getColumns(
        systemPage.systemKind,
        collaboratePopoverData,
        true,
        onCellFilter
      );
    } else {
      // setHeight(tableHeight + 45);
      return getColumns(
        systemPage.systemKind,
        collaboratePopoverData,
        false,
        () => {}
      );
    }
  }, [flightTableData.filterable]);
  // }, []);

  //显示航班
  let obj = flightTableData.getShowFlights;
  let showList = obj.showList || [];
  let targetFlight = obj.targetFlight || {};

  // let schemeListObj = schemeListData.getTimeRange;
  useEffect(() => {
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
        flightTableData.focusFlightId = "";
      }
    }
  }, [flightTableData.focusFlightId]);
  useEffect(() => {
    console.log("航班表格渲染 targetFlight变了", targetFlight.FLIGHTID);
    if (flightTableData.autoScroll && isValidVariable(targetFlight.id)) {
      console.log("航班表格渲染 滚动定位");
      scrollTopById(targetFlight.id, "flight_canvas");
    }
  }, [targetFlight]);

  console.log("航班表格container渲染 " + showList.length + "条");
  return (
    <FTable
      columns={columns}
      showList={showList}
      targetFlight={targetFlight}
      flightTableData={flightTableData}
      schemeListData={schemeListData}
      // schemeListObj={schemeListObj}
    />
  );
}

const FlightTable = inject(
  "flightTableData",
  "schemeListData",
  "collaboratePopoverData",
  "systemPage",
  "ATOMConfigFormData"
)(observer(FTableContainer));
export default FlightTable;
