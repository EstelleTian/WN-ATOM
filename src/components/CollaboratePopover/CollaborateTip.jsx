/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-25 13:35:51
 * @LastEditors: Please set LastEditors
 * @Description:tip提示框
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
import "./CollaboratePopover.scss";

let showPopoverNames = ["FFIXT", "POS", "RWY"];
//tip提示框
const PositionPopover = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, setRefuseBtnLoading] = useState(false);
  const [posObj, setPosObj] = useState({});
  const tipsRef = useRef();
  const { collaboratePopoverData = {} } = props;
  const { tipsObj = {} } = collaboratePopoverData;
  let {
    name = "",
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    type = "",
    title = "",
  } = tipsObj;

  // 内容渲染
  const getContent = () => {
    return <div>{title}</div>;
  };
  //计算提示框位置
  const reCalcPos = () => {
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
    let left = x;
    let screenHeight = document.getElementsByTagName("body")[0].offsetHeight;
    let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
    let top = y;

    const current = tipsRef.current;
    let tipHeight = 0;
    let tipWidth = 0;
    if (isValidVariable(current)) {
      tipHeight = current.offsetHeight || 0;
      tipWidth = current.offsetWidth || 0;
    } else if (document.getElementsByClassName("collaborate_tips").length > 0) {
      tipHeight =
        document.getElementsByClassName("collaborate_tips")[0].offsetHeight ||
        0;
      tipWidth =
        document.getElementsByClassName("collaborate_tips")[0].offsetWidth || 0;
    }

    top = y - tipHeight;
    left = x + width / 2 - tipWidth / 2;
    console.log("left", left, "top", top);
    setPosObj({ left, top });
  };

  useEffect(() => {
    reCalcPos();
  }, [tipsObj]);
  return (
    <Fragment>
      {title !== "" && (
        <div
          style={{ left: posObj.left + "px", top: posObj.top + "px" }}
          className={`collaborate_tips ${name}_tips ${type}`}
          ref={tipsRef}
        >
          <div className="tips_container">{getContent()}</div>
        </div>
      )}
    </Fragment>
  );
};

export default inject("collaboratePopoverData")(observer(PositionPopover));
