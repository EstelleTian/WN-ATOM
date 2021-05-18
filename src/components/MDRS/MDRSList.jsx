/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-05-17 17:29:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\MDRS\MSRSForm.jsx
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { Radio, Row, Col, Input, InputNumber, Form, Button } from "antd";
import ModalBox from "components/ModalBox/ModalBox";
import CustomDate from "components/Common/CustomDate";
import { ReqUrls } from "utils/request-urls.js";
import { formatTimeString } from "utils/basic-verify.js";
import { customNotice } from "utils/common-funcs";
import { request2 } from "utils/request.js";
import MDRSOptionBtns from "./MDRSOptionBtns";
import { OptionBtn } from "components/Common/OptionBtn";
import "./MDRSForm.scss";

//预警级别
const LevelOptions = [
  { label: "黄", value: "YELLOW" },
  { label: "橙", value: "ORANGE" },
  { label: "红", value: "RED" },
];
//原因类型预警
const TypeOptions = [
  { label: "天气", value: "WHEATHER" },
  { label: "军事", value: "MILITARY" },
  { label: "机场", value: "AIRPORT" },
  { label: "航空公司", value: "AIRLINE" },
  { label: "其他", value: "OTHER" },
];
//MDRS-列表模块
function mdrsList(props) {
  const {
    airport,
    MDRSData: { publishData = [] },
  } = props;
  //TODO 测试用
  // let update = true;

  // console.log("alarmlevel", alarmlevel);
  return (
    <Fragment>
      {publishData.map((item) => {
        const {
          validperiodbegin,
          validperiodend,
          trafficcapacity,
          alarmlevel,
          alarmtype,
          alarmreason,
          effectiveStatus,
        } = item;
        const startTime = formatTimeString(validperiodbegin);
        const endTime = formatTimeString(validperiodend);
        return (
          <ModalBox
            key={item.id}
            title={`${airport} MDRS预警信息-已发布`}
            showDecorator={false}
            className="mdrs_form_modal mdrs_detail_modal"
          >
            <div className="step_btn">
              {effectiveStatus === "未生效" && (
                <OptionBtn
                  type="reback"
                  //   size="small"
                  text="终止"
                  callback={(setLoad) => {
                    // sendResultRequest("reback", setLoad);
                  }}
                />
              )}
            </div>
            <div className="form_content">
              <Row gutter={24} className="line_row">
                <Col span={5} className="line_title">
                  生效时间：
                </Col>
                <Col span={18} className="line_cont">
                  <span>{startTime}</span>
                  <span
                    style={{
                      padding: "0 7px 0px",
                      position: "relative",
                      top: "-1px",
                    }}
                  >
                    ——
                  </span>
                  <span>{endTime}</span>
                </Col>
              </Row>
              <Row gutter={24} className="line_row">
                <Col span={5} className="line_title">
                  通行能力下降：
                </Col>
                <Col span={18} className="line_cont">
                  <div>{trafficcapacity}%</div>
                </Col>
              </Row>
              <Row gutter={24} className="line_row">
                <Col span={5} className="line_title">
                  预警级别：
                </Col>
                <Col span={18}>
                  <Radio.Group
                    className="level_radio_group"
                    value={alarmlevel}
                    disabled={true}
                    options={LevelOptions}
                  ></Radio.Group>
                </Col>
              </Row>
              <Row gutter={24} className="line_row">
                <Col span={5} className="line_title">
                  原因类型预警：
                </Col>
                <Col span={18}>
                  <Radio.Group
                    className="reason_type_radio_group"
                    value={alarmtype}
                    disabled={true}
                    options={TypeOptions}
                  ></Radio.Group>
                </Col>
              </Row>
              <Row
                gutter={24}
                className="line_row"
                style={{ position: "relative" }}
              >
                <Col span={5} className="line_title">
                  预警原因：
                </Col>
                <Col span={18} className="line_cont">
                  <div>{alarmreason || "无"}</div>
                </Col>
              </Row>
            </div>
          </ModalBox>
        );
      })}
    </Fragment>
  );
}
const MDRSList = inject("MDRSData")(observer(mdrsList));

export default MDRSList;
