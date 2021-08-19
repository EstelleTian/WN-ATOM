/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-19 18:07:24
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\ExchangeSlotNav.jsx
 */
import React, {
  Fragment,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { Tabs, Radio, Badge, Modal } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable } from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import DraggableModal from "components/DraggableModal/DraggableModal";
import ExchangeSlotTable from "./ExchangeSlotTable";
import "./ExchangeSlotNav.scss";

const { TabPane } = Tabs;

const ExchangeSlotNav = ({ systemPage, exchangeSlot }) => {
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const timerId = useRef();
  const slotList = exchangeSlot.slotList || [];
  const modalActiveName = systemPage.modalActiveName || "";
  const user = systemPage.user || {};
  const slotListLen = slotList.length || 0;

  const hideModal = () => {
    setSlotModalVisible(false);
    systemPage.setModalActiveName("");
  };
  //获取时隙交换列表请求
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
      if (!isValidVariable(user.id)) {
        timerFunc();
        return;
      }
      if (triggerLoading) {
        exchangeSlot.toggleLoad(true);
      }

      let url = ReqUrls.retrieveExchangeSlotInfoUrl + user.id;

      try {
        let params = {};
        let dateRangeData = systemPage.dateRangeData || [];
        if (dateRangeData.length >= 2) {
          params["startTime"] = dateRangeData[0] || "";
          params["endTime"] = dateRangeData[1] || "";
        }
        const data = await requestGet2({ url, params });
        // console.log(data);
        //更新工作流数据
        handleTasksData(data);
        exchangeSlot.toggleLoad(false);
        timerFunc();
      } catch (e) {
        let msg = "时隙交换列表数据获取失败";
        if (isValidVariable(e)) {
          let msg = e;
        }
        customNotice({
          type: "error",
          message: msg,
        });
        exchangeSlot.toggleLoad(false);
        timerFunc();
      }
    },
    [user.id]
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
        key,
        // sourceFlight,
        // targetFlight,
        authorities,
        exchangeId: targetFmeId, //航班B
        flightId: businessId, //航班A
      };

      let obj = {
        key: taskId,
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
    if (modalActiveName === "slot") {
      setSlotModalVisible(true);
    } else {
      setSlotModalVisible(false);
    }
  }, [modalActiveName]);

  useEffect(() => {
    if (exchangeSlot.forceUpdate) {
      console.log("强制更新时隙交换列表");
      requestData(false, false);
    }
  }, [exchangeSlot.forceUpdate]);

  useEffect(() => {
    if (isValidVariable(user.id) && systemPage.dateRangeData.length > 0) {
      requestData(true, true);
    }
    return () => {
      clearTimeout(timerId.current);
      timerId.current = null;
    };
  }, [user.id, systemPage.dateRangeData]);

  return (
    <Fragment>
      <Radio.Button value="slot">
        时隙交换信息
        {slotListLen > 0 ? (
          <Badge
            className="site-badge-count-109"
            count={slotListLen}
            style={{ backgroundColor: "rgb(61, 132, 36)" }}
          />
        ) : (
          ""
        )}
      </Radio.Button>

      <DraggableModal
        title="时隙交换列表"
        style={{ top: "110px", left: "320px" }}
        visible={slotModalVisible}
        handleOk={() => {}}
        handleCancel={hideModal}
        width={1250}
        maskClosable={false}
        mask={false}
        // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
        destroyOnClose={true}
        footer={""}
      >
        <ExchangeSlotTable requestData={requestData} />
      </DraggableModal>
    </Fragment>
  );
};

export default inject("systemPage", "exchangeSlot")(observer(ExchangeSlotNav));
