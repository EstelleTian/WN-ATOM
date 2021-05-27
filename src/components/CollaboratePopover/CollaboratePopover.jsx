/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-27 13:28:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\PopoverTip.jsx
 */
import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
  Fragment,
} from "react";
import { observer, inject } from "mobx-react";
import { request } from "utils/request";
import { CollaborateUrl } from "utils/request-urls";
import { REGEXP } from "utils/regExpUtil";
import { isValidVariable, getFullTime } from "utils/basic-verify";
import { closePopover, cgreen, cred } from "utils/collaborateUtils.js";
import PositionCont from "./PositionCont";
import RunwayCont from "./RunwayCont";
import FFixTCont from "./FFixTCont";
import TimeFormCont from "./TimeFormCont";
import FlightIdCont from "./FlightIdCont";
import "./CollaboratePopover.scss";

const showPopoverNames = [
  "FLIGHTID",
  "FFIXT",
  "POS",
  "RWY",
  "AOBT",
  "AGCT",
  "ASBT",
  "TOBT",
  "COBT",
  "CTOT",
];
const PopoverCNNames = {
  FLIGHTID: "",
  POS: "停机位修改",
  RWY: "跑道修改",
  FFIXT: "受控过点时间修改",
  AOBT: "推出时间修改",
  AGCT: "关舱门时间修改",
  ASBT: "上客时间修改",
  TOBT: "TOBT申请变更",
  COBT: "COBT时间变更",
  CTOT: "CTOT时间变更",
};

//popover和tip组合协调窗口
const ColPopover = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, setRefuseBtnLoading] = useState(false);
  const [posObj, setPosObj] = useState({});

  const popoverRef = useRef();
  const { collaboratePopoverData = {} } = props;
  const { selectedObj = {} } = collaboratePopoverData;
  let {
    name = "",
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    flightId = "",
  } = selectedObj;

  //重置数据
  const clearCollaboratePopoverData = useCallback(() => {
    collaboratePopoverData.setData({});
    //坐标数据 赋值
    collaboratePopoverData.setSelectedObj({
      name: "",
      flightId: "",
      target: null,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  }, []);
  // 内容渲染
  const getContent = () => {
    if (name === "POS") {
      return (
        <PositionCont
          clearCollaboratePopoverData={clearCollaboratePopoverData}
        />
      );
    } else if (name === "RWY") {
      return (
        <RunwayCont clearCollaboratePopoverData={clearCollaboratePopoverData} />
      );
    } else if (name === "FLIGHTID") {
      return (
        <FlightIdCont
          clearCollaboratePopoverData={clearCollaboratePopoverData}
        />
      );
    } else if (name === "FFIXT") {
      return (
        <FFixTCont clearCollaboratePopoverData={clearCollaboratePopoverData} />
      );
    } else if (
      name === "AOBT" ||
      name === "AGCT" ||
      name === "ASBT" ||
      name === "COBT" ||
      name === "CTOT" ||
      name === "TOBT"
    ) {
      return (
        <TimeFormCont
          clearCollaboratePopoverData={clearCollaboratePopoverData}
        />
      );
    }
    return "";
  };

  const getTitle = () => {
    let titleName = PopoverCNNames[name] || "";
    if (name === "FLIGHTID") {
      titleName = flightId || "";
    }
    return (
      <div className="popover_title">
        <span>{`${titleName}`}</span>
        <span className="close" onClick={clearCollaboratePopoverData}>
          X
        </span>
      </div>
    );
  };
  //计算提示框位置
  const reCalcPos = () => {
    let pos = "top-right";
    if (x === null) {
      x = 0;
    }
    if (width === null) {
      width = 0;
    }
    if (height === null) {
      height = 0;
    }
    if (y === null) {
      y = 0;
    }
    let left = x + width;
    let screenHeight = document.getElementsByTagName("body")[0].offsetHeight;
    let top = y;

    if (((screenHeight / 2) | 0) < y) {
      const current = popoverRef.current;
      let popHeight = 0;
      if (isValidVariable(current)) {
        popHeight = current.offsetHeight || 0;
      } else if (
        document.getElementsByClassName("collaborate_popover").length > 0
      ) {
        popHeight =
          document.getElementsByClassName("collaborate_popover")[0]
            .offsetHeight || 0;
      }
      // console.log(popHeight);
      top = y - popHeight + height;
      pos = "bottom-right";
    }
    // console.log("left", left, "top", top);
    setPosObj({ left, top, pos });
  };

  useEffect(() => {
    reCalcPos();
  }, [selectedObj]);

  return (
    <Fragment>
      {showPopoverNames.indexOf(name) > -1 && (
        <div
          style={{ left: posObj.left + "px", top: posObj.top + "px" }}
          className={`collaborate_popover ${name}_popover ${posObj.pos}`}
          ref={popoverRef}
        >
          {getTitle()}
          <div className="popover_container">{getContent()}</div>
        </div>
      )}
    </Fragment>
  );
};

export default inject("collaboratePopoverData")(observer(ColPopover));
