/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-05-11 21:53:54
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import {
  message as antdMessage,
  message,
  Popover,
  Button,
  Tooltip,
  Popconfirm,
} from "antd";
import React, { useCallback, useState, useEffect, memo, useMemo } from "react";
import { isValidVariable } from "utils/basic-verify";
import { FlightCoordination, PriorityList } from "utils/flightcoordination.js";
import { request } from "utils/request";
import { CollaborateUrl } from "utils/request-urls";
import { closePopover, cgreen, cred } from "utils/collaborateUtils.js";
import { observer, inject } from "mobx-react";
import FmeToday from "utils/fmetoday";
import { useTip } from "./CustomUses";
import PopconfirmFlightIdBtn from "./PopconfirmFlightIdBtn";

//航班号右键协调框
let FLIGHTIDPopover = (props) => {
  const [intervalLoad, setIntervalLoad] = useState(false);
  const [exemptLoad, setExemptLoad] = useState(false);
  const [singleExemptLoad, setSingleExemptLoad] = useState(false);
  const [poolLoad, setPoolLoad] = useState(false);
  const [qualifications, setQualifications] = useState(false);
  const [tipObj, setTipObj] = useTip(2500);
  const { opt, systemPage } = props;
  const { text, record } = opt;
  //数据提交失败回调
  const requestErr = useCallback((err, content) => {
    setTipObj({
      visible: true,
      title: content,
      color: "rgba(151,59,52,0.9)",
    });
    setExemptLoad(false);
    setSingleExemptLoad(false);
    setIntervalLoad(false);
    setPoolLoad(false);
    setQualifications(false);
  });
  //数据提交成功回调
  const requestSuccess = useCallback((data, title) => {
    console.timeEnd("航班协调");
    // console.log(title + '提交成功:',data);
    // console.log( props.flightTableData.updateSingleFlight );
    setExemptLoad(false);
    setSingleExemptLoad(false);
    setIntervalLoad(false);
    setPoolLoad(false);
    setQualifications(false);

    console.time("cod");

    const { flightCoordination } = data;
    //更新单条航班数据
    props.flightTableData.updateSingleFlight(flightCoordination);
    // message.success(title + '成功');
    //关闭协调窗口popover
    closePopover();

    setTipObj({
      visible: true,
      title: title + "提交成功",
      color: cgreen,
    });
  });
  // 显示航班详情
  const showFlightDetail = (record) => {
    //关闭协调窗口popover
    closePopover();
    let orgData = record.orgdata || "{}";
    let orgFlight = JSON.parse(orgData) || {};
    console.log(orgFlight);
    props.flightDetailData.toggleFlightId(record.id);
    // props.flightDetailData.updateFlightDetailData(orgFlight);
    props.flightDetailData.toggleModalVisible(true);
  };
  // 显示指定前序航班模态框
  const showFormerFlightUpdateModal = (record) => {
    //关闭协调窗口popover
    closePopover();
    let orgData = record.orgdata || "{}";
    let orgFlight = JSON.parse(orgData) || {};
    props.formerFlightUpdateFormData.updateFlightData(orgFlight);
    props.formerFlightUpdateFormData.toggleModalVisible(true);
  };

  // 显示航班时隙交换模态框
  const showFlightExchangeSlotModal = (record) => {
    debugger
    //关闭协调窗口popover
    closePopover();
    let orgData = record.orgdata || "{}";
    let orgFlight = JSON.parse(orgData) || {};
    props.flightExchangeSlotFormData.updateClaimantFlightData(orgFlight);
    props.flightExchangeSlotFormData.toggleModalVisible(true);
  };

  //标记豁免 取消标记豁免
  const handleExempt = useCallback((type, record, title) => {
    console.log(props);
    const orgData = record.orgdata || {};
    let orgFlight = JSON.parse(orgData) || {};
    let urlKey = "";
    let taskId = "";
    if (type === "exempt") {
      //申请豁免
      urlKey = "/applyExempt";
      setExemptLoad(true);
    } else if (type === "unExempt") {
      //申请取消豁免
      urlKey = "/applyUnExempt";
      setExemptLoad(true);
    } else if (type === "singleExempt") {
      //申请单方案豁免
      urlKey = "/applySingleExempt";
      setSingleExemptLoad(true);
    } else if (type === "singleUnExempt") {
      //申请取消单方案豁免
      urlKey = "/applyUnSingleExempt";
      setSingleExemptLoad(true);
    } else if (type === "interval") {
      //申请半数间隔
      urlKey = "/applyInterval";
      setIntervalLoad(true);
    } else if (type === "unInterval") {
      //申请取消半数间隔
      urlKey = "/applyUnInterval";
      setIntervalLoad(true);
    }

    if (isValidVariable(urlKey)) {
      const userId = props.systemPage.user.id || "14";
      const fid = orgFlight.flightid;
      const schemeId = props.schemeListData.activeSchemeId || ""; //方案id
      const tacticName = props.schemeListData.getNameBySchemeActiveId(schemeId); //方案名称

      const opt = {
        url: CollaborateUrl.exemptUrl + urlKey,
        method: "POST",
        params: {
          userId,
          flightCoordination: orgFlight,
          comment: "",
          tacticId: schemeId,
          tacticName,
        },
        resFunc: (data) => requestSuccess(data, fid + title),
        errFunc: (err, msg) => {
          if (isValidVariable(err)) {
            requestErr(err, err);
          } else {
            requestErr(err, fid + title + "请求失败");
          }
        },
      };
      console.time("航班协调");
      request(opt);
    }
  });

  //等待池
  const handlePool = useCallback(
    (type, record, title) => {
      console.log(props);
      setPoolLoad(true);
      const orgdata = record.orgdata || {};
      let orgFlight = JSON.parse(orgdata) || {};
      let urlKey = "";
      if (type === "direct-in-pool") {
        //申请入池
        urlKey = "/applyInpool";
        // orgFlight.poolStatus = FlightCoordination.IN_POOL_M; //2
      } else if (type === "direct-out-pool") {
        //申请出池
        urlKey = "/applyOutpool";
        // orgFlight.poolStatus = FlightCoordination.OUT_POOL; //0
      }

      if (isValidVariable(urlKey)) {
        // console.log(JSON.stringify(orgFlight));
        const userId = props.systemPage.user.id || "14";
        const fid = orgFlight.flightid;
        const schemeId = props.schemeListData.activeSchemeId || ""; //方案id
        const tacticName = props.schemeListData.getNameBySchemeActiveId(
          schemeId
        ); //方案名称
        const opt = {
          url: CollaborateUrl.poolUrl + urlKey,
          method: "POST",
          params: {
            userId,
            flightCoordination: orgFlight,
            comment: "",
            taskId: "",
            tacticId: schemeId,
            tacticName,
          },
          resFunc: (data) => requestSuccess(data, fid + title),
          errFunc: (err, msg) => {
            if (isValidVariable(err)) {
              requestErr(err, err);
            } else {
              requestErr(err, fid + title + "请求失败");
            }
          },
        };
        request(opt);
      }
    },
    [props.systemPage.user, props.schemeListData.activeSchemeId]
  );

  //二类资质
  const handleQualifications= useCallback(
    (type, record, title) => {
      console.log(props);
      setQualifications(true);
      const orgdata = record.orgdata || {};
      let orgFlight = JSON.parse(orgdata) || {};
      let urlKey = "/updateFlightQualifications";
      if (isValidVariable(urlKey)) {
        // console.log(JSON.stringify(orgFlight));
        const userId = props.systemPage.user.id || "14";
        const fid = orgFlight.flightid;
        const schemeId = props.schemeListData.activeSchemeId || ""; //方案id
        const tacticName = props.schemeListData.getNameBySchemeActiveId(
          schemeId
        ); //方案名称
        // 二类参数
        let timeVal="";
        if (type === "markQualifications") {
          //标记二类
          timeVal="2"
        } else if (type === "markUnQualifications") {
          //取消标记二类
          timeVal=""
        }
        
        const opt = {
          url: CollaborateUrl.qualificationsUrl + urlKey,
          method: "POST",
          params: {
            userId,
            flightCoordination: orgFlight,
            comment: "",
            taskId: "",
            tacticId: schemeId,
            tacticName,
            timeVal
          },
          resFunc: (data) => requestSuccess(data, fid + title),
          errFunc: (err, msg) => {
            if (isValidVariable(err)) {
              requestErr(err, err);
            } else {
              requestErr(err, fid + title + "请求失败");
            }
          },
        };
        request(opt);
      }
    },
    [props.systemPage.user, props.schemeListData.activeSchemeId]
  );

  // const { record } = props.opt;
  let { orgdata } = record;
  if (isValidVariable(orgdata)) {
    orgdata = JSON.parse(orgdata);
  }
  let { priority } = orgdata;
  const fmeToday = orgdata.fmeToday || {};
  let alarms = orgdata.alarms || [];
  alarms = alarms.join("-");

  let hasAuth = true;
  //航班状态验证 2021-4-2注释，后台接口校验，前台校验去掉
  let hadDEP = FmeToday.hadDEP(fmeToday); //航班已起飞
  let hadARR = FmeToday.hadARR(fmeToday); //航班已落地
  let hadFPL = FmeToday.hadFPL(fmeToday); //航班已发FPL报
  let isInAreaFlight = FmeToday.isInAreaFlight(orgdata); //航班在本区域内
  let isInPoolFlight = FlightCoordination.isInPoolFlight(orgdata); //航班是否在等待池中
  let isCoordinationResponseWaitingFlight = FlightCoordination.isCoordinationResponseWaitingFlight(orgdata); //航班是否在协调响应等待中
  let getCoordinationResponseWaitingType = FlightCoordination.getCoordinationResponseWaitingType
  let hadInAir = false;
  if (hadDEP && !hadARR) {
    hadInAir = true;
  }

  // //航班未起飞 且 在本区域内--
  // if ( !hadDEP && isInAreaFlight && hadFPL ) {
  //     hasAuth = true;
  // }

  let colorClass = "";
  if (isValidVariable(priority) && priority * 1 > 0) {
    colorClass = "priority_" + priority;
  }
  if (isInPoolFlight) {
    colorClass += " in_pool " + orgdata.poolStatus;
  }
  if(isCoordinationResponseWaitingFlight){
    colorClass +=" WAIT"
  }



  // const { priority, isInPoolFlight, hasAuth, colorClass, isInAreaFlight, hadDEP, alarms  } = useMemo( ()=>{

  //     return { priority, isInPoolFlight, hasAuth, colorClass, isInAreaFlight, hadDEP, alarms };
  // }, [props.opt.record])

  const content = useMemo(() => {
    return (
      <div className="clr_flightid">
        <button
          className="c-btn c-btn-blue"
          onClick={() => {
            showFlightDetail(record);
          }}
        >
          查看航班详情
        </button>

        <button
          className="c-btn c-btn-blue"
          onClick={() => {
            showFormerFlightUpdateModal(record);
          }}
        >
          指定前序航班
        </button>
        <button
          className="c-btn c-btn-green"
          onClick={() => {
            showFlightExchangeSlotModal(record);
          }}
        >
          时隙交换
        </button>
        {priority === FlightCoordination.PRIORITY_NORMAL &&
        hasAuth &&
        systemPage.userHasAuth(13401) ? (
          <PopconfirmFlightIdBtn
            loading={exemptLoad}
            handleExempt={handleExempt}
            type="exempt"
            record={record}
            alarms={alarms}
          />
        ) : (
          ""
        )}
        {priority === FlightCoordination.PRIORITY_EXEMPT &&
        hasAuth &&
        systemPage.userHasAuth(13404) ? (
          <Button
            loading={exemptLoad}
            className="c-btn c-btn-red"
            onClick={() => {
              handleExempt("unExempt", record, "取消豁免");
            }}
          >
            取消豁免
          </Button>
        ) : (
          ""
        )}
        {alarms.indexOf("800") === -1 &&
          hasAuth &&
          systemPage.userHasAuth(13407) && (
            <PopconfirmFlightIdBtn
              loading={singleExemptLoad}
              handleExempt={handleExempt}
              type="singleExempt"
              record={record}
              alarms={alarms}
            />
          )}
        {alarms.indexOf("800") > -1 &&
        hasAuth &&
        systemPage.userHasAuth(13410) ? (
          <Button
            loading={singleExemptLoad}
            className="c-btn c-btn-red"
            onClick={() => {
              handleExempt("singleUnExempt", record, "取消单方案豁免");
            }}
          >
            取消单方案豁免
          </Button>
        ) : (
          ""
        )}
        {alarms.indexOf("400") === -1 &&
        hasAuth &&
        systemPage.userHasAuth(13413) ? (
          <PopconfirmFlightIdBtn
            loading={intervalLoad}
            handleExempt={handleExempt}
            type="interval"
            record={record}
            alarms={alarms}
          />
        ) : (
          ""
        )}
        {alarms.indexOf("400") > -1 &&
        hasAuth &&
        systemPage.userHasAuth(13416) ? (
          <Button
            loading={intervalLoad}
            className="c-btn c-btn-red"
            onClick={() => {
              handleExempt("unInterval", record, "取消半数间隔");
            }}
          >
            取消半数间隔
          </Button>
        ) : (
          ""
        )}
        {!isInPoolFlight && hasAuth && systemPage.userHasAuth(13419) ? (
          <Button
            loading={poolLoad}
            className="c-btn c-btn-green"
            onClick={() => {
              handlePool("direct-in-pool", record, "申请入池");
            }}
          >
            申请入池
          </Button>
        ) : (
          ""
        )}
        {isInPoolFlight && hasAuth && systemPage.userHasAuth(13422) ? (
          <Button
            loading={poolLoad}
            className="c-btn c-btn-red"
            onClick={() => {
              handlePool("direct-out-pool", record, "申请出池");
            }}
          >
            申请出池
          </Button>
        ) : (
          ""
        )}
        {/* <Button
            loading={qualifications}
            className="c-btn c-btn-green"
            onClick={() => {
              handleQualifications("markQualifications", record, "标记二类资质");
            }}
          >
            标记二类资质
          </Button>
          <Button
            loading={qualifications}
            className="c-btn c-btn-red"
            onClick={() => {
              handleQualifications("markUnQualifications", record, "取消标记二类资质");
            }}
          >
            取消二类资质
          </Button> */}
      </div>
    );
  }, [
    priority,
    isInPoolFlight,
    hasAuth,
    alarms,
    exemptLoad,
    poolLoad,
    intervalLoad,
    singleExemptLoad,
  ]);

  return (
    <Popover
      destroyTooltipOnHide={{ keepParent: false }}
      placement="rightTop"
      title={text}
      content={content}
      trigger={[`contextMenu`]}
    >
      <Tooltip
        title={tipObj.title}
        visible={tipObj.visible}
        color={tipObj.color}
      >
        <div className={` ${colorClass}`}>
          <div
            className={`text_cell_center ${
              isValidVariable(text) ? "" : "empty_cell"
            }`}
            title={`${text}-${PriorityList[priority]} ${
              isInAreaFlight ? "区内" : "区外"
            } ${hadInAir ? "空中" : "地面"} ${isCoordinationResponseWaitingFlight ? `${getCoordinationResponseWaitingType(orgdata)}协调中` : ""}` }
          >
            <span className={`${isInAreaFlight ? "inArea" : "outArea"}`}>
              {text}
            </span>
          </div>
          {/* <div  
                        title={`${isInAreaFlight ? "区内" : "区外"} ${hadInAir ? "空中" : "地面"}`} 
                        className={`status_flag ${isInAreaFlight ? "inArea" : "outArea"} ${hadInAir ? "inAir" : "inGround"}`}
                    ></div> */}
          <div
            title={`${hadInAir ? "空中" : "地面"}`}
            className={`status_flag ${hadInAir ? "inAir" : "inGround"}`}
          ></div>
        </div>
      </Tooltip>
    </Popover>
  );
};
export default inject(
  "flightTableData",
  "systemPage",
  "schemeListData",
  "flightDetailData",
  "formerFlightUpdateFormData",
  "flightExchangeSlotFormData",
)(observer(FLIGHTIDPopover));
