/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-25 16:11:45
 * @LastEditors: Please set LastEditors
 * @Description: 停机位修改
 * @FilePath:
 */
import React, { useCallback, useState, useEffect, useRef } from "react";
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
import { closePopover, cgreen, cred } from "utils/collaborateUtils.js";

//协调窗口
const PositionCont = (props) => {
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
  const { data = {} } = collaboratePopoverData;
  const { FLIGHTID = "", POS = {}, orgdata = "{}" } = data;
  const positionVal = POS.value || "";
  const user = systemPage.user || {};
  const userId = user.id || "";
  const activeSchemeId = schemeListData.activeSchemeId || "";

  const onCheck = async (type) => {
    let values = {};
    try {
      values = await form.validateFields();
    } catch (errorInfo) {
      return;
    }
    try {
      let url = "";
      let params = {
        flightCoordination: JSON.parse(orgdata),
        userId,
        tacticId: activeSchemeId,
        comment: values.comments || "",
      };
      if (type === "approve") {
        setSubmitBtnLoading(true);
        url = CollaborateUrl.baseUrl + "/updateFlightPosition";
        params["timeVal"] = values.position || "";
      } else if (type === "refuse") {
        setRefuseBtnLoading(true);
        //跑道清除
        url = CollaborateUrl.baseUrl + "/clearFlightPosition";
        params["timeVal"] = "";
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
        title: "停机位修改成功",
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
    if (collaboratePopoverData.selectedObj.name === "POS") {
      // console.log("PositionCont", positionVal);
      form.setFieldsValue({ position: positionVal });
    }
    return () => {
      form.resetFields();
      // console.log("PositionCont卸载");
    };
  }, [collaboratePopoverData.selectedObj]);
  return (
    <Form
      form={form}
      size="small"
      initialValues={{ position: positionVal }}
      className="position_form"
    >
      <Descriptions size="small" bordered column={1}>
        <Descriptions.Item label="停机位">
          <Form.Item name="position" rules={[]}>
            <Input />
          </Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="备注">
          <Form.Item name="comments">
            <Input.TextArea maxLength={100} />
          </Form.Item>
        </Descriptions.Item>
        <div>
          <Button
            loading={submitBtnLoading}
            size="small"
            className="c-btn c-btn-blue"
            type="primary"
            onClick={(e) => {
              onCheck("approve");
            }}
          >
            确定
          </Button>
          <Button
            loading={refuseBtnLoading}
            size="small"
            className="c-btn c-btn-red"
            type="primary"
            style={{ marginLeft: "8px" }}
            onClick={(e) => {
              onCheck("refuse");
            }}
          >
            清除
          </Button>
        </div>
      </Descriptions>
    </Form>
  );
};

export default inject(
  "collaboratePopoverData",
  "systemPage",
  "schemeListData",
  "flightTableData"
)(observer(PositionCont));
// export default PositionCont;
