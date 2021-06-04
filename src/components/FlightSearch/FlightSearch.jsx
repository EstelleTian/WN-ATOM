/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2021-06-03 16:20:13
 * @LastEditors: Please set LastEditors
 * @Description: 航班查询
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, { useState, useEffect, useCallback } from "react";
import { observer, inject } from "mobx-react";
import {
  getFullTime,
  getDayTimeFromString,
  formatTimeString,
  isValidObject,
  isValidVariable,
  addDateTime,
} from "utils/basic-verify";
import {
  List,
  Divider,
  Icon,
  Form,
  Input,
  Select,
  Drawer,
  Tooltip,
  Tag,
  Row,
  Col,
} from "antd";
import ModalBox from "components/ModalBox/ModalBox";

import { FlightCoordination } from "utils/flightcoordination";
import DraggableModal from "components/DraggableModal/DraggableModal";

import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import FlightSummer from "./FlightSummer";
import "./FlightSearch.scss";
const { Option } = Select;
const { Search } = Input;

//航班查询模块
const FlightSearch = (props) => {
  const { flightDetailData, flightTableData } = props;
  const NORMAL = "";
  const EMPTY = "航班不存在";
  const FAILURE = "查询失败";

  const defaultDate = "today";

  // 单个航班数据
  let [flight, setFlight] = useState(0);
  let [searchTootipVisible, setSearchTootipVisible] = useState(0);
  let [searchTootipText, setSearchTootipText] = useState(NORMAL);
  let [searchLoadingVisible, setSearchLoadingVisible] = useState(0);
  let [selectedID, setSelectedID] = useState(-1);
  let [searchDate, setSearchDate] = useState(defaultDate);
  const data = [];
  let [flightListData, setFlightListData] = useState(data);

  /**
   * 隐藏tooltip
   * */
  const hideTooltip = useCallback(function () {
    setSearchTootipVisible(false);
  });

  /**
   * 显示单个航班信息
   * */
  const showSingleFlightSummary = useCallback(function (flight) {
    flightTableData.focusFlightId = flight.id;
    // 更新航班略情抽屉中的航班数据
    flightDetailData.setDrawerFlightId(flight.id);
    flightDetailData.setDrawerVisible(true);
  });

  /**
   * 绘制航班列表中单个航班信息
   * */
  const drawFlightItem = function (item, index) {
    let formerFlight = item.formerFlightObj || {};
    let FLIGHTID = item.flightId;
    let DEPAP = item.depAp || "N/A";
    let ARRAP = item.arrAp || "N/A";
    let SOBT = item.sobt || "N/A";
    let REG = item.registeNum || "N/A";
    let FORMER = formerFlight.flightId || "N/A";
    let FORMERDEPAP = formerFlight.depAp || "N/A";
    let FORMERARRAP = formerFlight.arrAp || "N/A";

    return (
      <List.Item
        className={item.id === selectedID ? "selected" : ""}
        key={item.id}
        onClick={() => {
          showSingleFlightSummary(item);
          const flightId = item.id || "";
          props.flightTableData.focusFlightId = flightId;
        }}
      >
        <div className="flight-item">
          <a className="flight">
            <div className="flight-prop num">{index + 1}</div>
            <div className="flight-prop flight-id">{FLIGHTID}</div>
            <div className="flight-prop flight-depap-arrap">{`${DEPAP}-${ARRAP}`}</div>
            <div className="flight-prop flight-sobt" title={SOBT}>
              {getDayTimeFromString(SOBT)}
            </div>
            <div className="flight-prop flight-reg">{REG}</div>
            <div className="flight-prop flight-former">{FORMER}</div>
          </a>
        </div>
      </List.Item>
    );
  };

  /**
   * 查询日期变更
   * */
  const handleChangeDate = (value) => {
    setSearchDate(value);
  };

  /**
   * 绘制单个航班命中方案列表中单个方案信息
   * */
  const drawSchemeItem = (data, index) => {
    return (
      <List.Item
        className={data.id === selectedID ? "selected" : ""}
        key={data.id}
        onClick={() => {
          // showSingleFlightSummary(item)
        }}
      >
        <Row>
          <Col span={2}>
            <div>{index + 1}</div>
          </Col>
          <Col span={5}>
            <div>{index + 1}</div>
          </Col>
          <Col span={5}>
            <div>{index + 1}</div>
          </Col>
          <Col span={5}>
            <div>{index + 1}</div>
          </Col>
        </Row>
      </List.Item>
    );
  };

  /**
   * 发送获取航班数据请求
   *
   * */
  const requestFlightData = useCallback((flightId) => {
    setSearchLoadingVisible(true);

    const now = new Date();
    let targetData = "";
    if (searchDate === "yestoday") {
      targetData = getFullTime(
        addDateTime(now, -1 * 1000 * 60 * 60 * 24)
      ).substring(0, 8);
    } else if (searchDate === "tomorrow") {
      targetData = getFullTime(
        addDateTime(now, 1 * 1000 * 60 * 60 * 24)
      ).substring(0, 8);
    } else if (searchDate === "today") {
      targetData = getFullTime(now).substring(0, 8);
    }
    const start = targetData + "0000";
    const end = targetData + "2359";
    const opt = {
      url: ReqUrls.searchFlightUrl + `${flightId}/${start}/${end}`,
      method: "GET",
      params: {},
      resFunc: (data) => {
        updateFlightListData(data);
      },
      errFunc: (err) => {
        requestErr(err, "查询失败");
      },
    };
    request(opt);
  });

  /**
   * 航班查询
   * */
  const searchFlightData = useCallback(function (value, event) {
    // 检测事件是否为输入框的清除图标点击事件
    if (isValidVariable(event)) {
      const target = event.currentTarget;
      const nodeName = target.nodeName;
      const eventType = event.type.toUpperCase();
      if (nodeName === "INPUT" && eventType === "CLICK") {
        // 隐藏tooltip
        hideTooltip();
        return;
      }
    }
    if (isValidVariable(value)) {
      // 获取航班数据
      requestFlightData(value.toUpperCase());
    } else {
      setSearchTootipText("请输入航班号");
      setSearchTootipVisible(true);
      // 添加点击事件
      addClickEventListener();
    }
  });

  /**
   * 在document 添加点击事件,用于隐藏tooltip
   * */
  const addClickEventListener = () => {
    document.addEventListener(`click`, function onClickOutside() {
      // 隐藏tooltip
      hideTooltip();
      document.removeEventListener(`click`, onClickOutside);
    });
  };
  /**
   * 输入框按下回车的回调
   * */
  const pressEnter = useCallback(function (e) {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value.toUpperCase();
    // 航班查询
    searchFlightData(value);
  });

  /**
   *
   * 输入框内容变化时的回调
   * */
  const handleInputValueChange = (e) => {
    // 隐藏
    hideTooltip();
  };

  const convertSingleFlight = (flightData) => {
    let flight = flightData.flight || {};
    let formerFlight = flightData.formerFlight || {};
    let obj = {
      ...flight,
      formerFlightObj: formerFlight,
    };
    return obj;
  };

  /**
   * 更新航班列表数据
   *
   * */
  const updateFlightListData = useCallback(function (data) {
    // 隐藏loading
    setSearchLoadingVisible(false);
    // 关闭单个航班信息抽屉
    flightDetailData.setDrawerVisible(false);
    flightDetailData.updateFlightResult(data.flightResult);

    // 结果数据id集合
    let dataList = [];
    // 结果数据对象
    let dataMap = {};
    if (isValidObject(data) && isValidObject(data.flightResult)) {
      dataList = Object.keys(data.flightResult);
      dataMap = data.flightResult;
    }
    // 遍历将结果数据对象转为数组形式
    let flightListData = [];
    dataList.map((item) => {
      let flight = convertSingleFlight(dataMap[item]);
      flightListData.push(flight);
    });
    // 更新航班列表数据
    setFlightListData((old) => {
      return flightListData;
    });
    // 航班列表数据个数
    const len = flightListData.length;
    // 若为0个
    if (len === 0) {
      setSearchTootipText(EMPTY);
      setSearchTootipVisible(true);
      // 添加点击事件
      addClickEventListener();
    } else if (len === 1) {
      flightDetailData.setDrawerVisible(true);
      // 显示单个航班信息
      showSingleFlightSummary(flightListData[0]);
    } else {
      setSelectedID(-1);
    }
  });

  /**
   * 请求失败回调
   *
   * */
  const requestErr = (err) => {
    // 隐藏loading
    setSearchLoadingVisible(false);
    // 关闭单个航班信息抽屉
    flightDetailData.setDrawerVisible(false);

    let errMsg = "";
    if (isValidObject(err) && isValidVariable(err.message)) {
      errMsg = err.message;
    } else if (isValidVariable(err)) {
      errMsg = err;
    }
    let content = FAILURE;
    if (isValidVariable(errMsg)) {
      content = `${content} : ${errMsg}`;
    }
    setSearchTootipText(content);
    setSearchTootipVisible(true);
    // 添加点击事件
    addClickEventListener();
  };

  const hideModal = () => {
    props.systemPage.toggleFlightSearch(false);
  };

  //获取屏幕宽度，适配 2k
  let body = document.getElementsByTagName("body");
  let screenWidth = 0;
  let screenHeight = 0;
  if (body.length > 0) {
    screenWidth = body[0].offsetWidth;
    screenHeight = body[0].offsetHeight;
  }

  return (
    <ModalBox
      title="航班查询"
      style={{
        height: 420,
      }}
      showDecorator={true}
      className="flight_search"
    >
      <div className="container">
        <div className="options">
          <div className="box">
            <div
              className="close"
              onClick={(e) => {
                props.systemPage.toggleFlightSearch(false);
              }}
            >
              X
            </div>
            <Tooltip
              title={searchTootipText}
              color="volcano"
              visible={searchTootipVisible}
            >
              <Search
                className="flight-search"
                placeholder="航班号"
                size="small"
                allowClear={true}
                loading={searchLoadingVisible}
                onSearch={searchFlightData}
                onPressEnter={pressEnter}
                onChange={handleInputValueChange}
                style={{ marginRight: "2%", width: "30%" }}
              />
            </Tooltip>
            <Select
              size="small"
              style={{ marginRight: "2%" }}
              defaultValue={defaultDate}
              onChange={handleChangeDate}
            >
              <Option value="yestoday">昨日</Option>
              <Option value="today">今日</Option>
              <Option value="tomorrow">明日</Option>
            </Select>
          </div>
        </div>
        <div className="content">
          <div className="flight-list">
            <div className="list-nav">
              <div className="flight-prop num">Num</div>
              <div title="航班号" className="flight-prop flight-id">
                FLIGHTID
              </div>
              <div title="起飞机场" className="flight-prop flight-depap-arrap">
                DEPAP-ARRAP
              </div>
              <div title="计划撤轮档" className="flight-prop flight-sobt">
                SOBT
              </div>
              <div title="计划撤轮档" className="flight-prop flight-reg">
                REG
              </div>
              <div title="前序航班" className="flight-prop flight-former">
                FORMER
              </div>
            </div>
            <List
              itemLayout="horizontal"
              size="small"
              dataSource={flightListData}
              renderItem={drawFlightItem}
            />
          </div>
          <FlightSummer flight={flight} />
        </div>
      </div>
    </ModalBox>
  );
};

export default inject(
  "systemPage",
  "flightTableData",
  "flightDetailData"
)(observer(FlightSearch));

// export default FlightSearch;
