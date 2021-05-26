/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-05-26 16:06:59
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

//顶部 左导航模块
function LeftNav(props) {
  const [dateRangeStr, setDateRangeStr] = useState("");
  const { match, systemPage } = props;
  const params = match.params || {};
  const from = params.from || "";

  const groupNameChange = (e) => {
    const value = e.target.value;
    console.log(value);
    window.open("./#/clearance/" + value);
    //打开新的放行页面
    //2021-05-11改版默认交通流方向单独弹窗
    // if (props.systemPage.leftNavSelectedName !== value) {
    //   props.systemPage.setLeftNavSelectedName(value);
    //   props.schemeListData.toggleSchemeActive(value);
    // } else {
    //   props.systemPage.setLeftNavSelectedName("");
    //   props.schemeListData.toggleSchemeActive("");
    // }
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
        let name = "";
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i] || {};
          if (item.concernStatus) {
            // name = "focus-" + item.concernTrafficId || "";
            name = item.concernTrafficId || "";
            idsList.push(name);
            if (showAll) {
              list.push(item);
            } else if (name === from) {
              list.push(item);
              document.title =
                (item.concernTrafficName || "") + "机场协同放行排序";
            }
            //2021-05-11改版默认交通流方向单独弹窗
            // if (i === 0) {
            //   props.systemPage.setLeftNavSelectedName(name);
            //   props.schemeListData.toggleSchemeActive(name);
            // }
          }
        }

        props.systemPage.leftNavNameList = idsList;
      }

      return list;
    },
    [props.systemPage.user.id]
  );
  useEffect(() => {
    const dateRangeData = systemPage.getDateRangeData();
    setDateRangeStr(dateRangeData);
    console.log("dateRangeData", dateRangeData);
  }, [systemPage.dateRangeData]);
  return (
    <div className="layout-nav-left layout-row nav_bar">
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
      {props.systemPage.userHasAuth(12510) && (
        <Radio.Group
          value={
            isValidVariable(from) && from !== "web"
              ? from
              : props.systemPage.leftNavSelectedName
          }
          buttonStyle="solid"
        >
          {userConcernTrafficList.map((item) => (
            <Radio.Button
              key={item.concernTrafficName || ""}
              value={`${item.concernTrafficId}`}
              // value={`focus-${item.concernTrafficId}`}
              onClick={groupNameChange}
            >
              {item.concernTrafficName}
            </Radio.Button>
          ))}
        </Radio.Group>
      )}
      <Radio.Group buttonStyle="solid">
        <RefreshBtn />
      </Radio.Group>
    </div>
  );
}

export default withRouter(
  inject("systemPage", "schemeListData")(observer(LeftNav))
);
