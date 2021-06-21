/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-06-09 10:50:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, { useEffect, Fragment } from "react";
import { observer, inject } from "mobx-react";
import { DownOutlined } from "@ant-design/icons";
import { Radio, Dropdown, Menu } from "antd";
import { withRouter } from "react-router-dom";
import ATOMConfigModal from "components/ATOMConfigModal/ATOMConfigModal";
import NTFMConfigModal from "components/NTFMConfigModal/NTFMConfigModal";

//参数配置页面
function ParameterConfiguration(props) {
  const { ATOMConfigFormData, NTFMConfigFormData, systemPage } = props;
  const menu = function () {
    return (
      <Menu>
        {
          systemPage.userHasAuth(12515) && <Menu.Item
          key="ATOMConfig"
          value="ATOMConfig"
          onClick={showATOMConfigurationModal}
        >
          各地CDM引接应用配置
        </Menu.Item>
        }
        {
          systemPage.userHasAuth(12516) && <Menu.Item
          key="NTFMConfig"
          value="NTFMConfig"
          onClick={showNTFMConfigurationModal}
        >
          NTFM引接应用配置
        </Menu.Item>
        }
        
      </Menu>
    );
  };

  // 显示ATOM引接应用配置模态框
  const showATOMConfigurationModal =()=> {
    ATOMConfigFormData.toggleModalVisible(true)
  }

  // 显示NTFM引接应用配置模态框
  const showNTFMConfigurationModal =()=> {
    NTFMConfigFormData.toggleModalVisible(true)
  }

  useEffect(() => {

  }, []);

  return (
    <Fragment>
      <Dropdown overlay={menu}>
        <Radio.Group buttonStyle="solid" value="">
          <Radio.Button value="system">参数配置<DownOutlined /></Radio.Button>
        </Radio.Group>
      </Dropdown>
      <ATOMConfigModal />
      <NTFMConfigModal />
    </Fragment>
  );
}

export default withRouter(
  inject("ATOMConfigFormData", "NTFMConfigFormData","systemPage")(observer(ParameterConfiguration))
);
