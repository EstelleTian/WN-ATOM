import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";

const columns = [
  {
    title: "协调类型",
    dataIndex: "type",
    align: "center",
    key: "type",
    width: 80,
    ellipsis: true,
    className: "type",
    showSorterTooltip: false,
  },
  {
    title: "协调前",
    dataIndex: "orgValue",
    align: "center",
    key: "orgValue",
    width: 80,
    ellipsis: true,
    className: "orgValue",
    showSorterTooltip: false,
  },
  {
    title: "协调后",
    dataIndex: "value",
    align: "center",
    key: "value",
    width: 80,
    ellipsis: true,
    className: "value",
    showSorterTooltip: false,
  },
  {
    title: "协调备注",
    dataIndex: "comment",
    align: "center",
    key: "comment",
    width: 80,
    ellipsis: true,
    className: "comment",
    showSorterTooltip: false,
  },
  {
    title: "协调状态",
    dataIndex: "status",
    align: "center",
    key: "status",
    width: 80,
    ellipsis: true,
    className: "status",
    showSorterTooltip: false,
  },
  {
    title: "协调时间",
    dataIndex: "time",
    align: "center",
    key: "time",
    width: 80,
    ellipsis: true,
    className: "time",
    showSorterTooltip: false,
  },
  {
    title: "协调用户",
    dataIndex: "user",
    align: "center",
    key: "user",
    width: 80,
    ellipsis: true,
    className: "user",
    showSorterTooltip: false,
  },
  {
    title: "协调用户IP",
    dataIndex: "ip",
    align: "center",
    key: "ip",
    width: 80,
    ellipsis: true,
    className: "ip",
    showSorterTooltip: false,
  },
];
//协调记录
const CoordinationRecord = (props) => {
  const { flightDetailData } = props;
  const { flight } = flightDetailData;
  // let data = [
  //   {
  //     key: "100",
  //     type: "发布预撤COBT",
  //     orgValue: "",
  //     value: "06/2151 06/2201",
  //     comment: "",
  //     status: "调整",
  //     time: "06/2108",
  //     user: "时隙分配程序",
  //     ip: "",
  //   },
  // ];
  let data = []
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
