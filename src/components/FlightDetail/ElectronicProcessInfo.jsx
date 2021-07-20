import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
  getDayTimeFromString
} from "utils/basic-verify";
const columns = [
  {
    title: "离场程序",
    dataIndex: "efps_sid",
    align: "center",
    key: "efps_sid",
    width: 80,
    ellipsis: true,
    className: "efps_sid",
    showSorterTooltip: false,
  },
  {
    title: "申请时间",
    dataIndex: "efps_reqTime",
    align: "center",
    key: "efps_reqTime",
    width: 80,
    ellipsis: true,
    className: "efps_reqTime",
    showSorterTooltip: false,
    render: (text, record, index) => {
      if (text.length > 14) {
        text = text.substring(0, 14);
      }
      const timeTitle = formatTimeString(text);
      const time = formatTimeString(text, 3);
      return <div title={timeTitle}>{time}</div>;
    },
  },
  {
    title: "推出时间",
    dataIndex: "efps_pusTime",
    align: "center",
    key: "efps_pusTime",
    width: 80,
    ellipsis: true,
    className: "efps_pusTime",
    showSorterTooltip: false,
    render: (text, record, index) => {
      if (text.length > 14) {
        text = text.substring(0, 14);
      }
      const timeTitle = formatTimeString(text);
      const time = formatTimeString(text, 3);
      return <div title={timeTitle}>{time}</div>;
    },
  },
  {
    title: "除冰坪",
    dataIndex: "efps_iceId",
    align: "center",
    key: "efps_iceId",
    width: 80,
    ellipsis: true,
    className: "efps_iceId",
    showSorterTooltip: false,
  },
  {
    title: "进除冰区时间",
    dataIndex: "efps_inIceTime",
    align: "center",
    key: "efps_inIceTime",
    width: 80,
    ellipsis: true,
    className: "efps_inIceTime",
    showSorterTooltip: false,
    render: (text, record, index) => {
      if (text.length > 14) {
        text = text.substring(0, 14);
      }
      const timeTitle = formatTimeString(text);
      const time = formatTimeString(text, 3);
      return <div title={timeTitle}>{time}</div>;
    },
  },
  {
    title: "进除冰等待区时间",
    dataIndex: "efps_inDhlTime",
    align: "center",
    key: "efps_inDhlTime",
    width: 80,
    ellipsis: true,
    className: "efps_inDhlTime",
    showSorterTooltip: false,
    render: (text, record, index) => {
      if (text.length > 14) {
        text = text.substring(0, 14);
      }
      const timeTitle = formatTimeString(text);
      const time = formatTimeString(text, 3);
      return <div title={timeTitle}>{time}</div>;
    },
  },
  {
    title: "出除冰等待区时间",
    dataIndex: "efps_outDhlTime",
    align: "center",
    key: "efps_outDhlTime",
    width: 80,
    ellipsis: true,
    className: "efps_outDhlTime",
    showSorterTooltip: false,
    render: (text, record, index) => {
      if (text.length > 14) {
        text = text.substring(0, 14);
      }
      const timeTitle = formatTimeString(text);
      const time = formatTimeString(text, 3);
      return <div title={timeTitle}>{time}</div>;
    },
  },
  {
    title: "出除冰区时间",
    dataIndex: "efps_outIcTime",
    align: "center",
    key: "efps_outIcTime",
    width: 80,
    ellipsis: true,
    className: "efps_outIcTime",
    showSorterTooltip: false,
    render: (text, record, index) => {
      if (text.length > 14) {
        text = text.substring(0, 14);
      }
      const timeTitle = formatTimeString(text);
      const time = formatTimeString(text, 3);
      return <div title={timeTitle}>{time}</div>;
    },
  },
  {
    title: "上跑道时间",
    dataIndex: "efps_linTime",
    align: "center",
    key: "efps_linTime",
    width: 80,
    ellipsis: true,
    className: "efps_linTime",
    showSorterTooltip: false,
    render: (text, record, index) => {
      if (text.length > 14) {
        text = text.substring(0, 14);
      }
      const timeTitle = formatTimeString(text);
      const time = formatTimeString(text, 3);
      return <div title={timeTitle}>{time}</div>;
    },
  },
];
//转化为规定格式
const convertToTableData = (efpsFlight = {}) => {
  let res = [];
  let obj = {
    key: "100",
    efps_sid: efpsFlight.id || "",
    efps_reqTime: efpsFlight.reqTime || "",
    efps_pusTime: efpsFlight.pusTime || "",
    efps_iceId: efpsFlight.iceId || "",
    efps_inIceTime: efpsFlight.inIceTime || "",
    efps_inDhlTime: efpsFlight.inDhlTime || "",
    efps_outDhlTime: efpsFlight.outDhlTime || "",
    efps_outIcTime: efpsFlight.outIcTime || "",
    efps_linTime: efpsFlight.linTime || "",
  };

  res.push(obj);
  console.log(res);
  return res;
};
//电子进程单
const CoordinationRecord = (props) => {
  const { flightDetailData } = props;
  const { flightData = {} } = flightDetailData;
  const { efpsFlight = {} } = flightData;
  let data = [];
  if (isValidObject(efpsFlight)) {
    data = convertToTableData(efpsFlight);
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
