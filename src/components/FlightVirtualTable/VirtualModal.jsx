/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-05-06 14:44:00
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
import { isValidVariable, formatTimeString } from "utils/basic-verify";
import debounce from "lodash/debounce";
import VTable from "./VirtualTable";
import "./VirtualModal.scss";

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

const TSpin = inject("flightTableData")(
  observer((props) => {
    const { flightTableData = {} } = props;
    const { loading } = flightTableData;
    // console.log("航班loading render!!!")
    return (
      <Spin spinning={loading}>
        {/* <FlightTable /> */}
        <VTable />
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
//快捷查询
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
function VirtualModal(props) {
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
    </ModalBox>
  );
}
/** end *****航班表格 列表框架************/
export default VirtualModal;
