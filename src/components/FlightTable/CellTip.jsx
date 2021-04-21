/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-04-15 15:57:03
 * @LastEditors: Please set LastEditors
 * @Description: 单元格tips
 * @FilePath: CellTip.jsx
 */
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { cgreen, cred } from "utils/collaborateUtils.js";
import { useTip } from "./CustomUses";

const CellTip = (props) => {
  const [tipObj, setTipObj] = useTip(1000);
  return (
    <Tooltip title={tipObj.title} visible={tipObj.visible} color={tipObj.color}>
      <div
        onContextMenu={(e) => {
          setTipObj({
            visible: true,
            title: props.title,
            color: cgreen,
          });
        }}
      >
        {props.children}
      </div>
    </Tooltip>
  );
};

export default CellTip;
