import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Fragment,
} from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { request2 } from "utils/request";
import {
  getFullTime,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import { OptionBtn } from "components/Common/OptionBtn";
//MDRS-表单 操作按钮
function MDRSOptionBtns(props) {
  const { airport, MDRSData = {} } = props;
  const { formData = {}, authMap = {}, historyTaskResult = {} } = MDRSData;
  let agree = authMap["AGREE"] || false;
  let refuse = authMap["REFUSE"] || false;
  let reback = authMap["REBACK"] || false;
  let update = authMap["UPDATE"] || false;
  //   agree = false;
  //   refuse = false;
  //   reback = true;
  //表单提交
  const handleSave = async () => {
    try {
      // const dateValues = await props.dateForm.validateFields();
      // let startDateString = moment(dateValues.startDate).format("YYYYMMDD");
      // let endDateString = moment(dateValues.endDate).format("YYYYMMDD");
      const values = await props.form.validateFields();
      let formValues = {
        ...formData,
        ...values,
        // validperiodbegin: startDateString + dateValues.startTime,
        // validperiodend: endDateString + dateValues.endTime,
        // airport,
      };
      console.log(formValues);
      return Promise.resolve(formValues);
      //   //发送修改请求
      //   try {
      //     const res = await request2({
      //       url: ReqUrls.mdrsUpdateDataUrl,
      //       method: "POST",
      //       params: formValues,
      //     });
      //     customNotice({
      //       type: "success",
      //       message: "MDRS预警信息修改成功",
      //     });
      //     console.log("保存成功：", res);
      //     setLoading(false);
      //     props.MDRSData.setEditable(false);
      //   } catch (err) {
      //     customNotice({
      //       type: "error",
      //       message: "MDRS预警信息修改失败",
      //     });
      //     setLoading(false);
      //   }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  //处理 操作 同意/拒绝
  const sendResultRequest = async (type, setLoad) => {
    const userStr = localStorage.getItem("user");
    let user = JSON.parse(userStr);
    const { username = "" } = user;
    if (!isValidVariable(username)) {
      return;
    }
    // const mdrsId = props.formData.id || ""; //MDRS预警数据主键ID
    let url = "";
    let params = formData || {};
    // console.log("historyTaskResult", { ...historyTaskResult });
    const {
      hisInstance: { processVariables = {} },
    } = historyTaskResult;
    const TASKTYPE = processVariables.TASKTYPE || "";
    let title = "";
    //同意
    if (type === "agree") {
      if (TASKTYPE === "TERMINATION") {
        url = ReqUrls.mdrsTerminalWorkFlowUrl;
        title = "MDRS提前终止【同意】操作";
      } else {
        url = ReqUrls.mdrsWorkFlowUrl;
        title = "MDRS超容预警【同意】操作";
      }
      if (update) {
        const formValues = await handleSave();
        params = formValues;
      }
    }
    //拒绝
    else if (type === "refuse") {
      if (TASKTYPE === "TERMINATION") {
        url = ReqUrls.mdrsTerminalWorkFlowUrl;
        title = "MDRS提前终止【拒绝】操作";
      } else {
        url = ReqUrls.mdrsWorkFlowUrl;
        title = "MDRS超容预警【拒绝】操作";
      }
      if (update) {
        const formValues = await handleSave();
        params = formValues;
      }
    }
    //撤回
    else if (type === "reback") {
      if (TASKTYPE === "TERMINATION") {
        url = ReqUrls.mdrsTerminalWorkFlowUrl;
        title = "MDRS提前终止【撤回】操作";
      } else {
        //容量审核拒绝
        url = ReqUrls.mdrsWorkFlowUrl;
        title = "MDRS超容预警【撤回】操作";
      }
    }

    try {
      const res = await request2({
        url: url + "/" + username + "/" + type.toUpperCase(),
        method: "POST",
        params: params,
      });
      customNotice({
        type: "success",
        message: title + "成功",
        duration: 8,
      });
      console.log("res", res);
      //数据赋值
      const { backlogResult = [], generateTime = "", publishResult = [] } = res;
      if (backlogResult.length == 0) {
        customNotice({
          type: "warning",
          message: "暂无数据",
          duration: 8,
        });
        MDRSData.setMDRSData({}, generateTime);
      } else {
        //TODO 回头这个result改成对象
        MDRSData.setMDRSData(backlogResult[0], generateTime);
      }
      if (publishResult.length == 0) {
        // customNotice({
        //   type: "warn",
        //   message: "暂无数据",
        //   duration: 8,
        // });
        MDRSData.setPublishData([]);
      } else {
        //TODO 回头这个result改成对象
        MDRSData.setPublishData(publishResult);
      }
      // setLoad(false);
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
      // setLoad(false);
    }
  };
  return (
    <div className="step_btn">
      {agree && (
        <OptionBtn
          type="agree"
          //   size="small"
          text="同意"
          callback={(setLoad) => {
            sendResultRequest("agree", setLoad);
          }}
        />
      )}
      {refuse && (
        <OptionBtn
          type="refuse"
          //   size="small"
          text="拒绝"
          callback={(setLoad) => {
            sendResultRequest("refuse", setLoad);
          }}
        />
      )}
      {reback && (
        <OptionBtn
          type="reback"
          //   size="small"
          text="撤回"
          callback={(setLoad) => {
            sendResultRequest("reback", setLoad);
          }}
        />
      )}
    </div>
  );
}
export default inject("MDRSData")(observer(MDRSOptionBtns));
