/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-05-12 18:39:25
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: WN-ATOM\src\components\FlightDetail\FlightDetail.jsx
 */
import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  Collapse,
  Form,
  Space,
  Card,
  Row,
  Col,
  Checkbox,
  DatePicker,
  Tabs,
  Radio,
  Tooltip,
} from "antd";
import { inject, observer } from "mobx-react";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { FlightCoordination } from "utils/flightcoordination";
import {
  isValidObject,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
import DraggableModal from "components/DraggableModal/DraggableModal";
import FlightInfo from "./FlightInfo";
import FormerInfo from "./FormerInfo";
import OperationalAnalysisInfo from "./OperationalAnalysisInfo";
import PositionRunwayDeiceInfo from "./PositionRunwayDeiceInfo";
import TrackInfo from "./TrackInfo";
import CoordinationInfo from "./CoordinationInfo";
import SchemeInfo from "./SchemeInfo";
import CoordinationRecord from "./CoordinationRecord";
import ElectronicProcessInfo from "./ElectronicProcessInfo";
import ACDMGroundOperationInfo from "./ACDMGroundOperationInfo";
import ACDMOtherInfo from "./ACDMOtherInfo";
import "./FlightDetail.scss";

const { Panel } = Collapse;

//航班详情
const FlightDetail = (props) => {
  const { flightDetailData } = props;
  const { modalVisible, flightData = {}, id = "" } = flightDetailData;
  const flight = flightData.flight || {};
  const generateTime = flightData.generateTime || "";
  // 关闭航班详情
  const closeModal = () => {
    flightDetailData.toggleModalVisible(false);
  };

  //获取航班详情数据
  const getDetailData = async () => {
    if (isValidVariable(id)) {
      const flightId = flight.id || "";
      const res = await requestGet2({
        url: ReqUrls.getFlightDetailUrl + id,
      });
      flightDetailData.updateFlightDetailData(res);
    } else {
      alert("未获取到航班信息");
    }
  };

  // 初始化用户信息
  useEffect(
    function () {
      if (modalVisible) {
        getDetailData();
      }
    },
    [modalVisible]
  );
  return (
    <DraggableModal
      title="航班详情"
      style={{ top: "100px", left: "0px" }}
      visible={modalVisible}
      handleOk={() => {}}
      handleCancel={() => {
        closeModal();
      }}
      width={1600}
      maskClosable={false}
      mask={false}
      className="flight-detail-modal"
      // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
      destroyOnClose={true}
      footer={""}
    >
      {modalVisible && isValidVariable(flightData.flight) && (
        <div className="flight-detail">
          <Row gutter={12} className="flight-info">
            <Col span={24}>
              <Space wrap align="center" size={16}>
                <div className="info-item" title={`ID:${flight.id}`}>
                  ID:{flight.id}
                </div>
                <div className="info-item" title={`航班号:${flight.flightId}`}>
                  {flight.flightId}
                </div>
                <div
                  className="info-item"
                  title={`执行日期:${flight.executeDate}`}
                >
                  {flight.executeDate}
                </div>
                <div
                  className="info-item"
                  title={`起降机场:${flight.depAp}-${flight.arrAp}`}
                >
                  {flight.depAp}-{flight.arrAp}
                </div>
                <div className="info-item" title={`状态:${flight.status}`}>
                  {FlightCoordination.getStatusZh(flight.status)}
                </div>
                <div className="info-item" title={`数据时间:${generateTime}`}>
                  数据时间:{formatTimeString(generateTime)}
                </div>
              </Space>
            </Col>
          </Row>
          <Form className="flight-detail-form" colon={false} labelAlign="left">
            <Row gutter={12}>
              <Col span={12}>
                <Collapse
                  defaultActiveKey={[
                    "info",
                    "formerInfo",
                    "operationalAnalysisInfo",
                    "trackInfo",
                  ]}
                >
                  <Panel
                    className="collapse-content-box"
                    showArrow={false}
                    header="航班信息"
                    key="info"
                  >
                    <FlightInfo />
                    {/* <PositionRunwayDeiceInfo /> */}
                  </Panel>
                  <Panel
                    showArrow={false}
                    header="前段航班信息"
                    key="formerInfo"
                  >
                    {/* <FormerInfo type="former"></FormerInfo> */}
                    <FlightInfo type="former"></FlightInfo>
                    {/* <PositionRunwayDeiceInfo /> */}
                  </Panel>
                  {/* <Panel
              showArrow={false}
              header="运行分析信息"
              key="operationalAnalysisInfo"
            >
              <OperationalAnalysisInfo></OperationalAnalysisInfo>
            </Panel> */}
                  <Panel showArrow={false} header="航迹信息" key="trackInfo">
                    <TrackInfo />
                  </Panel>
                </Collapse>
              </Col>
              <Col span={12}>
                <Collapse
                  showArrow={false}
                  defaultActiveKey={[
                    "positionRunwayDeiceInfo",
                    "coordinationInfo",
                    "schemeInfo",
                    "coordinationRecord",
                    "electronicProcessInfo",
                    "ACDMGroundOperationInfo",
                    "ACDMOtherInfo",
                  ]}
                >
                  <Panel
                    showArrow={false}
                    header="机位&跑道&除冰信息"
                    key="positionRunwayDeiceInfo"
                  >
                    <PositionRunwayDeiceInfo />
                  </Panel>
                  {/* <Panel
              showArrow={false}
              header="协调信息"
              key="coordinationInfo"
            >
              <CoordinationInfo />
            </Panel> */}
                  <Panel showArrow={false} header="命中方案" key="schemeInfo">
                    <SchemeInfo />
                  </Panel>
                  <Panel
                    showArrow={false}
                    header="协调记录"
                    key="coordinationRecord"
                  >
                    <CoordinationRecord />
                  </Panel>
                  <Panel
                    showArrow={false}
                    header="电子进程单"
                    key="electronicProcessInfo"
                  >
                    <ElectronicProcessInfo />
                  </Panel>
                  <Panel
                    showArrow={false}
                    header="A-CDM地面运行保障信息"
                    key="ACDMGroundOperationInfo"
                  >
                    <ACDMGroundOperationInfo />
                  </Panel>
                  <Panel
                    showArrow={false}
                    header="A-CDM其他信息"
                    key="ACDMOtherInfo"
                  >
                    <ACDMOtherInfo />
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </DraggableModal>
  );
};

export default inject("flightDetailData")(observer(FlightDetail));
