/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-06-18 10:07:13
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
  const { match, systemPage, flightTableData, schemeListData } = props;
  const systemKind = systemPage.systemKind || "";
  const params = match.params || {};
  const url = match.url || "";
  const systemType = params.systemType || "";

  window.onunload = function () {
    let openWind = localStorage.getItem("openWind");
    let openWindArr = openWind.split(",");
    let newArr = openWindArr.filter((wind) => wind !== systemType);
    localStorage.setItem("openWind", newArr.join(","));
  };

  const groupNameChange = (item) => {
    let systemType = item.systemType;
    let urlStr = url;
    const len = urlStr.length;
    if (urlStr.substring(len - 1, len) === "/") {
      urlStr = urlStr.substring(0, len - 1);
    }
    let openWind = localStorage.getItem("openWind");
    if (!isValidVariable(openWind)) {
      openWind = "";
    }
    if (openWind.indexOf(systemType) > -1) {
      return;
    }
    const winObj = window.open("./#" + urlStr + "/" + systemType);
    localStorage.setItem("openWind", openWind + "," + systemType);
  };
  const groupNameChange2 = (item) => {
    //如果激活方案是all，则标志请求全部航班，否则取方案第一个影响航班
    if (systemPage.leftNavSelectedName !== "all") {
      systemPage.setLeftNavSelectedName("all");
      schemeListData.toggleSchemeActive("");
    } else {
      systemPage.setLeftNavSelectedName("");
      schemeListData.toggleSchemeActive("");
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

      let name = "";
      //url有标识，取url标识
      if (systemType.indexOf("CDM") > -1) {
        name = "CDM";
        systemPage.setLeftNavSelectedName("all");
      } else {
        //url无标识，取默认激活的对象
        const activeSystem = systemPage.activeSystem || {};
        const system = activeSystem.system || "";
        if (system.indexOf("CDM") > -1) {
          name = "CDM";
          systemPage.setLeftNavSelectedName("all");
        } else if (system.indexOf("CRS") > -1) {
          const region = activeSystem.region || "";
          if (region !== "ZLXY") {
            name = "CRS-REGION"; //分局CRS
          } else {
            name = "CRS"; //CRS
          }
        }
      }
      if (!isValidVariable(name)) {
        name = "CRS";
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
  // console.log("systemPage.leftNavSelectedName", systemPage.leftNavSelectedName);
  const getContent = () => {
    if (systemPage.systemKind === "CRS-REGION") {
      return "";
    } else if (systemPage.systemKind === "CDM") {
      const item = systemPage.activeSystem || {};
      return (
        <Radio.Group value={systemPage.leftNavSelectedName} buttonStyle="solid">
          <Radio.Button
            key={item.id || ""}
            value={"all"}
            onClick={(e) => {
              groupNameChange2(item);
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
