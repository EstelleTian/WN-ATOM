import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";
import { FlightCoordination } from "utils/flightcoordination";
import { FlightCoordinationRecordGridTableDataUtil } from "utils/flight-coordination-record-data-util";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
  getDayTimeFromString,
} from "utils/basic-verify";
//转化为规定格式
const convertToTableData = (recordMap = {}) => {
  let res = [];
  for (let key in recordMap) {
    const record = recordMap[key] || {};
    let data = FlightCoordinationRecordGridTableDataUtil.convertData(record);

    let {
      id = "",
      tacticId = "",
      flowControlName = "",
      flowControlReason = "",
      flowControlMeasure = "",
      flowControlStatus = "",
    } = item;
    
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
  };
  return res;
};
//协调信息
const CoordinationInfo = (props) => {
  const { flightDetailData = {} } = props;
  const { flightData = {} } = flightDetailData;
  const { recordMap ={} } = flightData;
  const columns = [
    {
      title: "",
      dataIndex: "basename",
      align: "center",
      key: "basename",
      width: 100,
      ellipsis: true,
      className: "basename",
      showSorterTooltip: false,
    },
    {
      title: "OBT",
      dataIndex: "OBT",
      align: "center",
      key: "OBT",
      width: 100,
      ellipsis: true,
      className: "OBT",
      showSorterTooltip: false,
    },
    {
      title: "TOT",
      dataIndex: "TOT",
      align: "center",
      key: "TOT",
      width: 100,
      ellipsis: true,
      className: "TOT",
      showSorterTooltip: false,
    },
    {
      title: "NOBIK",
      dataIndex: "NOBIK",
      align: "center",
      key: "NOBIK",
      width: 100,
      ellipsis: true,
      className: "NOBIK",
      showSorterTooltip: false,
    },
  
    {
      title: "AGULU",
      dataIndex: "AGULU",
      align: "center",
      key: "AGULU",
      width: 100,
      ellipsis: true,
      className: "AGULU",
      showSorterTooltip: false,
    },
  ];
  let data = [];
  if (isValidObject(recordMap)) {
    data = convertToTableData(recordMap);
  }
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

export default inject("flightDetailData")(observer(CoordinationInfo));
