/*
 * @Author: your name
 * @Date: 2021-07-13 10:53:32
 * @LastEditTime: 2021-09-03 15:19:00
 * @LastEditors: liutianjiao
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\index.tsx
 */
// import * as React from "react";
// import * as ReactDOM from "react-dom";

// import { Hello } from "./Hello";

// const root = document.createElement("div");
// root.className = "root";
// document.body.appendChild(root);
// // <div>123123</div>,
// ReactDOM.render(
//   <Hello compiler="TypeScript" framework="React" />,
//     root
// );


// import React, { useState, useMemo } from "react";
// import ReactDom from "react-dom";
import * as React from "react";
import * as ReactDOM from "react-dom";
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
});

const root = document.createElement("div");
root.className = "root";
document.body.appendChild(root);

ReactDOM.render(
  <ConfigProvider locale={zh_CN}>
    <Routes />
  </ConfigProvider>,
  root
);
