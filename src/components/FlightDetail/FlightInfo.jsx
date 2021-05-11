/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-05-11 20:14:31
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: WN-ATOM\src\components\FlightDetail\FlightDetail.jsx
 */
import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import {
  isValidVariable,
  isValidObject,
  getDayTimeFromString,
} from "utils/basic-verify";

//航班信息
const FlightInfo = (props) => {
  const { type = "", flightDetailData: { flightData = {} } = {} } = props;

  let flight = {};
  if (type === "former") {
    flight = flightData.formerFlight || {};
  } else {
    flight = flightData.flight || {};
  }
  return (
    <Fragment>
      <Row className="info-row">
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="航班号">
                航班号
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.flightId}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="所属公司">
                所属公司
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.carrier}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="注册号">
                注册号
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.registeNum}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="机型">
                机型
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.aircraftType}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="报文记录">
                报文记录
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.teleType}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="最新报文">
                最新报文
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.teleNew}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="起飞机场">
                起飞机场
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.depAp}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="降落机场">
                降落机场
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.arrAp}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="计划起飞时间">
                计划起飞时间
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={flight.sDeptime}
                >
                  {getDayTimeFromString(flight.sDeptime, "", 2)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="计划降落时间">
                计划降落时间
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={flight.sArrtime}
                >
                  {getDayTimeFromString(flight.sArrtime, "", 2)}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={24}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="计划航路">
                计划航路
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.sRoute}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="FPL起飞时间">
                FPL起飞时间
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={flight.pDeptime}
                >
                  {getDayTimeFromString(flight.pDeptime, "", 2)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="FPL降落时间">
                FPL降落时间
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={flight.pArrtime}
                >
                  {getDayTimeFromString(flight.pArrtime, "", 2)}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={24}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="FPL航路">
                FPL航路
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.pRoute}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="info-row">
        <Col span={24}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="CPL信息">
                CPL信息
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  {flight.cplInfo}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {type === "former" ? (
        <Fragment>
          <Row className="info-row">
            <Col span={12}>
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                  <label className="ant-form-item-no-colon" title="关门时间">
                    关门时间
                  </label>
                </div>
                <div className="ant-col ant-form-item-control">
                  <div className="ant-form-item-control-input">
                    <div
                      className="ant-form-item-control-input-content"
                      title={flight.rCldtime}
                    >
                      {getDayTimeFromString(flight.rCldtime, "", 2)}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                  <label className="ant-form-item-no-colon" title="推出时间">
                    推出时间
                  </label>
                </div>
                <div className="ant-col ant-form-item-control">
                  <div className="ant-form-item-control-input">
                    <div
                      className="ant-form-item-control-input-content"
                      title={flight.rOutTime}
                    >
                      {getDayTimeFromString(flight.rOutTime, "", 2)}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Fragment>
      ) : (
        <Fragment>
          <Row className="info-row">
            <Col span={12}>
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                  <label
                    className="ant-form-item-no-colon"
                    title="前段实际降落时间"
                  >
                    前段实际降落时间
                  </label>
                </div>
                <div className="ant-col ant-form-item-control">
                  <div className="ant-form-item-control-input">
                    <div
                      className="ant-form-item-control-input-content"
                      title={flight.formerArrtime}
                    >
                      {getDayTimeFromString(flight.formerArrtime, "", 2)}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                  <label
                    className="ant-form-item-no-colon"
                    title="本段预计关门时间"
                  >
                    本段预计关门时间
                  </label>
                </div>
                <div className="ant-col ant-form-item-control">
                  <div className="ant-form-item-control-input">
                    <div
                      className="ant-form-item-control-input-content"
                      title={flight.ctobt}
                    >
                      {getDayTimeFromString(flight.ctobt, "", 2)}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="info-row">
            <Col span={12}>
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                  <label className="ant-form-item-no-colon" title="上客时间">
                    上客时间
                  </label>
                </div>
                <div className="ant-col ant-form-item-control">
                  <div className="ant-form-item-control-input">
                    <div
                      className="ant-form-item-control-input-content"
                      title={flight.boardingTime}
                    >
                      {getDayTimeFromString(flight.boardingTime, "", 2)}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                  <label className="ant-form-item-no-colon" title="关门时间">
                    关门时间
                  </label>
                </div>
                <div className="ant-col ant-form-item-control">
                  <div className="ant-form-item-control-input">
                    <div
                      className="ant-form-item-control-input-content"
                      title={flight.rCldtime}
                    >
                      {getDayTimeFromString(flight.rCldtime, "", 2)}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Fragment>
      )}
      <Row className="info-row">
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="实际起飞时间">
                实际起飞时间
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={flight.rCldtime}
                >
                  {getDayTimeFromString(flight.rCldtime, "", 2)}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="ant-row ant-form-item">
            <div className="ant-col ant-form-item-label ant-form-item-label-left">
              <label className="ant-form-item-no-colon" title="实际降落时间">
                实际降落时间
              </label>
            </div>
            <div className="ant-col ant-form-item-control">
              <div className="ant-form-item-control-input">
                <div
                  className="ant-form-item-control-input-content"
                  title={flight.rCldtime}
                >
                  {getDayTimeFromString(flight.rCldtime, "", 2)}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default inject("flightDetailData")(observer(FlightInfo));
