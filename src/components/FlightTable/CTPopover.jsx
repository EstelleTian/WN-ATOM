/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-05-14 16:37:05
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */

import React, { Fragment } from "react";
import {
  isValidVariable,
  getDayTimeFromString,
  getTimeAndStatus,
} from "utils/basic-verify";
import { FlightCoordination } from "utils/flightcoordination.js";
import { inject, observer } from "mobx-react";
import CellTip from "./CellTip";
import PopoverTip from "./PopoverTip";
import FmeToday from "utils/fmetoday";

//CTOT COBT FFIXT TOBT 右键协调框 通过 opt.col 列名 区分
const CTPopover = (props) => {
  const { opt, systemPage } = props;
  const { text, record, col } = opt;
  let { orgdata } = record;
  if (isValidVariable(orgdata)) {
    orgdata = JSON.parse(orgdata);
  }
  let field = {};
  let title = "";
  let hasAuth = false;
  if (col === "COBT") {
    field = orgdata.cobtField || {};
    title = "COBT时间变更";
    hasAuth = systemPage.userHasAuth(13428);
  } else if (col === "CTOT") {
    field = orgdata.ctotField || {};
    title = "CTOT时间变更";
    hasAuth = systemPage.userHasAuth(13434);
  } else if (col === "FFIXT") {
    field = orgdata.ffixField || {};
    title = "FFIXT时间变更";
    hasAuth = systemPage.userHasAuth(13440);
  } else if (col === "TOBT") {
    field = orgdata.tobtField || {};
    title = "TOBT申请变更";
    hasAuth = systemPage.userHasAuth(13425);
  }
  let source = field.source || "";
  let effectStatus = field.effectStatus || "";
  if (effectStatus * 1 === 200) {
    source = "INVALID";
  }
  let sourceCN = FlightCoordination.getSourceZh(source);

  const fmeToday = orgdata.fmeToday;
  let bgStatus = "";
  let subTitle = "";
  //航班状态验证
  let hadDEP = FmeToday.hadDEP(fmeToday); //航班已起飞
  let hadARR = FmeToday.hadARR(fmeToday); //航班已落地
  let hadFPL = FmeToday.hadFPL(fmeToday); //航班已发FPL报
  let isInAreaFlight = FmeToday.isInAreaFlight(orgdata); //航班在本区域内

  //航班已起飞或者不在本区域内--不显示
  // if ( hadDEP ) {
  //     if (  isValidVariable(text) ) {
  //         bgStatus = "DEP";
  //     }
  //     title = "航班已起飞";
  //     subTitle = "已起飞";
  // }else if ( hadARR ) {
  //     if (  isValidVariable(text) ) {
  //         bgStatus = "ARR";
  //     }
  //     title = "航班已落地";
  //     subTitle = "已落地";
  // }else if ( !hadFPL ) {
  //     if (  isValidVariable(text) ) {
  //         bgStatus = "FPL";
  //     }
  //     title = "航班尚未拍发FPL报";
  //     subTitle = "未拍发FPL报";
  // }else if ( !isInAreaFlight ) {
  //     if (  isValidVariable(text) ) {
  //         bgStatus = "notArea";
  //     }
  //     title = "非本区域航班";
  //     subTitle = "非本区域";
  // }else
  if (!hasAuth) {
    title = "无修改权限";
    subTitle = "无修改权限";
  }
  let textDom = "";
  if (col === "FFIXT") {
    let meetIntervalValue = field.meetIntervalValue || "";
    let ftime = "";
    if (isValidVariable(text) && text.length >= 12) {
      ftime = getTimeAndStatus(text);
      if (field.source === "MANUAL") {
        // console.log("MANUAL", text, ftime)
        getTimeAndStatus(text);
      }
    }
    if (ftime.indexOf("A") > -1) {
      source = "DEP";
    }
    textDom = (
      <div
        col-key={col}
        className={`full-cell time_${ftime} ${
          isValidVariable(text) ? source : ""
        } ${col}_${bgStatus}`}
      >
        <div
          className={`interval ${ftime !== "" ? source : ""}`}
          title={`${text}-${sourceCN}-${subTitle}`}
        >
          <span
            className={`${
              meetIntervalValue === "200" && ftime !== "" ? "interval_red" : ""
            }`}
          >
            {ftime}
          </span>
        </div>
      </div>
    );
  } else {
    textDom = (
      <div
      col-key={col}
        className={`full-cell ${
          isValidVariable(text) ? source : ""
        } ${col}_${bgStatus}`}
      >
        <div
          className={`${isValidVariable(text) ? "" : "empty_cell"}`}
          title={`${isValidVariable(text) ? text : ""}-${sourceCN}-${subTitle}`}
        >
          <span className="">{getDayTimeFromString(text)}</span>
        </div>
      </div>
    );
  }
  //航班已起飞或者不在本区域内--不显示 2021-4-2注释，后台接口校验，前台校验去掉
  // if ( hadDEP || hadARR || !hadFPL || !isInAreaFlight || !hasAuth ) {
  // if ( !hasAuth ) {
  //     return (
  //         <CellTip title={title}>
  //             {textDom}
  //         </CellTip>
  //     )
  // }else{
  //     return(
  //         <PopoverTip title={ title } textDom={textDom} opt={opt} field={field}/>
  //     )
  // }

  return <Fragment>{textDom}</Fragment>;
};

export default inject("systemPage")(observer(CTPopover));
// export default CTPopover
