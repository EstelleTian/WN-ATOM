import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";

const columns = [
  {
    title: "",
    dataIndex: "ffixt",
    align: "center",
    key: "ffixt",
    width: 100,
    ellipsis: true,
    className: "ffixt",
    showSorterTooltip: false,
  },
  {
    title: "预计(P)",
    dataIndex: "ptime",
    align: "center",
    key: "ptime",
    width: 100,
    ellipsis: true,
    className: "ptime",
    showSorterTooltip: false,
  },
  {
    title: "计算(C)",
    dataIndex: "ctime",
    align: "center",
    key: "ctime",
    width: 100,
    ellipsis: true,
    className: "ctime",
    showSorterTooltip: false,
  },
  {
    title: "实际/修正(E)",
    dataIndex: "atime",
    align: "center",
    key: "atime",
    width: 100,
    ellipsis: true,
    className: "atime",
    showSorterTooltip: false,
  },
];
//航迹信息
const TrackInfo = (props) => {
  const { flightDetailData } = props;
  const { flight } = flightDetailData;
  // let data = [
  //   {
  //     key: "100",
  //     ffixt: "ZUUU",
  //     ptime: "07/1450",
  //     ctime: "07/1450",
  //     atime: "07/1450",
  //   },
  //   {
  //     key: "200",
  //     ffixt: "NOBIK",
  //     ptime: "07/1450",
  //     ctime: "07/1450",
  //     atime: "07/1450",
  //   },
  // ];
  let data = [];
  return (
    <Fragment>
      <div className="info-row">最新动态修正时间：XXXX</div>
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

export default inject("flightDetailData")(observer(TrackInfo));
