import React, { Fragment, useEffect, useCallback } from "react";
import { Form, Radio, Row, Col, Button, Modal, Space } from "antd";
import { inject, observer } from "mobx-react";
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidObject, isValidVariable } from "utils/basic-verify";

//ATOM引接应用配置表单
function ATOMConfigInit({ ATOMConfigFormData, flightTableData }) {

  let timer = 0;

  //获取配置数据
  const fetchConfigData = () => {
    clearTimeout(timer);
    const opt = {
      url: ReqUrls.switchConfigUrl + "/switch/cdmDataApplySwitch",
      method: "GET",
      resFunc: (data) => fetchSuccess(data),
      errFunc: (err) => fetchErr(err),
    };
    request(opt);
    timer = setTimeout(fetchConfigData, 1000*60*10);
  };

  //获取配置数据成功
  const fetchSuccess = useCallback((data) => {
    let obj = {
      alternative: data.alternative,
      valueInfo: data.valueInfo,
    }
    ATOMConfigFormData.updateConfigData(obj);
  });

  //数据获取失败回调
  const fetchErr = useCallback((err) => {
    ATOMConfigFormData.updateConfigData({});
    let errMsg = "";
    if (isValidObject(err) && isValidVariable(err.message)) {
      errMsg = err.message;
    } else if (isValidVariable(err)) {
      errMsg = err;
    }
    Modal.error({
      title: "获取失败",
      content: (
        <span>
          <span>获取各地CDM引接应用配置数据失败</span>
          <br />
          <span>{errMsg}</span>
        </span>
      ),
      centered: true,
      okText: "确定",
    });
  });

  useEffect(function () {
    //获取配置数据
    fetchConfigData();
  }, []);
  return "";
}
export default inject(
  "ATOMConfigFormData",
  "flightTableData"
)(observer(ATOMConfigInit));
