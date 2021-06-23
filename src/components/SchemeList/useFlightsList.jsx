import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import { requestGet } from "utils/request";
import { isValidVariable, isValidObject } from "utils/basic-verify";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
//航班请求 hook
function useFlightsList({
  schemeListData,
  performanceKPIData,
  systemPage,
  flightTableData,
}) {
  let [flightsTimeoutId, setFlightsTimeoutId] = useState(0);

  //更新--航班列表 store数据
  const updateFlightTableData = useCallback(
    (flightData = {}) => {
      if (document.getElementsByClassName("collaborate_popover").length > 0) {
        // console.log("有协调窗口打开中，跳过此次航班更新");
        return;
      }

      let { flights, generateTime, performKpiResult } = flightData;
      if (flights !== null) {
        flightTableData.updateFlightsList(
          flights,
          generateTime,
          schemeListData.activeSchemeId
        );
        sessionStorage.setItem(
          "flightTableGenerateTime",
          generateTime,
          schemeListData.activeSchemeId
        );
      } else {
        flightTableData.updateFlightsList([], generateTime);
      }
      // 若KPI数据有效则更新KPI数据-特殊航班模块
      if (isValidObject(performKpiResult)) {
        performanceKPIData.updatePerformanceKPIData(performKpiResult);
      } else {
        // 反之清除KPI数据
        performanceKPIData.updatePerformanceKPIData({});
      }
      // flightTableData.lastSchemeId = schemeListData.activeSchemeId;
    },
    [schemeListData.activeSchemeId]
  );

  //获取--航班列表数据
  const getFlightTableData = useCallback(
    (nextRefresh, showLoad = false) => {
      const p = new Promise((resolve, reject) => {
        console.log("获取航班数据");
        let url = "";
        let params = {};
        let activeSchemeId = schemeListData.activeSchemeId || "";
        // if (
        //   !isValidVariable(activeSchemeId)
        // ) {
        //   flightTableData.updateFlightsList([], "", "");
        //   return;
        // }

        // console.log("本次方案id:", activeSchemeId)
        url = ReqUrls.flightsDataNoIdUrl + systemPage.user.id;
        let baseTime = "";
        if (schemeListData.generateTime !== "") {
          baseTime = schemeListData.generateTime.substring(0, 8);
        }
        let dateRangeData = systemPage.dateRangeData || [];
        if (dateRangeData.length === 0 || schemeListData.generateTime === "") {
          const date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          year = "" + year;
          month = month < 10 ? "0" + month : "" + month;
          day = day < 10 ? "0" + day : "" + day;
          baseTime = year + "" + month + "" + day;
        }
        let reqId = "";
        let filterArrap = "";
        let filterRegion = "";
        let region = "";
        let filterDepap = "";
        let system = "";
        const activeSystem = systemPage.activeSystem || {};
        filterArrap = activeSystem.filterArrap || "";
        filterRegion = activeSystem.filterRegion || "";
        region = activeSystem.region || "";
        filterDepap = activeSystem.filterDepap || "";
        system = activeSystem.system || "";
        // console.log(
        //   "activeSchemeId",
        //   activeSchemeId,
        //   "leftNavSelectedName",
        //   systemPage.leftNavSelectedName
        // );
        if (activeSchemeId === "" && systemPage.leftNavSelectedName === "all") {
        } else {
          reqId = activeSchemeId;
        }
        params = {
          startTime:
            dateRangeData.length > 0 ? dateRangeData[0] : baseTime + "0000",
          endTime:
            dateRangeData.length > 0 ? dateRangeData[1] : baseTime + "2359",
          id: reqId, //方案id
          filterArrap,
          filterRegion,
          filterDepap,
          system,
          region,
        };
        const timerFunc = function () {
          //开启定时
          if (nextRefresh) {
            if (isValidVariable(flightsTimeoutId)) {
              clearTimeout(flightsTimeoutId);
            }
            let timer = setTimeout(() => {
              if (!flightTableData.dataLoaded) {
                getFlightTableData(true);
              }
            }, 60 * 1000);
            setFlightsTimeoutId(timer);
          }
        };
        //开始获取数据，修改状态
        const opt = {
          url,
          method: "GET",
          params,
          resFunc: (data) => {
            console.time("tableTime");
            updateFlightTableData(data);
            timerFunc();
            // if (flightTableData.loading) {
            //   customNotice({
            //     type: "success",
            //     message: "航班列表数据获取成功",
            //     duration: 5,
            //   });
            // }
            flightTableData.toggleLoad(false, false);
            performanceKPIData.toggleLoad(false, false);
            console.timeEnd("tableTime");
            resolve("success");
          },
          errFunc: (err) => {
            // 清空航班表格数据
            flightTableData.updateFlightsList([], "");
            // 清除KPI数据
            performanceKPIData.updatePerformanceKPIData({});
            requestErr(err, "航班列表数据获取失败");
            //开启定时
            timerFunc();
            flightTableData.toggleLoad(false, false);
            performanceKPIData.toggleLoad(false, false);

            resolve("error");
          },
        };

        if (!flightTableData.dataLoaded) {
          requestGet(opt);
          flightTableData.toggleLoad(showLoad, true);
          performanceKPIData.toggleLoad(showLoad, true);
        }
      });
    },
    [systemPage.dateRangeData]
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
        performanceKPIData.toggleLoad(true, true);
        getFlightTableData(false);
      }
    },
    [systemPage.pageRefresh, systemPage.user]
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
