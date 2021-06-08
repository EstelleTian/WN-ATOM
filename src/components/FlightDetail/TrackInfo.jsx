import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";
import { FlightCoordination } from "utils/flightcoordination";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
  getDayTimeFromString,
} from "utils/basic-verify";

const formatTimeStrFunc = (text, record, index) => {
  if (text.length === 12 || text.length === 14) {
    return <span title={text}>{getDayTimeFromString(text, "", 2)}</span>;
  } else {
    let status = "";
    if (text.length >= 14) {
      status = text.substring(14);
      return (
        getDayTimeFromString(text.substring(0, 14), "", 2) + "(" + status + ")"
      );
    }
  }
  return "";
};
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
    render: formatTimeStrFunc,
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
    render: formatTimeStrFunc,
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
    render: formatTimeStrFunc,
  },
];

const convertToTableData = (mpiInfo = {}, flight = {}) => {
  let res = [];
  const { atd = "", estInfo = "", updateTime = "" } = flight;

  for (let key in mpiInfo) {
    const tra = mpiInfo[key] || {};
    let item = { key: key, ffixt: key };
    let traC = tra.C || "";
    if (traC === "null") {
      traC = "";
    }
    let traE = tra.E || "";
    if (traE === "null") {
      traE = "";
    }
    let traT = tra.T || "";
    if (traT === "null") {
      traT = "";
    }
    let traP = tra.P || "";
    if (traP === "null") {
      traP = "";
    }
    let traA = tra.A || "";
    if (isValidVariable(traA) || traA === "null") {
      traE = "";
    }

    item["ptime"] = traP;
    item["ctime"] = traC;
    item["atime"] = "";
    if (isValidVariable(traA)) {
      item["atime"] = traA;
    } else if (isValidVariable(traT)) {
      item["atime"] = traT + "T";
    } else if (
      isValidVariable(atd) ||
      isValidVariable(estInfo) ||
      isValidVariable(updateTime)
    ) {
      if (isValidVariable(traE)) {
        item["atime"] = traE + "E";
      }
    }
    res.push(item);
  }
  return res;
};

//航迹信息
const TrackInfo = (props) => {
  const { flightDetailData = {} } = props;
  const { flightData = {} } = flightDetailData;
  const { flight = {}, mpi = "" } = flightData;
  const { updateTime = "" } = flight;
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
  // alert(mpi);
  let mpiInfo = FlightCoordination.parseMonitorPointInfo(mpi, flight);
  let data = [];
  if (isValidObject(mpiInfo)) {
    data = convertToTableData(mpiInfo, flight);
  }
  // console.log("mpiInfo", mpiInfo, data);
  return (
    <Fragment>
      {updateTime !== "" && (
        <div className="info-row" title={updateTime}>
          最新动态修正时间：{formatTimeString(updateTime)}
        </div>
      )}
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
