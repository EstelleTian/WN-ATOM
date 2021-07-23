import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { inject, observer } from "mobx-react";

//机位&跑道&除冰信息
const PositionRunwayDeiceInfo = (props) => {
  const { flightDetailData = {} } = props;
  const { flightData = {} } = flightDetailData;
  const { flight = {} } = flightData;
  const taxi = flight.taxi || "";
  return (
    <Fragment>
      <Row className="info-row">
        <Col span={8}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="机位">
                机位
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.position || ""}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="跑道">
                跑道
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.runWay || ""}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="滑行时间">
                滑行时间
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {taxi !== "" && taxi + "分钟"}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={8}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="是否除冰">
                是否除冰
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content"></div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="除冰位">
                除冰位
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content"></div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="除冰组">
                除冰组
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content"></div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default inject("flightDetailData")(observer(PositionRunwayDeiceInfo));
