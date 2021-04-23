/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-04-22 14:02:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\PopoverTip.jsx
 */
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
import { request } from "utils/request";
import { CollaborateUrl } from "utils/request-urls";
import { REGEXP } from "utils/regExpUtil";
import React, { useCallback, useState, useEffect } from "react";
import { isValidVariable, getFullTime } from "utils/basic-verify";
import { closePopover, cgreen, cred } from "utils/collaborateUtils.js";
import { useTip } from "./CustomUses";
import moment from "moment";

//popover和tip组合协调窗口
const PopoverTip = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, serRefuseBtnLoading] = useState(false);
  const [form] = Form.useForm();
  const [tipObj, setTipObj] = useTip(2000);
  const { title } = props;
  const { record, col } = props.opt;
  const approve = props.approve || {};

  // 内容渲染
  const getContent = useCallback((opt, field) => {
    let { text, record, col } = opt;
    let { FLIGHTID, DEPAP, ARRAP } = record;
    let orgDataStr = record.orgdata || "{}";
    let orgdata = JSON.parse(orgDataStr);

    let time = "";
    let date = "";
    field = field || {};
    let fieldValue = field.value || "";
    if (isValidVariable(fieldValue) && fieldValue.length >= 12) {
      time = fieldValue.substring(8, 12);
      date = moment(fieldValue.substring(0, 8), "YYYY-MM-DD");
    }
    let initialValues = {
      flightid: FLIGHTID || "",
      airport: DEPAP + "-" + ARRAP,
      unit: "",
      locked: "",
      time,
      date,
      comment: "",
    };

    if (col === "TOBT" && approve.flag) {
      initialValues = {
        flightid: FLIGHTID || "",
        airport: DEPAP + "-" + ARRAP,
        applyComment: "", //申请备注
        applyTime: "",
        comment: "", //批复备注
        date: moment(new Date(), "YYYY-MM-DD"),
        orgTime: "",
        time: getFullTime(new Date(), 3),
      };
    }

    let hasConfirmAuth = false; //申请权限
    let hasRefuseAuth = false; //撤销权限

    let source = "";
    if (col === "FFIXT") {
      const field = orgdata["ffixField"] || {};
      source = field.source || "";
      hasConfirmAuth = props.systemPage.userHasAuth(13440);
      hasRefuseAuth = props.systemPage.userHasAuth(13443);
    } else if (col === "COBT") {
      const field = orgdata["cobtField"] || {};
      source = field.source || "";
      hasConfirmAuth = props.systemPage.userHasAuth(13428);
      hasRefuseAuth = props.systemPage.userHasAuth(13431);
    } else if (col === "CTOT") {
      const field = orgdata["ctotField"] || {};
      source = field.source || "";
      hasConfirmAuth = props.systemPage.userHasAuth(13434);
      hasRefuseAuth = props.systemPage.userHasAuth(13437);
    }

    //数据提交失败回调
    const requestErr = useCallback((err, content) => {
      setTipObj({
        visible: true,
        title: content,
        color: cred,
      });
      setSubmitBtnLoading(false);
      serRefuseBtnLoading(false);
      //关闭协调窗口popover
      closePopover();
    });
    //数据提交成功回调
    const requestSuccess = useCallback((data, title) => {
      // console.log(title + '成功:',data);
      // console.log( props.flightTableData.updateSingleFlight );
      const { flightCoordination } = data;
      props.flightTableData.updateSingleFlight(flightCoordination);
      setTipObj({
        visible: true,
        title: title + "提交成功",
        color: cgreen,
      });
      setSubmitBtnLoading(false);
      serRefuseBtnLoading(false);
      //关闭协调窗口popover
      closePopover();
    });

    const onCheck = async (type) => {
      try {
        const values = await form.validateFields();
        //   console.log('Success:', values);

        if (type === "clear") {
          serRefuseBtnLoading(true);
        } else {
          setSubmitBtnLoading(true);
        }

        const newStartTime = moment(values.startTime).format("YYYYMMDD"); //日期转化
        const { record } = props.opt;
        const orgdata = record.orgdata || {};
        let orgFlight = JSON.parse(orgdata) || {}; //航班fc
        const userId = props.systemPage.user.id || "";
        const timestr = newStartTime + "" + values.time;
        //   console.log(timestr);
        const locked = autoChecked ? "1" : "0";

        const schemeId = props.schemeListData.activeSchemeId || ""; //方案id
        const tacticName = props.schemeListData.getNameBySchemeActiveId(
          schemeId
        ); //方案名称

        //传参
        let params = {
          flightCoordination: orgFlight, //航班原fc
          comment: values.comment, //备注
          tacticId: schemeId,
          tacticName,
          userId: userId,
          locked,
        };

        let urlKey = "";
        let url = "";
        if (col === "COBT") {
          urlKey = "/updateFlightCobt";
          if (type === "clear") {
            urlKey = "/clearFlightCobt";
          }
          url = CollaborateUrl.cobtUrl;
          params["timeVal"] = timestr;
          params["fix"] = "";
        } else if (col === "CTOT") {
          urlKey = "/updateFlightCtd";
          if (type === "clear") {
            urlKey = "/clearFlightCtd";
          }
          url = CollaborateUrl.ctotUrl;
          params["timeVal"] = timestr;
          params["fix"] = "";
        } else if (col === "TOBT") {
          urlKey = "/applyTobt";
          url = CollaborateUrl.tobtUrl;
          params["changeVal"] = timestr;
        } else if (col === "FFIXT") {
          urlKey = "/updateFlightFFixT";
          if (type === "clear") {
            urlKey = "/clearFlightFFixT";
          }
          url = CollaborateUrl.ffixtUrl;
          if (type === "clear") {
            urlKey = "/clearFlightCtd";
          }
          const ffixField = orgFlight.ffixField || {};
          const name = ffixField.name || "";
          params["timeVal"] = timestr;
          params["fix"] = name;
        }
        //   console.log(params);
        const opt = {
          url: url + urlKey,
          method: "POST",
          params: params,
          resFunc: (data) => requestSuccess(data, title),
          errFunc: (err, msg) => {
            if (isValidVariable(err)) {
              requestErr(err, err);
            } else {
              requestErr(err, title + "请求失败");
            }
          },
        };
        request(opt);
      } catch (errorInfo) {
        console.log("Failed:", errorInfo);
      }
    };

    //TOBT批复
    if (col === "TOBT") {
      if (approve.flag) {
        return (
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
              <Descriptions.Item label="原始">
                <Form.Item name="orgTime">
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="申请">
                <Form.Item name="applyTime">
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="申请备注">
                <Form.Item name="applyComment">
                  <Input.TextArea maxLength={100} />
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
              <Descriptions.Item label="批复备注">
                <Form.Item name="comment">
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
                  批复
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
                  拒绝
                </Button>
              </div>
            </Descriptions>
          </Form>
        );
      }
      hasConfirmAuth = props.systemPage.userHasAuth(13425);
    }

    return (
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
          {opt.col === "TOBT" ? (
            <div>
              <Button
                loading={submitBtnLoading}
                size="small"
                className="c-btn c-btn-yellow"
                type="primary"
                onClick={(e) => {
                  onCheck("apply");
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
          )}
        </Descriptions>
      </Form>
    );
  });
  const content = getContent(props.opt, props.field);
  return (
    <Popover
      destroyTooltipOnHide={{ keepParent: false }}
      placement="rightTop"
      title={title}
      content={content}
      trigger={[`contextMenu`]}
      getContainer={false}
      // visible={true}
      onVisibleChange={(visible) => {
        if (visible) {
          form.resetFields();
        }
        if (visible && col === "TOBT" && approve.flag !== true) {
          let { COBT, CTOT, CTO } = record;
          if (
            isValidVariable(COBT) &&
            isValidVariable(CTOT) &&
            isValidVariable(CTO)
          ) {
            setTipObj({
              visible: true,
              title: "调整TOBT,会清空COBT/CTD,造成航班向后移动",
              color: cred,
            });
          }
        }
      }}
    >
      <Tooltip
        title={tipObj.title}
        visible={tipObj.visible}
        color={tipObj.color}
      >
        {props.textDom}
      </Tooltip>
    </Popover>
  );
};

export default inject(
  "systemPage",
  "flightTableData",
  "schemeListData"
)(observer(PopoverTip));
