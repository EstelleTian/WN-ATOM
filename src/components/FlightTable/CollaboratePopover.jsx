/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-04-14 14:25:42
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */

import React from "react";
import { getDayTimeFromString, getTimeAndStatus, isValidVariable } from 'utils/basic-verify'
import { FlightCoordination } from 'utils/flightcoordination.js'

import "./CollaboratePopover.scss"
import FmeToday from "../../utils/fmetoday";

const ColorPopover = (props) => {
    let {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    if( !isValidVariable(text) ){
        text = "";
    }
    let showVal = "";
    let field = {};
    if( col === "CTO" ){
        field = orgdata.ctoField || {};
        showVal = getTimeAndStatus(text);
    }else if( col === "ATOT" ){
        field = orgdata.ctoField || {};
        showVal = getDayTimeFromString(text);
    }else if( col === "EAWT" ){
        field = orgdata.eapField || {};
        showVal = getTimeAndStatus(text);
    }else if( col === "OAWT" ){
        field = orgdata.oapField || {};
        showVal = getTimeAndStatus(text);
    }
    let source = field.source || "";
    let effectStatus = field.effectStatus || "";
    if( effectStatus*1 === 200){
        source = "INVALID"
    }
    let sourceCN = FlightCoordination.getSourceZh( source );
    const fmeToday = orgdata.fmeToday;
    let bgStatus = "";
    let subTitle = "";
    //航班状态验证 2021-4-2注释，后台接口校验，前台校验去掉
    let hadDEP = FmeToday.hadDEP(fmeToday); //航班已起飞
    let hadARR = FmeToday.hadARR(fmeToday); //航班已落地
    let hadFPL = FmeToday.hadFPL(fmeToday); //航班已发FPL报
    let isInAreaFlight = FmeToday.isInAreaFlight(orgdata); //航班在本区域内

    //航班已起飞或者不在本区域内--不显示
    if ( hadDEP ) {
        if (  isValidVariable(text) ) {
            bgStatus = "DEP";
        }
        subTitle = "已起飞";
    }else if ( hadARR ) {
        if (  isValidVariable(text) ) {
            bgStatus = "ARR";
        }
        subTitle = "已落地";
    }else if ( !hadFPL ) {
        if (  isValidVariable(text) ) {
            bgStatus = "FPL";
        }
        subTitle = "未拍发FPL报";
    }else if ( !isInAreaFlight ) {
        if (  isValidVariable(text) ) {
            bgStatus = "notArea";
        }
        subTitle = "非本区域";
    }
    return(
        <div className={`full-cell ${col} ${ isValidVariable(text) ? source : "" }  ${col}_${bgStatus}` }>
            <div className={`${ isValidVariable(text) ? "" : "empty_cell" }  ${bgStatus}`} title={`${text}-${sourceCN}-${ subTitle }`}>
                <span className="">{showVal}</span>
            </div>
        </div>
    )
}
export {  ColorPopover }

