import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
  getDayTimeFromString,
} from "utils/basic-verify";

//A-CDM地面运行保障信息
const ACDMGroundOperationInfo = (props) => {
  const { flightDetailData } = props;
  const { flightData = {} } = flightDetailData;
  const { groundFlight = {} } = flightData;
  return (
    <Fragment>
      <Row className="info-row">
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="进港移交">
                进港移交
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="靠桥时间">
                靠桥时间
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="挡轮档">
                挡轮档
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="开客舱门">
                开客舱门
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="开始供油">
                开始供油
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="开始保洁">
                开始保洁
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="开始配餐">
                开始配餐
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="开货舱门">
                开货舱门
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
                <div className="ant-form-item-control-input-content">
                  {/* {groundFlight.XXXAcdm || ""} */}
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
                  title={formatTimeString(groundFlight.abipAcdm || "")}
                >
                  {formatTimeString(groundFlight.abipAcdm || "", 3)}
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
                  title={formatTimeString(groundFlight.aibtAcdm || "")}
                >
                  {formatTimeString(groundFlight.aibtAcdm || "", 3)}
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
                  title={formatTimeString(groundFlight.atdcAcdm || "")}
                >
                  {formatTimeString(groundFlight.atdcAcdm || "", 3)}
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
                  title={formatTimeString(groundFlight.startFuelTimeAcdm || "")}
                >
                  {formatTimeString(groundFlight.startFuelTimeAcdm || "", 3)}
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
                  title={formatTimeString(
                    groundFlight.startCleanTimeAcdm || ""
                  )}
                >
                  {formatTimeString(groundFlight.startCleanTimeAcdm || "", 3)}
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
                  title={formatTimeString(groundFlight.startFoodTimeAcdm || "")}
                >
                  {formatTimeString(groundFlight.startFoodTimeAcdm || "", 3)}
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
                  title={formatTimeString(groundFlight.atfoAcdm || "")}
                >
                  {formatTimeString(groundFlight.atfoAcdm || "", 3)}
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
              <label className="ant-form-item-no-colon" title="完成供油">
                完成供油
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="完成保洁">
                完成保洁
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="完成配餐">
                完成配餐
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="关货舱门">
                关货舱门
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="开始登机">
                开始登机
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
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
        </Col>
      </Row>
      <Row>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {groundFlight.endFuelTimeAcdm || ""}
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
                  {groundFlight.endCleanTimeAcdm || ""}
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
                  {groundFlight.endFoodTimeAcdm || ""}
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
                  {groundFlight.atfcAcdm || ""}
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
                  title={formatTimeString(groundFlight.asbtAcdm || "")}
                >
                  {formatTimeString(groundFlight.asbtAcdm || "", 3)}
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
                  title={formatTimeString(groundFlight.aebtAcdm || "")}
                >
                  {formatTimeString(groundFlight.aebtAcdm || "", 3)}
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
                  title={formatTimeString(groundFlight.ardoAcdm || "")}
                >
                  {formatTimeString(groundFlight.ardoAcdm || "", 3)}
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
                  title={formatTimeString(groundFlight.aadtAcdm || "")}
                >
                  {formatTimeString(groundFlight.aadtAcdm || "", 3)}
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
              <label className="ant-form-item-no-colon" title="机务放行">
                机务放行
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="实际离港">
                实际离港
              </label>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="离港移交">
                离港移交
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
                  title={formatTimeString(
                    groundFlight.groundHandlerClearenceTime || ""
                  )}
                >
                  {formatTimeString(
                    groundFlight.groundHandlerClearenceTime || "",
                    3
                  )}
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
                  title={formatTimeString(groundFlight.aobtAcdm || "")}
                >
                  {formatTimeString(groundFlight.aobtAcdm || "", 3)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={3}>
          <div className="ant-row ant-form-item">
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

export default inject("flightDetailData")(observer(ACDMGroundOperationInfo));
