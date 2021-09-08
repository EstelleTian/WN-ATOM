/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-09-08 14:48:55
 * @LastEditors: liutianjiao
 * @Description:tip提示框
 * @FilePath: \WN-ATOM\src\components\CollaboratePopover\CollaborateTip.jsx
 */
import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
  Fragment
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
  const { tipsObj = {}, selectedObj } = collaboratePopoverData;
  let { name = "", id = "", type = "", title = "" } = tipsObj;

  // 内容渲染
  const getContent = () => {
    return <div>{title}</div>;
  };
  //计算提示框位置
  const reCalcPos = () => {
    //根据id和name获取dom位置
    let canvasDom = document.getElementsByClassName("flight_canvas")[0];
    let trDom = canvasDom.getElementsByClassName(id);
    let tdDom = [];
    if (trDom.length > 0) {
      tdDom = trDom[0].getElementsByClassName(name);
    } else {
      tdDom = canvasDom.getElementsByClassName(id + "_" + name);
    }

    if (tdDom.length > 0) {
      tdDom = tdDom[0];

      //获取点击坐标数据
      const bounds = tdDom.getBoundingClientRect();
      const x = bounds.x || 0;
      const y = bounds.y || 0;
      const width = bounds.width || 0;
      const height = bounds.height || 0;

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
      } else if (
        document.getElementsByClassName("collaborate_tips").length > 0
      ) {
        tipHeight =
          document.getElementsByClassName("collaborate_tips")[0].offsetHeight ||
          0;
        tipWidth =
          document.getElementsByClassName("collaborate_tips")[0].offsetWidth ||
          0;
      }

      top = y - tipHeight;
      left = x + width / 2 - tipWidth / 2;
      console.log("left", left, "top", top);
      setPosObj({ left, top });
    }
  };

  useEffect(() => {
    console.log("重新计算位置");
    if (isValidVariable(tipsObj.title)) {
      reCalcPos();
    }
  }, [selectedObj, tipsObj]);
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
