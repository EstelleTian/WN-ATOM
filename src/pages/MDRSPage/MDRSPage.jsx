/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-04-27 08:55:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\MDRSPage\MDRSPage.jsx
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { inject, observer } from "mobx-react";
import { Layout, Spin } from "antd";
import MDRSWorkList from "components/MDRS/MDRSWorkList";
import { MDRSForm, MDRSDetail } from "components/MDRS/MDRSForm";
import { isValidVariable } from "utils/basic-verify.js";
import { requestGet2 } from "utils/request.js";
import { ReqUrls } from "utils/request-urls.js";
import { customNotice } from "utils/common-funcs";
import { withRouter } from "react-router-dom";

//MDRS模块
function MDRSPage(props) {
  const [loading, setLoading] = useState(false);
  const userRef = useRef();
  const timer = useRef();
  const { MDRSData, match } = props;
  const params = match.params || {};
  const airport = params.airport || "";
  // let authMap = MDRSData.authMap || {};
  // let update = authMap["UPDATE"] || false;

  //获取数据
  const requestData = useCallback(async (nextRefresh, showLoading) => {
    const { username, id } = userRef.current;
    if (showLoading) {
      setLoading(true);
    }
    const timerFunc = function () {
      if (nextRefresh) {
        timer.current = setTimeout(function () {
          requestData(nextRefresh, false);
        }, 30 * 1000);
      }
    };
    try {
      //获取数据
      const resData = await requestGet2({
        url: ReqUrls.mdrsRetrieveDataUrl,
        params: {
          userName: username,
          airport: airport,
        },
      });
      // console.log("resData", resData);
      //数据赋值
      const { result = [], generateTime = "" } = resData;
      if (result.length == 0) {
        customNotice({
          type: "warn",
          message: "暂无数据",
          duration: 8,
        });
        MDRSData.setMDRSData({}, generateTime);
      } else {
        //TODO 回头这个result改成对象
        MDRSData.setMDRSData(result[0], generateTime);
      }
      setLoading(false);
      timerFunc();
    } catch (err) {
      customNotice({
        type: "error",
        message: "数据获取失败",
      });
      setLoading(false);
      timerFunc();
    }
  }, []);
  //componentDidMount
  useEffect(function () {
    const userStr = localStorage.getItem("user");
    let user = JSON.parse(userStr);
    userRef.current = user;
    const { username = "" } = user;
    if (isValidVariable(username)) {
      requestData(true, true);
    }
  }, []);
  useEffect(
    function () {
      if (MDRSData.forceUpdate) {
        requestData(false, true);
        props.MDRSData.setForceUpdate(false);
      }
    },
    [MDRSData.forceUpdate]
  );
  return (
    <Layout style={{ minWidth: "1400px", height: "inherit" }}>
      <Spin spinning={loading}>
        <MDRSWorkList></MDRSWorkList>
        {/* {update ? (
          <MDRSForm airport={airport}></MDRSForm>
        ) : (
          <MDRSDetail airport={airport}></MDRSDetail>
        )} */}
        <MDRSDetail airport={airport}></MDRSDetail>
      </Spin>
    </Layout>
  );
}

export default withRouter(inject("MDRSData")(observer(MDRSPage)));
