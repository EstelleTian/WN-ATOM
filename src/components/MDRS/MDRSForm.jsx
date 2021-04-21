/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-04-20 17:26:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\MDRS\MSRSForm.jsx
 */
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Radio, Row, Col, Input, InputNumber, Form, Button } from "antd";
import ModalBox from "components/ModalBox/ModalBox";
import CustomDate from "components/Common/CustomDate";
import "./MDRSForm.scss";

//MDRS模块
function MDRSDetail() {
  const passageCapacity = 25;
  const reason = "22222";
  return (
    <ModalBox
      title={`ZLXY MDRS预警信息`}
      showDecorator={false}
      className="mdrs_form_modal mdrs_detail_modal"
    >
      <div className="form_content">
        <Row gutter={24} className="line_row">
          <Col span={5} className="line_title">
            生效时间：
          </Col>
          <Col span={18} className="line_cont">
            <span>2021-4-22 08:00</span>
            <span>——</span>
            <span>2021-4-22 18:00</span>
          </Col>
        </Row>
        <Row gutter={24} className="line_row">
          <Col span={5} className="line_title">
            通行能力下降：
          </Col>
          <Col span={18} className="line_cont">
            <div>{passageCapacity}%</div>
          </Col>
        </Row>
        <Row gutter={24} className="line_row">
          <Col span={5} className="line_title">
            预警级别：
          </Col>
          <Col span={18}>
            <Radio.Group
              className="level_radio_group"
              defaultValue={1}
              disabled={true}
            >
              <Radio value={1}>
                <span className="level_label level_1">黄</span>
              </Radio>
              <Radio value={2}>
                <span className="level_label level_2">橙</span>
              </Radio>
              <Radio value={3}>
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
              defaultValue={1}
              disabled={true}
            >
              <Radio value={1}>
                <span className="level_label">天气</span>
              </Radio>
              <Radio value={2}>
                <span className="level_label">军事</span>
              </Radio>
              <Radio value={3}>
                <span className="level_label">机场</span>
              </Radio>
              <Radio value={4}>
                <span className="level_label">航空公司</span>
              </Radio>
              <Radio value={5}>
                <span className="level_label">其他</span>
              </Radio>
            </Radio.Group>
          </Col>
        </Row>

        <Row gutter={24} className="line_row">
          <Col span={5} className="line_title">
            预警原因：
          </Col>
          <Col span={18} className="line_cont">
            <div>{reason}</div>
          </Col>
        </Row>
      </div>
    </ModalBox>
  );
}

//MDRS模块
function MDRSForm() {
  const [form] = Form.useForm();
  const [load, setLoading] = useState(false);
  const [dateForm, setDateForm] = useState({});

  //表单提交
  const handleSave = async () => {
    setLoading(true);
    try {
      const dateValues = await dateForm.validateFields();
      let startDateString = moment(dateValues.startDate).format("YYYYMMDD");
      let endDateString = moment(dateValues.endDate).format("YYYYMMDD");
      const values = await form.validateFields();
      let formValues = {
        ...values,
        startDate: startDateString,
        startTime: dateValues.startTime,
        endDate: endDateString,
        endTime: dateValues.endTime,
      };
      console.log(formValues);
      setLoading(false);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      setLoading(false);
    }
  };
  return (
    <ModalBox
      title={`ZLXY MDRS预警信息`}
      showDecorator={false}
      className="mdrs_form_modal"
    >
      <div className="form_content">
        <Row gutter={24} className="line_row">
          <Col span={5} className="line_title">
            生效时间：
          </Col>
          <Col span={18}>
            <CustomDate setDateForm={setDateForm} />
          </Col>
        </Row>
        <Form
          form={form}
          initialValues={{
            passageCapacity: 25,
            level: 1,
            reasonType: 1,
            reason: "",
          }}
          onFinish={(values) => {
            console.log(values);
          }}
          className="custom_date_form"
        >
          <Row gutter={24} className="line_row">
            <Col span={5} className="line_title">
              通行能力下降：
            </Col>
            <Col span={18}>
              <Form.Item
                name="passageCapacity"
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
              <Form.Item name="level">
                <Radio.Group className="level_radio_group">
                  <Radio value={1}>
                    <span className="level_label level_1">黄</span>
                  </Radio>
                  <Radio value={2}>
                    <span className="level_label level_2">橙</span>
                  </Radio>
                  <Radio value={3}>
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
              <Form.Item name="reasonType">
                <Radio.Group className="reason_type_radio_group">
                  <Radio value={1}>
                    <span className="level_label">天气</span>
                  </Radio>
                  <Radio value={2}>
                    <span className="level_label">军事</span>
                  </Radio>
                  <Radio value={3}>
                    <span className="level_label">机场</span>
                  </Radio>
                  <Radio value={4}>
                    <span className="level_label">航空公司</span>
                  </Radio>
                  <Radio value={5}>
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
              <Form.Item name="reason">
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
                保存
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </ModalBox>
  );
}

export { MDRSForm, MDRSDetail };
