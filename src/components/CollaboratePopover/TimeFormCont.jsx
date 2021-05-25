/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-25 16:25:40
 * @LastEditors: Please set LastEditors
 * @Description: 时间类协调窗口-
 * @FilePath: \WN-ATOM\src\components\FlightTable\TimeFormCont.jsx
 */
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  message,
  Popover,
  Button,
  Form,
  Descriptions,
  Input,
  DatePicker,
  Checkbox,
  Tooltip,
} from "antd";
import { observer, inject } from "mobx-react";
import { request2 } from "utils/request";
import { CollaborateUrl } from "utils/request-urls";
import { REGEXP } from "utils/regExpUtil";
import { isValidVariable, getFullTime } from "utils/basic-verify";
import moment from "moment";
//协调窗口
const TimeFormCont = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, setRefuseBtnLoading] = useState(false);
  const [form] = Form.useForm();
  const {
    collaboratePopoverData = {},
    systemPage = {},
    schemeListData = {},
    flightTableData = {},
    clearCollaboratePopoverData,
  } = props;
  const { data = {}, selectedObj = {} } = collaboratePopoverData;
  //右键列名
  const { name = "" } = selectedObj;
  // 用户id
  const user = systemPage.user || {};
  const userId = user.id || "";

  const { orgdata = "{}" } = data;
  const flight = JSON.parse(orgdata);
  let { flightid = "", depap = "", arrap = "" } = flight;
  let initialValues = {};
  //根据列名获取对应要显示的时间
  let {
    time = "",
    date,
    fieldSource = "",
  } = useMemo(() => {
    const { name = "" } = selectedObj;
    let time = "";
    let date = "";
    let fieldSource = "";
    if (isValidVariable(name)) {
      let fieldValue = "";
      if (name === "AOBT") {
        const aobtField = flight.aobtField || {};
        fieldValue = aobtField.value || "";
        fieldSource = aobtField.source || "";
      } else if (name === "AGCT") {
        const agctField = flight.agctField || {};
        fieldValue = agctField.value || "";
        fieldSource = agctField.source || "";
      } else if (name === "ASBT") {
        const asbtField = flight.asbtField || {};
        fieldValue = asbtField.value || "";
        fieldSource = asbtField.source || "";
      } else if (name === "TOBT") {
        const tobtField = flight.tobtField || {};
        fieldValue = tobtField.value || "";
        fieldSource = tobtField.source || "";
      }
      if (isValidVariable(fieldValue) && fieldValue.length >= 12) {
        time = fieldValue.substring(8, 12);
        date = moment(fieldValue.substring(0, 8), "YYYY-MM-DD");
      }
      if (!isValidVariable(date)) {
        date = moment();
      }
    }
    return { time, date, fieldSource };
  }, [selectedObj]);

  //根据type和列名，生成url和params参数
  const handleUrlAndParams = (type, values) => {
    //方案id
    // const activeSchemeId = schemeListData.activeSchemeId || "";
    // const tacticName = schemeListData.getNameBySchemeActiveId(activeSchemeId); //方案名称

    const { date, time } = values;
    const dateStr = moment(date).format("YYYYMMDD") || "";
    let timeStr = dateStr + time;
    let tipTitle = "";
    let url = "";
    let params = {
      flightCoordination: flight, //航班原fc
      userId,
      // tacticId: activeSchemeId,
      // tacticName,
      comment: values.comments || "", //备注
    };
    const flightId = flight.flightid || "";
    if (type === "approve") {
      setSubmitBtnLoading(true);
      if (name === "TOBT") {
        url = CollaborateUrl.baseUrl + "/applyTobt";
        params["changeVal"] = timeStr;
        tipTitle = flightId + " TOBT申请变更成功";
      } else if (name === "ASBT") {
        url = CollaborateUrl.baseUrl + "/updateFlightAsbt";
        params["timeVal"] = timeStr;
        tipTitle = flightId + " 上客时间修改成功";
      } else if (name === "AOBT") {
        url = CollaborateUrl.baseUrl + "/updateFlightAobt";
        params["timeVal"] = timeStr;
        tipTitle = flightId + " 推出时间修改成功";
      } else if (name === "AGCT") {
        url = CollaborateUrl.baseUrl + "/updateFlightAgct";
        params["timeVal"] = timeStr;
        tipTitle = flightId + " 关门时间修改成功";
      }
    } else if (type === "clear") {
      setRefuseBtnLoading(true);
      if (name === "ASBT") {
        url = CollaborateUrl.baseUrl + "/clearFlightAsbt";
        tipTitle = flightId + " 上客时间撤销成功";
      } else if (name === "AOBT") {
        url = CollaborateUrl.baseUrl + "/clearFlightAobt";
        tipTitle = flightId + " 推出时间撤销成功";
      } else if (name === "AGCT") {
        url = CollaborateUrl.baseUrl + "/clearFlightAgct";
        tipTitle = flightId + " 关门时间撤销成功";
      }
    }
    return { url, params, tipTitle };
  };
  //表单校验+提交
  const onCheck = async (type) => {
    let values = {};
    try {
      values = await form.validateFields();
    } catch (errorInfo) {
      return;
    }
    try {
      let {
        url = "",
        params = {},
        tipTitle = "",
      } = handleUrlAndParams(type, values);

      if (!isValidVariable(url)) {
        return;
      }
      //提交参数拼装
      const res = await request2({
        url,
        params,
        method: "POST",
      });

      setSubmitBtnLoading(false);
      setRefuseBtnLoading(false);
      const { flightCoordination } = res;
      //单条数据更新
      flightTableData.updateSingleFlight(flightCoordination);
      collaboratePopoverData.setTipsObj({
        ...collaboratePopoverData.selectedObj,
        title: tipTitle,
      });
      //关闭popover
      clearCollaboratePopoverData();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      collaboratePopoverData.setTipsObj({
        ...collaboratePopoverData.selectedObj,
        type: "warn",
        title: errorInfo,
      });
      //关闭popover
      clearCollaboratePopoverData();
    }
  };

  useEffect(() => {
    if (collaboratePopoverData.selectedObj.name !== "") {
      //初始化表单赋值
      form.setFieldsValue({
        flightid,
        airport: depap + "-" + arrap,
        time,
        date,
        comment: "",
      });
    }
    return () => {
      form.resetFields();
    };
  }, [collaboratePopoverData.selectedObj, flight]);
  return (
    <Form
      form={form}
      size="small"
      initialValues={initialValues}
      className={`${name}_form`}
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
          <Form.Item
            name="date"
            rules={[{ required: true, message: "请选择日期" }]}
          >
            <DatePicker className="col_form_date" format="YYYY-MM-DD" />
          </Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="时间">
          <Form.Item
            name="time"
            rules={[
              {
                type: "string",
                pattern: REGEXP.TIMEHHmm,
                message: "请输入有效的时间",
              },
              {
                required: true,
                message: "请输入时间",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Descriptions.Item>
        {(name === "COBT" || name === "CTOT") && (
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
        )}

        <Descriptions.Item label="备注">
          <Form.Item name="comment">
            <Input.TextArea maxLength={100} />
          </Form.Item>
        </Descriptions.Item>
        {name === "TOBT" ? (
          <div>
            <Button
              loading={submitBtnLoading}
              size="small"
              className="c-btn c-btn-yellow"
              type="primary"
              onClick={(e) => {
                onCheck("approve");
              }}
            >
              申请
            </Button>
          </div>
        ) : (
          <div>
            <Button
              loading={submitBtnLoading}
              size="small"
              className="todo_opt_btn c-btn-blue"
              onClick={(e) => {
                onCheck("approve");
              }}
            >
              指定
            </Button>
            {fieldSource === "MANUAL" && hasRefuseAuth && (
              <Button
                style={{ marginLeft: "8px" }}
                loading={refuseBtnLoading}
                className="todo_opt_btn c-btn-red"
                onClick={(e) => {
                  onCheck("clear");
                }}
                size="small"
              >
                撤销
              </Button>
            )}
          </div>
        )}
      </Descriptions>
    </Form>
  );
};

export default inject(
  "collaboratePopoverData",
  "systemPage",
  "schemeListData",
  "flightTableData"
)(observer(TimeFormCont));
