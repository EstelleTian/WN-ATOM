/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-19 16:25:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\PopoverTip.jsx
 */
import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  message,
  Popover,
  Button,
  Form,
  Descriptions,
  DatePicker,
  Input,
  Radio,
  Checkbox,
  Tooltip,
} from "antd";
import { observer, inject } from "mobx-react";
import { request } from "utils/request";
import { CollaborateUrl } from "utils/request-urls";
import { REGEXP } from "utils/regExpUtil";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import {
  isValidVariable,
  isValidObject,
  getFullTime,
} from "utils/basic-verify";
import { closePopover, cgreen, cred } from "utils/collaborateUtils.js";
import moment from "moment";
//popover和tip组合协调窗口
const FFixTCont = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, setRefuseBtnLoading] = useState(false);
  const [rightContShow, setRightContShow] = useState(false);

  const [form] = Form.useForm();
  const { collaboratePopoverData = {} } = props;
  const { data = {}, selectedObj = {} } = collaboratePopoverData;
  console.log(data);
  const { FLIGHTID = "", DEPAP = "", ARRAP = "" } = data;
  let orgDataStr = data.orgdata || "{}";
  let orgdata = JSON.parse(orgDataStr);
  let field = orgdata.ffixField || {};

  let time = "";
  let date = "";
  let source = field.source || "";
  let fieldValue = field.value || "";
  if (isValidVariable(fieldValue) && fieldValue.length >= 12) {
    time = fieldValue.substring(8, 12);
    date = moment(fieldValue.substring(0, 8), "YYYY-MM-DD");
  }

  let hasConfirmAuth = props.systemPage.userHasAuth(13440); //申请权限
  let hasRefuseAuth = props.systemPage.userHasAuth(13443); //撤销权限

  let initialValues = {
    flightid: FLIGHTID || "",
    airport: DEPAP + "-" + ARRAP,
    unit: "",
    locked: "",
    time,
    date,
    comment: "",
  };
  const onCheck = async (type) => {
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  useEffect(() => {
    if (
      isValidVariable(collaboratePopoverData.selectedObj) &&
      collaboratePopoverData.selectedObj.name === "FFIXT"
    ) {
      console.log("FFixTCont挂载");
      // form.setFieldsValue({ runway: FFIXT });
      form.setFieldsValue({
        flightid: FLIGHTID || "",
        airport: DEPAP + "-" + ARRAP,
        unit: "",
        locked: "",
        time,
        date,
        comment: "",
      });
    }

    return () => {
      form.resetFields();
      console.log("FFixTCont卸载");
    };
  }, [collaboratePopoverData.selectedObj]);

  return (
    <div className="ffixt_col_container">
      <div className="ffixt_left_canvas">
        <Form
          form={form}
          size="small"
          initialValues={initialValues}
          className="ffixt_form"
        >
          <Descriptions size="small" bordered column={1}>
            <Descriptions.Item label="航班">
              <Form.Item name="flightid">
                <Input disabled />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="机场">
              <Form.Item name="airport">
                <Input disabled />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="日期">
              <Form.Item name="date">
                <DatePicker className="clr_date" format="YYYY-MM-DD" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="时间">
              <Form.Item
                name="time"
                rules={[
                  {
                    type: "string",
                    pattern: REGEXP.TIMEHHmm,
                    message: "请输入有效的开始时间",
                  },
                  {
                    required: true,
                    message: "请输入开始时间",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="">
              <Form.Item name="locked">
                <Checkbox
                  checked={autoChecked}
                  onChange={(e) => {
                    setAutoChecked(e.target.checked);
                  }}
                >
                  禁止系统自动调整
                </Checkbox>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="备注">
              <Form.Item name="comment">
                <Input.TextArea maxLength={100} />
              </Form.Item>
            </Descriptions.Item>
            <div>
              <Button
                loading={submitBtnLoading}
                size="small"
                className="todo_opt_btn todo_agree c-btn-blue"
                onClick={(e) => {
                  onCheck("");
                }}
              >
                指定
              </Button>
              {source === "MANUAL" && hasRefuseAuth && (
                <Button
                  style={{ marginLeft: "8px" }}
                  loading={refuseBtnLoading}
                  className="todo_opt_btn todo_refuse c-btn-red"
                  onClick={(e) => {
                    onCheck("clear");
                  }}
                  size="small"
                >
                  撤销
                </Button>
              )}

              {/* <Button style={{marginLeft: '8px'}}  size="small">重置</Button> */}
            </div>
          </Descriptions>
        </Form>
      </div>
      <div className="ffixt_middle_canvas">
        {rightContShow ? (
          <DoubleLeftOutlined
            onClick={(e) => {
              setRightContShow(false);
            }}
          />
        ) : (
          <DoubleRightOutlined
            onClick={(e) => {
              setRightContShow(true);
            }}
          />
        )}
      </div>
      {rightContShow && (
        <div className="ffixt_right_canvas">
          <Descriptions size="small" bordered column={1}>
            <Descriptions.Item label="ZUUU">
              <Form.Item>
                <DatePicker className="ffixt_right_date" format="YYYY-MM-DD" />
                <Input className="ffixt_right_time" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="ZYG">
              <Form.Item>
                <DatePicker className="ffixt_right_date" format="YYYY-MM-DD" />
                <Input className="ffixt_right_time" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="XYO">
              <Form.Item>
                <DatePicker className="ffixt_right_date" format="YYYY-MM-DD" />
                <Input className="ffixt_right_time" />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </div>
  );
};

export default inject(
  "collaboratePopoverData",
  "systemPage"
)(observer(FFixTCont));
// export default FFixTCont;
