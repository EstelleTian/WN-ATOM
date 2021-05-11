/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-05-11 14:57:15
 * @LastEditors: Please set LastEditors
 * @Description: 消息订阅
 * @FilePath: \WN-CDM\src\pages\NewsSubscribePage\NewsSubscribePage.jsx
 */
import React, {
  Fragment,
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from "react";
import { inject, observer } from "mobx-react";
import { CloseOutlined } from "@ant-design/icons";
import { Layout, Tooltip, Tabs, Button, Checkbox } from "antd";
import {
  isValidObject,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
const { TabPane } = Tabs;

//订阅事件-tab+内容
function tabCont(props) {
  const { children = [], newsSubscribe } = props;
  const data = newsSubscribe.data || {};
  const { categorySubscribeConfigs = [] } = data;

  function handleSubscribe(e) {
    // console.log(`checked = ${e.target.checked}`);
    const target = e.target;
    const code = target.code;
    const type = target.parentType;
    const checked = target.checked;
    newsSubscribe.updateSubChecked(type, code, checked);
  }

  return (
    <div className="subscribe_tabs_cont">
      {children.map((child) => {
        if (isValidVariable(child)) {
          // {
          //      children: []
          //      code: "FLAC"
          //      id: 66
          //      name: "航班异常编码"
          //      seq: 1
          //      subscribe: true
          //      type: "FLAI"
          // }
          return (
            <Checkbox
              className="tab_row"
              key={child.id}
              checked={child.subscribe}
              code={child.code}
              parentType={child.type}
              onChange={handleSubscribe}
            >
              {child.name}
            </Checkbox>
          );
        } else {
          return "";
        }
      })}
    </div>
  );
}
const TabCont = inject("newsSubscribe")(observer(tabCont));
//订阅事件-tab+内容
function NewsSubscribeCont(props) {
  const { newsSubscribe = {} } = props;
  const data = newsSubscribe.data || {};
  const { categorySubscribeConfigs = [] } = data;

  function callback(key) {
    // console.log(key);
    newsSubscribe.setTabSelect(key);
  }

  return (
    <div className="subscribe_tabs">
      <Tabs onChange={callback} type="card">
        {categorySubscribeConfigs.map((item) => (
          <TabPane tab={item.name} key={item.type}>
            <TabCont children={item.children}></TabCont>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default inject("newsSubscribe")(observer(NewsSubscribeCont));
