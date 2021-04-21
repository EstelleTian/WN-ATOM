import React, { Fragment, useState } from "react";
import { Spin } from "antd";
import PerformanceItemHeader from "./PerformanceItemHeader";

const CollaborateKPI = function (props) {
  const [loading, setLoading] = useState(false);
  const list = [
    {
      id: 1001,
      des: "扇区开合",
      value: 3,
    },
    {
      id: 1002,
      des: "容量变更",
      value: 5,
    },
    {
      id: 1003,
      des: "机场跑道变更",
      value: 1,
    },
    {
      id: 1004,
      des: "机场容量变更",
      value: 2,
    },
  ];
  return (
    <Fragment>
      <PerformanceItemHeader
        style={{ background: "#2d6b92", color: "#d4d4d4" }}
        title="运行配置"
      />
      <Spin spinning={loading}>
        <div className="content">
          <ul className="ant-list-items">
            {list.map((item) => (
              <li key={item.id} className="list-item">
                <div className="item">
                  <div className="description">
                    <span>{item.des}</span>
                  </div>
                  <div className="value">
                    <span>{item.value}</span>
                    <span>次</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Spin>
    </Fragment>
  );
};

export default CollaborateKPI;
