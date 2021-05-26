/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-25 16:11:36
 * @LastEditors: Please set LastEditors
 * @Description: 跑道修改
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

//协调窗口
const RunwayCont = (props) => {
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
  const { FLIGHTID = "", RWY = {}, orgdata = "{}" } = data;
  const { value = "", name = "" } = RWY;
  let runwayNames = [];
  if (name !== "" && name !== null) {
    runwayNames = name.split(",") || [];
  }
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
        comment: values.comments,
      };
      if (type === "approve") {
        setSubmitBtnLoading(true);
        url = CollaborateUrl.baseUrl + "/updateFlightRunway";
        params["timeVal"] = values.runway;
      } else if (type === "refuse") {
        setRefuseBtnLoading(true);
        //跑道清除
        url = CollaborateUrl.baseUrl + "/clearFlightRunway";
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
        title: "跑道修改成功",
      });
      //关闭popover
      clearCollaboratePopoverData();
      console.log("Success:", res);
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
    if (collaboratePopoverData.selectedObj.name === "RWY") {
      // console.log("RunwayCont", RWY);
      // form.setFieldsValue({ runway: RWY });
      form.setFieldsValue({ runway: value });
    }

    return () => {
      form.resetFields();
      // console.log("RunwayCont卸载");
    };
  }, [collaboratePopoverData.selectedObj]);
  return (
    <Form form={form} size="small" initialValues={{}} className="runway_form">
      <Descriptions size="small" bordered column={1}>
        <Descriptions.Item label="跑道">
          {runwayNames.length > 0 ? (
            <Form.Item name="runway" rules={[]}>
              <Radio.Group>
                {runwayNames.map((name, index) => (
                  <Radio value={name} key={index}>
                    {name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          ) : (
            <span>无可选跑道</span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="备注">
          <Form.Item name="comments">
            <Input.TextArea maxLength={100} />
          </Form.Item>
        </Descriptions.Item>
        {runwayNames.length > 0 && (
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
)(observer(RunwayCont));
