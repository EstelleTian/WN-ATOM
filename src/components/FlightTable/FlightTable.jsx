/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-04-23 09:36:21
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
} from "react";
import { inject, observer } from "mobx-react";
import { Table, Input, Checkbox, message, Spin } from "antd";
import ModalBox from "components/ModalBox/ModalBox";
import {
  getColumns,
  formatSingleFlight,
  scrollTopById,
  highlightRowByDom,
} from "components/FlightTable/TableColumns";
import  FlightDetail from "components/FlightDetail/FlightDetail";
import { isValidVariable, formatTimeString } from "utils/basic-verify";
import debounce from "lodash/debounce";
// import VTable from './VirtualTable'
import "./FlightTable.scss";

/** start *****航班表格标题************/
function TTitle(props) {
  const { flightTableData = {}, schemeListData } = props;

  const generateTime = useMemo(() => {
    return flightTableData.generateTime || "";
  }, [flightTableData.generateTime]);

  const tacticName = useMemo(() => {
    // console.log(schemeListData.activeSchemeId)
    if (isValidVariable(schemeListData.activeSchemeId)) {
      const activeScheme =
        schemeListData.activeScheme(schemeListData.activeSchemeId) || {};
      return activeScheme.tacticName || "";
    } else {
      return "";
    }
  }, [schemeListData.activeSchemeId]);

  return (
    <span className="tactic_title_span">
      <span>航班列表({formatTimeString(generateTime)})</span>
      {tacticName !== "" && <span>—</span>}
      {tacticName !== "" && (
        <span style={{ color: "#36a5da" }} className="tactic_name">
          {tacticName}
        </span>
      )}
    </span>
  );
}
const TableTitle = inject(
  "flightTableData",
  "schemeListData"
)(observer(TTitle));
/** end *****航班表格标题************/

