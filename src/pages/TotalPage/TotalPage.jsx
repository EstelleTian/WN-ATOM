/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-08-05 13:19:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {
  Fragment,
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Layout,
  Spin,
  Row,
  Col,
  Avatar,
  Radio,
  message,
  Button,
  Tabs,
} from "antd";

import { UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { inject, observer } from "mobx-react";

import ModalBox from "components/ModalBox/ModalBox";
import PrimaryPane from "components/Total/PrimaryPane";
import User from "components/NavBar/User";
import LoadingIframe from "components/LoadingIframe/LoadingIframe";
import { openMapFrame } from "utils/client";
const { TabPane } = Tabs;

// import NavBar  from 'components/NavBar/NavBar.jsx'
import {
  getFullTime,
  isValidObject,
  isValidVariable,
  formatTimeString,
  addStringTime,
} from "utils/basic-verify";

import "components/NavBar/NavBar.scss";

import "./TotalPage.scss";

// const FlightPerformance = lazy(() =>
//   import("components/FlightPerformance/FlightPerformance")
// );
// const CapacityFlowMonitor = lazy(() =>
//   import("components/CapacityFlowMonitor/CapacityFlowMonitor")
// );

const { Header, Footer, Sider, Content } = Layout;

//总体监控布局模块
function TotalPage(props) {
  const initialPanes = [
    {
      title: "总体监控",
      content: <PrimaryPane setActiveTabPane={setActiveTabPane}></PrimaryPane>,
      // content: <div style={{background:"red"}}>ssss</div>,
      key: "primary",
      closable: false,
    },
  ];
  let [activeKey, setActiveKey] = useState(initialPanes[0].key);
  let [panes, setPanes] = useState(initialPanes);

  // 激活指定tab面板
  function setActiveTabPane({ key, title, content }) {
    console.log(panes);
    // 解析出所有key
    let keys = panes.map((item) => item.key);
    // 查找对应key
    let index = keys.indexOf(key);
    // 若当前tab面板中不包含此tab,则追加并设置为激活状态
    if (index == -1) {
      addPane({ key, title, content });
    } else {
      // 反之激活
      setActiveKey(key);
    }
  }
  // 添加tab面板
  function addPane({ key, title, content }) {
    setPanes([...panes, { title: title, content: content, key: key }]);
    setActiveKey(key);
  }
  // 移除指定tab面板
  function removePane(targetKey) {
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  }

  const onChangeActivePane = (activeKey) => {
    setActiveKey(activeKey);
  };

  // 新增和删除页签的回调
  const onEdit = (targetKey, action) => {
    // 若为删除则调用remove方法
    if (action === "remove") {
      removePane(targetKey);
    }
  };
  return (
    <div className="total-page layout-column">
      <div className="user-bar layout-row">
        <div className="single_user">
          <div className="user_icon" />
          <User />
        </div>
      </div>

      <Tabs
        hideAdd
        type="editable-card"
        onChange={onChangeActivePane}
        activeKey={activeKey}
        onEdit={onEdit}
        className="total-tabs"
      >
        {panes.map((pane) => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}

// export default withRouter(TodoPage);
// export default TodoPage

export default inject(
  "userSubscribeData",
  "flightPerformanceData",
  "systemPage"
)(observer(TotalPage));
