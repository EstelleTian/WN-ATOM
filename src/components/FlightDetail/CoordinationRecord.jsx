import React, { Fragment } from "react";
import { Row, Col, Tooltip } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";
import { FlightCoordination } from "utils/flightcoordination";
import { FlightCoordinationRecordGridTableDataUtil } from "utils/flight-coordination-record-data-util";
import { FlightCoordinationRecord } from "utils/flight-coordination-record";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
  getDayTimeFromString,
  getFullTime,
} from "utils/basic-verify";
//根据key识别列表列配置columns
const getLockedCn = (value) => {
  let res = "";
  switch (value) {
    case "1":
      res = "禁止调整";
      break;
    case "0":
      res = "自动";
      break;
  }
  return res;
};
const convertValueFunc = (text, record, index) => {
  const { type } = record;
  if (type === "TOBT") {
    if (isValidVariable(text) && text.length >= 12 && text * 1 > 0) {
      return <div title={text}>{getDayTimeFromString(text)}</div>;
    }
  } else if (type === "EXEMPT" || type === "UNEXEMPT") {
    // console.log(text)
    return <div title={text}>{FlightCoordination.getPriorityZh(text)}</div>;
  } else if (
    type === "SINGLEEXEMPT" ||
    type === "UNSINGLEEXEMPT" ||
    type === "INTERVAL" ||
    type === "UNINTERVAL"
  ) {
    if (isValidVariable(text)) {
      const tacticName = record.tacticName || "";
      return <div title={`${tacticName} - ${text}`}>{tacticName}</div>;
    } else {
      return <div title={text}>{text}</div>;
    }
  } else if (type === "INPOOL" || type === "OUTPOOL") {
    return <div title={text}>{FlightCoordination.getPoolStatusZh(text)}</div>;
  } else if (
    type === "COBT" ||
    type === "CTOT" ||
    type === "CTD" ||
    type === "FFIXT" ||
    type === "CTO"
  ) {
    const obj = JSON.parse(text) || {};
    const getCont = () => {
      return (
        <div>
          {Object.keys(obj).map((key, index) => {
            let val = obj[key];
            if (isValidVariable(val) && val.length >= 12 && val * 1 > 0) {
              return (
                <div key={index}>
                  {key}：{getDayTimeFromString(val, "", 2)}
                </div>
              );
            } else {
              return (
                <div key={index}>
                  {key}：{getLockedCn(val)}
                </div>
              );
            }
          })}
        </div>
      );
    };
    return <Tooltip title={getCont()}>{getCont()}</Tooltip>;
  } else {
    if (isValidVariable(text) && text.length >= 12 && text * 1 > 0) {
      return <div title={text}>{getDayTimeFromString(text)}</div>;
    }
  }
  return <div title={text}>{text}</div>;
};
const columns = [
  {
    title: "协调类型",
    dataIndex: "type",
    align: "center",
    key: "type",
    width: 100,
    ellipsis: true,
    className: "type",
    showSorterTooltip: false,
  },
  {
    title: "协调前",
    dataIndex: "orgValue",
    align: "center",
    key: "orgValue",
    width: 100,
    ellipsis: true,
    className: "orgValue",
    showSorterTooltip: false,
    render: convertValueFunc,
  },
  {
    title: "协调后",
    dataIndex: "value",
    align: "center",
    key: "value",
    width: 100,
    ellipsis: true,
    className: "value",
    showSorterTooltip: false,
    render: convertValueFunc,
  },
  {
    title: "协调备注",
    dataIndex: "comments",
    align: "center",
    key: "comments",
    width: 60,
    ellipsis: true,
    className: "comments",
    showSorterTooltip: false,
  },
  {
    title: "协调状态",
    dataIndex: "status",
    align: "center",
    key: "status",
    width: 60,
    ellipsis: true,
    className: "status",
    showSorterTooltip: false,
  },
  {
    title: "协调时间",
    dataIndex: "time",
    align: "center",
    key: "time",
    width: 70,
    ellipsis: true,
    className: "time",
    showSorterTooltip: false,
    render: (text, record, index) => {
      if (text.length > 14) {
        text = text.substring(0, 14);
      }
      const timeTitle = formatTimeString(text);
      const time = formatTimeString(text, 2);
      return <div title={timeTitle}>{time}</div>;
    },
  },
  {
    title: "协调用户",
    dataIndex: "user",
    align: "center",
    key: "user",
    width: 70,
    ellipsis: true,
    className: "user",
    showSorterTooltip: false,
  },
  {
    title: "协调用户IP",
    dataIndex: "ip",
    align: "center",
    key: "ip",
    width: 70,
    ellipsis: true,
    className: "ip",
    showSorterTooltip: false,
  },
];

//转化为规定格式
const convertToTableData = (recordMap = {}) => {
  let res = [];
  for (let key in recordMap) {
    const record = recordMap[key] || {};
    const statusZh = FlightCoordinationRecord.getStatusZh(record.status || "");
    const type = record.type || "";
    const typeZh = FlightCoordination.CoordinationType[type];
    let obj = {
      key: record.id || "",
      type: typeZh || "",
      orgValue: record.originalValue || "",
      value: record.value || "",
      comments: record.comments || "",
      status: statusZh || "",
      time: record.timestamp || "",
      user: record.username || "",
      ip: record.ipAddress || "",
    };

    res.push(obj);
  }
  console.log(res);
  return res;
};
//协调记录
const CoordinationRecord = (props) => {
  const { flightDetailData = {} } = props;
  const { flightData = {} } = flightDetailData;
  const { recordMap = {} } = flightData;

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

export default inject("flightDetailData")(observer(CoordinationRecord));
