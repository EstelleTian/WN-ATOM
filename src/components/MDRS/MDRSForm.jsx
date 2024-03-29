/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-05-18 18:20:56
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
//MDRS-详情模块
function DetailModule(props) {
  const [form] = Form.useForm();
  const {
    airport,
    MDRSData: { formData = {}, authMap = {} },
  } = props;
  let update = authMap["UPDATE"] || false;
  //TODO 测试用
  // let update = true;
  const {
    validperiodbegin = "",
    validperiodend = "",
    trafficcapacity = "",
    alarmlevel = "",
    alarmtype = "",
    alarmreason = "",
    effectiveStatus = "",
    earlyTerminationReason = "",
  } = formData;
  const startTime = formatTimeString(validperiodbegin);
  const endTime = formatTimeString(validperiodend);
  // console.log("alarmlevel", alarmlevel);
  return (
    <ModalBox
      title={`${airport} MDRS预警信息-${effectiveStatus}`}
      showDecorator={false}
      className={`${update ? "mdrs_form_modal" : "mdrs_detail_modal"} ${
        effectiveStatus === "提前终止" && "mdrs_terminal_modal"
      }`}
    >
      <MDRSOptionBtns form={form} />
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
        {update ? (
          <Form
            form={form}
            initialValues={{
              alarmtype: alarmtype || "WHEATHER",
              alarmreason,
            }}
            className="custom_date_form"
          >
            <Row gutter={24} className="line_row">
              <Col span={5} className="line_title">
                原因类型预警：
              </Col>
              <Col span={18}>
                <Form.Item name="alarmtype">
                  <Radio.Group
                    className="reason_type_radio_group"
                    options={TypeOptions}
                  ></Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24} className="line_row">
              <Col span={5} className="line_title">
                预警原因：
              </Col>
              <Col span={18}>
                <Form.Item name="alarmreason">
                  <Input.TextArea
                    className="reason_text"
                    maxLength={100}
                    showCount={true}
                    autoSize={{ minRows: 4, maxRows: 4 }}
                  ></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            {effectiveStatus === "提前终止" && (
              <Row
                gutter={24}
                className="line_row"
                style={{ marginTop: "22px" }}
              >
                <Col span={5} className="line_title">
                  终止原因：
                </Col>
                <Col span={18}>
                  <Form.Item name="earlyTerminationReason">
                    <Input.TextArea
                      className="reason_text"
                      maxLength={100}
                      showCount={true}
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form>
        ) : (
          <Fragment>
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
                终止原因：
              </Col>
              <Col span={18} className="line_cont">
                <div>{earlyTerminationReason || "无"}</div>
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
          </Fragment>
        )}
      </div>
    </ModalBox>
  );
}
const MDRSDetail = inject("MDRSData")(observer(DetailModule));

export default MDRSDetail;
