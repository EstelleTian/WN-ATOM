/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-06-21 19:46:41
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

// import CollaboratePopover from "components/CollaboratePopover/CollaboratePopover";
import { isValidVariable, formatTimeString } from "utils/basic-verify";
import debounce from "lodash/debounce";

import "./FlightTable.scss";
const FlightDetail = React.lazy(() =>
  import("components/FlightDetail/FlightDetail")
);
const FormerFlightUpdateModal = React.lazy(() =>
  import("components/FormerFlightUpdateModal/FormerFlightUpdateModal")
);
const FlightExchangeSlotModal = React.lazy(() =>
  import("components/FlightExchangeSlotModal/FlightExchangeSlotModal")
);
const DateRangeChangeModal = React.lazy(() =>
  import("components/DateRangeChangeModal/DateRangeChangeModal")
);
const CollaboratePopover = React.lazy(() =>
  import("components/CollaboratePopover/CollaboratePopover")
);
const CollaborateTip = React.lazy(() =>
  import("components/CollaboratePopover/CollaborateTip")
);
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
    <div className="tactic_title_span">
      <div>航班列表({formatTimeString(generateTime)})</div>
      {tacticName !== "" && <div>—</div>}
      {tacticName !== "" && (
        <div
          // style={{ color: "#36a5da" }}
          className="tactic_name "
          title={tacticName}
          // className="tactic_name ellipsis_name"
        >
          {tacticName}
        </div>
      )}
    </div>
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

/** start *****航班表格 纯表格************/
function FTable(props) {
  const { tableWidth, tableHeight, setHeight } = useAutoSize();
  let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段
  let [sortOrder, setSortOrder] = useState("ascend"); //表格排序 顺序  升序ascend/降序

  const { flightTableData = {}, schemeListData, systemPage } = props;
  const {
    autoScroll,
    filterable,
    focusFlightId,
    dataLoaded,
    codeType,
    systemName,
  } = flightTableData;

  const handleRow = useCallback((event, record) => {
    // 点击行
    const dom = event.currentTarget;
    // const refVal = dom.getAttribute("data-row-key");
    // flightTableData.toggleSelectFlight(refVal);
    // console.log("toggleSelectFlight", refVal)
    highlightRowByDom(dom);
  }, []);

  let { schemeStartTime, schemeEndTime } = useMemo(() => {
    if (flightTableData.loading) {
      return {
        schemeStartTime: "",
        schemeEndTime: "",
      };
    }
    console.log("航班表格 useMemo 1", flightTableData.loading);
    const activeScheme =
      schemeListData.activeScheme(schemeListData.activeSchemeId) || {};
    const { tacticTimeInfo = {} } = activeScheme;
    const { startTime, endTime } = tacticTimeInfo;

    return {
      schemeStartTime: startTime,
      schemeEndTime: endTime,
    };
    // }, [schemeListData.activeSchemeId]);
  }, [flightTableData.loading]);

  let showList = [];
  let targetFlight = {};
  if (
    flightTableData.loading &&
    flightTableData.lastSchemeId !== schemeListData.activeSchemeId
  ) {
    showList = [];
    targetFlight = {};
  } else {
    let obj = props.flightTableData.getShowedFlights();
    showList = obj.showList;
    targetFlight = obj.targetFlight;
  }

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
      let orgdataStr = record["orgdata"] || "{}";
      let orgdata = JSON.parse(orgdataStr);
      let FFIXTField = record.FFIXT || {};
      let FFIXT = FFIXTField.value || "";
      let type = FFIXTField.type || "";
      let id = record.id || "";
      let isOutterFlight = false;
      if (props.ATOMConfigFormData.configValue * 1 === 300) {
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
        isValidVariable(props.schemeListData.activeSchemeId) &&
        !isOutterFlight
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
      if (isOutterFlight) {
        id += " groupb";
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
    [
      schemeStartTime,
      schemeEndTime,
      systemName,
      props.ATOMConfigFormData.configValue,
    ]
  );

  const onChange = useCallback((pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
    setSortOrder(sorter.order);
    setSortKey(sorter.columnKey);
  }, []);

  useEffect(() => {
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

  const onCellFilter = useCallback((name, value) => {
    // console.log(name,value);
    props.flightTableData.setFilterValues(name, value);
  }, []);

  let columns = getColumns(
    props.systemPage.systemKind,
    props.collaboratePopoverData,
    false,
    () => {}
  );

  useEffect(() => {
    if (filterable) {
      setHeight(tableHeight - 45);
      columns = getColumns(
        props.systemPage.systemKind,
        props.collaboratePopoverData,
        true,
        onCellFilter
      );
    } else {
      setHeight(tableHeight + 45);
    }
  }, [filterable]);

  if (flightTableData.lastSchemeId !== schemeListData.activeSchemeId) {
    showList = [];
  }
  console.log(
    "航班表格渲染 showList",
    showList.length,
    flightTableData.lastSchemeId,
    schemeListData.activeSchemeId,
    tableWidth,
    tableHeight
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
      loading={props.flightTableData.loading}
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
  "schemeListData",
  "collaboratePopoverData",
  "systemPage",
  "ATOMConfigFormData"
)(observer(FTable));
/** end *****航班表格 纯表格************/

const TSpin = inject("flightTableData")(
  observer((props) => {
    const { flightTableData = {}, from } = props;
    const { loading } = flightTableData;

    return (
      <Spin spinning={loading}>
        <FlightTable />
      </Spin>
    );
  })
);
//四字码ICAO 三字码IATA 切换
const ICAOSwitch = inject("flightTableData")(
  observer((props) => {
    const onChange = (checked) => {
      console.log(`switch to ${checked}`);
      props.flightTableData.setCodeType(checked);
    };
    return (
      <div className="auto_scroll">
        <Switch
          className="icao_switch"
          title="ICAO/IATA切换"
          defaultChecked
          checkedChildren="ICAO"
          unCheckedChildren="IATA"
          onChange={onChange}
        />
      </div>
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
  console.log("FlightTableModal 渲染");
  return (
    <Fragment>
      <ModalBox
        className="flight_canvas"
        title={<TableTitle />}
        showDecorator={false}
      >
        <div className="statistics">
          <FilterBtn />
          <AutoScrollBtn />
          <ICAOSwitch />
          <SearchInput />
          <TotalDom />
        </div>
        {/* <TSpin /> */}
        <FlightTable />
        <Suspense fallback={<div></div>}>
          <FlightDetail />
          {/* 一个popover专注做一件事 */}
          <CollaborateTip />
          <CollaboratePopover />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <FormerFlightUpdateModal />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <FlightExchangeSlotModal />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <DateRangeChangeModal />
        </Suspense>
      </ModalBox>
    </Fragment>
  );
}
/** end *****航班表格 列表框架************/
export default FlightTableModal;
