/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-19 16:40:34
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
  Fragment,
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

let showPopoverNames = ["FFIXT", "POS", "RWY"];
//popover和tip组合协调窗口
const PositionPopover = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, setRefuseBtnLoading] = useState(false);
  const [form] = Form.useForm();
  const { collaboratePopoverData = {} } = props;
  const { selectedObj = {} } = collaboratePopoverData;
  const { name = "", x = 0, y = 0, width = 0 } = selectedObj;

  //重置数据
  const clearCollaboratePopoverData = () => {
    collaboratePopoverData.setData({});
    //坐标数据 赋值
    collaboratePopoverData.setSelectedObj({
      name: "",
      target: null,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  };
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
    } else if (name === "FFIXT") {
      return (
        <FFixTCont clearCollaboratePopoverData={clearCollaboratePopoverData} />
      );
    }
    return "";
  };

  const getTitle = () => {
    let titleName = "";
    if (name === "POS") {
      titleName = "停机位修改";
    } else if (name === "RWY") {
      titleName = "跑道修改";
    } else if (name === "FFIXT") {
      titleName = "受控过点时间修改";
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

  let left = x + width + "px";
  let top = y + "px";
  console.log("left", left, "top", top);
  return (
    <Fragment>
      {showPopoverNames.indexOf(name) > -1 && (
        <div
          style={{ left: left, top: top }}
          className={`collaborate_popover ${name}_popover`}
        >
          {getTitle()}
          <div className="popover_container">{getContent()}</div>
        </div>
      )}
      ;
    </Fragment>
  );
};

export default inject("collaboratePopoverData")(observer(PositionPopover));
