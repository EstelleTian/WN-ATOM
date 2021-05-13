import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";
import { FlightCoordination, reasonType } from "utils/flightcoordination";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
  getDayTimeFromString,
} from "utils/basic-verify";

//转化为规定格式
const convertToTableData = (flowcontrols = []) => {
  let res = [];
  flowcontrols.map((item, index) => {
    let {
      id = "",
      tacticId = "",
      flowControlName = "",
      flowControlReason = "",
      flowControlMeasure = {},
      flowControlStatus = "",
    } = item;
    const restrictionMode = flowControlMeasure.restrictionMode || "";
    //限制值
    let interVal = "";
    if (restrictionMode === "MIT") {
      interVal = flowControlMeasure.restrictionMITValue || "";
    } else if (restrictionMode === "AFP") {
      interVal = flowControlMeasure.restrictionAFPValueSequence || "";
    }

    let status = FlightCoordination.getSchemeStatusZh(flowControlStatus);

    let obj = {
      key: id || index,
      tacticId: tacticId,
      schemeName: flowControlName,
      type: restrictionMode,
      value: interVal,
      reason: reasonType[flowControlReason] || "",
      resource: "",
      status: status,
    };
    res.push(obj);
  });
  return res;
};
//命中方案
const SchemeInfo = (props) => {
  const { flightDetailData = {} } = props;
  const { flightData = {} } = flightDetailData;
  const { flowcontrols = [] } = flightData;
  let data = [];
  if (flowcontrols.length > 0) {
    data = convertToTableData(flowcontrols);
  }
  const columns = [
    {
      title: "名称",
      dataIndex: "schemeName",
      align: "center",
      key: "schemeName",
      width: 200,
      ellipsis: true,
      className: "schemeName",
      showSorterTooltip: false,
      render: (text, record, index) => {
        return (
          <span
            className="tactic_blue"
            onClick={(e) => {
              const tacticId = record.tacticId || "";
              console.log(record);
              if (isValidVariable(tacticId)) {
                props.schemeListData.toggleSchemeActive(tacticId);
              }
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "类型",
      dataIndex: "type",
      align: "center",
      key: "type",
      width: 80,
      ellipsis: true,
      className: "type",
      showSorterTooltip: false,
    },
    {
      title: "限制值",
      dataIndex: "value",
      align: "center",
      key: "value",
      width: 80,
      ellipsis: true,
      className: "value",
      showSorterTooltip: false,
    },
    {
      title: "原因",
      dataIndex: "reason",
      align: "center",
      key: "reason",
      width: 80,
      ellipsis: true,
      className: "reason",
      showSorterTooltip: false,
    },
    // {
    //   title: "来源",
    //   dataIndex: "resource",
    //   align: "center",
    //   key: "resource",
    //   width: 80,
    //   ellipsis: true,
    //   className: "resource",
    //   showSorterTooltip: false,
    // },
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      key: "status",
      width: 80,
      ellipsis: true,
      className: "status",
      showSorterTooltip: false,
    },
  ];
  console.log("方案命中列表", data);
  // let data = [
  //   {
  //     key: "100",
  //     schemeName: "AGULU 1分钟/架",
  //     type: "时间",
  //     value: "1",
  //     reason: "其他",
  //     resource: "ATOM",
  //     status: "正在执行",
  //   },
  //   {
  //     key: "101",
  //     schemeName: "AGULU 1分钟/架",
  //     type: "时间",
  //     value: "1",
  //     reason: "其他",
  //     resource: "ATOM",
  //     status: "正在执行",
  //   },
  // ];
  return (
    <Fragment>
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        bordered
        pagination={false}
      />
    </Fragment>
  );
};

export default inject(
  "flightDetailData",
  "schemeListData"
)(observer(SchemeInfo));
