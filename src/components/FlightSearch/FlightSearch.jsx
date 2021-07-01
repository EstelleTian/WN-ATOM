/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2021-06-30 14:41:17
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
import { List, Divider, Icon, Form, Input, Drawer, Tag, Row, Col } from "antd";
import ModalBox from "components/ModalBox/ModalBox";
import DraggableModal from "components/DraggableModal/DraggableModal";
import FlightSearchOption from "./FlightSearchOption";
import FlightList from "./FlightList";
import FlightSummer from "./FlightSummer";
import "./FlightSearch.scss";

//航班查询模块
const FlightSearch = (props) => {
  return (
    <ModalBox title="航班查询" showDecorator={true} className="flight_search">
      <div className="container">
        <FlightSearchOption />
        <div className="content">
          <FlightList />
          <FlightSummer />
        </div>
      </div>
    </ModalBox>
  );
};

export default inject(
  "systemPage",
  "fightSearch",
  "schemeListData",
  "flightTableData",
  "flightDetailData"
)(observer(FlightSearch));

// export default FlightSearch;
