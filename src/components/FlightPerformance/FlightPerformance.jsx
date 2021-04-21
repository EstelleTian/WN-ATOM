/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2021-04-21 15:13:45
 * @LastEditors: Please set LastEditors
 * @Description: In U.3ser Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, { useEffect, useCallback, useState } from "react";
import { inject, observer } from "mobx-react";
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { Col, Row, Spin, Tooltip } from "antd";
import {
  getFullTime,
  isValidObject,
  isValidVariable,
} from "utils/basic-verify";
import { customNotice } from "utils/common-funcs";
import PerformanceItemHeader from "./PerformanceItemHeader";
import List from "./List";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import "./FlightPerformance.scss";
import CollaborateKPI from "./CollaborateKPI";

//航班执行情况模块
const FlightPerformance = (props) => {
  // 航班执行情况数据
  const flightPerformanceData = props.flightPerformanceData || {};

  // 航班执行情况数据loading标记
  const { loading } = flightPerformanceData;
  const performanceData = flightPerformanceData.performanceData || {};
  // 航班执行情况数据对象
  const flight = performanceData.flight || {};
  // 限制数据
  const implementTacticsData = props.implementTacticsData || {};
  // 限制数据
  const tacticsData = implementTacticsData.tacticsData || {};
  // 限制数据对象
  const statisticsMap = tacticsData.statisticsMap || {};
  // 限制数据loading标记
  const tacticsDataLoading = implementTacticsData.loading;

  // 计划起降架次
  const sDANum = flight.sDANum || 0;
  //计划起飞架次
  const sDepNum = flight.sDepNum || 0;
  // 计划落地架次
  const sArrNum = flight.sArrNum || 0;
  // 计划区域飞越架次(飞越本区)
  const sAOvfNum = flight.sAOvfNum || 0;
  // 计划飞越架次(国际飞越)
  const sOvfNum = flight.sOvfNum || 0;
  // 绩效情况
  const situation = flight.situation || "";
  // 起飞正常率绩效情况
  const depRatioSituation = flight.depRatioSituation || "";
  // 离港流量绩效情况
  const depFlowSituation = flight.depFlowSituation || "";
  // 起飞正常率
  const depRatio = flight.depRatio || 0;
  // 地面延误航班架次
  const groundDelay = flight.groundDelay || 0;
  // 返航备降航班
  const cplNum = flight.cplNum || 0;
  // 复飞航班
  const reflySorties = flight.reflySorties || 0;
  // 盘旋航班
  const circlingSorties = flight.circlingSorties || 0;
  // 限制总数
  const restrictTotal = statisticsMap["ALL"] || 0;
  // 限制原因分类数据
  const restrictMap = statisticsMap;

  // 执行起降
  const executeDAMap = isValidObject(flight.executeDAMap)
    ? flight.executeDAMap
    : {};
  // 执行区内空中
  const currentInAreaSkyMap = isValidObject(flight.currentInAreaSkyMap)
    ? flight.currentInAreaSkyMap
    : {};
  // 执行区域飞越
  const executeAOvfMap = isValidObject(flight.executeAOvfMap)
    ? flight.executeAOvfMap
    : {};
  // 执行国际飞越
  const executeOvfMap = isValidObject(flight.executeOvfMap)
    ? flight.executeOvfMap
    : {};

  // 执行率
  const executeRatio = flight.executeRatio || 0;
  // 执行数据
  const executeData = {
    executeDAMap,
    executeAOvfMap,
    executeOvfMap,
    currentInAreaSkyMap,
  };

  const planData = [
    {
      id: "sDepNum",
      iconType: "takeoff",
      // color:"#1890ff",
      des: "计划起飞",
      value: sDepNum,
      unit: "架次",
    },
    {
      id: "sArrNum",
      iconType: "landing",
      des: "计划落地",
      value: sArrNum,
      unit: "架次",
    },
    {
      id: "sAOvfNum",
      iconType: "area-over",
      // color: "#2fc25b",
      des: "飞越本区",
      value: sAOvfNum,
      unit: "架次",
    },
    {
      id: "sOvfNum",
      iconType: "international-over",
      // color: "#facc14",
      des: "国际飞越",
      value: sOvfNum,
      unit: "架次",
    },
  ];

  // 绩效
  const performance = [
    {
      id: "depRatio",
      iconType: "normal-takeoff",
      // color:"#2fc25b",
      des: "起飞正常",
      value: (depRatio * 100).toFixed(0),
      unit: "%",
    },
    {
      id: "groundDelay",
      iconType: "ground-delay",
      // color:"#facc14",
      des: "地面延误",
      value: groundDelay,
      unit: "架次",
    },
    {
      id: "cplNum",
      iconType: "return",
      // color:"#f04864",
      des: "返航备降",
      value: cplNum,
      unit: "架次",
    },
    {
      id: "reflySorties",
      iconType: "refly",
      // color:"#f04864",
      des: "复飞架次",
      value: reflySorties,
      unit: "架次",
    },
    {
      id: "circlingSorties",
      iconType: "circling",
      // color:"#f04864",
      des: "盘旋架次",
      value: circlingSorties,
      unit: "架次",
    },
  ];

  //更新--航班执行情况 store数据
  const updateFlightPerformanceData = useCallback((flightPerformanceData) => {
    if (isValidObject(flightPerformanceData)) {
      props.flightPerformanceData.updateFlightPerformanceData(
        flightPerformanceData
      );
    } else {
      props.flightPerformanceData.updateFlightPerformanceData({});
      customNotice({
        type: "error",
        message: "获取的航班执行数据为空",
      });
    }
  });
  //更新--限制store数据
  const updateImplementTacticsData = useCallback((reasonData) => {
    if (isValidObject(reasonData)) {
      props.implementTacticsData.updateImplementTacticsData(reasonData);
    } else {
      props.implementTacticsData.updateImplementTacticsData({});
      customNotice({
        type: "error",
        message: "获取的限制数据为空",
      });
    }
  });

  //请求错误处理
  const requestErr = useCallback((err, content) => {
    let errMsg = "";
    if (isValidObject(err) && isValidVariable(err.message)) {
      errMsg = err.message;
    } else if (isValidVariable(err)) {
      errMsg = err;
    }
    customNotice({
      type: "error",
      message: (
        <div>
          <p>{content}</p>
          <p>{errMsg}</p>
        </div>
      ),
    });
  });

  useEffect(
    function () {
      // 初次获取航班执行情况数据启用loading
      props.flightPerformanceData.toggleLoad(true);
      // 初次获取限制数据启用loading
      props.implementTacticsData.toggleLoad(true);
      // 获取航班执行情况数据
      requestFlightPerformanceData();
      // 获取限制数据
      requestImplementTacticsReasonData();
      // 清除定时
      clearInterval(props.flightPerformanceData.timeoutId);
      clearInterval(props.implementTacticsData.timeoutId);
      // 开启定时获取数据
      props.flightPerformanceData.timeoutId = setInterval(
        requestFlightPerformanceData,
        60 * 1000
      );
      props.implementTacticsData.timeoutId = setInterval(
        requestImplementTacticsReasonData,
        60 * 1000
      );
      return function () {
        clearInterval(props.flightPerformanceData.timeoutId);
        clearInterval(props.implementTacticsData.timeoutId);
        props.flightPerformanceData.timeoutId = "";
        props.implementTacticsData.timeoutId = "";
      };
    },
    [props.userSubscribeData.subscribeData]
  );

  /**
   * 获取监控单元
   * */
  const getMonitorUnits = () => {
    const { userSubscribeData = {} } = props;
    let subscribeData = userSubscribeData.subscribeData || {};
    let { monitorUnit, focus } = subscribeData;
    let arr = [];
    if (isValidObject(monitorUnit) && isValidVariable(focus)) {
      let area = monitorUnit[focus] || {};
      let areaData = area.data;
      for (let type in areaData) {
        let data = areaData[type];
        let units = data.units;
        for (let unit in units) {
          arr.push(unit);
        }
      }
    }
    return arr;
  };

  //获取--航班执行情况数据
  const requestFlightPerformanceData = useCallback(() => {
    //TODO 时间范围取值需要使用服务器时间，目前使用的终端时间
    // const now = getFullTime(new Date());
    // const nextDate = addStringTime(now, 1000*60*60*24).substring(0,8);
    // const nowDate = now.substring(0,8);
    // const start = nowDate+'050000';
    // const end =nextDate+'050000';
    // const monitorUnits = getMonitorUnits();
    // const units = monitorUnits.join(',');
    // if(!isValidVariable(units)){
    //     return;
    // }

    const { userSubscribeData = {} } = props;
    let subscribeData = userSubscribeData.subscribeData || {};
    // 区域
    let { focus } = subscribeData;
    if (!isValidVariable(focus)) {
      return;
    }
    const opt = {
      url: ReqUrls.performanceDataUrl + "?areaName=" + focus,
      method: "GET",
      params: {},
      resFunc: (data) => {
        updateFlightPerformanceData(data);
        props.flightPerformanceData.toggleLoad(false);
      },
      errFunc: (err) => {
        requestErr(err, "航班执行数据获取失败");
        props.flightPerformanceData.toggleLoad(false);
      },
    };
    request(opt);
  });

  //获取--限制数据
  const requestImplementTacticsReasonData = useCallback(() => {
    const { userSubscribeData = {} } = props;
    let subscribeData = userSubscribeData.subscribeData || {};
    // 区域
    let { focus } = subscribeData;
    if (!isValidVariable(focus)) {
      return;
    }
    //TODO 时间范围取值需要使用服务器时间，目前使用的终端时间
    const now = getFullTime(new Date());
    const nowDate = now.substring(0, 8);
    const start = nowDate + "000000";
    const end = now;
    const opt = {
      url:
        ReqUrls.restrictionDataUrl +
        "?areaName=" +
        focus +
        "&starttime=" +
        start +
        "&endtime=" +
        end,
      method: "GET",
      params: {},
      resFunc: (data) => {
        updateImplementTacticsData(data);
        props.implementTacticsData.toggleLoad(false);
      },
      errFunc: (err) => {
        requestErr(err, "限制数据获取失败");
        props.implementTacticsData.toggleLoad(false);
      },
    };
    request(opt);
  });

  return (
    <div className="flight_performance_list_container">
      <Row className="performance-row" style={{ marginBottom: 10 }}>
        <Col span={24} className="layout-row">
          <div className="performance_item module">
            <PerformanceItemHeader
              style={{ background: "#4b7ba4", color: "#d4d4d4" }}
              title="计划"
            />
            <Spin spinning={loading}>
              <div className="description">
                <Tooltip>
                  <div className="text-wrapper">
                    <span className="value">{sDANum}</span>
                    <span className="unit">架次</span>
                  </div>
                </Tooltip>
              </div>
              <div className="content">
                <List listData={planData} />
              </div>
            </Spin>
          </div>
          <div className="performance_item module">
            <PerformanceItemHeader
              style={{ background: "#2e93bb", color: "#d4d4d4" }}
              title="执行"
            />
            <Spin spinning={loading}>
              <div className="description">
                <Tooltip>
                  <div className="text-wrapper">
                    <span className="value">
                      {(executeRatio * 100).toFixed(0)}
                    </span>
                    <span className="unit">%</span>
                  </div>
                </Tooltip>
              </div>
              <div className="content">
                <LineChart executeData={executeData} />
              </div>
            </Spin>
          </div>

          <div className="performance_item module">
            <PerformanceItemHeader
              style={{ background: "#168f9d", color: "#d4d4d4" }}
              title="限制"
            />
            <Spin spinning={tacticsDataLoading}>
              <div className="description">
                <Tooltip>
                  <div className="text-wrapper">
                    <span className="value">{restrictTotal}</span>
                    <span className="unit">条</span>
                  </div>
                </Tooltip>
              </div>
              <div className="content">
                <PieChart data={restrictMap} />
              </div>
            </Spin>
          </div>

          <div className="performance_item module">
            <PerformanceItemHeader
              style={{ background: "#2d6b92", color: "#d4d4d4" }}
              title="绩效"
              TabPaneConfig={{
                key: "operation",
                title: "运行监控",
                content: "运行监控content",
              }}
              setActiveTabPane={props.setActiveTabPane}
            />
            <Spin spinning={loading}>
              <div className="description">
                <Tooltip
                  title={
                    <div className="performance-tooltip-content-box">
                      <div className="content-row">
                        <div className="label">起飞正常率:</div>{" "}
                        {depRatioSituation}
                      </div>
                      <div className="content-row">
                        <div className="label">离港流量:</div>{" "}
                        {depFlowSituation}
                      </div>
                    </div>
                  }
                >
                  <div className="text-wrapper">
                    <span className="value">{situation}</span>
                    <span className="unit"></span>
                  </div>
                </Tooltip>
              </div>
              <div className="content">
                <List listData={performance} />
              </div>
            </Spin>
          </div>
        </Col>
      </Row>
      <Row className="performance-row" style={{ marginBottom: 10 }}>
        <Col span={24} className="layout-row">
          <Col span={24} className="performance_item module">
            <CollaborateKPI />
          </Col>
          {/* <div className="performance_item module"></div> */}
        </Col>
      </Row>
    </div>
  );
};

export default inject(
  "userSubscribeData",
  "flightPerformanceData",
  "implementTacticsData",
  "systemPage"
)(observer(FlightPerformance));
