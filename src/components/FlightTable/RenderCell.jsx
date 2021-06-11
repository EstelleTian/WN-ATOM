/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-06-11 10:49:04
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */

import React from "react";
import {
  getDayTimeFromString,
  getTimeAndStatus,
  isValidVariable,
  isValidObject,
} from "utils/basic-verify";
import { FlightCoordination } from "utils/flightcoordination.js";
import FmeToday from "../../utils/fmetoday";
import "./RenderCell.scss";

const RenderCell = (props) => {
  let { record, index, col } = props.opt;
  let field = props.opt.text || {};
  let { orgdata } = record;
  if (isValidVariable(orgdata)) {
    orgdata = JSON.parse(orgdata);
  }

  let value = field.value || "";
  let showVal = "";
  if (col === "CTOT" || col === "COBT" || col === "CTO") {
    showVal = getTimeAndStatus(value) || "";
  } else {
    showVal = getDayTimeFromString(value) || "";
  }

  let source = field.source || "";
  let effectStatus = field.effectStatus || "";
  if (effectStatus * 1 === 200) {
    source = "INVALID";
  }
  let sourceCN = FlightCoordination.getSourceZh(source);
  const fmeToday = orgdata.fmeToday || {};
  let bgStatus = "";
  let subTitle = "";
  //航班状态验证 2021-4-2注释，后台接口校验，前台校验去掉
  let hadDEP = isValidObject(fmeToday) ? FmeToday.hadDEP(fmeToday) : false; //航班已起飞
  let hadARR = isValidObject(fmeToday) ? FmeToday.hadARR(fmeToday) : false; //航班已落地
  let hadFPL = isValidObject(fmeToday) ? FmeToday.hadFPL(fmeToday) : false; //航班已发FPL报
  let isInAreaFlight = FmeToday.isInAreaFlight(orgdata); //航班在本区域内

  //航班已起飞或者不在本区域内--不显示
  if (hadDEP) {
    if (isValidVariable(value)) {
      bgStatus = "DEP";
    }
    subTitle = "已起飞";
  } else if (hadARR) {
    if (isValidVariable(value)) {
      bgStatus = "ARR";
    }
    subTitle = "已落地";
  } else if (!hadFPL) {
    if (isValidVariable(value)) {
      bgStatus = "FPL";
    }
    subTitle = "未拍发FPL报";
  } else if (!isInAreaFlight) {
    if (isValidVariable(value)) {
      bgStatus = "notArea";
    }
    subTitle = "非本区域";
  }
  return (
    <div
      className={`full-cell ${col} ${
        isValidVariable(value) ? source : ""
      }  ${col}_${bgStatus}`}
    >
      <div
        className={`${isValidVariable(value) ? "" : "empty_cell"}  ${bgStatus}`}
        title={`${value}-${sourceCN}-${subTitle}`}
      >
        <span className="">{showVal}</span>
      </div>
    </div>
  );
};
export default RenderCell;
