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
//航班请求 hook
function useFlightsList({
  schemeListData,
  performanceKPIData,
  systemPage,
  flightTableData
}) {
  let [flightsTimeoutId, setFlightsTimeoutId] = useState(0);

  //更新--航班列表 store数据
  const updateFlightTableData = useCallback(
    (flightData = {}) => {
      if (document.getElementsByClassName("collaborate_popover").length > 0) {
        // console.log("有协调窗口打开中，跳过此次航班更新");
        return;
      }
      let { flights, generateTime, performKpiResult = {} } = flightData;
      if (flights !== null) {
        flightTableData.updateFlightsList(
          flights,
          generateTime,
          schemeListData.activeSchemeId
        );
        //注释 表格不要渲染测试时候用此方法
        // flightTableData.updateFlightsList([], generateTime);
        sessionStorage.setItem(
          "flightTableGenerateTime",
          generateTime,
          schemeListData.activeSchemeId
        );
      } else {
        flightTableData.updateFlightsList([], generateTime);
      }
      // 若KPI数据有效则更新KPI数据-特殊航班模块
      if (systemPage.systemKind.indexOf("CRS") > -1) {
        if (isValidObject(performKpiResult)) {
          performanceKPIData.updatePerformanceKPIData(performKpiResult);
        } else {
          // 反之清除KPI数据
          performanceKPIData.updatePerformanceKPIData({});
        }
      }
      // flightTableData.lastSchemeId = schemeListData.activeSchemeId;
    },
    [schemeListData.activeSchemeId]
  );

  const timerFunc = useCallback(function (nextRefresh) {
    //开启定时
    if (nextRefresh) {
      if (isValidVariable(flightsTimeoutId)) {
        clearTimeout(flightsTimeoutId);
      }
      let timer = setTimeout(() => {
        if (!flightTableData.dataLoaded) {
          getFlightTableData(nextRefresh);
        }
      }, 60 * 1000);
      setFlightsTimeoutId(timer);
    }
  }, []);
  //获取--航班列表数据
  const getFlightTableData = useCallback(
    async (nextRefresh, showLoad = false) => {
      try {
        if (flightTableData.dataLoaded) {
          console.log("航班处于数据获取中，跳过获取，开启下一轮定时");
          //开启定时
          timerFunc(nextRefresh);
          return;
        }
        const userId = systemPage.user.id || "";
        let url = ReqUrls.flightsDataNoIdUrl + userId;
        let params = {
          startTime: "",
          endTime: "",
          id: "",
          filterArrap: "",
          filterRegion: "",
          filterDepap: "",
          system: "",
          region: ""
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

        let activeSchemeId = schemeListData.activeSchemeId || "";
        if (activeSchemeId !== "") {
          params["id"] = activeSchemeId;
        }
        flightTableData.toggleLoad(showLoad, true);
        if (systemPage.systemKind.indexOf("CRS") > -1) {
          performanceKPIData.toggleLoad(showLoad, true);
        }
        if (flightTableData.getState) {
        }
        const data = await requestGet2({
          url,
          params
        });
        console.time("tableTime");
        updateFlightTableData(data);
        flightTableData.toggleLoad(false, false);
        if (systemPage.systemKind.indexOf("CRS") > -1) {
          performanceKPIData.toggleLoad(false, false);
        }
        timerFunc(nextRefresh);
        console.timeEnd("tableTime");
      } catch (e) {
        customNotice({
          type: "error",
          content: "航班列表数据获取失败"
        });
        // 清空航班表格数据
        flightTableData.updateFlightsList([], "");
        // 清除KPI数据
        if (systemPage.systemKind.indexOf("CRS") > -1) {
          performanceKPIData.updatePerformanceKPIData({});
        }
        flightTableData.toggleLoad(false, false);
        if (systemPage.systemKind.indexOf("CRS") > -1) {
          performanceKPIData.toggleLoad(false, false);
        }
        //开启定时
        timerFunc(nextRefresh);
      }
    },
    [systemPage.user.id, systemPage.dateRangeData]
  );

  useEffect(() => {
    clearTimeout(flightsTimeoutId);
    getFlightTableData(true, true);
  }, [schemeListData.activeSchemeId]);

  //监听全局刷新
  useEffect(
    function () {
      if (systemPage.pageRefresh && isValidVariable(systemPage.user.id)) {
        // console.log("全局刷新开启")
        flightTableData.toggleLoad(true, true);
        if (systemPage.systemKind.indexOf("CRS") > -1) {
          performanceKPIData.toggleLoad(true, true);
        }
        getFlightTableData(false);
      }
    },
    [systemPage.pageRefresh, systemPage.user.id]
  );

  useEffect(() => {
    if (flightTableData.forceUpdate) {
      // console.log("航班数据强制更新");
      getFlightTableData(false);
      flightTableData.setForceUpdate(false);
    }
  }, [flightTableData.forceUpdate]);

  useEffect(() => {
    return () => {
      if (isValidVariable(flightsTimeoutId.current)) {
        flightsTimeoutId.current.map((t) => {
          clearTimeout(t);
        });
        flightsTimeoutId.current = [];
      }
      flightTableData.updateFlightsList([], "");
    };
  }, []);
}

export default useFlightsList;
