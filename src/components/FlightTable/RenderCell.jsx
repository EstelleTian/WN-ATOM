/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-06-15 15:01:53
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
import FmeToday from "utils/fmetoday";
import "./RenderCell.scss";

const RenderCell = (props) => {
  let { record, index, col } = props.opt;
  let field = props.opt.text || {};

  let {
    source = "",
    value = "",
    type = "",
    title = "",
    sourceZH = "",
    effectStatus = "",
    meetIntervalValue = "",
  } = field;
  let showVal = "";
  if (isValidVariable(value) && value.length >= 12) {
    type = type === null ? "" : type;
    showVal = getDayTimeFromString(value) + " " + type;
  }

  if (effectStatus * 1 === 200) {
    source = "INVALID";
  }

  return (
    <div
      className={`full-cell ${col} ${
        isValidVariable(value) ? source : ""
      }  ${col}_${source}`}
    >
      <div
        className={`${isValidVariable(value) ? "" : "empty_cell"}  ${source}`}
        title={`${title}`}
      >
        <span className="">{showVal}</span>
      </div>
    </div>
  );
};
export default RenderCell;
