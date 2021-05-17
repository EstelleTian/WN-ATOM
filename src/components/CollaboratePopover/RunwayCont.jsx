/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-17 10:35:09
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
  Input,
  Radio,
  Checkbox,
  Tooltip,
} from "antd";
import { observer, inject } from "mobx-react";
import { request2 } from "utils/request";
import { CollaborateUrl } from "utils/request-urls";
import { REGEXP } from "utils/regExpUtil";
import { isValidVariable, getFullTime } from "utils/basic-verify";
import { closePopover, cgreen, cred } from "utils/collaborateUtils.js";

//popover和tip组合协调窗口
const RunwayCont = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, serRefuseBtnLoading] = useState(false);
  const [form] = Form.useForm();
  const {
    collaboratePopoverData = {},
    systemPage = {},
    schemeListData = {},
  } = props;
  const { data = {} } = collaboratePopoverData;
  const { FLIGHTID = "", RWY = "" } = data;
  const user = systemPage.user || {};
  const userId = user.id || "";
  const activeSchemeId = schemeListData.activeSchemeId || "";

  const onCheck = async (type) => {
    try {
      const values = await form.validateFields();

      let url = "";
      let params = {
        flightCoordination: data,
        userId,
        tacticId: activeSchemeId,
        comment: values.comments,
      };
      if (type === "approve") {
        url = CollaborateUrl.runwayUrl + "/updateFlightRunway";
        params["timeVal"] = values.runway;
      } else if (type === "refuse") {
        //跑道清除
        url = CollaborateUrl.runwayUrl + "/clearFlightRunway";
        params["timeVal"] = "";
      }
      //提交参数拼装
      const res = await request2({
        url,
        params,
        method: "POST",
      });

      console.log("Success:", res);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  useEffect(() => {
    if (collaboratePopoverData.selectedObj.name === "RWY") {
      console.log("RunwayCont", RWY);
      // form.setFieldsValue({ runway: RWY });
      form.setFieldsValue({ runway: "02R" });
    }

    return () => {
      form.resetFields();
      console.log("RunwayCont卸载");
    };
  }, [collaboratePopoverData.selectedObj]);
  return (
    <Form form={form} size="small" initialValues={{}} className="runway_form">
      <Descriptions size="small" bordered column={1}>
        <Descriptions.Item label="跑道">
          <Form.Item name="runway" rules={[]}>
            <Radio.Group>
              <Radio value="20L">20L</Radio>
              <Radio value="02R">02R</Radio>
            </Radio.Group>
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
            className="c-btn c-btn-green"
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
  "schemeListData"
)(observer(RunwayCont));
// export default RunwayCont;
