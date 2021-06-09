/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-06-09 10:50:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, { useMemo, useState, useEffect, Fragment } from "react";
import { observer, inject } from "mobx-react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Radio, Tag, Dropdown, Button, Menu } from "antd";
import { withRouter } from "react-router-dom";
import { isValidVariable } from "utils/basic-verify";
import { convertNameToTitle } from "utils/global";

//各个系统调整页面
function SystemBar(props) {
  const { match, systemPage } = props;
  const params = match.params || {};
  const from = params.from || "";
  const system = params.system || "";
  let fromKey1 = "";
  let fromKey2 = "";
  if (from.indexOf("-") > -1) {
    const fromArr = from.split("_");
    if (fromArr.length >= 2) {
      fromKey1 = fromArr[0] || "";
      fromKey2 = fromArr[1] || "";
    }
  }

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

  let userConcernTrafficListStr = localStorage.getItem(
    "userConcernTrafficList"
  );
  let userConcernTrafficList = useMemo(
    function () {
      let showAll = true;
      if (isValidVariable(from) && from !== "web") {
        showAll = false;
      }
      let list = [];
      if (props.systemPage.userHasAuth(12510)) {
        const arr = JSON.parse(userConcernTrafficListStr) || [];
        let idsList = [];

        for (let i = 0; i < arr.length; i++) {
          let item = arr[i] || {};
          if (item.concernStatus) {
            item.concernTrafficId = "focus-" + item.concernTrafficId || "";
            let name = item.concernTrafficName;
            idsList.push(item.concernTrafficId);
            if (showAll) {
              list.push(item);
            } else if (from.indexOf(name) > -1) {
              item.concernTrafficName = fromKey2.replace("CDM", "离港");
              list.push(item);
            }
          }
        }

        props.systemPage.leftNavNameList = idsList;
      }
      console.log("list", list);
      return list;
    },
    [props.systemPage.user.id]
  );

  const menu = function () {
    return (
      <Menu>
        {userConcernTrafficList.map((item) => (
          <Menu.Item
            key={item.concernTrafficId || ""}
            value={`${item.concernTrafficId}`}
            onClick={(e) => {
              groupNameChange(item);
            }}
          >
            {item.concernTrafficName}
          </Menu.Item>
        ))}
      </Menu>
    );
  };
  //系统名称赋值
  useEffect(() => {
    let name = "CRS";
    if (isValidVariable(from)) {
      if (from === "web") {
        name = "CRS-WEB";
      } else {
        name = "CDM";
      }
    }
    const user = systemPage.user || {};
    const region = user.region || "";
    if (region !== "ZLXY") {
      name = "CRS-REGION"; //分局CRS
    }
    props.flightTableData.systemName = name;
    props.flightTableData.trafficId = fromKey1;
    props.flightTableData.systemCnName = fromKey2;
    console.log(name, fromKey1, fromKey2);
  }, []);

  useEffect(() => {
    if (from !== "" && from !== "web") {
      props.systemPage.setLeftNavSelectedName(fromKey1);
      props.schemeListData.toggleSchemeActive(fromKey1);
    }
  }, []);

  return (
    <Fragment>
      {props.systemPage.userHasAuth(12510) ? (
        props.flightTableData.systemName === "CDM" ? (
          <Radio.Group
            value={props.systemPage.leftNavSelectedName}
            buttonStyle="solid"
          >
            {userConcernTrafficList.map((item) => (
              <Radio.Button
                key={item.concernTrafficId || ""}
                value={`${item.concernTrafficId}`}
                onClick={(e) => {
                  groupNameChange(item);
                }}
              >
                {item.concernTrafficName}
              </Radio.Button>
            ))}
          </Radio.Group>
        ) : (
          <Dropdown overlay={menu}>
            <Button className="sys_dropdown">
              CDM <DownOutlined />
            </Button>
          </Dropdown>
        )
      ) : (
        ""
      )}
    </Fragment>
  );
}

export default withRouter(
  inject("flightTableData", "systemPage", "schemeListData")(observer(SystemBar))
);
