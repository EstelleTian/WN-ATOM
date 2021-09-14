import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { inject, observer } from "mobx-react";
import ReactDom from "react-dom";
import {
  getTimeFromString,
  getDayTimeFromString,
  isValidVariable,
  isValidObject,
  calculateStringTimeDiff,
  parseFullTime
} from "utils/basic-verify";
import { FlightCoordination, reasonType } from "utils/flightcoordination";
import { handleStopControl, openRunningControlFlow } from "utils/client";
import { Window as WindowDHX } from "dhx-suite";
import { openBaseSchemeFrame, openFilterFrame } from "utils/client";
import WorkFlowContent from "components/WorkFlow/WorkFlowContent";
import { Tag, Menu, Dropdown, Modal, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const SummaryCell = memo(
  ({
    publishTime,
    createTime,
    basicTacticInfoReasonZh,
    basicTacticInfoRemark,
    updateTime,
    tacticStatus
  }) => {
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = (flag) => {
      setVisible(flag);
    };
    // 是否为终止状态(人工终止或系统终止或正常结束)
    let isTerminated =
      tacticStatus === "TERMINATED_MANUAL" ||
      tacticStatus === "TERMINATED_AUTO" ||
      tacticStatus === "FINISHED";

    const menu = (
      <Menu selectable={false}>
        <Menu.Item key="publishTime" title={publishTime}>
          发布时间: {getDayTimeFromString(publishTime, "", 2)}
        </Menu.Item>
        <Menu.Item key="createTime" title={createTime}>
          创建时间: {getDayTimeFromString(createTime, "", 2)}
        </Menu.Item>
        {isTerminated ? (
          <Menu.Item key="updateTime" title={updateTime}>
            终止时间: {getDayTimeFromString(updateTime, "", 2)}
          </Menu.Item>
        ) : (
          ""
        )}
        <Menu.Item key="reason">原因: {basicTacticInfoReasonZh}</Menu.Item>
        <Menu.Item key="remark">备注: {basicTacticInfoRemark}</Menu.Item>
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
              fontSize: "0.8rem"
            }}
          >
            {isTerminated ? "终止时间:" : "发布时间:"}
          </span>
          <span
            style={{
              padding: "0 10px",
              fontSize: "0.8rem"
            }}
          >
            {isTerminated
              ? getTimeFromString(updateTime)
              : getTimeFromString(publishTime)}
          </span>

          <DownOutlined />
        </span>
      </Dropdown>
    );
  }
);

