/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2021-06-07 15:05:44
 * @LastEditors: Please set LastEditors
 * @Description: 航班查询
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, { useState, useEffect, useCallback } from "react";
import { observer, inject } from "mobx-react";
import { ReqUrls } from "utils/request-urls";
import { requestGet2 } from "utils/request";
import {
  getDayTimeFromString,
  formatTimeString,
  isValidObject,
  isValidVariable,
} from "utils/basic-verify";
import { FlightCoordination, reasonType } from "utils/flightcoordination";

import {
  List,
  Divider,
  Icon,
  Form,
  Drawer,
  Tooltip,
  Tag,
  Row,
  Col,
  Tabs,
} from "antd";

import "./FlightSearch.scss";

const { TabPane } = Tabs;
//单个航班略情展示
const FlightSummer = (props) => {
  const { flightDetailData, flightTableData } = props;
  // 略情激活航班id
  const drawerFlightId = flightDetailData.drawerFlightId || "";

  const res = flightDetailData.getFlightBySelectedId() || {};
  const { flight = {}, formerFlight = {} } = res;

  /**
   * 关闭单个航班信息抽屉
   * */
  const closeDrawer = useCallback(function () {
    flightDetailData.setDrawerVisible(false);
  });

  /**
   * 显示单个航班信息
   * */
  const showSingleFlightSummary = useCallback(function (flight) {
    flightTableData.focusFlightId = flight.id;
    // 更新航班略情抽屉中的航班数据
    flightDetailData.setDrawerFlightId(flight.id);
    flightDetailData.setDrawerVisible(true);
  });

  /**
   * 绘制单个航班命中方案列表中单个方案信息
   * */
  const drawSchemeItem = (data, index) => {
    let {
      id = "",
      tacticId = "",
      flowControlName = "",
      flowControlReason = "",
      flowControlMeasure = {},
      flowControlStatus = "",
    } = data;
    const restrictionMode = flowControlMeasure.restrictionMode || "";
    //限制值
    let interVal = "";
    if (restrictionMode === "MIT") {
      interVal = flowControlMeasure.restrictionMITValue || "";
    } else if (restrictionMode === "AFP") {
      interVal = flowControlMeasure.restrictionAFPValueSequence || "";
    }
    let status = FlightCoordination.getSchemeStatusZh(flowControlStatus);

    return (
      <List.Item
        className={""}
        key={tacticId}
        onClick={() => {
          // showSingleFlightSummary(item)
        }}
      >
        <Row>
          <Col span={10} title={`方案名称:${flowControlName}(ID${tacticId})`}>
            <div className="summer_tacticName">{flowControlName}</div>
          </Col>
          <Col span={3} title="类型">
            <div>{restrictionMode}</div>
          </Col>
          <Col span={3} title="限制值">
            <div>{interVal}</div>
          </Col>
          <Col span={4} title="原因">
            <div>{reasonType[flowControlReason] || ""}</div>
          </Col>
          <Col span={4} title="状态">
            <div>{status}</div>
          </Col>
        </Row>
      </List.Item>
    );
  };

  /**
   *  绘制航班略情数据
   * */
  const drawFlightSummerData = useCallback(function () {
    let formerFlight = flight.formerFlightObj || {};
    let DEPAP = flight.depAp || "N/A";
    let ARRAP = flight.arrAp || "N/A";
    const id = flight.id;
    const FLIGHTID = flight.flightId || "N/A";
    const AGCT = flight.agct || "";
    const AGCTHHmm = getDayTimeFromString(AGCT) || "N/A";
    const AOBT = flight.aobt || "";
    const COBT = flight.cobt || "";
    const TOBT = flight.tobt || "";
    const EOBT = flight.eobt || "";
    const ATD = flight.atd || "";
    const CTD = flight.ctd || "";
    const TTD = flight.ttd || "";
    const ETD = flight.etd || "";

    const ATOT = flight.atd || "";
    const ATOTHHmm = getDayTimeFromString(ATOT) || "N/A";
    const SOBT = flight.sobt || "";
    const SOBTHHmm = getDayTimeFromString(SOBT) || "N/A";
    const RWY = flight.runWay || "N/A";
    const SID = flight.SID || "N/A";
    const REG = flight.registeNum || "N/A";
    const ALDT = flight.ALDT || "N/A";
    const ACTYPE = flight.aCtype || "N/A";
    const STATUS = flight.status || "";
    const STATUSZH = FlightCoordination.getStatusZh(STATUS);
    const STATUSColor = "";

    let OBT = "N/A";
    let OBTTitle = "";
    if (isValidVariable(AOBT)) {
      OBTTitle = "AOBT";
      OBT = AOBT;
    } else if (isValidVariable(COBT)) {
      OBTTitle = "COBT";
      OBT = COBT;
    } else if (isValidVariable(TOBT)) {
      if (isValidVariable(EOBT)) {
        OBTTitle = "EOBT";
        var eobtVal = EOBT.substring(EOBT.length - 4);
        var tobtVal = TOBT.substring(TOBT.length - 4);
        var difValue = tobtVal - eobtVal;
        //TOBT大于 EOBT则显示EOBT加上 差值（作为角标）
        if (tobtVal > eobtVal) {
          OBT = EOBT;
        } else {
          OBT = TOBT;
        }
      }
    } else if (isValidVariable(EOBT)) {
      OBTTitle = "EOBT";
      OBT = EOBT;
    }
    let OBTHHmm = getDayTimeFromString(OBT) || "N/A";

    let TOT = "N/A";
    let TOTTitle = "";
    if (isValidVariable(ATD)) {
      TOTTitle = "ATOT";
      TOT = ATD;
    } else if (isValidVariable(CTD)) {
      TOTTitle = "CTOT";
      TOT = CTD;
    } else if (isValidVariable(TTD)) {
      TOTTitle = "TTOT";
      TOT = TTD;
    } else if (isValidVariable(ETD)) {
      TOTTitle = "ETOT";
      TOT = ETD;
    }
    let TOTHHmm = getDayTimeFromString(TOT) || "N/A";

    let FORMER = formerFlight.flightId || "N/A";
    let FORMERDEPAP = formerFlight.depAp || "N/A";
    let FORMERARRAP = formerFlight.arrAp || "N/A";

    const text = <span>{`查看航班详情`}</span>;

    const schemeListData = flight.flowcontrols || [];

    return (
      <div className="summary-container">
        <div className="flight-summary-section">
          <Form layout="vertical ">
            <Row className="summary-row">
              {/* <Col className="vertical-span" span={4}>
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input">
                      <div className="ant-form-item-control-input-content flight-id">
                        <div>{FLIGHTID}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col> */}
              <Col span={5}>
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-label" title="起降机场">
                    <label className="ant-form-item-no-colon">ADEP-ADES</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div className="ant-form-item-control-input-content text-center">{`${DEPAP}-${ARRAP}`}</div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={3}>
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-label" title="AGCT">
                    <label className="ant-form-item-no-colon">AGCT</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <Tooltip title={formatTimeString(AGCT)}>
                        <div className="ant-form-item-control-input-content">
                          {AGCTHHmm}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={3}>
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-label" title={OBTTitle}>
                    <label className="ant-form-item-no-colon">{OBTTitle}</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <Tooltip title={formatTimeString(OBT)}>
                        <div className="ant-form-item-control-input-content">
                          {OBTHHmm}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={3}>
                <div className="ant-row ant-form-item">
                  <div
                    className="ant-col ant-form-item-label "
                    title={TOTTitle}
                  >
                    <label className="ant-form-item-no-colon">{TOTTitle}</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <Tooltip title={formatTimeString(TOT)}>
                        <div className="ant-form-item-control-input-content">
                          {TOTHHmm}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={3}>
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-label " title="跑道">
                    <label className="ant-form-item-no-colon ">RWY</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div className="ant-form-item-control-input-content">
                        {RWY}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={3}>
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-label " title="SID">
                    <label className="ant-form-item-no-colon">SID</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div className="ant-form-item-control-input-content">
                        {SID}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="vertical-span" span={3}>
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div
                        className="ant-form-item-control-input-content"
                        title={STATUS}
                      >
                        <Tag className="flight-status-tag" color="#2db7f5">
                          {STATUSZH}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="summary-row">
              <Col className="vertical-span" span={5}>
                <div className="ant-row ant-form-item">
                  <div
                    className="ant-col ant-form-item-label"
                    title="前段航班号"
                  >
                    <label className="ant-form-item-no-colon">FORMER</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div className="ant-form-item-control-input-content">
                        {FORMER}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="ant-row ant-form-item">
                  <div
                    className="ant-col ant-form-item-label"
                    title="前段起降机场"
                  >
                    <label className="ant-form-item-no-colon">ADEP-ADES</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div className="ant-form-item-control-input-content">{`${FORMERDEPAP}-${FORMERARRAP}`}</div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={3}>
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-label " title="机型">
                    <label className="ant-form-item-no-colon">ACTYPE</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div className="ant-form-item-control-input-content">
                        {ACTYPE}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={3}>
                <div className="ant-row ant-form-item">
                  <div
                    className="ant-col ant-form-item-label "
                    title="本段机尾号"
                  >
                    <label className="ant-form-item-no-colon">REG</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div className="ant-form-item-control-input-content">
                        {REG}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={3}>
                <div className="ant-row ant-form-item">
                  <div
                    className="ant-col ant-form-item-label"
                    title="前段A/C/T/E LDT"
                  >
                    <label className="ant-form-item-no-colon">ALDT</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input ">
                      <div className="ant-form-item-control-input-content">
                        {ALDT}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="scheme-list-section">
          <Tabs type="card">
            <TabPane tab="命中流控" key="1">
              {schemeListData.length > 0 && (
                <List
                  itemLayout="horizontal"
                  size="small"
                  dataSource={schemeListData}
                  renderItem={drawSchemeItem}
                />
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  });

  // 显示航班详情
  const showFlightDetail = async () => {
    const flightId = flight.id || "";
    if (isValidVariable(flightId)) {
      flightDetailData.toggleModalVisible(true);
      try {
        const res = await requestGet2({
          url: ReqUrls.getFlightDetailUrl + flightId,
        });
        //航班详情赋值
        flightDetailData.toggleFlightId(flightId);
        flightDetailData.updateFlightDetailData(res);
      } catch (e) {
        customNotice({
          type: "error",
          message: e,
        });
      }
    }

    //关闭协调窗口popover
    if (typeof clearCollaboratePopoverData === "function") {
      clearCollaboratePopoverData();
    }
  };

  /**
   *  获取航班略情抽屉标题
   * */
  const getDrawerTitle = useCallback(function () {
    // const STATUS = flight.status;
    // const STATUSZH = FlightCoordination.getStatusZh(STATUS);
    return (
      <div>
        <span
          className="title-flight-id"
          style={{
            color: "#36a5da",
          }}
          onClick={(e) => {
            props.flightTableData.focusFlightId = flight.id;
            // 显示航班详情
            showFlightDetail();
          }}
        >
          {flight.flightId}
        </span>
        {/* <span>
          <Tag className="flight-status-tag" color="#2db7f5">
            {STATUSZH}
          </Tag>
        </span> */}
      </div>
    );
  });

  const convertSingleFlight = (flightData) => {
    let flight = flightData.flight || {};
    let formerFlight = flightData.formerFlight || {};
    let obj = {
      ...flight,
      formerFlightObj: formerFlight,
    };
    return obj;
  };

  // 航班略情抽屉标题
  const drawerTitle = getDrawerTitle();

  return (
    <Drawer
      destroyOnClose={true}
      className="flight-summary-drawer"
      title={drawerTitle}
      placement="right"
      closable={true}
      onClose={closeDrawer}
      visible={flightDetailData.drawerVisible}
      mask={false}
      getContainer={false}
      width="100%"
      style={{ position: "absolute" }}
    >
      {drawFlightSummerData()}
    </Drawer>
  );
};

export default inject(
  "flightTableData",
  "flightDetailData"
)(observer(FlightSummer));
