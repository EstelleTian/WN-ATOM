/*
 * @Author: your name
 * @Date: 2021-01-26 14:17:55
 * @LastEditTime: 2021-04-22 20:14:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\MDRSWorkList.jsx
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Fragment,
} from "react";
import { inject, observer } from "mobx-react";

import { request2 } from "utils/request";
import {
  getFullTime,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import ModalBox from "components/ModalBox/ModalBox";
import { OptionBtn } from "components/Common/OptionBtn";
import "./MDRSWorkList.scss";

function WorkStep(props) {
  const { task = {}, index, len, authMap } = props;
  let agree = false;
  let refuse = false;
  if (len - 1 === index) {
    agree = authMap["AGREE"] || false;
    refuse = authMap["REFUSE"] || false;
    //TODO 测试用
    // agree = true;
    // refuse = true;
  }

  let reback = false;
  if (len - 2 === index) {
    reback = authMap["REBACK"] || false;
    //TODO 测试用
    // reback = true;
  }
  let { name = "" } = task;
  if (name === "") {
    name = task.assigneeName || "";
  }
  const userNameCn = task.assigneeName || "";
  let createTime = task.createTime || "";
  let endTime = task.endTime || "";
  const taskLocalVariables = task.taskLocalVariables || {};
  const processVariables = task.processVariables || {};
  const comments = taskLocalVariables.comments || "";
  const remarkTitle = processVariables.remark || "";
  let remark = processVariables.remark || "";
  if (remark.length > 100) {
    remark = remark.substring(0, 100) + "...";
  }
  if (isValidVariable(endTime)) {
    endTime = getFullTime(new Date(endTime), 1);
  } else {
    endTime = getFullTime(new Date(createTime), 1);
  }
  //处理 操作 同意/拒绝
  const sendResultRequest = async (type, setLoad) => {
    const userStr = localStorage.getItem("user");
    let user = JSON.parse(userStr);
    const { username = "" } = user;
    if (!isValidVariable(username)) {
      return;
    }

    const businessKey = props.formData.businessKey || ""; //业务主键id
    const mdrsId = props.formData.id || ""; //MDRS预警数据主键ID
    let url = "";
    let params = {
      user: username,
      businessKey,
    };
    let title = "";
    //同意
    if (type === "agree") {
      url = ReqUrls.mdrsWorkFlowUrl + "/approve";
      params = {
        ...params,
        mdrsId,
        approvalStatus: true,
      };
      title = "MDRS工作流【同意】审批";
    }
    //拒绝
    else if (type === "refuse") {
      params = {
        ...params,
        mdrsId,
        approvalStatus: false,
      };
      url = ReqUrls.mdrsWorkFlowUrl + "/approve";
      title = "MDRS工作流【拒绝】审批";
    }
    //撤回
    else if (type === "reback") {
      approvalStatus = false;
      //容量审核拒绝
      url = ReqUrls.mdrsWorkFlowUrl + "/withdraw";
      title = "MDRS工作流【撤回】";
    }
    if (isValidVariable(url)) {
      try {
        const res = await request2({ url, method: "POST", params: params });
        customNotice({
          type: "success",
          message: title + "成功",
          duration: 8,
        });
        setLoad(false);
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
        setLoad(false);
      }
    }
  };
  return (
    <Fragment>
      <div
        className={`work_step_item ${len === index + 1 ? "wait" : "finished"}`}
      >
        <div className="item_top">
          <span className="step_number">{"0" + (index + 1)}</span>
          <span className="step_name">{name}</span>
          <div className="step_des">
            <div>{userNameCn} </div>
            <div title={endTime}> {endTime !== "" && `${endTime}`}</div>
            {/* <div className="step_reason" title={remarkTitle}>
                {" "}
                {remark != "" && `原因: ${remark} `}
              </div> */}
          </div>
          <div className="step_btn">
            {agree && (
              <OptionBtn
                type="agree"
                size="small"
                text="同意"
                callback={(setLoad) => {
                  sendResultRequest("agree", text, setLoad);
                }}
              />
            )}
            {refuse && (
              <OptionBtn
                type="refuse"
                size="small"
                text="拒绝"
                callback={(setLoad) => {
                  sendResultRequest("refuse", text, setLoad);
                }}
              />
            )}
            {reback && (
              <OptionBtn
                type="reback"
                size="small"
                text="撤回"
                callback={(setLoad) => {
                  sendResultRequest("reback", text, setLoad);
                }}
              />
            )}
          </div>
        </div>
        <div className="item_bottom">
          <div className="item_icon wait"></div>
          <div className="item_line"></div>
        </div>
      </div>
    </Fragment>
  );
}

//容量管理-工作流详情
function MDRSWorkList(props) {
  const {
    MDRSData: { hisTasks = [], authMap = {}, formData = {}, generateTime },
  } = props;

  const len = hisTasks.length;
  return (
    <div className="mdrs_workflow">
      {hisTasks.length > 0 && (
        <ModalBox
          // title={`工作流详情（流水号：${hisInstance.id || ""}）`}
          title={`工作流详情`}
          showDecorator={false}
          className="mdrs_modal"
        >
          <div className="work_steps">
            {hisTasks.map((task, index) => (
              <WorkStep
                key={task.id}
                task={task}
                index={index}
                authMap={authMap}
                formData={formData}
                len={len}
              />
            ))}
          </div>
        </ModalBox>
      )}
    </div>
  );
}

export default inject("MDRSData")(observer(MDRSWorkList));