//单条方案
function SchemeItem(props) {
  const [window, setWindow] = useState("");
  const [windowClass, setWindowClass] = useState("");

  let { item, systemPage = {}, generateTime, schemeListData } = props;
  let user = systemPage.user || {};
  let username = user.username || "";
  let {
    id,
    isCalculated,
    tacticName,
    tacticStatus,
    tacticPublishUnit,
    tacticPublishUser,
    tacticPublishUnitCH,
    basicTacticInfoReason,
    basicTacticInfoRemark,
    tacticTimeInfo: {
      startTime,
      endTime = "",
      publishTime,
      createTime,
      startCalculateTime = "",
      updateTime = ""
    },
    basicFlowcontrol = {},
    directionList = [],
    schemeRelative = "",
    tacticMode = "",
    tempSyncSign = "0",
    tacticSource = ""
  } = item;

  // 是否为数据生成日期内的数据
  let isSameDay = useMemo(() => {
    let same = true;
    // 数据生成日期
    let generateDate = "";
    if (
      (isValidVariable(generateTime) && generateTime.length == 12) ||
      generateTime.length > 12
    ) {
      generateDate = generateTime.substring(0, 8);
    }

    if (isValidVariable(generateDate)) {
      if (isValidVariable(startTime) && isValidVariable(endTime)) {
        let startDate = startTime.substring(0, 8);
        let endDate = endTime.substring(0, 8);
        same = startDate === generateDate && endDate === generateDate;
      } else if (isValidVariable(startTime)) {
        let startDate = startTime.substring(0, 8);
        same = startDate === generateDate;
      }
    }
    return same;
  });

  let dayCount = useCallback(() => {
    if (isValidVariable(startTime) && isValidVariable(endTime)) {
      // let startTmp = parseFullTime(startTime.substring(0,8)+"0000");
      // let endTmp = parseFullTime(endTime.substring(0,8)+"0000");
      let diff = calculateStringTimeDiff(
        startTime.substring(0, 8) + "0000",
        endTime.substring(0, 8) + "0000"
      );
      diff = Math.abs(diff);
      let count = Math.floor(diff / (60 * 60 * 24 * 1000));
      if (count > 0) {
        return "+" + count;
      } else {
        return 0;
      }
    }
  }, [startTime, endTime]);

  let isActive = useMemo(() => {
    return schemeListData.activeSchemeId === item.id;
  }, [schemeListData.activeSchemeId, item.id]);

  // NTFM流控
  let isNTFM = tacticSource.includes("NTFM-ORIGINAL");

  const classNameStr = useMemo(() => {
    let className = "item_container layout-column";

    if (isActive) {
      className += " item_active";
    }
    if (isNTFM) {
      className += " NTFM-item";
    }
    return className;
  }, [isActive, isNTFM]);

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
    restrictionMITValueUnit = ""
  } = flowControlMeasure;
  //限制值
  let interVal = "";
  if (restrictionMode === "MIT") {
    interVal = restrictionMITValue;
  } else if (restrictionMode === "AFP") {
    interVal = restrictionAFPValueSequence;
  } else if (restrictionMode === "TC") {
    const restrictionTCPeriodDuration =
      flowControlMeasure.restrictionTCPeriodDuration || "";
    const restrictionTCPeriodValue =
      flowControlMeasure.restrictionTCPeriodValue || "";
    interVal =
      restrictionTCPeriodDuration +
      "/" +
      restrictionTCPeriodValue +
      "/" +
      restrictionMITValue +
      restrictionMITValueUnit;
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
  // 基准点字符串
  let targetUnitsString = targetUnits;

  // 开始时间格式化
  let startTimeFormat = getDayTimeFromString(startTime, "", 2);
  // 结束时间格式化
  let endTimeFormat = getDayTimeFromString(endTime, "", 2);
  // 若schemeRelative值为"100",相对时间和基准点加括号显示
  if (schemeRelative === "100") {
    startTimeFormat = startTimeFormat ? `(${startTimeFormat})` : "";
    endTimeFormat = endTimeFormat ? `(${endTimeFormat})` : "";
    // 增加相对标记
    targetUnitsString = targetUnits ? `(${targetUnits})` : "";
  } else if (schemeRelative === "200") {
    // 若schemeRelative值为"200",相对时间加括号显示
    startTimeFormat = startTimeFormat ? `(${startTimeFormat})` : "";
    endTimeFormat = endTimeFormat ? `(${endTimeFormat})` : "";
  }

  const restrictionModeOptions = [
    { key: "AFP", text: "AFP", title: "AFP" },
    { key: "MIT", text: "MIT", title: "MIT" },
    { key: "CR", text: "CR", title: "改航" },
    { key: "GS", text: "GS", title: "GS" },
    { key: "TC", text: "TC", title: "总量控制" }
    // {"key":"GDP", "text": "GDP"},
    // {"key":"AS", "text": "指定时隙"},
    // {"key":"BREQ", "text": "上客申请"},
    // {"key":"REQ", "text": "开车申请"},
    // {"key":"TC", "text": "总量控制"},
    // {"key":"AH", "text": "空中等待"},
    // {"key":"AA", "text": "空域开闭限制"},
  ];

  const restrictionModeZh = (mode) => {
    let modeData = restrictionModeOptions.filter((item) => item.key === mode);
    let modeZh = "";
    if (modeData.length > 0) {
      modeZh = modeData[0].title;
    }
    if (!isValidVariable(modeZh)) {
      modeZh = mode;
    }
    return modeZh;
  };

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
          height: 0
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
            }
          });
          props.schemeListData.toggleActiveSchemeCalculatingModalVisible(true);
        }
        return;
      } else {
        if (activeSchemeCalculatingModalVisible) {
          props.schemeListData.toggleActiveSchemeCalculatingModalVisible(false);
        }
      }
      // alert("激活的id是:"+id);
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
        resizable: true
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

  return (
    <div className={classNameStr} onClick={onChange}>
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
              {tempSyncSign === "100" && (
                <span className="" title="同步">
                  <Tag color="#26a69a">同</Tag>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="right-column border-bottom layout-row">
          <div className="layout-column column-box">
            <div className="border-bottom">
              <div className="cell" title={`发布单位: ${tacticPublishUnitCH}`}>
                {tacticPublishUnitCH}
              </div>
            </div>

            <div className="">
              <div
                className="cell"
                title={`限制方式: ${restrictionModeZh(restrictionMode)}`}
              >
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
                <span>{startTimeFormat}</span>
                <span style={{ padding: "0px 3px" }}>-</span>
                <Badge className="day_count_badge" count={dayCount()}>
                  <span>{endTimeFormat}</span>
                </Badge>

                {/* {isSameDay ? (
                  `${startTimeFormat} - ${endTimeFormat}`
                ) : (
                  <Tag className="time-range-tag" color="#FA8C15">
                    {startTimeFormat} - {endTimeFormat}
                  </Tag>
                )} */}
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
                  title={`基准单元: ${targetUnitsString}`}
                >
                  {targetUnitsString}
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
            updateTime={updateTime}
            tacticStatus={tacticStatus}
            basicTacticInfoReasonZh={basicTacticInfoReasonZh}
            basicTacticInfoRemark={basicTacticInfoRemark}
          />
        </div>
        <div className="right-column2">
          <div className="options-box layout-row">
            <div
              className="opt item-icon detail-icon"
              onClick={(e) => {
                showDetail(e);
                e.stopPropagation();
              }}
              title="方案详情"
            >
              {/* 详情 */}
            </div>

            {/* {systemPage.userHasAuth(11301) &&
              ["TERMINATED_MANUAL", "TERMINATED_AUTO", "FINISHED"].includes(
                tacticStatus
              ) && (
                <div className="opt" onClick={showRecreate}>
                  重新发布
                </div>
              )} */}
            {systemPage.userHasAuth(11401) && !isNTFM && (
              <div
                className="opt item-icon work-icon"
                onClick={(e) => {
                  showWorkFlowDetail(id);
                  e.stopPropagation();
                }}
                title="工作流"
              >
                {/* 工作流 */}
              </div>
            )}
            {systemPage.userHasAuth(11502) && !isNTFM && (
              <div
                className="opt item-icon base-icon"
                onClick={(e) => {
                  openBaseSchemeFrame(id);
                  e.stopPropagation();
                }}
                title="决策依据"
              >
                {/* 决策依据 */}
                {/* <DownOutlined /> */}
              </div>
            )}
            {systemPage.userHasAuth(11502) && !isNTFM && (
              <div
                className="opt item-icon execute-icon"
                onClick={(e) => {
                  // 执行情况菜单按钮点击事件
                  // 调用客户端方法,参数为当前方案id
                  openRunningControlFlow(id);
                  e.stopPropagation();
                }}
                title="执行情况"
              >
                {/* 执行情况 */}
                {/* <DownOutlined /> */}
              </div>
            )}
            {systemPage.userHasAuth(11505) && !isNTFM && (
              <div
                className="opt item-icon relation-icon"
                onClick={(e) => {
                  openFilterFrame(id, tacticName, targetUnits, interVal);
                  e.stopPropagation();
                }}
                title="航图关联"
              >
                {/* 航图关联 */}
              </div>
            )}
            {systemPage.userHasAuth(11301) &&
              tacticPublishUser === username &&
              !isNTFM &&
              ["FUTURE", "RUNNING"].includes(tacticStatus) && (
                <div
                  className="opt item-icon edit-icon"
                  onClick={showModify}
                  title="方案调整"
                >
                  {/* 调整 */}
                </div>
              )}
            {systemPage.userHasAuth(11201) &&
              tacticPublishUser === username &&
              !isNTFM &&
              ["FUTURE", "RUNNING"].includes(tacticStatus) && (
                <div
                  className="opt item-icon terminate-icon"
                  onClick={(e) => {
                    // 重新获取方案列表数据以刷新方案列表
                    stopControl(id);
                    e.stopPropagation();
                  }}
                  title="终止"
                >
                  {/* 终止 */}
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
      {isNTFM && <div className="ntfm-flag" title="NTFM"></div>}
    </div>
  );
}

export default inject(
  "systemPage",
  "schemeListData",
  "collaboratePopoverData"
)(observer(SchemeItem));
