/*
 * @Author: your name
 * @Date: 2021-01-12 14:15:12
 * @LastEditTime: 2021-04-28 13:18:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\Topic.jsx
 */
import React, { useEffect } from "react";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { isValidVariable } from "utils/basic-verify";
import Stomp from "stompjs";

function Topic(props) {
  const { location } = props;

  const pathname = location.pathname || "";
  const user = localStorage.getItem("user");
  const stompClientFunc = (username = "") => {
    console.log("建立连接  ", username);
    if (!isValidVariable(username)) {
      return;
    }
    // alert("建立连接:" + username);
    // console.log("建立连接");
    // 建立连接
    let ws = new WebSocket("ws://192.168.210.150:15674/ws");
    let stompClient = Stomp.over(ws);
    stompClient.heartbeat.outgoing = 200;
    stompClient.heartbeat.incoming = 0;
    stompClient.debug = null;

    let on_connect = function (x) {
      console.log("放行监控 WebSocket连接成功:");
      // console.log(x);
      //收到方案发布消息
      const topic_SCHEME_PUBLISH = "/exchange/TOPIC.SCHEME.PUBLISH.FLOW";
      stompClient.subscribe(topic_SCHEME_PUBLISH, function (d) {
        //收到消息
        console.log("收到方案发布消息,更新方案列表.");
        // 重新获取方案列表数据以刷新方案列表
        props.schemeListData.setForceUpdate(true);
      });
      //收到方案终止消息
      const topic_SCHEME_TERMINATE = "/exchange/TOPIC.SCHEME.TERMINATE.FLOW";
      stompClient.subscribe(topic_SCHEME_TERMINATE, function (d) {
        //收到消息
        console.log("收到方案终止消息,更新方案列表.");
        // 重新获取方案列表数据以刷新方案列表
        props.schemeListData.setForceUpdate(true);
      });
      //收到方案变更消息
      const topic_SCHEME_SLOTUPDATE = "/exchange/TOPIC.SCHEME.SLOTUPDATE.FLOW";
      stompClient.subscribe(topic_SCHEME_SLOTUPDATE, function (d) {
        //收到消息
        console.log("收到方案变更消息,更新方案列表." + d);
        // 重新获取方案列表数据以刷新方案列表
        props.schemeListData.setForceUpdate(true);
      });
      //收到限制消息-【交通流消息】
      const topic_EVENT_CENTER_TRAFFIC_FLOW_CHANGE =
        "/exchange/EXCHANGE.EVENT_CENTER_TRAFFIC_FLOW_CHANGE";
      stompClient.subscribe(
        topic_EVENT_CENTER_TRAFFIC_FLOW_CHANGE,
        function (d) {
          //收到消息
          console.log("收到交通流消息,更新航班列表+待办/已办列表");
          props.flightTableData.setForceUpdate(true);
          props.todoList.setForceUpdate(true);
          props.myApplicationList.setForceUpdate(true);
        }
      );
      //收消息中心-【只截取 航班协调类 消息 做处理】
      const topic_EVENT_CENTER =
        "/exchange/EXCHANGE.EVENT_CENTER_OUTEXCHANGE_" + username;
      stompClient.subscribe(topic_EVENT_CENTER, function (d) {
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
      //收到异步协调操作成功/失败消息-【更新多条航班数据】
      const topic_EVENT_CENTER_FC_CHANGE =
        "/exchange/EXCHANGE.EVENT_CENTER_FC_CHANGE";
      stompClient.subscribe(topic_EVENT_CENTER_FC_CHANGE, function (d) {
        //收到消息
        console.log("收到异步协调操作成功/失败消息,更新多条航班数据");
        console.log(d);
      });
    };

    let on_error = function (error) {
      console.log("放行监控 WebSocket连接失败:");
      console.log(error);
      setTimeout(function () {
        stompClientFunc(username);
      }, 5000);
    };
    // 连接消息服务器
    stompClient.connect("guest", "guest", on_connect, on_error, "/");
  };
  if (isValidVariable(user)) {
    if (pathname.indexOf("/clearance") > -1) {
      const userObj = JSON.parse(user);
      stompClientFunc(userObj.username);
    }
  }

  return "";
}

export default withRouter(
  inject(
    "flightTableData",
    "todoList",
    "myApplicationList",
    "schemeListData"
  )(observer(Topic))
);
