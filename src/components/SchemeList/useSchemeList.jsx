import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
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
  flightTableData,
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
  flightTableData,
}) {
  // 勾选中状态的选项值
  const statusValuesString = schemeListData.statusValues.join(',');
  // 勾选中的NTFM选项值
  const NTFMShowTypeString = schemeListData.NTFMShowType.join(',');

  const curStatusValues = useRef();
  // 定时器
  let timer = 0;
  // 开启下一次定时
  const timerFunc = useCallback(function () {
    timer = setTimeout(() => {
      getSchemeList();
    }, 30 * 1000);
  }, []);

  //获取--方案列表
  const getSchemeList = useCallback(
    async () => {
      // 清除定时
      clearTimeout(timer);
      try {
        let params = {
          status: curStatusValues.current.join(","),
          startTime: "",
          endTime: "",
          userId: systemPage.user.id || "",
          filterArrap: "",
          filterRegion: "",
          filterDepap: "",
          system: "",
          region: "",
          ntfmShowType: schemeListData.NTFMShowType.join(",")
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
          params,
        });
        //更新方案数据
        updateSchemeListData(data);
        if (schemeListData.loading) {
          schemeListData.toggleLoad(false);
        }
        timerFunc();
      } catch (e) {
        customNotice({
          type: "error",
          content: "方案列表数据获取失败",
        });
        // 清空各模块store数据
        clearStoreData({
          schemeListData,
          executeKPIData,
          performanceKPIData,
          flightTableData,
        });
        if (schemeListData.loading) {
          schemeListData.toggleLoad(false);
        }
        timerFunc();
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
    //更新 方案列表 store
    schemeListData.updateList(list, generateTime);
    systemPage.setBaseDate(generateTime);
  }, []);

  useEffect(() => {
    if (isValidVariable(systemPage.user.id)) {
      // 复制一份勾选的状态选项值
      let newStatusValues = [...schemeListData.statusValues];
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
      getSchemeList();
    } else {
      clearTimeout(timer);
    }
  }, [systemPage.user.id, statusValuesString, NTFMShowTypeString]);

  // 监听全局刷新
  useEffect(
    function () {
      if (systemPage.pageRefresh && isValidVariable(systemPage.user.id)) {
        // 复制一份勾选的状态选项值
        let newStatusValues = [...schemeListData.statusValues];
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
        getSchemeList();
      }
    },
    [systemPage.pageRefresh]
  );

  useEffect(() => {
    if (schemeListData.forceUpdate) {
      // 复制一份勾选的状态选项值
      let newStatusValues = [...schemeListData.statusValues];
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
      getSchemeList();
      schemeListData.setForceUpdate(false);
    }
  }, [schemeListData.forceUpdate]);

  useEffect(() => {
    return () => {
      clearTimeout(timer);
      schemeListData.updateList([], "");
      schemeListData.toggleSchemeActive("");
    };
  }, []);

  return getSchemeList;
}

export default useSchemeList;
