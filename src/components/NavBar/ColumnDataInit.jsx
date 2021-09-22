import React, { Fragment, useEffect, useCallback } from "react";
import { inject, observer } from "mobx-react";
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidObject, isValidVariable } from "utils/basic-verify";

//列配置获取数据
function ColumnDataInit({ columnConfig, flightTableData, systemPage }) {
  const user = systemPage.user || {};
  const userId = user.id || "";
  const activeSystem = systemPage.activeSystem || {};
  const systemType = activeSystem.systemType || "";
  //获取配置数据
  const fetchConfigData = () => {
    const opt = {
      // url:
      //   ReqUrls.flightTableColumnConfigUrl +
      //   "/retrieveUserPropertyGridTable" +
      //   "?userId=" +
      //   userId +
      //   "&keys=" +
      //   systemType,
      url: ReqUrls.flightTableColumnConfigUrl,
      method: "GET",
      resFunc: (data) => fetchSuccess(data),
      errFunc: (err) => fetchErr(err)
    };
    request(opt);
  };

  //获取配置数据成功
  const fetchSuccess = (data) => {
    // flightTableData.updateGetState(true)
    console.log(flightTableData.getState);
    const { userPropertys = [] } = data;
    let propertys = userPropertys[0] || {};
    columnConfig.setRequestData(propertys);
  };

  //数据获取失败回调
  const fetchErr = (err) => {
    // flightTableData.updateGetState(false)
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
          <span>获取表格列配置数据失败</span>
          <br />
          <span>{errMsg}</span>
        </span>
      ),
      centered: true,
      okText: "确定"
    });
  };

  // 初始化获取配置数据
  useEffect(
    function () {
      if (isValidVariable(userId) && isValidVariable(systemType)) {
        //获取配置数据
        fetchConfigData();
      }
    },
    [userId, systemType]
  );
  return "";
}
export default inject(
  "columnConfig",
  "flightTableData",
  "systemPage"
)(observer(ColumnDataInit));
