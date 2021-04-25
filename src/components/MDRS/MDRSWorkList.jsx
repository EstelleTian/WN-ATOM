/*
 * @Author: your name
 * @Date: 2021-01-26 14:17:55
 * @LastEditTime: 2021-04-25 14:27:08
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
  let { name = "" } = task;
  if (name === "") {
    name = task.assigneeName || "";
  }
  const userNameCn = task.assigneeName || "";
  let createTime = task.createTime || "";
  let endTime = task.endTime || "";
  let showEndTime = task.endTime || "";
  const taskLocalVariables = task.taskLocalVariables || {};
  const processVariables = task.processVariables || {};
  const comments = taskLocalVariables.comments || "";
  const remarkTitle = processVariables.remark || "";
  let remark = processVariables.remark || "";
  // let remark = "大风方发狂大风方发狂大风方发狂大风方发狂";
  if (remark.length > 8) {
    remark = remark.substring(0, 8) + "...";
  }
  if (isValidVariable(endTime)) {
    endTime = getFullTime(new Date(endTime), 1);
    showEndTime = "办结时间：" + getFullTime(new Date(endTime), 2);
  } else {
    endTime = getFullTime(new Date(createTime), 1);
    showEndTime = "到达时间：" + getFullTime(new Date(createTime), 2);
  }

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
            <div title={endTime}> {endTime !== "" && `${showEndTime}`}</div>
            <div className="step_reason" title={remarkTitle}>
              {`原因: ${remark} `}
            </div>
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
    MDRSData: {
      historyTaskResult: { hisTasks = [], hisInstance = {} } = {},
      authMap = {},
      formData = {},
      generateTime,
    },
  } = props;

  const len = hisTasks.length;
  return (
    <div className="mdrs_workflow">
      {hisTasks.length > 0 && (
        <ModalBox
          title={`工作流详情（流水号：${hisInstance.id || ""}）`}
          // title={`工作流详情`}
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
