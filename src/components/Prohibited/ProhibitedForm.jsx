/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-26 15:30:26
 * @LastEditors: Please set LastEditors
 * @Description: 禁航信息-添加、修改表单
 * @FilePath: \WN-ATOM\src\components\NavBar\PositionModal.jsx
 */
import React, {
  Fragment,
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import { Modal, Form, Input, Button, Row, Col, Checkbox } from "antd";
import moment from "moment";
import { inject, observer } from "mobx-react";
import {
  getFullTime,
  getDayTimeFromString,
  isValidVariable,
  formatTimeString,
  isValidObject,
} from "utils/basic-verify";
import { request2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import { CustomDate, convertToFormData } from "components/Common/CustomDate";
import DraggableModal from "components/DraggableModal/DraggableModal";

const ProhibitedForm = (props) => {
  const [airportForm] = Form.useForm();
  const [statusForm] = Form.useForm();
  const [dateForm, setDateForm] = useState({});
  const { systemPage = {}, prohibitedData = {} } = props;

  // 用户信息
  const user = systemPage.user || {};
  let userId = user.id || "";

  const hideModal = () => {
    prohibitedData.setUpdateInfoModalVisible(false);
  };

  const handleConfirm = async () => {
    // 触发表单验证获取取表单数据
    const airportFormValues = await airportForm.validateFields();
    const { unit = "" } = airportFormValues;
    const statusFormValues = await statusForm.validateFields();
    const { status } = statusFormValues;
    const dateFormValues = await dateForm.validateFields();
    const { startDate, endDate, startTime, endTime } = dateFormValues;

    // 表单提交-开始时间
    let startTimeStr =
      isValidVariable(moment(startDate).format("YYYYMMDDHHmm")) &&
      isValidVariable(startTime)
        ? moment(startDate).format("YYYYMMDDHHmm").substring(0, 8) + startTime
        : "";
    // 表单提交-结束时间
    let endTimeStr =
      isValidVariable(moment(endDate).format("YYYYMMDDHHmm")) &&
      isValidVariable(endTime)
        ? moment(endDate).format("YYYYMMDDHHmm").substring(0, 8) + endTime
        : "";
    const defaultFormData = prohibitedData.formData || {};

    let params = {
      id: defaultFormData.id || "",
      unit: unit.toUpperCase(),
      startTime: startTimeStr,
      endTime: endTimeStr,
      status: status ? 1 : 0,
      userId: userId,
      unitType: "AIRPORT",
      source: 1,
    };
    try {
      const res = await request2({
        url: ReqUrls.updateNoTamDataUrl,
        params: [params],
      });
      //刷新列表
      prohibitedData.setForceUpdate(true);
      // 关闭页面
      prohibitedData.setUpdateInfoModalVisible(false);
    } catch (e) {
      customNotice({
        type: "error",
        content: "保存禁航信息失败:" + e,
      });
    }
  };

  useEffect(() => {
    if (prohibitedData.updateInfoModalVisible && isValidObject(dateForm)) {
      const defaultFormData = prohibitedData.formData || {};
      // console.log(defaultFormData);
      let formStatus = defaultFormData.status;
      let defaultStatus = true;
      if (formStatus !== 1) {
        defaultStatus = false;
      }
      if (prohibitedData.formType === "update") {
        airportForm.setFieldsValue({ unit: defaultFormData.unit || "" });
        statusForm.setFieldsValue({ status: defaultStatus });
        const dateValues = convertToFormData(
          defaultFormData.startTime,
          defaultFormData.endTime
        );
        dateForm.setFieldsValue(dateValues);
      } else if (prohibitedData.formType === "add") {
        airportForm.setFieldsValue({ unit: "" });
        statusForm.setFieldsValue({ status: true });
        const dateValues = convertToFormData("", "");
        dateForm.setFieldsValue(dateValues);
      }
    }
  }, [prohibitedData.formData, dateForm]);

  return (
    <DraggableModal
      title={`禁航信息${
        prohibitedData.formType === "add"
          ? "添加"
          : prohibitedData.formType === "update"
          ? "修改"
          : ""
      }`}
      style={{ top: "240px", right: "1080px", float: "right" }}
      visible={prohibitedData.updateInfoModalVisible}
      handleOk={() => {}}
      handleCancel={hideModal}
      width={800}
      maskClosable={false}
      mask={false}
      destroyOnClose={true}
      footer={""}
    >
      <div className="prohibited_form">
        <Form
          form={airportForm}
          initialValues={{ unit: prohibitedData.formData.unit }}
        >
          <Row gutter={24} className="">
            <Col span={4} className="line_title">
              机场：
            </Col>
            <Col span={10}>
              <Form.Item name="unit">
                <Input className="text-uppercase"></Input>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row gutter={24} className="">
          <Col span={4} className="line_title">
            起止时间：
          </Col>
          <Col span={20}>
            <CustomDate setDateForm={setDateForm} />
          </Col>
        </Row>
        <Form
          form={statusForm}
          initialValues={{
            status: prohibitedData.formData.status === 1 ? true : false,
          }}
        >
          <Row gutter={24} className="line_row">
            <Col span={4} className="line_title"></Col>
            <Col span={20}>
              <Form.Item name="status" valuePropName="checked">
                <Checkbox>立即启用</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div className="btns">
          <Button
            // size="small"
            className="todo_opt_btn c-btn-blue"
            onClick={handleConfirm}
          >
            保存
          </Button>
        </div>
      </div>
    </DraggableModal>
  );
};
export default inject("systemPage", "prohibitedData")(observer(ProhibitedForm));
