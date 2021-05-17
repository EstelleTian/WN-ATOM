/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-14 16:40:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\PopoverTip.jsx
 */
import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  message,
  Popover,
  Button,
  Form,
  Descriptions,
  Input,
  DatePicker,
  Checkbox,
  Tooltip,
} from "antd";
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
//popover和tip组合协调窗口
const PositionPopover = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, serRefuseBtnLoading] = useState(false);
  const [form] = Form.useForm();
  const { popoverName = "", collaboratePopoverData = {} } = props;
  const { selectedObj = {}, popoverVisible } = collaboratePopoverData;
  const { name = "" } = selectedObj;

  // 内容渲染
  const getContent = () => {
    if (popoverName === "POS") {
      return <PositionCont />;
    } else if (popoverName === "RWY") {
      return <RunwayCont />;
    } else if (popoverName === "FFIXT") {
      return <FFixTCont />;
    }
    return "";
  };

  const getTitle = () => {
    let titleName = "";
    if (popoverName === "POS") {
      titleName = "停机位修改";
    } else if (popoverName === "RWY") {
      titleName = "跑道修改";
    } else if (popoverName === "FFIXT") {
      titleName = "受控过点时间修改";
    }
    return (
      <div className="popover_title">
        <span>{`${titleName}`}</span>
        <span
          className="close"
          onClick={(e) => {
            collaboratePopoverData.togglePopoverVisible(false);
          }}
        >
          X
        </span>
      </div>
    );
  };
  useEffect(() => {
    console.log("挂载", { ...selectedObj });
    const popoverDoms = document.getElementsByClassName(name + "_popover");
    if (popoverDoms.length > 0) {
      //定位
      const popoverDom = popoverDoms[0];
      const { x, y, width } = selectedObj;
      setTimeout(() => {
        popoverDom.style.left = x + width + "px";
        popoverDom.style.top = y + "px";
      }, 30);
    }
    // }
    return () => {
      console.log("卸载");
    };
  }, [
    collaboratePopoverData.popoverVisible,
    collaboratePopoverData.selectedObj,
  ]);
  return (
    <Popover
      overlayClassName={`collaborate_popover ${popoverName}_popover ${
        collaboratePopoverData.popoverVisible &&
        selectedObj.name === popoverName
          ? ""
          : "hidden"
      }`}
      destroyTooltipOnHide={{ keepParent: false }}
      placement="rightTop"
      title={getTitle()}
      content={getContent()}
      visible={true}
    ></Popover>
  );
};

export default inject("collaboratePopoverData")(observer(PositionPopover));
