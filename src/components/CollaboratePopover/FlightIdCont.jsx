/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-08-18 18:09:33
 * @LastEditors: Please set LastEditors
 * @Description: 航班号右键协调框
 * @FilePath:
 */

import React, { useCallback, useState, useEffect, memo, useMemo } from "react";
import { observer, inject } from "mobx-react";
import {
  message as antdMessage,
  message,
  Popover,
  Button,
  Tooltip,
  Popconfirm,
} from "antd";
import { ReqUrls } from "utils/request-urls";
import { requestGet2 } from "utils/request";
import { isValidVariable } from "utils/basic-verify";
import { FlightCoordination, PriorityList } from "utils/flightcoordination.js";
import { request, request2 } from "utils/request";
import { CollaborateUrl } from "utils/request-urls";
import { cgreen, cred } from "utils/collaborateUtils.js";
import FmeToday from "utils/fmetoday";
import { customNotice } from "utils/common-funcs";
import PopconfirmFlightIdBtn from "./PopconfirmFlightIdBtn";

//协调窗口
const FlightIdCont = (props) => {
  const [slotLoad, setSlotLoad] = useState(false);
  const [intervalLoad, setIntervalLoad] = useState(false);
  const [exemptLoad, setExemptLoad] = useState(false);
  const [singleExemptLoad, setSingleExemptLoad] = useState(false);
  const [poolLoad, setPoolLoad] = useState(false);
  const [qualifications, setQualifications] = useState(false);
  const {
    clearCollaboratePopoverData,
    flightDetailData,
    formerFlightUpdateFormData,
    collaboratePopoverData,
    systemPage,
    schemeListData,
    flightTableData,
    flightExchangeSlotFormData,
  } = props;
  const record = collaboratePopoverData.data || {};
  const orgdata = record.orgdata || "{}";
  let flight = JSON.parse(orgdata) || {};
  let { priority } = flight;
  const fmeToday = flight.fmeToday || {};
  let alarms = flight.alarms || [];
  alarms = alarms.join("-");
  let hasAuth = true;
  //航班状态验证 2021-4-2注释，后台接口校验，前台校验去掉
  let hadDEP = FmeToday.hadDEP(fmeToday); //航班已起飞
  let hadARR = FmeToday.hadARR(fmeToday); //航班已落地
  let hadFPL = FmeToday.hadFPL(fmeToday); //航班已发FPL报
  let isInAreaFlight = FmeToday.isInAreaFlight(flight); //航班在本区域内
  let isInPoolFlight = FlightCoordination.isInPoolFlight(flight); //航班是否在等待池中

  // 显示航班详情
  const showFlightDetail = async () => {
    //关闭协调窗口popover
    clearCollaboratePopoverData();
    const flightId = flight.id || "";
    // 先清空store数据
    flightDetailData.updateFlightDetailData({});
    if (isValidVariable(flightId)) {
      flightDetailData.toggleModalVisible(true);
      try {
        const res = await requestGet2({
          url: ReqUrls.getFlightDetailUrl + flightId,
        });
        //航班详情赋值
        flightDetailData.toggleFlightId(flightId);
        flightDetailData.updateFlightDetailData(res);
      } catch (e) {
        let message = `获取航班${flight.flightid}详情数据失败`;
        if (isValidVariable(e)) {
          message = message + ":" + e;
        }
        customNotice({
          type: "error",
          message: message,
        });
      }
    }
  };
  // 显示指定前序航班模态框
  const showFormerFlightUpdateModal = useCallback(() => {
    //关闭协调窗口popover
    clearCollaboratePopoverData();
    formerFlightUpdateFormData.updateFlightData(flight);
    formerFlightUpdateFormData.toggleModalVisible(true);
  }, []);
  // 验证航班是否可以进行时隙交换
  const judgeFlight = useCallback(async (record) => {
    // collaboratePopoverData.setTipsObj({
    //   ...collaboratePopoverData.selectedObj,
    //   id: flight.id || "",
    //   title: "2222222222222222",
    // });
    setSlotLoad(true);
    try {
      const flightId = flight.id || "";
      const res = await requestGet2({
        url: ReqUrls.judgeAbilityFlightUrl + flightId,
      });
      // console.log(res);
      setSlotLoad(false);
      showFlightExchangeSlotModal(record);
    } catch (e) {
      collaboratePopoverData.setTipsObj({
        ...collaboratePopoverData.selectedObj,
        type: "warn",
        id: flight.id || "",
        title: e,
      });
      setSlotLoad(false);
      //关闭协调窗口popover
      clearCollaboratePopoverData();
    }
  }, []);
  // 显示航班时隙交换模态框
  const showFlightExchangeSlotModal = useCallback(() => {
    flightExchangeSlotFormData.updateClaimantFlightData(flight);
    const flightId = flight.id || "";
    flightExchangeSlotFormData.updateClaimantFlightCoordinationData(flight);
    flightExchangeSlotFormData.toggleModalVisible(true);
    //关闭协调窗口popover
    clearCollaboratePopoverData();
  }, []);
  //数据提交失败回调
  const requestErr = (err, content) => {
    collaboratePopoverData.setTipsObj({
      ...collaboratePopoverData.selectedObj,
      id: flight.id || "",
      type: "fail",
      title: content,
    });
    setExemptLoad(false);
    setSingleExemptLoad(false);
    setIntervalLoad(false);
    setPoolLoad(false);
    setQualifications(false);
    //关闭协调窗口popover
    clearCollaboratePopoverData();
  };

  //数据提交成功回调
  const requestSuccess = (data, title) => {
    setExemptLoad(false);
    setSingleExemptLoad(false);
    setIntervalLoad(false);
    setPoolLoad(false);
    setQualifications(false);
    const { flightCoordination } = data;
    //更新单条航班数据
    flightTableData.updateSingleFlight(flightCoordination);
    collaboratePopoverData.setTipsObj({
      ...collaboratePopoverData.selectedObj,
      id: flight.id || "",
      title: title + "提交成功",
    });
    //关闭协调窗口popover
    clearCollaboratePopoverData();
  };
  //异步请求发送
  const sendRequest = async (url, params, title) => {
    try {
      const res = await request2({
        url,
        method: "POST",
        params,
      });
      requestSuccess(res, flight.flightid + title);
    } catch (err) {
      if (isValidVariable(err)) {
        requestErr(err, err);
      } else {
        requestErr(err, flight.flightid + title + "请求失败");
      }
    }
  };
  //标记豁免 取消标记豁免
  const handleExempt = async (type, record, title) => {
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
      const userId = systemPage.user.id || "";
      const schemeId = schemeListData.activeSchemeId || ""; //方案id
      const tacticName = schemeListData.getNameBySchemeActiveId(schemeId); //方案名称

      const url = CollaborateUrl.baseUrl + urlKey;
      const params = {
        userId,
        flightCoordination: flight,
        comment: "",
        tacticId: schemeId,
        tacticName,
      };
      sendRequest(url, params, title);
    }
  };

  //等待池
  const handlePool = async (type, record, title) => {
    setPoolLoad(true);
    let urlKey = "";
    if (type === "direct-in-pool") {
      //申请入池
      urlKey = "/applyInpool";
      // flight.poolStatus = FlightCoordination.IN_POOL_M; //2
    } else if (type === "direct-out-pool") {
      //申请出池
      urlKey = "/applyOutpool";
      // flight.poolStatus = FlightCoordination.OUT_POOL; //0
    }

    if (isValidVariable(urlKey)) {
      // console.log(flight.flightid);
      const userId = systemPage.user.id || "";
      const schemeId = schemeListData.activeSchemeId || ""; //方案id
      const tacticName = schemeListData.getNameBySchemeActiveId(schemeId); //方案名称
      const url = CollaborateUrl.baseUrl + urlKey;
      const params = {
        userId,
        flightCoordination: flight,
        comment: "",
        taskId: "",
        tacticId: schemeId,
        tacticName,
      };
      sendRequest(url, params, title);
    }
  };

  //二类资质
  const handleQualifications = async (type, record, title) => {
    setQualifications(true);
    let urlKey = "/updateFlightQualifications";
    if (isValidVariable(urlKey)) {
      // console.log(JSON.stringify(flight));
      const userId = systemPage.user.id || "";
      const schemeId = schemeListData.activeSchemeId || ""; //方案id
      const tacticName = schemeListData.getNameBySchemeActiveId(schemeId); //方案名称
      // 二类参数
      let timeVal = "";
      if (type === "markQualifications") {
        //标记二类
        timeVal = "2";
      } else if (type === "markUnQualifications") {
        //取消标记二类
        timeVal = "";
      }
      const url = CollaborateUrl.baseUrl + urlKey;
      const params = {
        userId,
        flightCoordination: flight,
        comment: "",
        taskId: "",
        tacticId: schemeId,
        tacticName,
        timeVal,
      };
      sendRequest(url, params, title);
    }
  };

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
      {systemPage.userHasAuth(13454) && (
        <button
          className="c-btn c-btn-blue"
          onClick={() => {
            showFormerFlightUpdateModal(record);
          }}
        >
          指定前序航班
        </button>
      )}
      {!hadDEP && (
        <Button
          className="c-btn c-btn-green"
          loading={slotLoad}
          onClick={() => {
            judgeFlight(record);
          }}
        >
          时隙交换
        </Button>
      )}

      {priority === FlightCoordination.PRIORITY_NORMAL &&
        systemPage.userHasAuth(13401) && (
          <PopconfirmFlightIdBtn
            loading={exemptLoad}
            handleExempt={handleExempt}
            type="exempt"
            record={record}
            alarms={alarms}
          />
        )}
      {priority === FlightCoordination.PRIORITY_EXEMPT &&
        systemPage.userHasAuth(13404) && (
          <Button
            loading={exemptLoad}
            className="c-btn c-btn-red"
            onClick={() => {
              handleExempt("unExempt", record, "取消豁免");
            }}
          >
            取消豁免
          </Button>
        )}
      {alarms.indexOf("800") === -1 && systemPage.userHasAuth(13407) && (
        <PopconfirmFlightIdBtn
          loading={singleExemptLoad}
          handleExempt={handleExempt}
          type="singleExempt"
          record={record}
          alarms={alarms}
        />
      )}
      {alarms.indexOf("800") > -1 && systemPage.userHasAuth(13410) ? (
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
      {alarms.indexOf("400") === -1 && systemPage.userHasAuth(13413) ? (
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
      {alarms.indexOf("400") > -1 && systemPage.userHasAuth(13416) ? (
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
      {!isInPoolFlight && systemPage.userHasAuth(13419) ? (
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
      {isInPoolFlight && systemPage.userHasAuth(13422) ? (
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
};

export default inject(
  "collaboratePopoverData",
  "systemPage",
  "schemeListData",
  "systemPage",
  "flightTableData",
  "flightDetailData",
  "formerFlightUpdateFormData",
  "flightExchangeSlotFormData"
)(observer(FlightIdCont));
