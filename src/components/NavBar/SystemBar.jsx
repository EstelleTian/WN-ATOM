/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-06-10 15:51:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import { observer, inject } from "mobx-react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Radio, Tag, Dropdown, Button, Menu } from "antd";
import { withRouter } from "react-router-dom";
import { isValidVariable } from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { convertNameToTitle } from "utils/global";
import { customNotice } from "utils/common-funcs";

//各个系统调整页面
function SystemBar(props) {
  const { match, systemPage, flightTableData } = props;
  const systemKind = systemPage.systemKind || "";
  const params = match.params || {};
  const url = match.url || "";
  const systemType = params.systemType || "";

  const groupNameChange = (item) => {
    const concernTrafficId = item.concernTrafficId;
    const concernTrafficName = item.concernTrafficName; //如果是crs或者web点击跳转
    if (from === "" || from === "web") {
      let system = "CRS";
      if (concernTrafficName.indexOf("CDM") > -1) {
        system = "CDM";
      }
      window.open(
        "./#/clearance/" +
          system +
          "/" +
          concernTrafficId +
          "_" +
          concernTrafficName
      );
    } else {
      if (props.systemPage.leftNavSelectedName !== concernTrafficId) {
        props.systemPage.setLeftNavSelectedName(concernTrafficId);
        props.schemeListData.toggleSchemeActive("");
      } else {
        props.systemPage.setLeftNavSelectedName("");
        props.schemeListData.toggleSchemeActive("first");
      }
    }
  };
  const { cdmList = [], crsList = [] } = systemPage.getSystemListByGroup();
  const cdmMenu = function () {
    return (
      <Menu>
        {cdmList.map((item) => (
          <Menu.Item
            key={item.id || ""}
            value={`${item.systemType}`}
            onClick={(e) => {
              groupNameChange(item);
            }}
          >
            {item.systemName}
          </Menu.Item>
        ))}
      </Menu>
    );
  };
  const crsMenu = function () {
    return (
      <Menu>
        {crsList.map((item) => (
          <Menu.Item
            key={item.id || ""}
            value={`${item.systemType}`}
            onClick={(e) => {
              groupNameChange(item);
            }}
          >
            {item.systemName}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  //根据用户id获取系统列表
  const getSystemListById = useCallback(async (userId) => {
    try {
      const res = await requestGet2({
        url: ReqUrls.systemListUrl + userId,
      });
      const uumaSystemList = res.uumaSystemList || [];
      systemPage.setSystemList(uumaSystemList, systemType);

      let name = "CRS";
      if (isValidVariable(systemType)) {
        if (systemType.indexOf("CDM") > -1) {
          name = "CDM";
        } else {
          const user = systemPage.user || {};
          const region = user.region || "";
          if (region !== "ZLXY") {
            name = "CRS-REGION"; //分局CRS
          }
        }
      }
      systemPage.setSystemKind(name);
      //flight也存一份，为的航班自动滚动知道是按哪列定位
      flightTableData.systemName = name;
    } catch (e) {
      customNotice({
        type: "error",
        content: "获取的用户可访问系统列表失败",
      });
    }
  }, []);

  const getContent = () => {
    if (systemPage.systemKind === "CDM") {
      const item = systemPage.activeSystem || {};
      return (
        <Radio.Group value={item.systemType} buttonStyle="solid">
          <Radio.Button
            key={item.id || ""}
            value={`${item.systemType}`}
            onClick={(e) => {
              groupNameChange(item);
            }}
          >
            {item.systemName.replace("CDM", "离港")}
          </Radio.Button>
        </Radio.Group>
      );
    } else {
      return (
        <Fragment>
          <Dropdown overlay={cdmMenu}>
            <Button className="sys_dropdown">
              CDM <DownOutlined />
            </Button>
          </Dropdown>
          <Dropdown overlay={crsMenu}>
            <Button className="sys_dropdown">
              CRS <DownOutlined />
            </Button>
          </Dropdown>
        </Fragment>
      );
    }
  };

  //系统名称赋值
  useEffect(() => {
    const userId = systemPage.user.id || "";
    if (isValidVariable(userId)) {
      //根据id获取系统列表
      getSystemListById(userId);
    }
  }, [systemPage.user.id]);

  return (
    <Fragment>{systemPage.userHasAuth(12510) ? getContent() : ""}</Fragment>
  );
}

export default withRouter(
  inject("flightTableData", "systemPage", "schemeListData")(observer(SystemBar))
);
