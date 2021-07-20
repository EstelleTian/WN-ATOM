/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-07-20 17:46:26
 * @LastEditTime: 2021-06-21 18:18:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, { useEffect, Fragment } from "react";
import { observer, inject } from "mobx-react";
import { DownOutlined } from "@ant-design/icons";
import { Radio, Dropdown, Menu } from "antd";
import FlightTableColumnConfigModal from "components/FlightTableColumnConfigModal/FlightTableColumnConfigModal";
import ATOMConfigModal from "components/ATOMConfigModal/ATOMConfigModal";
import NTFMConfigModal from "components/NTFMConfigModal/NTFMConfigModal";
import ATOMConfigInit from "components/ATOMConfigModal/ATOMConfigInit";
import ColumnDataInit from "./ColumnDataInit";

//参数配置页面
function ParameterConfiguration({
  ATOMConfigFormData,
  NTFMConfigFormData,
  systemPage,
  columnConfig,
}) {
  const menu = function () {
    return (
      <Menu>
        <Menu.Item
          key="FlightTableColumnConfig"
          value="FlightTableColumnConfig"
          onClick={showFlightTableColumnConfigModal}
        >
          表格列序配置
        </Menu.Item>
        <Menu.Item
          key="ATOMConfig"
          value="ATOMConfig"
          onClick={showATOMConfigurationModal}
        >
          各地CDM引接应用配置
        </Menu.Item>
        <Menu.Item
          key="NTFMConfig"
          value="NTFMConfig"
          onClick={showNTFMConfigurationModal}
        >
          NTFM引接应用配置
        </Menu.Item>
      </Menu>
    );
  };

  // 显示表格列序配置模态框
  const showFlightTableColumnConfigModal = () => {
    columnConfig.toggleModalVisible(true);
  };
  // 显示ATOM引接应用配置模态框
  const showATOMConfigurationModal = () => {
    ATOMConfigFormData.toggleModalVisible(true);
  };

  // 显示NTFM引接应用配置模态框
  const showNTFMConfigurationModal = () => {
    NTFMConfigFormData.toggleModalVisible(true);
  };

  return (
    <Fragment>
      <Dropdown overlay={menu}>
        <Radio.Group buttonStyle="solid" value="">
          <Radio.Button value="system">
            参数配置
            <DownOutlined />
          </Radio.Button>
        </Radio.Group>
      </Dropdown>
      {columnConfig.modalVisible && <FlightTableColumnConfigModal />}
      <ColumnDataInit />
      <ATOMConfigInit />
      <ATOMConfigModal />
      <NTFMConfigModal />
    </Fragment>
  );
}

export default inject(
  "ATOMConfigFormData",
  "NTFMConfigFormData",
  "systemPage",
  "columnConfig"
)(observer(ParameterConfiguration));
