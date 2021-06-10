/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-06-10 17:55:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\Common\DateRange.jsx
 */
import React, { useEffect, useCallback } from "react";
import { inject, observer } from "mobx-react";
import { isValidVariable, isValidObject } from "utils/basic-verify.js";
import { requestGet2 } from "utils/request.js";
import { ReqUrls } from "utils/request-urls.js";
import { customNotice } from "utils/common-funcs";

const calcNum = (str) => {
  let num = 0;
  const arr = str.split("_");
  let t1 = arr[0] * 1;
  let t2 = arr[1].substring(0, 2) * 1;
  if (t1 === 0) {
    num = 24;
  } else if (t1 === 1) {
    num = 48;
  }
  return num + t2;
};
//计划时间范围获取数据
function DateRange(props) {
  const { systemPage } = props;

  //获取数据
  const requestData = useCallback(async () => {
    try {
      //获取数据
      const resData = await requestGet2({
        url: ReqUrls.rangeScopeUrl,
      });
      // console.log("resData", resData);
      //数据赋值
      const { dynamicTimeScope = [] } = resData;
      let time1 = "";
      let time2 = "";
      if (dynamicTimeScope.length >= 2) {
        time1 = dynamicTimeScope[0] || "";
        time2 = dynamicTimeScope[1] || "";
      }
      const scopeStr = dynamicTimeScope[2] || "{}";
      const scope = JSON.parse(scopeStr) || {};
      const timeStr = scope["time_scope"] || "";
      const timeArr = timeStr.split(",");
      let startNum = calcNum(timeArr[0]);
      let endNum = calcNum(timeArr[1]);
      // console.log(startNum, endNum);
      systemPage.setDateRangeData([time1, time2]);
      systemPage.dateBarRangeData = [startNum, endNum];
    } catch (err) {
      customNotice({
        type: "error",
        message: "计划时间范围数据获取失败",
      });
    }
  }, []);
  //componentDidMount
  useEffect(function () {
    requestData();
  }, []);

  return "";
}

export default inject("systemPage")(observer(DateRange));
