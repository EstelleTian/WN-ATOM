/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-07-23 10:06:29
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
const FlightTableContainer = React.lazy(() =>
  import("components/FlightTable/FlightTableContainer")
);

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
    <div className="tactic_title_span">
      <div>航班列表({formatTimeString(generateTime)})</div>
      {tacticName !== "" && <div>—</div>}
      {tacticName !== "" && (
        <div
          // style={{ color: "#36a5da" }}
          // className="tactic_name "
          title={tacticName}
          className="tactic_name ellipsis_name"
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

/** end *****航班表格 纯表格************/

const TSpin = inject("flightTableData")(
  observer((props) => {
    const { flightTableData = {}, from } = props;
    const { loading } = flightTableData;

    return (
      <Spin spinning={loading}>
        <FlightTableContainer />
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
        <TSpin />

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
