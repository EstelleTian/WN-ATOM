/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-08-26 15:51:14
 * @LastEditTime: 2021-06-21 18:18:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, { useEffect, Fragment, useState } from "react";
import { observer, inject } from "mobx-react";
import { DownOutlined } from "@ant-design/icons";
import { Radio, Dropdown, Menu, Badge } from "antd";
import FlightTableColumnConfigModal from "components/FlightTableColumnConfigModal/FlightTableColumnConfigModal";
import ATOMConfigModal from "components/ATOMConfigModal/ATOMConfigModal";
import NTFMConfigModal from "components/NTFMConfigModal/NTFMConfigModal";
import ATOMConfigInit from "components/ATOMConfigModal/ATOMConfigInit";
import PositionModal from "components/Position/PositionModal";
import ProhibitedNav from "components/Prohibited/ProhibitedNav";
import ColumnDataInit from "./ColumnDataInit";

//参数配置页面
function ParameterConfiguration({
  ATOMConfigFormData,
  NTFMConfigFormData,
  columnConfig,
  prohibitedData,
}) {
  const [positionModalVisible, setPositionModalVisible] = useState(false);

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
        <Menu.Item key="Position" value="Position" onClick={showPositionModal}>
          备降停机位
        </Menu.Item>
        {/* 禁航信息 */}
        <Menu.Item
          key="Prohibited"
          value="Prohibited"
          onClick={showProhibitedModal}
        >
          <span>
            禁航信息管理
            {/* {prohibitedData.dataList.length > 0 && (
              <Badge
                count={prohibitedData.dataList.length}
                style={{ backgroundColor: "rgb(61, 132, 36)" }}
              />
            )} */}
          </span>
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
  // 显示禁航信息模态框
  const showProhibitedModal = () => {
    prohibitedData.setProhibitedListModalVisible(true);
  };

  // 显示备降停机位模态框
  const showPositionModal = () => {
    setPositionModalVisible(true);
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
      {/* 表格列配置数据初始化组件 */}
      <ColumnDataInit />
      <ATOMConfigInit />
      <ATOMConfigModal />
      <NTFMConfigModal />
      <PositionModal
        visible={positionModalVisible}
        setPositionModalVisible={setPositionModalVisible}
      />
      {/* 禁航信息相关 */}
      <ProhibitedNav />
    </Fragment>
  );
}

export default inject(
  "ATOMConfigFormData",
  "NTFMConfigFormData",
  "columnConfig",
  "prohibitedData"
)(observer(ParameterConfiguration));
