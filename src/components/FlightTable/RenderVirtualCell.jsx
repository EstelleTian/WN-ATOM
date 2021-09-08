/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-09-08 12:11:35
 * @LastEditors: liutianjiao
 * @Description:
 * @FilePath: \WN-ATOM\src\components\FlightTable\RenderVirtualCell.jsx
 */

import React from "react";
import { Tooltip } from "antd";
import {
  getDayTimeFromString,
  getTimeAndStatus,
  isValidVariable,
  isValidObject
} from "utils/basic-verify";
import { FlightCoordination } from "utils/flightcoordination.js";
import FmeToday from "utils/fmetoday";
import "./RenderCell.scss";

const getTitle = (title) => {
  if (!isValidVariable(title)) return "";
  if (title * 1 > 0 && title.length >= 12) {
    return <div>{getDayTimeFromString(title, "", 2)}</div>;
  } else {
    const titleArr = title.split("#");
    return (
      <div>
        {titleArr.map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </div>
    );
  }
};

const RenderVirtualCell = ({ cellData, columnName }) => {
  let { source = "", value = "", type = "", title = "" } = cellData;
  let showVal = "";
  if (isValidVariable(value) && value.length >= 12) {
    type = type === null ? "" : type;
    showVal = getDayTimeFromString(value) + " " + type;
  }
  if (!isValidVariable(title) && isValidVariable(value)) {
    title = value;
  }
  return (
    // <Tooltip placement="bottom" title={getTitle(title)}>
    <div
      className={`full-cell ${columnName} ${
        isValidVariable(value) ? source : ""
      }  ${columnName}_${source}`}
      title={title}
    >
      <div className={`${isValidVariable(value) ? "" : "empty_cell"}`}>
        <span className="">{showVal}</span>
      </div>
    </div>
    // </Tooltip>
  );
};
export default RenderVirtualCell;