function useAutoSize() {
  let [tableWidth, setWidth] = useState(0);
  let [tableHeight, setHeight] = useState(0);
  useEffect(() => {
    console.log("tableWidth, tableHeight: ", tableWidth, tableHeight);
    const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
    const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
    const tableHeader = flightCanvas.getElementsByClassName(
      "ant-table-header"
    )[0];
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

/** start *****航班表格 纯表格************/
function FTable(props) {
  const { tableWidth, tableHeight, setHeight } = useAutoSize();
  let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段
  let [sortOrder, setSortOrder] = useState("ascend"); //表格排序 顺序  升序ascend/降序

  const { flightTableData = {}, schemeListData } = props;
  const { autoScroll, filterable, focusFlightId, dataLoaded } = flightTableData;
  const { showList, targetFlight } = props.flightTableData.getShowFlights;
  // if( showList.length < 3){
  //     console.log(showList)
  // }

  const handleRow = useCallback((event, record) => {
    // 点击行
    const dom = event.currentTarget;
    // const refVal = dom.getAttribute("data-row-key");
    // flightTableData.toggleSelectFlight(refVal);
    // console.log("toggleSelectFlight", refVal)
    highlightRowByDom(dom);
  }, []);

  const { schemeStartTime, schemeEndTime } = useMemo(() => {
    const activeScheme =
      schemeListData.activeScheme(schemeListData.activeSchemeId) || {};
    const { tacticTimeInfo = {} } = activeScheme;
    const { startTime, endTime } = tacticTimeInfo;
    return {
      schemeStartTime: startTime,
      schemeEndTime: endTime,
    };
  }, [schemeListData.activeSchemeId]);

  // useEffect(() => {
  //     const flightCanvas = document.getElementsByClassName("flight_canvas");
  //     const boxContent = flightCanvas[0].getElementsByClassName("box_content");
  //     const tr = boxContent[0].getElementsByClassName( props.flightTableData.selectFlightId );
  //     console.log("自动选回高亮dom",  props.flightTableData.selectFlightId)
  //     if( tr.length > 0 ){
  //         highlightRowByDom(tr);
  //     }

  // }, [schemeListData.activeSchemeId]);

  //设置表格行的 class
  const setRowClassName = useCallback(
    (record, index) => {
      let FFIXT = record.FFIXT || "";
      let id = record.id || "";
      if (
        sortKey === "FFIXT" &&
        isValidVariable(props.schemeListData.activeSchemeId) &&
        props.schemeListData.activeSchemeId.indexOf("focus") === -1
      ) {
        if (isValidVariable(FFIXT) && FFIXT.length >= 12) {
          FFIXT = FFIXT.substring(0, 12);
        }
        let sTime = "";
        if (isValidVariable(schemeStartTime) && schemeStartTime.length >= 12) {
          sTime = schemeStartTime.substring(0, 12);
        }
        // console.log("FFIXT",FFIXT,"startTime",startTime,"schemeEndTime",schemeEndTime);
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
      // if( id.indexOf("in_range") === -1){
      if (index % 2 === 0) {
        id += " even";
      } else {
        id += " odd";
      }
      // }
      return id;
    },
    [schemeStartTime, schemeEndTime]
  );

  const onChange = useCallback((pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
    setSortOrder(sorter.order);
    setSortKey(sorter.columnKey);
  }, []);

  useEffect(() => {
    // console.log("table autoScroll")
    if (autoScroll && isValidVariable(targetFlight.id)) {
      scrollTopById(targetFlight.id, "flight_canvas");
    }
  }, [targetFlight.id]);

  useEffect(() => {
    if (!dataLoaded && isValidVariable(focusFlightId)) {
      console.log("航班定位");
      //高亮航班
      const flightCanvas = document.getElementsByClassName("flight_canvas");
      const boxContent = flightCanvas[0].getElementsByClassName("box_content");
      const tr = boxContent[0].getElementsByClassName(focusFlightId);
      if (tr.length > 0) {
        highlightRowByDom(tr[0]);
        scrollTopById(focusFlightId, "flight_canvas");
        props.flightTableData.focusFlightId = "";
      }
    }
  }, [focusFlightId, dataLoaded]);

  // console.log("航班表格 render!!! filterable",filterable)

  const onCellFilter = useCallback((name, value) => {
    // console.log(name,value);
    props.flightTableData.setFilterValues(name, value);
  }, []);

  const columns = useMemo(() => {
    if (filterable) {
      setHeight(tableHeight - 45);
      return getColumns("", true, onCellFilter);
    } else {
      setHeight(tableHeight + 45);
      return getColumns();
    }
  }, [filterable]);

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
      onChange={onChange}
      rowClassName={setRowClassName}
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
const FlightTable = inject(
  "flightTableData",
  "schemeListData"
)(observer(FTable));
/** end *****航班表格 纯表格************/

const TSpin = inject("flightTableData")(
  observer((props) => {
    const { flightTableData = {} } = props;
    const { loading } = flightTableData;
    // console.log("航班loading render!!!")
    return (
      <Spin spinning={loading}>
        <FlightTable />
        {/* <VTable /> */}
      </Spin>
    );
  })
);

//自动滚动
const AutoScrollBtn = inject("flightTableData")(
  observer((props) => {
    return (
      <div className="auto_scroll">
        <Checkbox.Group
          options={[{ label: "自动滚动", value: "auto_scroll" }]}
          defaultValue={"auto_scroll"}
          onChange={(checkedValues) => {
            if (checkedValues.indexOf("auto_scroll") === -1) {
              props.flightTableData.setAutoScroll(false);
            } else {
              props.flightTableData.setAutoScroll(true);
            }
          }}
        />
      </div>
    );
  })
);
//快速过滤
const FilterBtn = inject("flightTableData")(
  observer((props) => {
    return (
      <div className="quick_filter">
        <Checkbox.Group
          options={[{ label: "快速过滤", value: "quick_filter" }]}
          onChange={(checkedValues) => {
            console.log("filterable", checkedValues);
            if (checkedValues.indexOf("quick_filter") === -1) {
              props.flightTableData.setFilterable(false);
              props.flightTableData.clearFilterValues();
            } else {
              props.flightTableData.setFilterable(true);
            }
          }}
        />
      </div>
    );
  })
);
//快捷过滤
const SearchInput = inject("flightTableData")(
  observer((props) => {
    const { flightTableData = {} } = props;
    const { searchVal = "", setSearchVal } = flightTableData;

    const handleInputVal = useCallback(
      debounce((values) => {
        props.flightTableData.setSearchVal(values);
      }, 800),
      []
    );

    return (
      <Input
        allowClear
        className="text-uppercase"
        style={{ width: "150px", marginRight: "15px" }}
        defaultValue={searchVal}
        placeholder="航班号快捷查询"
        onPressEnter={(e) => handleInputVal(e.target.value)}
        onChange={(e) => handleInputVal(e.target.value)}
      />
    );
  })
);
//计数
const TotalDom = inject("flightTableData")(
  observer((props) => {
    const { showList } = props.flightTableData.getShowFlights;

    return <span className="total_num">总计{showList.length || 0}条</span>;
  })
);

/** start *****航班表格 列表框架************/
function FlightTableModal(props) {
  let [flightDetailModalVisible, setFlightDetailModalVisible] = useState(false);
  return (
    <ModalBox
      className="flight_canvas"
      title={<TableTitle />}
      showDecorator={false}
    >
      <div className="statistics">
        <FilterBtn />
        <AutoScrollBtn />
        <SearchInput />
        <TotalDom />
      </div>
      <TSpin />
      <FlightDetail 
      flightDetailModalVisible = {true}
      setFlightDetailModalVisible = { setFlightDetailModalVisible }
      ></FlightDetail>
    </ModalBox>
  );
}
/** end *****航班表格 列表框架************/
export default FlightTableModal;
