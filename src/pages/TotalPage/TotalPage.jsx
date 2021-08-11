/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-08-05 13:19:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {  useState,} from "react";
import {  Tabs,} from "antd";
import { inject, observer } from "mobx-react";
// 主tab面板
import PrimaryPane from "components/Total/PrimaryPane";
// 用户组件
import User from "components/NavBar/User";
const { TabPane } = Tabs;
import "components/NavBar/NavBar.scss";
import "./TotalPage.scss";

//总体监控布局模块
function TotalPage(props) {
  // 初始化tab面板数据对象
  const initialPanes = [
    {
      title: "总体监控",
      content: <PrimaryPane setActiveTabPane={setActiveTabPane}></PrimaryPane>,
      key: "primary",
      closable: false,
    },
  ];
  // 活动tab面板  
  let [activeKey, setActiveKey] = useState(initialPanes[0].key);
  // tab面板集合
  let [panes, setPanes] = useState(initialPanes);

  // 激活指定tab面板
  function setActiveTabPane({ key, title, content }) {
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
  //  切换面板
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

export default inject(
  "userSubscribeData",
  "flightPerformanceData",
  "systemPage"
)(observer(TotalPage));
