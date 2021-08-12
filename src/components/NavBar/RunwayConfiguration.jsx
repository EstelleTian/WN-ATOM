/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-08-12 17:20:30
 * @LastEditTime: 2021-06-21 18:18:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, { useEffect, Fragment } from "react";
import { observer, inject } from "mobx-react";
import { DownOutlined } from "@ant-design/icons";
import { Radio, Dropdown, Menu } from "antd";
import RunwayDynamicPublishModal from "components/RunwayDynamicPublishModal/RunwayDynamicPublishModal";
import RunwayFormworkmanagement from "components/RunwayFormworkManagement/RunwayFormworkmanagement";
//参数配置页面
function RunwayConfiguration({
  RunwayDynamicPublishFormData,
  RunwayFormworkmanagementData,
  systemPage,
}) {
  let hasAuth = systemPage.userHasAuth(12520);
  const menu = function () {
    if (hasAuth) {
      return (
        <Menu>
          {systemPage.userHasAuth(12520) && (
            <Menu.Item
              key="RunwayDynamicPublish"
              value="RunwayDynamicPublish"
              onClick={showRunwayDynamicPublishModal}
            >
              动态跑道发布
            </Menu.Item>
          )}

          {systemPage.userHasAuth(12521) && (
            <Menu.Item
              key="RunwayTemplate"
              value="RunwayTemplate"
              onClick={showRunwayFormworkmanagement}
            >
              跑道模板管理
            </Menu.Item>
          )}
        </Menu>
      );
    } else {
      return "";
    }
  };

  // 显示动态跑道发布模态框
  const showRunwayDynamicPublishModal = () => {
    RunwayDynamicPublishFormData.toggleModalVisible(true);
    RunwayFormworkmanagementData.togIsGo("is");
  };

  // 显示跑道模板管理模态框
  const showRunwayFormworkmanagement = () => {
    RunwayFormworkmanagementData.toggleTemplateVisible(true);
  };

  return (
    <Fragment>
      {hasAuth ? (
        <Dropdown overlay={menu}>
          <Radio.Button value="runway">
            跑道配置
            <DownOutlined />
          </Radio.Button>
        </Dropdown>
      ) : (
        <Radio.Button value="runway">跑道配置</Radio.Button>
      )}
      <RunwayDynamicPublishModal />
      <RunwayFormworkmanagement />
    </Fragment>
  );
}

export default inject(
  "RunwayDynamicPublishFormData",
  "RunwayFormworkmanagementData",
  "systemPage"
)(observer(RunwayConfiguration));
