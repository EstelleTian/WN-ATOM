import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
  getDayTimeFromString,
} from "utils/basic-verify";
//A-CDM其他信息
const ACDMOtherInfo = (props) => {
  const { flightDetailData } = props;
  const { flightData = {} } = flightDetailData;
  const { groundFlight = {} } = flightData;
  return (
    <Fragment>
      <Row className="info-row">
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="目标撤轮档">
                目标撤轮档
              </label>
            </div>
          </div>
        </Col>

        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="除冰坪">
                除冰坪
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="除冰类型">
                除冰类型
              </label>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="ant-row ant-form-item">
            <div
              className="ant-col ant-form-item-label ant-form-item-label-left"
              style={{ width: "100%" }}
            >
              <label className="ant-form-item-no-colon" title="开始除冰">
                开始除冰
              </label>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="ant-row ant-form-item">
            <div
              className="ant-col ant-form-item-label ant-form-item-label-left"
              style={{ width: "100%" }}
            >
              <label className="ant-form-item-no-colon" title="完成除冰">
                完成除冰
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="离港停机位">
                离港停机位
              </label>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.tobtAcdm || "")}
                >
                  {formatTimeString(groundFlight.tobtAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.deiceStandAcdm || "")}
                >
                  {formatTimeString(groundFlight.deiceStandAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.deiceTypeAcdm || "")}
                >
                  {formatTimeString(groundFlight.deiceTypeAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.ecztAcdm || "")}
                >
                  {formatTimeString(groundFlight.ecztAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.acztAcdm || "")}
                >
                  {formatTimeString(groundFlight.acztAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.eeztAcdm || "")}
                >
                  {formatTimeString(groundFlight.eeztAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.aeztAcdm || "")}
                >
                  {formatTimeString(groundFlight.aeztAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {groundFlight.standAcdm || ""}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="离港停机位类型">
                离港停机位类型
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="航班登机口">
                航班登机口
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="二次开门">
                二次开门
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="二次关门">
                二次关门
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="目标撤轮档应用">
                目标撤轮档应用
              </label>
            </div>
          </div>
        </Col>
        {/* <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="完成登机">
                完成登机
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="关客舱门">
                关客舱门
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="离桥时间">
                离桥时间
              </label>
            </div>
          </div>
        </Col> */}
      </Row>
      <Row>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {groundFlight.standTypeAcdm || ""}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {groundFlight.gateAcdm || ""}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.ropenTimeAcdm || "")}
                >
                  {formatTimeString(groundFlight.ropenTimeAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.rcldtimeAcdm || "")}
                >
                  {formatTimeString(groundFlight.rcldtimeAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={formatTimeString(groundFlight.tobtFusionAcdm || "")}
                >
                  {formatTimeString(groundFlight.tobtFusionAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default inject("flightDetailData")(observer(ACDMOtherInfo));
