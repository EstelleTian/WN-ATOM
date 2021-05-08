import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";

//协调信息
const CoordinationInfo = (props) => {
  const { flightDetailData } = props;
  const { flight } = flightDetailData;
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
  const data = [
    {
      key: "100",
      basename: "FPL(E)",
      OBT: "07/1450",
      TOT: "07/1450",
      NOBIK: "07/1450",
      AGULU: "07/1450",
    },
    {
      key: "101",
      basename: "预计(T)",
      OBT: "07/1450",
      TOT: "07/1450",
      NOBIK: "07/1450",
      AGULU: "07/1450",
    },
    {
      key: "102",
      basename: "协调(H)",
      OBT: "07/1450",
      TOT: "07/1450",
      NOBIK: "07/1450",
      AGULU: "07/1450",
    },
    {
      key: "103",
      basename: "计算(C)",
      OBT: "07/1450",
      TOT: "07/1450",
      NOBIK: "07/1450",
      AGULU: "07/1450",
    },
    {
      key: "104",
      basename: "NTFM(C)",
      OBT: "07/1450",
      TOT: "07/1450",
      NOBIK: "07/1450",
      AGULU: "07/1450",
    },
    {
      key: "105",
      basename: "全国计算(N)",
      OBT: "07/1450",
      TOT: "07/1450",
      NOBIK: "07/1450",
      AGULU: "07/1450",
    },
    {
      key: "106",
      basename: "实际(A)",
      OBT: "07/1450",
      TOT: "07/1450",
      NOBIK: "07/1450",
      AGULU: "07/1450",
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

export default inject("flightDetailData")(observer(CoordinationInfo));
