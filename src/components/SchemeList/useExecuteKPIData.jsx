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
//KPI数据请求 hook- 执行KPI模块下->影响航班/影响程度/正常率卡片
function useExecuteKPIData({ schemeListData, executeKPIData, systemPage }) {
  let [executeKPITimeoutId, setExecuteKPITimeoutId] = useState(0);

  //更新--执行KPI store数据
  const updateKPIData = useCallback((data) => {
    const { generateTime = "", tacticProcessInfo = {} } = data;
    if (
      isValidObject(data) &&
      isValidObject(data.tacticProcessInfo) &&
      isValidObject(data.tacticProcessInfo.kpi)
    ) {
      executeKPIData.updateExecuteKPIData(
        data.tacticProcessInfo.kpi,
        generateTime
      );
    } else {
      executeKPIData.updateExecuteKPIData({}, generateTime);
      customNotice({
        type: "error",
        content: "获取的KPI数据为空",
      });
    }
  }, []);
  //获取--执行KPI数据
  const getKPIData = useCallback((nextRefresh) => {
    const p = new Promise((resolve, reject) => {
      let activeSchemeId = schemeListData.activeSchemeId;
      if (activeSchemeId.indexOf("focus") > -1) {
        activeSchemeId = activeSchemeId.replace(/focus-/g, "");
      }
      const opt = {
        url: ReqUrls.executeKPIDataUrl + activeSchemeId,
        method: "GET",
        params: {},
        resFunc: (data) => {
          updateKPIData(data);
          executeKPIData.toggleLoad(false);
          //开启定时
          if (nextRefresh) {
            if (isValidVariable(executeKPITimeoutId)) {
              clearTimeout(executeKPITimeoutId);
            }
            let timer = setTimeout(() => {
              getKPIData(true);
            }, 60 * 1000);
            setExecuteKPITimeoutId(timer);
          }
          resolve("success");
        },
        errFunc: (err) => {
          requestErr(err, "KPI数据获取失败");
          // 置空KPIstore数据
          executeKPIData.updateExecuteKPIData({}, "");
          if (executeKPIData.loading) {
            executeKPIData.toggleLoad(false);
          }
          //开启定时
          if (nextRefresh) {
            if (isValidVariable(executeKPITimeoutId)) {
              clearTimeout(executeKPITimeoutId);
            }
            let timer = setTimeout(() => {
              getKPIData(true);
            }, 60 * 1000);
            setExecuteKPITimeoutId(timer);
          }
          resolve("error");
        },
      };
      requestGet(opt);
    });
  }, []);

  useEffect(() => {
    clearTimeout(executeKPITimeoutId);
    if (isValidVariable(schemeListData.activeSchemeId)) {
      executeKPIData.toggleLoad(true);
      getKPIData(true);
    }
  }, [schemeListData.activeSchemeId]);

  //监听全局刷新
  useEffect(
    function () {
      if (systemPage.pageRefresh && isValidVariable(systemPage.user.id)) {
        // console.log("全局刷新开启")
        executeKPIData.toggleLoad(true);
        getKPIData(false);
      }
    },
    [systemPage.pageRefresh, systemPage.user]
  );

  useEffect(() => {
    return () => {
      if (isValidVariable(executeKPITimeoutId)) {
        clearTimeout(executeKPITimeoutId);
      }
      executeKPIData.updateExecuteKPIData({});
    };
  }, []);
}

export default useExecuteKPIData;
