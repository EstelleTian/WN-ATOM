/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-08-26 14:14:04
 * @LastEditTime: 2021-06-21 18:18:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React from "react";
import { observer, inject } from "mobx-react";
import { Menu } from "antd";
import ProhibitedModal from "./ProhibitedModal";
import ProhibitedForm from "./ProhibitedForm";

//参数配置页面
function ProhibitedNav() {
  return (
    <>
      {/* 禁航信息列表 模态框 */}
      <ProhibitedModal />
      {/* 禁航信息添加、修改 模态框 */}
      <ProhibitedForm />
    </>
  );
}

export default ProhibitedNav;
