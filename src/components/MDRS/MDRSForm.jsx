/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-04-22 20:00:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\MDRS\MSRSForm.jsx
 */
import React, { useEffect, useState, useRef } from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { Radio, Row, Col, Input, InputNumber, Form, Button } from "antd";
import ModalBox from "components/ModalBox/ModalBox";
import CustomDate from "components/Common/CustomDate";
import { ReqUrls } from "utils/request-urls.js";
import { formatTimeString } from "utils/basic-verify.js";
import { customNotice } from "utils/common-funcs";
import { request2 } from "utils/request.js";
import "./MDRSForm.scss";

//MDRS-详情模块
function DetailModule(props) {
  const {
    airport,
    MDRSData: { formData = {}, authMap = {} },
  } = props;
  // let update = authMap["UPDATE"] || false;
  //TODO 测试用
  let update = true;
  const {
    validperiodbegin,
    validperiodend,
    trafficcapacity,
    alarmlevel,
    alarmtype,
    alarmreason,
  } = formData;
  const startTime = formatTimeString(validperiodbegin);
  const endTime = formatTimeString(validperiodend);
  // console.log("alarmlevel", alarmlevel);
  return (
    <ModalBox
      title={`${airport} MDRS预警信息`}
      showDecorator={false}
      className="mdrs_form_modal mdrs_detail_modal"
    >
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
            >
              <Radio value={"YELLOW"}>
                <span className="level_label level_1">黄</span>
              </Radio>
              <Radio value={"ORANGE"}>
                <span className="level_label level_2">橙</span>
              </Radio>
              <Radio value={"RED"}>
                <span className="level_label level_3">红</span>
              </Radio>
            </Radio.Group>
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
            >
              <Radio value="WHEATHER">
                <span className="level_label">天气</span>
              </Radio>
              <Radio value="MILITARY">
                <span className="level_label">军事</span>
              </Radio>
              <Radio value="AIRPORT">
                <span className="level_label">机场</span>
              </Radio>
              <Radio value="AIRLINE">
                <span className="level_label">航空公司</span>
              </Radio>
              <Radio value="OTHER">
                <span className="level_label">其他</span>
              </Radio>
            </Radio.Group>
          </Col>
        </Row>

        <Row gutter={24} className="line_row" style={{ position: "relative" }}>
          <Col span={5} className="line_title">
            预警原因：
          </Col>
          <Col span={18} className="line_cont">
            <div>{alarmreason || "无"}</div>
          </Col>
          {update && (
            <Button
              className="c-btn-blue edit_btn"
              onClick={() => {
                props.MDRSData.setEditable(true);
              }}
            >
              编辑
            </Button>
          )}
        </Row>
      </div>
    </ModalBox>
  );
}
const MDRSDetail = inject("MDRSData")(observer(DetailModule));

//MDRS-表单模块
function FormModule(props) {
  const [form] = Form.useForm();
  const [load, setLoading] = useState(false);
  const [dateForm, setDateForm] = useState({});
  const {
    airport,
    MDRSData: { formData = {} },
  } = props;
  const {
    validperiodbegin,
    validperiodend,
    trafficcapacity,
    alarmlevel,
    alarmtype,
    alarmreason,
  } = formData;
  const startDate = moment(validperiodbegin, "YYYY-MM-DD");
  const startTime = validperiodbegin.substring(8, 12);
  const endDate = moment(validperiodend, "YYYY-MM-DD");
  const endTime = validperiodend.substring(8, 12);
  // console.log("startDate", startDate);
  //表单提交
  const handleSave = async () => {
    setLoading(true);
    try {
      const dateValues = await dateForm.validateFields();
      let startDateString = moment(dateValues.startDate).format("YYYYMMDD");
      let endDateString = moment(dateValues.endDate).format("YYYYMMDD");
      const values = await form.validateFields();
      let formValues = {
        ...formData,
        ...values,
        validperiodbegin: startDateString + dateValues.startTime,
        validperiodend: endDateString + dateValues.endTime,
        // airport,
      };
      console.log(formValues);
      //发送修改请求
      try {
        const res = await request2({
          url: ReqUrls.mdrsUpdateDataUrl,
          method: "POST",
          params: formValues,
        });
        customNotice({
          type: "success",
          message: "MDRS预警信息修改成功",
        });
        console.log("保存成功：", res);
        setLoading(false);
        props.MDRSData.setEditable(false);
      } catch (err) {
        customNotice({
          type: "error",
          message: "MDRS预警信息修改失败",
        });
        setLoading(false);
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      setLoading(false);
    }
  };
  return (
    <ModalBox
      title={`${airport} MDRS预警信息`}
      showDecorator={false}
      className="mdrs_form_modal"
    >
      <div className="form_content">
        <Row gutter={24} className="line_row">
          <Col span={5} className="line_title">
            生效时间：
          </Col>
          <Col span={18}>
            <CustomDate
              setDateForm={setDateForm}
              initialDatas={{
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
              }}
            />
          </Col>
        </Row>
        <Form
          form={form}
          initialValues={{
            trafficcapacity,
            alarmlevel,
            alarmtype: alarmtype || "WHEATHER",
            alarmreason,
          }}
          className="custom_date_form"
        >
          <Row gutter={24} className="line_row">
            <Col span={5} className="line_title">
              通行能力下降：
            </Col>
            <Col span={18}>
              <Form.Item
                name="trafficcapacity"
                rules={[
                  { required: true, message: "请输入通行能力" },
                  {
                    pattern: /^(100|[1-9]\d?)$/g,
                    message: "请输入1-100的值",
                  },
                ]}
              >
                <InputNumber
                  className="passageCapacity_item"
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} className="line_row">
            <Col span={5} className="line_title">
              预警级别：
            </Col>
            <Col span={18}>
              <Form.Item name="alarmlevel">
                <Radio.Group className="level_radio_group">
                  <Radio value={"YELLOW"}>
                    <span className="level_label level_1">黄</span>
                  </Radio>
                  <Radio value={"ORANGE"}>
                    <span className="level_label level_2">橙</span>
                  </Radio>
                  <Radio value={"RED"}>
                    <span className="level_label level_3">红</span>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} className="line_row">
            <Col span={5} className="line_title">
              原因类型预警：
            </Col>
            <Col span={18}>
              <Form.Item name="alarmtype">
                <Radio.Group className="reason_type_radio_group">
                  <Radio value="WHEATHER">
                    <span className="level_label">天气</span>
                  </Radio>
                  <Radio value="MILITARY">
                    <span className="level_label">军事</span>
                  </Radio>
                  <Radio value="AIRPORT">
                    <span className="level_label">机场</span>
                  </Radio>
                  <Radio value="AIRLINE">
                    <span className="level_label">航空公司</span>
                  </Radio>
                  <Radio value="OTHER">
                    <span className="level_label">其他</span>
                  </Radio>
                </Radio.Group>
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
              <Button
                // size={size}
                loading={load}
                className="c-btn-blue save_btn"
                onClick={handleSave}
              >
                保存修改
              </Button>
              <Button
                className=" un_edit_btn"
                onClick={() => {
                  props.MDRSData.setEditable(false);
                }}
              >
                取消编辑
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </ModalBox>
  );
}
const MDRSForm = inject("MDRSData")(observer(FormModule));
export { MDRSForm, MDRSDetail };
