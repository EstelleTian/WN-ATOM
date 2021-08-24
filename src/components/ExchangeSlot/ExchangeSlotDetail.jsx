/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-24 18:10:42
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
import { Badge, Modal } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable } from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import DraggableModal from "components/DraggableModal/DraggableModal";
import "./ExchangeSlotDetail.scss";

const ExchangeSlotDetail = ({  exchangeSlot }) => {
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
        let params = {};

        const data = await requestGet2({ url, params });
        // console.log(data);
        //更新详情
        // handleTasksData(data);
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
      width={1250}
      maskClosable={false}
      mask={false}
      // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
      destroyOnClose={true}
      footer={""}
    >
      <div className="exchange_slot_detail_canvas">
        <div className="task_canvas"></div>
        <div className="flight_line flight_A"></div>
        <div className="flight_line flight_"></div>
      </div>
    </DraggableModal>
  );
};

export default inject(
  "exchangeSlot"
)(observer(ExchangeSlotDetail));
