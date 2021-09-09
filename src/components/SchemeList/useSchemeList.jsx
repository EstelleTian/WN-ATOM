import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef
} from "react";
import { requestGet2 } from "utils/request";
import { isValidVariable, isValidObject } from "utils/basic-verify";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";

// 清空各模块store数据
function clearStoreData({
  schemeListData,
  executeKPIData,
  performanceKPIData,
  flightTableData
}) {
  //清空方案列表 store 数据
  schemeListData.updateList([], "");
  // 清空KPI数据
  executeKPIData.updateExecuteKPIData({}, "");
  // 清空KPI数据
  performanceKPIData.updatePerformanceKPIData({});
  //  清空航班表格数据
  flightTableData.updateFlightsList([], "");
}
//方案请求 hook
function useSchemeList({
  systemPage,
  schemeListData,
  executeKPIData,
  performanceKPIData,
  flightTableData
}) {
  const curStatusValues = useRef();
  // 定时器
  let timer = 0;
  let [schemeTimeoutId, setSchemeTimeoutId] = useState(0);
  // 开启定时
  const timerFunc = useCallback(function (nextRefresh) {
    //开启定时
    if (nextRefresh) {
      if (isValidVariable(schemeTimeoutId)) {
        clearTimeout(schemeTimeoutId);
      }
      let timer = setTimeout(() => {
        if (!flightTableData.dataLoaded) {
          getSchemeList(nextRefresh);
        }
      }, 30 * 1000);
      setSchemeTimeoutId(timer);
    }
  }, []);

  //获取--方案列表 @nextRefresh 是否开启下一轮定时
  const getSchemeList = useCallback(
    async (nextRefresh = false) => {
      try {
        let params = {
          status: "",
          startTime: "",
          endTime: "",
          userId: systemPage.user.id || "",
          filterArrap: "",
          filterRegion: "",
          filterDepap: "",
          system: "",
          region: "",
          ntfmShowType: "",
          direction: "ALL"
        };
        const activeSystem = systemPage.activeSystem || {};
        params["filterArrap"] = activeSystem.filterArrap || "";
        params["filterRegion"] = activeSystem.filterRegion || "";
        params["region"] = activeSystem.region || "";
        params["filterDepap"] = activeSystem.filterDepap || "";
        params["system"] = activeSystem.system || "";

        let dateRangeData = systemPage.dateRangeData || [];
        if (dateRangeData.length >= 2) {
          params["startTime"] = dateRangeData[0] || "";
          params["endTime"] = dateRangeData[1] || "";
        }

        const data = await requestGet2({
          url: ReqUrls.schemeListUrl,
          params
        });
        //更新方案数据
        updateSchemeListData(data);
        if (schemeListData.loading) {
          schemeListData.toggleLoad(false);
        }
        timerFunc(nextRefresh);
      } catch (e) {
        customNotice({
          type: "error",
          content: "方案列表数据获取失败"
        });
        // 清空各模块store数据
        clearStoreData({
          schemeListData,
          executeKPIData,
          performanceKPIData,
          flightTableData
        });
        if (schemeListData.loading) {
          schemeListData.toggleLoad(false);
        }
        timerFunc(nextRefresh);
      }
    },
    [systemPage.user.id, systemPage.dateRangeData]
  );

  //提交成功--处理 更新--方案列表 store数据
  const updateSchemeListData = useCallback((data) => {
    let { tacticProcessInfos, generateTime = "" } = data;
    if (tacticProcessInfos === null) {
      tacticProcessInfos = [];
    }
    const list = tacticProcessInfos.map((item) => {
      const { basicTacticInfo } = item;
      return basicTacticInfo;
    });
    // const list = [tacticProcessInfos[0].basicTacticInfo];
    //更新 方案列表 store
    schemeListData.updateList(list, generateTime);
    systemPage.setBaseDate(generateTime);
  }, []);

  useEffect(() => {
    if (
      isValidVariable(systemPage.user.id) &&
      isValidVariable(systemPage.activeSystem.system)
    ) {
      // 复制一份
      let newStatusValues = [...schemeListData.statusValues];
      //获取方案列表--开启下一轮更新
      let index = newStatusValues.indexOf("TERMINATED");
      if (index > -1) {
        // 将"TERMINATED"替换为 "FINISHED","TERMINATED_MANUAL","TERMINATED_AUTO"
        newStatusValues.splice(
          index,
          1,
          "FINISHED",
          "TERMINATED_MANUAL",
          "TERMINATED_AUTO"
        );
      }
      curStatusValues.current = newStatusValues;
      schemeListData.toggleLoad(true);
      getSchemeList(true);
    } else {
      //没有user id 清定时器
      if (isValidVariable(schemeTimeoutId)) {
        clearTimeout(schemeTimeoutId);
      }
    }
  }, [systemPage.user.id, systemPage.activeSystem.system]);

  //监听全局刷新
  useEffect(
    function () {
      if (
        systemPage.pageRefresh &&
        isValidVariable(systemPage.user.id) &&
        isValidVariable(systemPage.activeSystem.system)
      ) {
        // console.log("方案刷新开启");
        schemeListData.toggleLoad(true);
        getSchemeList(false);
      }
    },
    [systemPage.pageRefresh, systemPage.user, systemPage.activeSystem.system]
  );

  useEffect(() => {
    if (schemeListData.forceUpdate) {
      // console.log("方案列表强制更新");
      getSchemeList(false);
      schemeListData.setForceUpdate(false);
    }
  }, [schemeListData.forceUpdate]);

  useEffect(() => {
    return () => {
      if (isValidVariable(schemeTimeoutId)) {
        clearTimeout(schemeTimeoutId);
      }
      schemeListData.updateList([], "");
      schemeListData.toggleSchemeActive("");
    };
  }, []);

  return getSchemeList;
}

export default useSchemeList;
