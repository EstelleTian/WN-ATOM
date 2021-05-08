import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";
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
  },
];
//电子进程单
const CoordinationRecord = (props) => {
  const { flightDetailData } = props;
  const { flight } = flightDetailData;
  let data = [
    {
      key: "100",
      efps_sid: "",
      efps_reqTime: "",
      efps_pusTime: "",
      efps_iceId: "",
      efps_inIceTime: "",
      efps_inDhlTime: "",
      efps_outDhlTime: "",
      efps_outIcTime: "",
      efps_linTime: "",
    },
  ];
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
