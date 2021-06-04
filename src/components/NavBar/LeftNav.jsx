/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-06-03 15:49:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, { useMemo, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Radio, Tag } from "antd";
import RefreshBtn from "components/SchemeList/RefreshBtn";
import { withRouter } from "react-router-dom";
import { isValidVariable } from "utils/basic-verify";
import { convertNameToTitle } from "utils/global";

//顶部 左导航模块
function LeftNav(props) {
  const [dateRangeStr, setDateRangeStr] = useState("");
  const { match, systemPage } = props;
  const params = match.params || {};
  const from = params.from || "";
  let fromKey1 = "";
  let fromKey2 = "";
  if (from.indexOf("-") > -1) {
    const fromArr = from.split("_");
    if (fromArr.length >= 2) {
      fromKey1 = fromArr[0] || "";
      fromKey2 = fromArr[1] || "";
      document.title = convertNameToTitle(fromKey2);
    }
  }

  const groupNameChange = (item) => {
    const concernTrafficId = item.concernTrafficId;
    const concernTrafficName = item.concernTrafficName; //如果是crs或者web点击跳转
    if (from === "" || from === "web") {
      window.open(
        "./#/clearance/" + concernTrafficId + "_" + concernTrafficName
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
  useEffect(() => {
    if (from !== "" && from !== "web") {
      props.systemPage.setLeftNavSelectedName(fromKey1);
      props.schemeListData.toggleSchemeActive(fromKey1);
    }
  }, []);
  useEffect(() => {
    const dateRangeData = systemPage.getDateRangeData();
    setDateRangeStr(dateRangeData);
  }, [systemPage.dateRangeData]);

  return (
    <div className="layout-nav-left layout-row nav_bar">
      {props.systemPage.userHasAuth(12510) && (
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
      )}
      <Radio.Group buttonStyle="solid">
        <Radio.Button
          value="a"
          onClick={(e) => {
            props.systemPage.setDateRangeVisible(true);
          }}
        >
          计划范围
          {dateRangeStr !== "" && (
            <Tag className="range_tag" color="#3d8424">
              {dateRangeStr}
            </Tag>
          )}
        </Radio.Button>
      </Radio.Group>
      <Radio.Group buttonStyle="solid">
        <RefreshBtn />
      </Radio.Group>
    </div>
  );
}

export default withRouter(
  inject("systemPage", "schemeListData")(observer(LeftNav))
);
