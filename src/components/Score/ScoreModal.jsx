/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-27 13:18:51
 * @LastEditors: Please set LastEditors
 * @Description: 贡献值与诚信值管理
 * @FilePath: \WN-ATOM\src\components\NavBar\ScoreModal.jsx
 */
import React, {
  Fragment,
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import { Tabs } from "antd";
import { isValidVariable } from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import DraggableModal from "components/DraggableModal/DraggableModal";
import ScoreList from "./ScoreList";
import ScoreConfig from "./ScoreConfig";
import "./ScoreModal.scss";
const { TabPane } = Tabs;
const ScoreModal = (props) => {
  const timerId = useRef();
  const tableTotalWidth = useRef();
  // const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dedicated");

  const hideModal = () => {
    props.setScoreModalVisible(false);
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

    // exchangeSlot.updateSlotListData(tableData, generateTime);
  }, []);

  useEffect(() => {
    //requestData(true, true);
    return () => {
      clearTimeout(timerId.current);
      timerId.current = null;
    };
  }, []);

  return (
    <DraggableModal
      title="贡献值与诚信值管理"
      style={{ top: "110px", right: "20px", float: "right" }}
      visible={props.visible}
      handleOk={() => {}}
      handleCancel={hideModal}
      width={700}
      maskClosable={false}
      mask={false}
      destroyOnClose={true}
      footer={""}
    >
      <Tabs
        size="large"
        style={{ marginTop: -25 }}
        activeKey={activeTab}
        onChange={function (activeKey) {
          console.log(activeKey);
          setActiveTab(activeKey);
        }}
      >
        <TabPane tab="奉献值列表" key="dedicated">
          <ScoreList name="dedicated" />
        </TabPane>
        <TabPane tab="诚信值列表" key="integrity">
          <ScoreList name="integrity" />
        </TabPane>
        <TabPane tab="奉献值参数配置" key="dedicatedConfig">
          <ScoreConfig name="dedicated" />
        </TabPane>
        <TabPane tab="诚信值参数配置" key="integrityConfig">
          <ScoreConfig name="integrity" />
        </TabPane>
      </Tabs>
    </DraggableModal>
  );
};

export default ScoreModal;
