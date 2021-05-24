/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-24 19:53:03
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
import "./CollaboratePopover.scss";

let showPopoverNames = ["FFIXT", "POS", "RWY"];
//popover和tip组合协调窗口
const PositionPopover = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, setRefuseBtnLoading] = useState(false);
  const tipsRef = useRef();
  const { collaboratePopoverData = {} } = props;
  const { tipsObj = {} } = collaboratePopoverData;
  let { name = "", x = 0, y = 0, width = 0, height = 0 } = tipsObj;

  // 内容渲染
  const getContent = () => {
    return <div>{tipsObj.title}</div>;
  };

  //TODO 计算距离屏幕底部距离，向上展示，防止遮挡。 目前仅向下展示了。
  let { left, top } = useMemo(() => {
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
    } else {
      tipHeight = 50;
      tipWidth = 200;
    }

    top = y - tipHeight;
    left = x + width / 2 - tipWidth / 2;
    console.log("left", left, "top", top);
    return { left, top };
  }, [showPopoverNames, tipsObj]);
  return (
    <Fragment>
      {tipsObj.title !== "" && (
        <div
          style={{ left: left + "px", top: top + "px" }}
          className={`collaborate_tips ${name}_tips ${tipsObj.type}`}
          ref={tipsRef}
        >
          <div className="tips_container">{getContent()}</div>
        </div>
      )}
    </Fragment>
  );
};

export default inject("collaboratePopoverData")(observer(PositionPopover));
