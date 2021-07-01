/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2021-07-01 11:16:01
 * @LastEditors: Please set LastEditors
 * @Description: 航班查询-航班搜索
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, { useCallback } from "react";
import { observer, inject } from "mobx-react";
import {
  getFullTime,
  getDayTimeFromString,
  formatTimeString,
  isValidObject,
  isValidVariable,
  addDateTime,
  parseFullTime,
} from "utils/basic-verify";
import { Input, Select, Tooltip } from "antd";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
const { Option } = Select;
const { Search } = Input;

const EMPTY = "航班不存在";
const FAILURE = "查询失败";
//航班查询模块
const FlightSearchOption = ({ flightTableData, fightSearch, systemPage }) => {
  /**
   * 隐藏tooltip
   * */
  const hideTooltip = useCallback(function () {
    fightSearch.setSearchTooltipText("");
  }, []);
  /**
   * 在document 添加点击事件,用于隐藏tooltip
   * */
  const addClickEventListener = useCallback(() => {
    document.addEventListener(`click`, function onClickOutside() {
      // 隐藏tooltip
      hideTooltip();
      document.removeEventListener(`click`, onClickOutside);
    });
  }, []);
  /**
   * 发送获取航班数据请求
   *
   * */
  const requestFlightData = useCallback(
    async (flightId) => {
      try {
        fightSearch.setSearchLoadingVisible(true);
        // 去掉首尾空格
        flightId = flightId.trim();
        const baseDate = systemPage.baseDate || "";
        let now = null;
        if (baseDate === "") {
          now = new Date();
        } else {
          now = parseFullTime(systemPage.baseDate + "0000");
        }

        let targetData = baseDate;
        if (fightSearch.searchDate === "yestoday") {
          targetData = getFullTime(
            addDateTime(now, -1 * 1000 * 60 * 60 * 24)
          ).substring(0, 8);
        } else if (fightSearch.searchDate === "tomorrow") {
          targetData = getFullTime(
            addDateTime(now, 1 * 1000 * 60 * 60 * 24)
          ).substring(0, 8);
        } else if (fightSearch.searchDate === "today") {
          targetData = getFullTime(now).substring(0, 8);
        }
        const start = targetData + "0000";
        const end = targetData + "2359";
        const url = ReqUrls.searchFlightUrl + `${flightId}/${start}/${end}`;
        const data = await requestGet2({ url });
        updateFlightListData(data);
      } catch (err) {
        requestErr(err, "查询失败");
      }
    },
    [systemPage.baseDate]
  );

  const convertSingleFlight = useCallback((flightData) => {
    let flight = flightData.flight || {};
    let formerFlight = flightData.formerFlight || {};
    let obj = {
      ...flight,
      formerFlightObj: formerFlight,
    };
    return obj;
  }, []);

  /**
   * 更新航班列表数据
   *
   * */
  const updateFlightListData = useCallback(function (data) {
    // 隐藏loading
    fightSearch.setSearchLoadingVisible(false);
    // 关闭单个航班信息抽屉
    fightSearch.setDrawerVisible(false);

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
    fightSearch.setFlightListData(flightListData);
    // 航班列表数据个数
    const len = flightListData.length;
    // 若为0个
    if (len === 0) {
      fightSearch.setSearchTooltipText(EMPTY);
      // 添加点击事件
      addClickEventListener();
    } else if (len === 1) {
      fightSearch.setDrawerFlight(flightListData[0]);
      fightSearch.setDrawerVisible(true);
    }
  }, []);

  /**
   * 请求失败回调
   *
   * */
  const requestErr = useCallback((err) => {
    // 隐藏loading
    fightSearch.setSearchLoadingVisible(false);
    // 关闭单个航班信息抽屉
    fightSearch.setDrawerVisible(false);

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
    fightSearch.setSearchTooltipText(content);
    // 添加点击事件
    addClickEventListener();
  }, []);

  return (
    <div className="options">
      <div className="box">
        <div
          className="close"
          onClick={(e) => {
            systemPage.toggleFlightSearch(false);
          }}
        >
          X
        </div>
        <SearchInput
          requestFlightData={requestFlightData}
          addClickEventListener={addClickEventListener}
        ></SearchInput>
        <DateSelect></DateSelect>
      </div>
    </div>
  );
};
//查询输入框
const SearchInput = inject("fightSearch")(
  observer(function ({
    fightSearch,
    requestFlightData,
    addClickEventListener,
  }) {
    /**
     * 隐藏tooltip
     * */
    const hideTooltip = useCallback(function () {
      fightSearch.setSearchTooltipText("");
    }, []);
    /**
     * 输入框按下回车的回调
     * */
    const pressEnter = useCallback(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const value = e.target.value.toUpperCase();
      // 航班查询
      fightSearch.setSearchInputVal(value);
      searchFlightData(value, e);
    }, []);
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
        fightSearch.setSearchTooltipText("请输入航班号");
        // 添加点击事件
        addClickEventListener();
      }
    }, []);
    /**
     *
     * 输入框内容变化时的回调
     * */
    const handleInputValueChange = useCallback((e) => {
      // 隐藏
      hideTooltip();
    }, []);

    console.log("Tooltip", fightSearch.searchTooltipText);
    return (
      <Tooltip
        title={fightSearch.searchTooltipText}
        color="volcano"
        visible={isValidVariable(fightSearch.searchTooltipText) ? true : false}
      >
        <Search
          className="flight-search"
          placeholder="航班号"
          size="small"
          allowClear={true}
          loading={fightSearch.searchLoadingVisible}
          onSearch={searchFlightData}
          onPressEnter={pressEnter}
          onChange={handleInputValueChange}
          style={{ marginRight: "2%", width: "135px" }}
        />
      </Tooltip>
    );
  })
);
//查询日期框
const DateSelect = inject("fightSearch")(
  observer(function ({ fightSearch }) {
    /**
     * 查询日期变更
     * */
    const handleChangeDate = useCallback((value) => {
      fightSearch.setSearchDate(value);
    }, []);
    return (
      <Select
        size="small"
        style={{ width: "70px", marginRight: "2%" }}
        defaultValue={fightSearch.searchDate}
        onChange={handleChangeDate}
      >
        <Option value="yestoday">昨日</Option>
        <Option value="today">今日</Option>
        <Option value="tomorrow">明日</Option>
      </Select>
    );
  })
);

export default inject(
  "systemPage",
  "schemeListData",
  "fightSearch",
  "flightTableData"
)(observer(FlightSearchOption));
