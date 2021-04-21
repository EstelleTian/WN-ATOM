/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-04-20 17:04:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\MDRSPage\MDRSPage.jsx
 */
import React from "react";
import { Layout } from "antd";
import MDRSWorkList from "components/MDRS/MDRSWorkList";
import { MDRSForm, MDRSDetail } from "components/MDRS/MDRSForm";

//MDRS模块
function MDRSPage() {
  return (
    <Layout style={{ minWidth: "1400px", height: "inherit" }}>
      <MDRSWorkList></MDRSWorkList>
      <MDRSDetail></MDRSDetail>
      <MDRSForm></MDRSForm>
    </Layout>
  );
}

export default MDRSPage;
