/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-05-18 17:44:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\MDRS\MSRSForm.jsx
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";
import {
  Radio,
  Row,
  Col,
  Input,
  InputNumber,
  Form,
  Button,
  Popconfirm,
} from "antd";
import ModalBox from "components/ModalBox/ModalBox";
import CustomDate from "components/Common/CustomDate";
import { ReqUrls } from "utils/request-urls.js";
import {
  getFullTime,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
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
function mdrsItem(props) {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputDom = useRef();
  const { item = {}, airport = "" } = props;
  const {
    validperiodbegin = "",
    validperiodend = "",
    trafficcapacity = "",
    alarmlevel = "",
    alarmtype = "",
    alarmreason = "",
    effectiveStatus,
  } = item;
  const startTime = formatTimeString(validperiodbegin);
  const endTime = formatTimeString(validperiodend);
  //处理 操作 同意/拒绝
  const sendTerminalRequest = async (type, item) => {
    const userStr = localStorage.getItem("user");
    let user = JSON.parse(userStr);
    const { username = "" } = user;
    if (!isValidVariable(username)) {
      return;
    }
    // const mdrsId = props.formData.id || ""; //MDRS预警数据主键ID
    let url = "";
    let params = item || {};
    let title = "";
    //申请-终止
    if (type === "apply") {
      setConfirmLoading(true);
      url = ReqUrls.mdrsTerminalWorkFlowUrl + "/" + username + "/APPLY";
      title = "MDRS【终止】操作";
      params["earlyTerminationReason"] = inputVal;
    }

    // console.log("type", type, params, inputVal);
    // return;
    try {
      const res = await request2({
        url,
        method: "POST",
        params: params,
      });
      customNotice({
        type: "success",
        message: title + "成功",
        duration: 8,
      });
      // const { result = [], generateTime = "" } = res;
      console.log(res);
      props.MDRSData.setForceUpdate(true);
    } catch (err) {
      if (isValidVariable(err)) {
        customNotice({
          type: "error",
          message: err,
        });
      } else {
        customNotice({
          type: "error",
          message: title + "失败",
        });
      }
    }
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const onChange = (e) => {
    setInputVal(e.target.value);
  };
  const showPopconfirm = () => {
    setVisible(true);
  };
  return (
    <ModalBox
      title={`${airport} MDRS预警信息-${effectiveStatus}`}
      showDecorator={false}
      className="mdrs_form_modal mdrs_detail_modal"
    >
      <div className="step_btn">
        {effectiveStatus === "未生效" && (
          <Popconfirm
            title={
              <div>
                <div style={{ fontSize: "1.2rem" }}>请输入原因:</div>
                <Input.TextArea
                  size="small"
                  maxLength={100}
                  showCount={true}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  value={inputVal}
                  onChange={onChange}
                  style={{
                    width: "300px",
                    marginTop: "0.5rem",
                  }}
                />
              </div>
            }
            visible={visible}
            onConfirm={(e) => {
              sendTerminalRequest("apply", item);
            }}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleCancel}
            overlayClassName="capacity-popconfirm"
          >
            <Button
              className="todo_opt_btn todo_reback c-btn-red"
              type="primary"
              onClick={showPopconfirm}
            >
              终止
            </Button>
          </Popconfirm>
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
        <Row gutter={24} className="line_row" style={{ position: "relative" }}>
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
}
const MDRSItem = inject("MDRSData")(observer(mdrsItem));
//MDRS-列表模块
function mdrsList(props) {
  const {
    airport,
    MDRSData: { publishData = [] },
  } = props;

  return (
    <Fragment>
      {publishData.map((item) => (
        <MDRSItem key={item.id} item={item} airport={airport} />
      ))}
    </Fragment>
  );
}
const MDRSList = inject("MDRSData")(observer(mdrsList));

export default MDRSList;
