/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-05-27 14:25:29
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import {
  message as antdMessage,
  message,
  Popover,
  Button,
  Tooltip,
  Popconfirm,
} from "antd";
import React, { useCallback, useState, useEffect, memo, useMemo } from "react";

const typeCn = {
  exempt: "标记豁免",
  singleExempt: "标记单方案豁免",
  interval: "标记半数间隔",
};
// 带二次确认提示框的按钮
const PopconfirmFlightIdBtn = memo((props) => {
  // 气泡确认框显隐控制标记
  const [visible, setVisible] = useState(false);
  const { loading, handleExempt, record, alarms, type } = props;
  const orgData = record.orgdata || "{}";
  let orgFlight = JSON.parse(orgData) || {};
  const flightId = orgFlight.flightid || "";
  // 处理气泡确认框显隐
  const handlePopconfirmVisible = (flag) => {
    setVisible(flag);
  };
  // 点击确认按钮
  const handleOk = () => {
    // 隐藏气泡确认框
    handlePopconfirmVisible(false);
    // 调用标记半数间隔方法
    handleExempt(type, record, typeCn[type]);
  };

  // 若航班已经单方案豁免则显示带气泡确认框的按钮
  if (
    alarms.indexOf("300") > -1 ||
    alarms.indexOf("400") > -1 ||
    alarms.indexOf("800") > -1
  ) {
    let alarmCN = "";
    if (alarms.indexOf("300") > -1) {
      alarmCN = "全局豁免";
    } else if (alarms.indexOf("400") > -1) {
      alarmCN = "半数间隔";
    } else if (alarms.indexOf("800") > -1) {
      alarmCN = "单方案豁免";
    }
    return (
      <Popconfirm
        title={`航班 ${flightId} 处于${alarmCN}状态,确认${typeCn[type]}?`}
        visible={visible}
        onConfirm={handleOk}
        okButtonProps={{ loading: loading, size: "default" }}
        cancelButtonProps={{ size: "default" }}
        onCancel={() => {
          handlePopconfirmVisible(false);
        }}
        overlayClassName="apply-interval-button-popconfirm"
      >
        <Button
          loading={loading}
          className="c-btn c-btn-green"
          onClick={() => {
            handlePopconfirmVisible(true);
          }}
        >
          {typeCn[type]}
        </Button>
      </Popconfirm>
    );
  } else {
    return (
      <Button
        loading={loading}
        className="c-btn c-btn-green"
        onClick={() => {
          handleExempt(type, record, typeCn[type]);
        }}
      >
        {typeCn[type]}
      </Button>
    );
  }
});

export default PopconfirmFlightIdBtn;
