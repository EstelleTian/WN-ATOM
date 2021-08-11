/*
 * @Author: your name
 * @Date: 2021-01-12 14:15:12
 * @LastEditTime: 2021-08-11 16:33:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\Topic.jsx
 */
import React, { useEffect } from "react";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { isValidVariable, isValidObject } from "utils/basic-verify";
import { customNotice } from "utils/common-funcs";
import { TopicConstant } from "utils/request-urls";
import JmsWebsocket from "utils/jms-websocket";

function Topic(props) {
  const { location, from } = props;
  let timer = 0;

  const stompClientFunc = (username = "") => {
    // 初始化JMS组件
    let jms_websocket = new JmsWebsocket(
      TopicConstant.url,
      TopicConstant.username,
      TopicConstant.password,
      {}
    );
    // 连接JMS消息服务器
    jms_websocket.connect(function () {
      //收到方案发布消息
      const topic_SCHEME_PUBLISH = "/exchange/TOPIC.SCHEME.PUBLISH.FLOW";
      jms_websocket.subscribe(topic_SCHEME_PUBLISH, function (d) {
        //收到消息
        console.log("收到方案发布消息,更新方案列表.");
        // 重新获取方案列表数据以刷新方案列表
        props.schemeListData.setForceUpdate(true);
      });

      //收到方案终止消息
      const topic_SCHEME_TERMINATE = "/exchange/TOPIC.SCHEME.TERMINATE.FLOW";
      jms_websocket.subscribe(topic_SCHEME_TERMINATE, function (d) {
        //收到消息
        console.log("收到方案终止消息,更新方案列表.");
        // 重新获取方案列表数据以刷新方案列表
        props.schemeListData.setForceUpdate(true);
      });
      //收到方案变更消息
      const topic_SCHEME_SLOTUPDATE = "/exchange/TOPIC.SCHEME.SLOTUPDATE.FLOW";
      jms_websocket.subscribe(topic_SCHEME_SLOTUPDATE, function (d) {
        //收到消息
        console.log("收到方案变更消息,更新方案列表.");
        // 重新获取方案列表数据以刷新方案列表
        props.schemeListData.setForceUpdate(true);
      });
      /* *
       * 收到方案消息用于【更新航班列表数据】
       * 从消息中检索方案ID集合中是否包含当前活动方案id,
       * 若存在则更新航班数据
       */
      const topic_EVENT_CENTER_TRAFFIC_FLOW_CHANGE =
        "/exchange/EXCHANGE.EVENT_CENTER_RELEASE_MONITORING_PARTIAL_CHANGE";
      jms_websocket.subscribe(
        topic_EVENT_CENTER_TRAFFIC_FLOW_CHANGE,
        function (d) {
          //收到消息
          // console.log(d);
          const body = d.body;
          const msgObj = JSON.parse(body);
          const msg = msgObj.message || [];
          // 当前活动方案id
          let activeSchemeId = props.schemeListData.activeSchemeId || "";
          // 消息中的方案ID集合中是否包含当前活动方案id
          let isIncludesActiveSchemeId = msg.includes(activeSchemeId);
          if (isIncludesActiveSchemeId) {
            // 强制刷新航班表格
            props.flightTableData.setForceUpdate(true);
          }
        }
      );
      //收消息中心-【只截取 航班协调类 消息 做处理】
      const topic_EVENT_CENTER =
        "/exchange/EXCHANGE.EVENT_CENTER_OUTEXCHANGE_" + username;
      jms_websocket.subscribe(topic_EVENT_CENTER, function (d) {
        //收到消息
        const body = d.body;
        const msgObj = JSON.parse(body);
        const { message } = msgObj;
        //工作流类别消息，不显示
        message.map((msg) => {
          if ("FCDM" === msg.dataType) {
            console.log("收到消息中心非FCDM消息,更新航班列表+待办/已办列表");
            props.flightTableData.setForceUpdate(true);
            props.todoList.setForceUpdate(true);
            props.myApplicationList.setForceUpdate(true);
          }
        });
      });
      //收到异步协调操作成功/失败消息-【更新航班数据】
      const topic_EVENT_CENTER_FC_CHANGE =
        "/exchange/EXCHANGE.EVENT_CENTER_FC_CHANGE";
      jms_websocket.subscribe(topic_EVENT_CENTER_FC_CHANGE, function (d) {
        //收到消息
        console.log("收到异步协调消息,更新航班数据");
        // console.log(d);
        const body = d.body;
        const msgObj = JSON.parse(body);
        const msg = msgObj.message || {};
        //消息
        if (msg.status * 1 !== 200) {
          const error = msg.error || {};
          const message = error.message || "";
          customNotice({
            type: "error",
            message: "收到异步协调消息,更新航班数据" + message,
            msgType: "async",
            duration: 10,
          });
        }
        //更新航班数据（一定是单条）
        const flightCoordination = msg.flightCoordination || {};
        if (isValidObject(flightCoordination)) {
          props.flightTableData.updateSingleFlight(flightCoordination);
        }
      });
      // 收到各地CDM&NTFM引接应用配置变更消息
      const topic_PARAMETER_CONFIG_SWITCH_CONFIG_CHANGE =
        "/exchange/EXCHANGE.SWITCH_CONFIG_UPDATE_ENEXCHANGE";
      jms_websocket.subscribe(
        topic_PARAMETER_CONFIG_SWITCH_CONFIG_CHANGE,
        function (d) {
          //收到消息
          const body = d.body;
          const data = JSON.parse(body);
          // 消息内容
          const msg = data.message;
          const { switchKey, switchVal } = msg;
          // 各地CDM引接应用配置
          if (
            switchKey === "cdmDataApplySwitch" &&
            isValidVariable(switchVal)
          ) {
            setTimeout(function () {
              // 强制刷新航班表格
              props.flightTableData.setForceUpdate(true);
            }, 1000 * 3);
          }
          // NTFM引接应用配置
          if (
            switchKey === "ntfmDataApplySwitch" &&
            isValidVariable(switchVal) &&
            switchVal !== props.NTFMConfigFormData.configValue
          ) {
            // 更新NTFM引接应用页面 ATOMConfigFormData Store数据
            props.NTFMConfigFormData.updateConfigValue(switchVal);
            setTimeout(function () {
              // 强制刷新航班表格
              props.flightTableData.setForceUpdate(true);
            }, 1000 * 3);
          }
        }
      );
      if (from === "web") {
        // 收到各地CDM&NTFM引接应用配置变更消息
        const topic_UUMA_ONLINEMANAGER =
          "/exchange/EXCHANGE.UUMA.ONLINEMANAGER";
        jms_websocket.subscribe(topic_UUMA_ONLINEMANAGER, function (d) {
          //收到消息
          const body = d.body;
          const data = JSON.parse(body);
          console.log(data);
        });
      }
    });
  };

  useEffect(() => {
    const pathname = location.pathname || "";
    const user = localStorage.getItem("user");
    if (isValidVariable(user)) {
      if (pathname.indexOf("/clearance") > -1) {
        const userObj = JSON.parse(user);
        stompClientFunc(userObj.username);
      }
    }
  }, []);
  return "";
}

export default withRouter(
  inject(
    "flightTableData",
    "todoList",
    "myApplicationList",
    "schemeListData",
    "ATOMConfigFormData",
    "NTFMConfigFormData"
  )(observer(Topic))
);
