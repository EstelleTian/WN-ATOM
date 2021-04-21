import React, { Fragment, useState } from "react";
import { Spin, Row, Col } from "antd";
import PerformanceItemHeader from "./PerformanceItemHeader";
import "./CollaborateKPI.scss";
const CollaborateKPI = function (props) {
  const [loading, setLoading] = useState(false);
  let style = { background: "rgb(69 87 137)", color: "#d4d4d4" };

  return (
    <Fragment>
      <PerformanceItemHeader style={style} title={"协调KPI"} />
      <Spin spinning={loading}>
        <Row className="col_kpi_card">
          <Col span={24} className="sub_title">
            运行配置
          </Col>
          <Col span={4} className="sub_item">
            <div className="total">
              <div className="item_value">
                <span>总计</span>
                <span className="number">22</span>
                <span>次</span>
              </div>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">扇区开合</div>
            <div className="item_value">
              <span className="number">22</span>
              <span>次</span>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">容量变更</div>
            <div className="item_value">
              <span className="number">3</span>
              <span>次</span>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">机场跑道变更</div>
            <div className="item_value">
              <span className="number">0</span>
              <span>次</span>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">机场容量变更</div>
            <div className="item_value">
              <span className="number">4</span>
              <span>次</span>
            </div>
          </Col>
        </Row>
        <Row className="col_kpi_card">
          <Col span={24} className="sub_title">
            航班协调
          </Col>
          <Col span={4} className="sub_item">
            <div className="total">
              <div className="item_value">
                <span>总计</span>
                <span className="number">53</span>
                <span>架次</span>
              </div>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">全局豁免</div>
            <div className="item_value">
              <span className="number">10</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">单方案豁免</div>
            <div className="item_value">
              <span className="number">8</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">半数间隔</div>
            <div className="item_value">
              <span className="number">6</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">出入池</div>
            <div className="item_value">
              <span className="number">5</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">调整CTOT</div>
            <div className="item_value">
              <span className="number">22</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={3} className="sub_item">
            <div className="item_name">TOBT变更</div>
            <div className="item_value">
              <span className="number">16</span>
              <span>架次</span>
            </div>
          </Col>
        </Row>
      </Spin>
    </Fragment>
  );
};

export default CollaborateKPI;
