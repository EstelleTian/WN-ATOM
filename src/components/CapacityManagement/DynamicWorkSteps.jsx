/*
 * @Author: your name
 * @Date: 2021-01-26 14:17:55
 * @LastEditTime: 2021-07-14 16:06:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityTabs.jsx
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { inject, observer } from "mobx-react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Steps, Spin, Button, Collapse } from "antd";
import { requestGet, request, request2 } from "utils/request";
import {
  getFullTime,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import ModalBox from "components/ModalBox/ModalBox";
import { OptionBtn } from "components/Common/OptionBtn";
import "./DynamicWorkSteps.scss";
import { clearTimeout } from "highcharts";
import { NWGlobal } from "utils/global";
const { Step } = Steps;
const { Panel } = Collapse;

function stepsList(props) {
  const {
    user = {},
    hisInstance = {},
    hisTasks = [],
    generateTime = "",
  } = props;

  return (
    <div className="work_cont">
      <div style={{ margin: "-12px 0px 10px 4px", fontSize: "16px" }}>
        流水号：{hisInstance.id || ""}
      </div>
      <Steps direction="vertical" current={hisTasks.length - 1}>
        {hisTasks.map((task) => {
          let { name = "" } = task;
          if (name === "") {
            name = task.assigneeName || "";
          }
          let createTime = task.createTime || "";
          let endTime = task.endTime || "";

          if (isValidVariable(endTime)) {
            endTime = "办结时间：" + getFullTime(new Date(endTime), 1);
          } else {
            endTime = "到达时间：" + getFullTime(new Date(createTime), 1);
          }

          const taskLocalVariables = task.taskLocalVariables || {};
          const processVariables = task.processVariables || {};
          const agree = taskLocalVariables.agree;
          const comments = taskLocalVariables.comments || "";
          const remarkTitle = processVariables.remark || "";
          let remark = processVariables.remark || "";
          if (remark.length > 100) {
            remark = remark.substring(0, 100) + "...";
          }
          let resCn = "";
          if ((agree === undefined || agree === null) && comments != "") {
            resCn = (
              <span
                style={{
                  color: "#ffffff",
                  padding: "0 3px",
                  backgroundColor: "green",
                }}
              >
                {comments}
              </span>
            );
          } else if (agree === true || agree === "true") {
            resCn = (
              <span
                style={{
                  color: "#ffffff",
                  padding: "0 3px",
                  backgroundColor: "green",
                }}
              >
                同意
              </span>
            );
          } else if (agree === false || agree === "false") {
            resCn = (
              <span
                style={{
                  color: "#ffffff",
                  padding: "0 3px",
                  backgroundColor: "#ec4747",
                }}
              >
                拒绝
              </span>
            );
          }
          // const userNameCn = taskLocalVariables.userNameCn || "";
          const userNameCn = task.assigneeName || "";
          let desDom = (
            <div>
              <div>处理人：{userNameCn} </div>
              <div title={endTime}> {endTime !== "" && `${endTime}`}</div>
              <div title={remarkTitle}>
                {" "}
                {remark != "" && `原因: ${remark} `}
              </div>
            </div>
          );
          return (
            <Step
              key={task.id}
              icon={
                endTime === "" ? (
                  <ClockCircleOutlined style={{ fontSize: "34px" }} />
                ) : (
                  ""
                )
              }
              title={name}
              subTitle={resCn}
              description={desDom}
            />
          );
        })}
      </Steps>
    </div>
  );
}
const StepsList = inject("capacity")(observer(stepsList));

//容量管理-工作流详情
function DynamicWorkSteps(props) {
  const { pane = {}, capacity, systemPage, routeName } = props;
  const dateRange = capacity.dateRange;
  const user = props.systemPage.user || {};
  const username = user.username || "";
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [globalInsDate, setGlobalInsDate] = useState(false);
  const timer = useRef();
  // 更新客户端版本号信息方法
  NWGlobal.updateInsDate = (date) => {
    // alert(date);
    setGlobalInsDate(date);
  };

  const taskMap = props.capacity.dynamicWorkFlowData.taskMap || {};
  const generateTime = props.capacity.dynamicWorkFlowData.generateTime || {};
  const values = Object.values(taskMap) || [];
  let taskObj = {};
  let hisTasks = [];
  let hisInstance = [];
  let authMap = {};
  if (values.length > 0) {
    taskObj = values[values.length - 1] || {};
    hisTasks = taskObj.hisTasks || [];
    hisInstance = taskObj.hisInstance || [];
    authMap = taskObj.authMap || {};
  }

  const requestDynamicWorkFlowData = useCallback(
    async (nextRefresh) => {
      const timerFunc = function () {
        if (nextRefresh) {
          if (isValidVariable(timer.current)) {
            clearTimeout(timer.current);
          }
          timer.current = setTimeout(function () {
            requestDynamicWorkFlowData(nextRefresh);
          }, 30 * 1000);
        }
      };
      const type = pane.type.toUpperCase();
      if (!isValidVariable(systemPage.user.username)) {
        timerFunc();
        return;
      }
      if (type === "ROUTE" && !isValidVariable(routeName)) {
        timerFunc();
        return;
      }

      const airportName = pane.key;
      const firId = pane.firId;

      let date = capacity.getDate();
      let params = {
        date,
        elementName: airportName,
        routeName: "",
        firId,
        elementType: type,
      };
      if (type === "ROUTE") {
        params = {
          date,
          elementName: routeName,
          routeName: airportName,
          firId,
          elementType: type,
        };
      }

      if (!dataLoaded) {
        setDataLoaded(true);
        try {
          const data = await request2({
            url:
              ReqUrls.capacityBaseUrl +
              "simulationTactics/retrieveSchemeFlows/" +
              systemPage.user.username,
            method: "POST",
            params,
          });
          props.capacity.updateDynamicWorkFlowData(data);
          // if (props.capacity.isFirstLoadDynamicWorkFlowData) {
          // console.log("data", data);
          const taskMap = data.taskMap || {};
          //工作流基准日期【用于判断选中‘昨日’‘今日’‘明日’】
          let insDate = "";
          for (let key in taskMap) {
            let taskObj = taskMap[key] || {};
            let hisInstance = taskObj.hisInstance || {};
            let businessKey = hisInstance.businessKey || "";
            if (businessKey === "") {
              if (globalInsDate !== "") {
                insDate = globalInsDate;
              }
            }

            let businessKeyArr = businessKey.split(",") || [];
            if (businessKeyArr.length > 0) {
              insDate = businessKeyArr[businessKeyArr.length - 1];
            }
          }
          let targetDateRange = 0;
          if (insDate !== "") {
            const generateTime =
              props.capacity.dynamicWorkFlowData.generateTime || "";
            const curDate =
              generateTime.length >= 8
                ? generateTime.substring(0, 8)
                : generateTime;
            console.log("insDate", insDate, "curDate", curDate);
            if (insDate.length > 8) {
              insDate = insDate.substring(0, 8);
            }
            if (insDate * 1 > curDate * 1) {
              targetDateRange = 1; //明天
            } else if (insDate * 1 < curDate * 1) {
              targetDateRange = -1; //昨天
            } else if (insDate * 1 === curDate * 1) {
              targetDateRange = 0; //今天
            }
            if (props.capacity.dateRange !== targetDateRange) {
              props.capacity.dateRange = targetDateRange;
            }
          }

          //   props.capacity.isFirstLoadDynamicWorkFlowData = false;
          // }

          setDataLoaded(false);
          setLoading(false);
          if (props.capacity.forceUpdateDynamicWorkFlowData) {
            props.capacity.forceUpdateDynamicWorkFlowData = false;
          }
          timerFunc();
        } catch (err) {
          customNotice({
            type: "error",
            message: "动态容量工作流数据获取失败",
          });
          setDataLoaded(false);
          setLoading(false);
          if (props.capacity.forceUpdateDynamicWorkFlowData) {
            props.capacity.forceUpdateDynamicWorkFlowData = false;
          }
          timerFunc();
        }
      }
    },
    [systemPage.user.username, routeName]
  );

  //请求错误处理
  const requestErr = useCallback((err, content) => {
    customNotice({
      type: "error",
      message: content,
    });
  }, []);
  //数据提交成功回调
  const requestSuccess = useCallback((data, content, key) => {
    // console.log("协调成功：", data);
    //重新请求数据
    requestDynamicWorkFlowData(false);

    customNotice({
      type: "success",
      message: content,
      duration: 8,
    });
  });

  //处理 操作 同意/拒绝
  const sendResultRequest = (type, setLoad) => {
    if (!isValidVariable(username)) {
      return;
    }
    const len = hisTasks.length;
    let taskId = "";
    if (len > 1) {
      taskId = hisTasks[len - 1].id || "";
    }
    const businessKey = hisInstance.businessKey || ""; //流程id

    let url = "";
    let params = {
      businessKey, //流程id
      taskId, //任务id
    };
    let title = "动态容量调整";
    if (type === "agree") {
      //容量审核同意
      url = ReqUrls.capacityBaseUrl + "simulationTactics/approve/" + username;
    } else if (type === "refuse") {
      //容量审核拒绝
      url = ReqUrls.capacityBaseUrl + "simulationTactics/refuse/" + username;
    }
    if (isValidVariable(url)) {
      const opt = {
        url,
        method: "POST",
        params: params,
        resFunc: (data) => {
          requestSuccess(data, title + "成功");
          setLoad(false);
        },
        errFunc: (err) => {
          if (isValidVariable(err)) {
            requestErr(err, err);
          } else {
            requestErr(err, title + "失败");
          }
          setLoad(false);
        },
      };
      request(opt);
    }
  };

  useEffect(
    function () {
      if (isValidVariable(username)) {
        setLoading(true);
        // if (pane.type === "ROUTE" && isValidVariable(routeName)) {
        //   //获取数据
        //   requestDynamicWorkFlowData(true);
        // } else {
        //   //获取数据
        //   requestDynamicWorkFlowData(true);
        // }
        requestDynamicWorkFlowData(true);
      }
      return () => {
        clearTimeout(timer.current);
        timer.current = null;
      };
    },
    [username, routeName]
  );

  useEffect(
    function () {
      if (props.capacity.forceUpdateDynamicWorkFlowData) {
        setLoading(true);
        //获取数据
        requestDynamicWorkFlowData(false);
      }
    },
    [props.capacity.forceUpdateDynamicWorkFlowData]
  );
  useEffect(
    function () {
      let targetDateRange = 0;
      if (globalInsDate !== "") {
        let insDate = globalInsDate;
        const generateTime =
          props.capacity.dynamicWorkFlowData.generateTime || "";
        const curDate =
          generateTime.length >= 8
            ? generateTime.substring(0, 8)
            : generateTime;
        console.log("insDate", insDate, "curDate", curDate);
        if (insDate.length > 8) {
          insDate = insDate.substring(0, 8);
        }
        if (insDate * 1 > curDate * 1) {
          targetDateRange = 1; //明天
        } else if (insDate * 1 < curDate * 1) {
          targetDateRange = -1; //昨天
        } else if (insDate * 1 === curDate * 1) {
          targetDateRange = 0; //今天
        }
        if (props.capacity.dateRange !== targetDateRange) {
          props.capacity.dateRange = targetDateRange;
        }
      }
    },
    [globalInsDate]
  );

  // useEffect(
  //   function () {
  //     //获取数据
  //     requestDynamicWorkFlowData(false);
  //   },
  //   [dateRange]
  // );

  useEffect(function () {
    return () => {
      clearTimeout(timer.current);
      timer.current = "";
    };
  }, []);

  return (
    <div className="dynamic_workflow">
      {hisTasks.length > 0 ? (
        <ModalBox
          // title={`动态容量变更工作流(${formatTimeString(generateTime)})`}
          title={`动态容量变更工作流`}
          showDecorator={false}
          className="static_cap_modal"
        >
          <Spin spinning={loading}>
            <StepsList
              user={user}
              hisTasks={hisTasks}
              generateTime={generateTime}
              hisInstance={hisInstance}
            />
            <div className="btn_opts">
              {/* {
                                authMap.AGREE && <OptionBtn  type="agree" text="同意" callback = {
                                    (setLoad)=>{ 
                                        sendResultRequest("agree", setLoad) 
                                    }
                                } />
                            }
                            {
                                authMap.REFUSE && <OptionBtn type="refuse"  text="拒绝" callback = {
                                    (setLoad)=>{ 
                                        sendResultRequest("refuse", setLoad) 
                                    }
                                } />
                            } */}
              {authMap.CONFIRM && (
                <OptionBtn
                  type="agree"
                  text="确认"
                  callback={(setLoad) => {
                    sendResultRequest("agree", setLoad);
                  }}
                />
              )}
            </div>
          </Spin>
        </ModalBox>
      ) : (
        ""
      )}
    </div>
  );
}

export default inject("capacity", "systemPage")(observer(DynamicWorkSteps));
