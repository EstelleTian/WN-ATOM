import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";

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
  {
    title: "来源",
    dataIndex: "resource",
    align: "center",
    key: "resource",
    width: 80,
    ellipsis: true,
    className: "resource",
    showSorterTooltip: false,
  },
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
//命中方案
const SchemeInfo = (props) => {
  const { flightDetailData } = props;
  const { flight } = flightDetailData;
  let data = [];
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

export default inject("flightDetailData")(observer(SchemeInfo));
