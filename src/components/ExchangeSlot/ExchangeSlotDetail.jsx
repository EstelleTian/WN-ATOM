/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-25 16:35:43
 * @LastEditors: Please set LastEditors
 * @Description: 时隙交换详情
 * @FilePath: \WN-ATOM\src\components\NavBar\ExchangeSlotDetail.jsx
 */
import React, {
  Fragment,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { Row, Col, Modal } from "antd";
import { observer, inject } from "mobx-react";
import {
  isValidObject,
  isValidVariable,
  formatTimeString,
  getDayTimeFromString,
  getFullTime,
} from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import DraggableModal from "components/DraggableModal/DraggableModal";
import "./ExchangeSlotDetail.scss";
import "components/MDRS/MDRSWorkList.scss";

function WorkStep(props) {
  const { task = {}, index, len } = props;
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
function WorkList({ hisTasks = [] }) {
  const len = hisTasks.length;
  return (
    <div className="work_steps">
      {hisTasks.map((task, index) => (
        <WorkStep key={task.id} task={task} index={index} len={len} />
      ))}
    </div>
  );
}

const FlightLine = ({ name = "", data = {} }) => {
  const flightid = data.flightid || "";
  const depap = data.depap || "";
  const arrap = data.arrap || "";
  const sobt = data.sobt || "";
  const gsobt = data.gsobt || "";
  const cobtField = data.cobtField || {};
  const cobt = cobtField.value || "";
  const ctotField = data.ctotField || {};
  const ctot = ctotField.value || "";
  const ctoField = data.ctoField || {};
  const ffix = ctoField.name || "";
  const ffixt = ctoField.value || "";
  let impactTacticInfoList = data.impactTacticInfoList || [];
  //只保留 将要执行 正在执行
  impactTacticInfoList = impactTacticInfoList.filter((data) => {
    return data.tacticStatus === "FUTURE" || data.tacticStatus === "RUNNING";
  });
  return (
    <div className="flight_line">
      <div className="name">{name}</div>
      <div className="cont">
        <Row className="row_title">
          <Col span={4}>航班号</Col>
          <Col span={5}>起降机场</Col>
          <Col span={5}>SOBT(GSOBT)</Col>
          <Col span={5}>COBT/CTOT</Col>
          <Col span={5}>受控点(过点时间)</Col>
        </Row>
        <Row className="row_val">
          <Col span={4}>{flightid}</Col>
          <Col span={5}>
            {depap}——{arrap}
          </Col>
          <Col
            span={5}
            title={`sobt===""?"N/A":${formatTimeString(sobt)}(${
              gsobt === "" ? "N/A" : formatTimeString(gsobt)
            })`}
          >
            {sobt === "" ? "N/A" : getDayTimeFromString(sobt)}(
            {gsobt === "" ? "N/A" : getDayTimeFromString(gsobt)})
          </Col>
          <Col
            span={5}
            title={`${cobt === "" ? "N/A" : formatTimeString(cobt)}/${
              ctot === "" ? "N/A" : formatTimeString(ctot)
            }`}
          >
            {cobt === "" ? "N/A" : getDayTimeFromString(cobt)}/
            {ctot === "" ? "N/A" : getDayTimeFromString(ctot)}
          </Col>
          <Col
            span={5}
            title={`${ffix === "" ? "N/A" : ffix}(${
              ffixt === "" ? "N/A" : formatTimeString(ffixt)
            })`}
          >
            {ffix === "" ? "N/A" : ffix}(
            {ffixt === "" ? "N/A" : getDayTimeFromString(ffixt)})
          </Col>
        </Row>
        <Row className="row_title">
          <Col span={4}>流控名</Col>
        </Row>
        <Row className="row_val tactic_name">
          {impactTacticInfoList.map((item, index) => (
            <Col span={12} key={index}>
              {item.tacticName || ""}
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

const ExchangeSlotDetail = ({ exchangeSlot }) => {
  //申请航班（航班A）
  const [flightData, setFlightData] = useState({});
  //交换航班（航班B）
  const [exchangeFlightData, setExchangeFlightData] = useState({});
  //工作流
  const [hisTasks, setHisTasks] = useState([]);
  const [hisInstance, setHisInstance] = useState([]);
  const timerId = useRef();

  const hideModal = () => {
    exchangeSlot.slotDetailModalVisible = false;
  };
  //获取时隙交换详情请求
  const requestData = useCallback(
    async (triggerLoading, nextRefresh = false) => {
      const timerFunc = () => {
        if (nextRefresh) {
          if (isValidVariable(timerId.current)) {
            clearTimeout(timerId.current);
            timerId.current = "";
          }
          timerId.current = setTimeout(() => {
            requestData(false, nextRefresh);
          }, 60 * 1000);
        }
      };
      if (!isValidVariable(exchangeSlot.slotDetailId)) {
        timerFunc();
        return;
      }
      let url =
        ReqUrls.retrieveExchangeSlotDetailUrl + exchangeSlot.slotDetailId;
      try {
        const data = await requestGet2({ url, params: {} });
        const flight = data.flight || {};
        const exchangeFlight = data.exchangeFlight || {};
        const hisTasks = data.hisTasks || {};
        const hisInstance = data.hisInstance || {};
        setFlightData(flight);
        setExchangeFlightData(exchangeFlight);
        setHisTasks(hisTasks);
        setHisInstance(hisInstance);

        timerFunc();
      } catch (e) {
        let msg = "时隙交换详情数据获取失败";
        if (isValidVariable(e)) {
          let msg = e;
        }
        customNotice({
          type: "error",
          message: msg,
        });
        timerFunc();
      }
    },
    []
  );

  //请求错误处理
  const requestErr = useCallback((err, content) => {
    customNotice({
      type: "error",
      message: content,
    });
  }, []);

  //处理 时隙交换工作 数据
  const handleTasksData = useCallback((data) => {
    let tableData = [];
    const tasks = data.tasks || {};
    const flights = data.flights || {};
    const generateTime = data.generateTime || "";
    for (let key in tasks) {
      const task = tasks[key] || {}; //流水号
      const taskId = task.taskId || "";
      const instanceId = task.instanceId || "";
      const authorities = task.authorities || {};
      //交换方 航班A
      const businessId = task.businessId || "";
      // const sourceFlight = flights[businessId] || {};
      // const sourceVal = sourceFlight.flightid || "";
      const sourceVal = task.sourceVal || "";
      //被交换方 航班B
      const targetFmeId = task.targetFmeId || "";
      // const targetFlight = flights[targetFmeId] || {};
      // const targetVal = targetFlight.flightid || "";
      const targetVal = task.targetVal || "";
      //发起人
      const startUser = task.startUser || "";
      //发起时间
      const startTime = task.startTime || "";
      //状态
      const handleStatus = task.status || "";
      //到达环节
      const activityName = task.activityName || "";
      //更新时间
      const endTime = task.endTime || "";
      //备注
      const comments = task.comments || "";

      let options = {
        taskId: taskId,
        key: instanceId,
        // sourceFlight,
        // targetFlight,
        authorities,
        exchangeId: targetFmeId, //航班B
        flightId: businessId, //航班A
      };

      let obj = {
        key: instanceId,
        instanceId,
        taskId: taskId,
        opt: JSON.stringify(options),
        sourceVal,
        targetVal,
        startUser,
        startTime,
        handleStatus,
        activityName,
        endTime,
        comments,
      };
      tableData.push(obj);
    }

    exchangeSlot.updateSlotListData(tableData, generateTime);
  }, []);

  useEffect(() => {
    if (isValidVariable(exchangeSlot.slotDetailId)) {
      requestData(true, true);
    }
    return () => {
      clearTimeout(timerId.current);
      timerId.current = null;
    };
  }, [exchangeSlot.slotDetailId]);

  return (
    <DraggableModal
      title="时隙交换详情"
      style={{ top: "440px", left: "10px" }}
      visible={exchangeSlot.slotDetailModalVisible}
      handleOk={() => {}}
      handleCancel={hideModal}
      width={1200}
      maskClosable={false}
      mask={false}
      // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
      destroyOnClose={true}
      footer={""}
    >
      <div className="exchange_slot_detail_canvas">
        <div
          className="mdrs_workflow"
          style={{ textAlign: "center", borderBottom: "1px solid #9a9a9a" }}
        >
          <div
            style={{
              textAlign: "left",
              fontSize: "16px",
              margin: "0 0 5px 20px",
            }}
          >{`工作流详情（流水号：${hisInstance.id || ""}）`}</div>
          <WorkList hisTasks={hisTasks} />
        </div>
        <div style={{ width: "900px", margin: "0 auto" }}>
          <FlightLine name="申请航班" data={flightData} />
          <FlightLine name="交换航班" data={exchangeFlightData} />
        </div>
      </div>
    </DraggableModal>
  );
};

export default inject("exchangeSlot")(observer(ExchangeSlotDetail));
