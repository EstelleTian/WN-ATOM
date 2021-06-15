/*
 * @Author: your name
 * @Date: 2020-12-23 20:10:27
 * @LastEditTime: 2021-06-15 10:01:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\app.jsx
 */
import React, { useState, useMemo } from "react";
import ReactDom from "react-dom";
import Routes from "./routes/route";
import { ConfigProvider, notification } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import "normalize.css";
import "dhx-suite/codebase/suite.min.css";
import "./custom-ant-theme.less";
import "./app.less";

notification.config({
  placement: "bottomLeft",
  duration: null,
  maxCount: 1,
});

const root = document.createElement("div");
root.className = "root";
document.body.appendChild(root);

ReactDom.render(
  <ConfigProvider locale={zh_CN}>
    <Routes />
  </ConfigProvider>,
  root
);
