/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2021-07-01 11:18:38
 * @LastEditors: Please set LastEditors
 * @Description: 航班查询-列表
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, { useCallback, useMemo } from "react";
import { observer, inject } from "mobx-react";
import { getDayTimeFromString, isValidVariable } from "utils/basic-verify";
import { List } from "antd";
import { FlightCoordination } from "utils/flightcoordination";

//航班查询模块
const FlightList = ({ flightTableData, fightSearch, schemeListData }) => {
  const {
    flight = {},
    formerFlight = {},
    drawerFlightId = "",
  } = useMemo(() => {
    const res = fightSearch.drawerFlight || {};
    const { flight = {}, formerFlight = {} } = res;
    // 略情激活航班id
    const drawerFlightId = flight.id || "";
    return { flight, formerFlight, drawerFlightId };
  }, [fightSearch.drawerFlight]);

  /**
   * 绘制航班列表中单个航班信息
   * */
  const drawFlightItem = function (item, index) {
    let formerFlight = item.formerFlightObj || {};
    let FLIGHTID = item.flightId || "";
    let DEPAP = item.depAp || "N/A";
    let ARRAP = item.arrAp || "N/A";
    let SOBT = item.sobt || "N/A";
    let REG = item.registeNum || "N/A";
    let FORMER = formerFlight.flightId || "N/A";
    let FORMERDEPAP = formerFlight.depAp || "N/A";
    let FORMERARRAP = formerFlight.arrAp || "N/A";

    const onClickCB = (flight) => {
      // 更新航班略情抽屉中的航班数据
      fightSearch.setDrawerFlight(flight);
      fightSearch.setDrawerVisible(true);
    };
    return (
      <List.Item
        className={item.id === drawerFlightId ? "selected" : ""}
        key={item.id}
        onClick={(e) => {
          onClickCB(item);
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

  //   const convertSingleFlight = useCallback((flightData) => {
  //     let flight = flightData.flight || {};
  //     let formerFlight = flightData.formerFlight || {};
  //     let obj = {
  //       ...flight,
  //       formerFlightObj: formerFlight,
  //     };
  //     return obj;
  //   }, []);

  //   const dataList = useMemo(() => {
  //     const flightListData = fightSearch.flightListData;
  //     // 遍历将结果数据对象转为数组形式
  //     let flightListData = [];
  //     for (let flightId in flightListData) {
  //       //转化为列表数据格式
  //       let flight = convertSingleFlight(dataMap[item]);
  //       flightListData.push(flight);
  //     }
  //     return flightListData;
  //   }, [fightSearch.flightListData]);

  return (
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
        dataSource={fightSearch.flightListData}
        renderItem={drawFlightItem}
      />
    </div>
  );
};

export default inject(
  "fightSearch",
  "schemeListData",
  "flightTableData"
)(observer(FlightList));
