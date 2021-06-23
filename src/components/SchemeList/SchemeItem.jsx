import React, { useState, useEffect, useCallback, memo } from "react";
import { inject, observer } from "mobx-react";
import ReactDom from "react-dom";
import {
  getTimeFromString,
  getDayTimeFromString,
  isValidVariable,
  isValidObject,
  calculateStringTimeDiff,
} from "utils/basic-verify";
import { FlightCoordination, reasonType } from "utils/flightcoordination";
import { handleStopControl, openRunningControlFlow } from "utils/client";
import { Window as WindowDHX } from "dhx-suite";
import { openBaseSchemeFrame, openFilterFrame } from "utils/client";
import WorkFlowContent from "components/WorkFlow/WorkFlowContent";
import { Tag, Menu, Dropdown, Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const SummaryCell = memo(
  ({
    publishTime,
    createTime,
    basicTacticInfoReasonZh,
    basicTacticInfoRemark,
  }) => {
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = (flag) => {
      setVisible(flag);
    };

    const menu = (
      <Menu>
        <Menu.Item key="1" title={publishTime}>
          发布时间: {getDayTimeFromString(publishTime, "", 2)}
        </Menu.Item>
        <Menu.Item key="2" title={createTime}>
          创建时间: {getDayTimeFromString(createTime, "", 2)}
        </Menu.Item>
        <Menu.Item key="3">原因: {basicTacticInfoReasonZh}</Menu.Item>
        <Menu.Item key="4">备注: {basicTacticInfoRemark}</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown
        overlay={menu}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <span className="ant-dropdown-link">
          <span
            style={{
              padding: "0 10px",
              fontSize: "0.8rem",
            }}
          >
            发布时间:
          </span>
          {getTimeFromString(publishTime)} <DownOutlined />
        </span>
      </Dropdown>
    );
  }
);

//单条方案
function SchemeItem(props) {
  const [window, setWindow] = useState("");
  const [windowClass, setWindowClass] = useState("");

  let { item, activeSchemeId, userHasAuth, generateTime } = props;
  let {
    id,
    isCalculated,
    tacticName,
    tacticStatus,
    tacticPublishUnit,
    basicTacticInfoReason,
    basicTacticInfoRemark,
    tacticTimeInfo: {
      startTime,
      endTime = "",
      publishTime,
      createTime,
      startCalculateTime = "",
    },
    basicFlowcontrol = {},
    directionList = [],
    schemeRelative = "",
    tacticMode = "",
    tempSyncSign = "0",
    tacticSource = ""
  } = item;
  let isActive = activeSchemeId === id;
  // NTFM流控
  let isNTFM = tacticSource === "NTFM-ORIGINAL"

  basicTacticInfoRemark = basicTacticInfoRemark || "";
  if (basicFlowcontrol === null) {
    basicFlowcontrol = {};
  }
  let { flowControlMeasure = {} } = basicFlowcontrol;
  if (flowControlMeasure === null) {
    flowControlMeasure = {};
  }
  let basicTacticInfoReasonZh = reasonType[basicTacticInfoReason] || "";
  let {
    restrictionMITValue = "",
    restrictionAFPValueSequence = "",
    restrictionMode = "",
    restrictionMITValueUnit = "",
  } = flowControlMeasure;
  //限制值
  let interVal = "";
  if (restrictionMode === "MIT") {
    interVal = restrictionMITValue;
  } else if (restrictionMode === "AFP") {
    interVal = restrictionAFPValueSequence;
  }
  let unit = "";
  if (restrictionMode === "MIT" || restrictionMode === "AH") {
    if (restrictionMITValueUnit === "T") {
      unit = "分钟";
    } else if (restrictionMITValueUnit === "D") {
      unit = "公里";
    }
  } else if (restrictionMode === "AFP") {
    unit = "架";
  }

  let targetUnits = [];
  let behindUnits = [];
  if (!isValidVariable(directionList)) {
    directionList = [];
  }
  directionList.map((item) => {
    if (isValidVariable(item.targetUnit)) {
      targetUnits.push(item.targetUnit);
    }
    if (isValidVariable(item.behindUnit)) {
      behindUnits.push(item.behindUnit);
    }
  });
  targetUnits = targetUnits.join(";");
  behindUnits = behindUnits.join(";");
  // if (targetUnits !== "") {
  //   targetUnits = targetUnits.substring(0, targetUnits.length - 1);
  // }
  // if (behindUnits !== "") {
  //   behindUnits = behindUnits.substring(0, targetUnits.length - 1);
  // }

  // 开始时间格式化
  let startTimeFormat = getDayTimeFromString(startTime);
  // 结束时间格式化
  let endTimeFormat = getDayTimeFromString(endTime);
  // 若schemeRelative值为"100",则为相对时间
  if (schemeRelative === "100") {
    startTimeFormat = startTimeFormat ? `(${startTimeFormat})` : "";
    endTimeFormat = endTimeFormat ? `(${endTimeFormat})` : "";
    targetUnits = targetUnits ? `(${targetUnits})` : "";
  }

  const showDetail = useCallback(
    (e) => {
      props.toggleModalVisible(true, id);
      props.toggleModalType("DETAIL");
      e.preventDefault();
      e.stopPropagation();
    },
    [id]
  );

  const showModify = useCallback(
    (e) => {
      props.toggleModalVisible(true, id);
      props.toggleModalType("MODIFY");
      e.preventDefault();
      e.stopPropagation();
    },
    [id]
  );
  // 显示重新发布模态框
  const showRecreate = useCallback(
    (e) => {
      props.toggleModalVisible(true, id);
      props.toggleModalType("RECREATE");
      e.preventDefault();
      e.stopPropagation();
    },
    [id]
  );

  const onChange = useCallback(
    (e) => {
      if (document.getElementsByClassName("collaborate_popover").length > 0) {
        console.log("有协调窗口打开，强制关闭");
        //清理协调窗口
        props.collaboratePopoverData.setSelectedObj({
          name: "",
          target: null,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        });
      }
      const { activeSchemeCalculatingModalVisible } = props.schemeListData;
      if (!isCalculated) {
        if (!activeSchemeCalculatingModalVisible) {
          Modal.warning({
            width: 500,
            title: "方案【" + tacticName + "】正在计算中，请稍后再试...",
            content: "",
            okText: "知道了",
            onOk: () => {
              props.schemeListData.toggleActiveSchemeCalculatingModalVisible(
                false
              );
            },
          });
          props.schemeListData.toggleActiveSchemeCalculatingModalVisible(true);
        }
        return;
      } else {
        if (activeSchemeCalculatingModalVisible) {
          props.schemeListData.toggleActiveSchemeCalculatingModalVisible(false);
        }
      }
      props.handleActive(id);
      e.preventDefault();
      e.stopPropagation();
    },
    [id, isCalculated]
  );

  //工作流详情
  const showWorkFlowDetail = useCallback((id) => {
    let windowClass = "win_" + id;
    if (!isValidVariable(id)) {
      windowClass = "win_" + Math.floor(Math.random() * 100000000);
    }
    if (document.getElementsByClassName(windowClass).length === 0) {
      const newWindow = new WindowDHX({
        width: 1000,
        height: 665,
        title: "工作流详情(方案ID:" + id + ")",
        html: `<div class="wind_canvas ` + windowClass + `"></div>`,
        css: "bg-black",
        closable: true,
        movable: true,
        resizable: true,
      });
      setWindow(newWindow);
      setWindowClass(windowClass);
    } else {
      window.show();
    }
  });
  //终止 详情
  const stopControl = useCallback((id) => {
    handleStopControl(id);
  });

  useEffect(
    function () {
      if (window !== "") {
        window.show();
        setTimeout(function () {
          const winDom = document.getElementsByClassName(windowClass)[0];
          ReactDom.render(
            <WorkFlowContent modalId={id} window={window} source="clearance" />,
            winDom
          );
        }, 200);
      }
    },
    [window]
  );

  // 下拉菜单按钮点击事件
  const handleMenuClick = (e) => {
    const event = e.domEvent;
    event.stopPropagation();
    const key = e.key;
    // 执行情况菜单按钮点击事件
    if (key === "Implementation") {
      // 调用客户端方法,参数为当前方案id
      openRunningControlFlow(id);
    }
  };

  // 决策依据下拉菜单
  const baseSchemeFrameMenu = (
    <Menu className="base-scheme-frame-menu" onClick={handleMenuClick}>
      <Menu.Item key="Implementation">
        <div className="opt">执行情况</div>
      </Menu.Item>
    </Menu>
  );

  const setClassName = ()=> {
    let className = "item_container layout-column";
    if(isActive) {
      className +=" item_active";
    }
    if(isNTFM) {
      className +=" NTFM-item";
    }
    return className;
  }

  return (
    <div
      className={setClassName()}
      onClick={onChange}
    >
      <div className="layout-row">
        <div className="left-column border-bottom layout-column justify-content-center">
          <div className="name">
            <div className="cell">
              <span
                className="tactic-name"
                title={`方案名称: ${tacticName} ID:${id} `}
              >
                {tacticName}
              </span>
            </div>
          </div>
          <div className="state">
            <div className="cell">
              <span className={`${tacticStatus} status`} title="方案状态">
                {FlightCoordination.getSchemeStatusZh(tacticStatus)}
              </span>
              <span className="calculate" title="方案计算状态">
                {isCalculated ? "已计算" : "计算中"}
              </span>
              {tacticMode === "200" ? (
                <span className="" title="二类">
                  <Tag color="#f50">Ⅱ</Tag>
                </span>
              ) : (
                ""
              )}
              {
                tempSyncSign === "100" && (
                  <span className="" title="同步">
                  <Tag color="#26a69a">同</Tag>
                </span>
                )
              }
            </div>
          </div>
        </div>
        <div className="right-column border-bottom layout-row">
          <div className="layout-column column-box">
            <div className="border-bottom">
              <div className="cell" title={`发布单位: ${tacticPublishUnit}`}>
                {tacticPublishUnit}
              </div>
            </div>

            <div className="">
              <div className="cell" title={`限制方式: ${restrictionMode}`}>
                {restrictionMode}
              </div>
            </div>
          </div>
          <div className="layout-column double-column-box">
            <div className="column-box  border-bottom">
              <div
                className="cell time_range"
                title={startTime + "-" + endTime}
              >
                {startTimeFormat} - {endTimeFormat}
              </div>
            </div>
            <div className="layout-row">
              <div className="column-box">
                <div
                  className="cell"
                  style={{ color: "#f5f5f5" }}
                  title={`限制值: ${interVal}${unit}`}
                >{`${interVal}${unit}`}</div>
              </div>
              <div className="column-box">
                <div
                  className="cell"
                  style={{ color: "#f5f5f5" }}
                  title={`基准单元: ${targetUnits}`}
                >
                  {targetUnits}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="layout-row">
        <div className="summary">
          <SummaryCell
            publishTime={publishTime}
            createTime={createTime}
            basicTacticInfoReasonZh={basicTacticInfoReasonZh}
            basicTacticInfoRemark={basicTacticInfoRemark}
          />
        </div>
        <div className="right-column2">
          <div className="options-box layout-row">
            <div
              className="opt"
              onClick={(e) => {
                showDetail(e);
                e.stopPropagation();
              }}
            >
              详情
            </div>

            {props.systemPage.userHasAuth(11301) && !isNTFM &&
              ["FUTURE", "RUNNING"].includes(tacticStatus) && (
                <div className="opt" onClick={showModify}>
                  调整
                </div>
              )}

            {/* {props.systemPage.userHasAuth(11301) &&
              ["TERMINATED_MANUAL", "TERMINATED_AUTO", "FINISHED"].includes(
                tacticStatus
              ) && (
                <div className="opt" onClick={showRecreate}>
                  重新发布
                </div>
              )} */}
            {props.systemPage.userHasAuth(11401)  && !isNTFM && (
              <div
                className="opt"
                onClick={(e) => {
                  showWorkFlowDetail(id);
                  e.stopPropagation();
                }}
              >
                工作流
              </div>
            )}
            {props.systemPage.userHasAuth(11502) && !isNTFM && (
              <Dropdown overlay={baseSchemeFrameMenu}>
                <div
                  className="opt"
                  onClick={(e) => {
                    openBaseSchemeFrame(id);
                    e.stopPropagation();
                  }}
                >
                  决策依据
                  <DownOutlined />
                </div>
              </Dropdown>
            )}

            {props.systemPage.userHasAuth(11201) &&  !isNTFM &&
              ["FUTURE", "RUNNING"].includes(tacticStatus) && (
              <div
                className="opt"
                onClick={(e) => {
                  stopControl(id);
                  e.stopPropagation();
                }}
              >
                终止
              </div>
            )}
            {props.systemPage.userHasAuth(11505) && !isNTFM && (
              <div
                className="opt"
                onClick={(e) => {
                  openFilterFrame(id, tacticName, targetUnits, interVal);
                  e.stopPropagation();
                }}
              >
                航图关联
              </div>
            )}

            {
              // (screenWidth > 1920)
              // ? <div className="opt" onClick={ showModify}>调整</div>
              // : <div className="opt">
              //     <Dropdown overlay={menu}>
              //         <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              //         <DownOutlined />
              //         </a>
              //     </Dropdown>
              // </div>
            }
          </div>
        </div>
      </div>
      {
        isNTFM && (
          <div className="ntfm-flag" title="NTFM"></div>
        )
      }      
    </div>
  );
}

export default inject(
  "systemPage",
  "schemeListData",
  "collaboratePopoverData"
)(observer(SchemeItem));
