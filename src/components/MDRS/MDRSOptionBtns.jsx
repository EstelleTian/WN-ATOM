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
  const {
    airport,
    MDRSData: { formData = {}, authMap = {} },
  } = props;
  let agree = authMap["AGREE"] || false;
  let refuse = authMap["REFUSE"] || false;
  let reback = authMap["REBACK"] || false;
  agree = false;
  refuse = false;
  reback = true;
  //表单提交
  const handleSave = async () => {
    try {
      const dateValues = await props.dateForm.validateFields();
      let startDateString = moment(dateValues.startDate).format("YYYYMMDD");
      let endDateString = moment(dateValues.endDate).format("YYYYMMDD");
      const values = await props.form.validateFields();
      let formValues = {
        ...formData,
        ...values,
        validperiodbegin: startDateString + dateValues.startTime,
        validperiodend: endDateString + dateValues.endTime,
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
    let params = {
      user: username,
      mdrs: { ...formData },
      optionType: type.toUpperCase(),
    };
    let title = "";
    //同意
    if (type === "agree") {
      url = ReqUrls.mdrsWorkFlowUrl + "/approve";
      const formValues = await handleSave();
      params = {
        ...params,
        mdrs: formValues,
      };
      title = "MDRS工作流【同意】审批";
    }
    //拒绝
    else if (type === "refuse") {
      const formValues = await handleSave();
      params = {
        ...params,
        mdrs: formValues,
      };
      url = ReqUrls.mdrsWorkFlowUrl + "/approve";
      title = "MDRS工作流【拒绝】审批";
    }
    //撤回
    else if (type === "reback") {
      //容量审核拒绝
      url = ReqUrls.mdrsWorkFlowUrl + "/withdraw";
      title = "MDRS工作流【撤回】";
    }
    console.log("type", type, params);
    //   try {
    //     const res = await request2({ url, method: "POST", params: params });
    //     customNotice({
    //       type: "success",
    //       message: title + "成功",
    //       duration: 8,
    //     });
    //     setLoad(false);
    //   } catch (err) {
    //     if (isValidVariable(err)) {
    //       customNotice({
    //         type: "error",
    //         message: err,
    //       });
    //     } else {
    //       customNotice({
    //         type: "error",
    //         message: title + "失败",
    //       });
    //     }
    //     setLoad(false);
    //   }
    // }
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
