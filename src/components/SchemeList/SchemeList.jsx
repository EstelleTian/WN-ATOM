/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2021-06-04 13:22:58
 * @LastEditTime: 2021-03-04 14:40:22
 * @LastEditors: Please set LastEditors
 * @Description: 方案列表
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import debounce from "lodash/debounce";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Checkbox, Empty, Spin, notification, Modal } from "antd";
import { requestGet } from "utils/request";
import {
  isValidVariable,
  isValidObject,
  getFullTime,
  calculateStringTimeDiff,
} from "utils/basic-verify";
import { NWGlobal } from "utils/global";
import SchemeModal from "./SchemeModal";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import SchemeItem from "./SchemeItem";
import "./SchemeList.scss";

// 接收storage同源消息
window.addEventListener("storage", function (e) {
  if (e.key === "targetToFlight") {
    // console.log("storage", e);
    const newValue = e.newValue || "{}";
    let values = JSON.parse(newValue);
    const { tacticId = "", flightId = "" } = values;
    if (isValidVariable(tacticId) && isValidVariable(flightId)) {
      NWGlobal.targetToFlight(tacticId, flightId);
    }
  }
  localStorage.removeItem("targetToFlight");
});

//方案多选按钮组
const plainOptions = [
  { label: "正在执行", value: "RUNNING" },
  { label: "将要执行", value: "FUTURE" },
  { label: "正常结束", value: "FINISHED" },
  { label: "人工终止", value: "TERMINATED_MANUAL" },
  { label: "自动终止", value: "TERMINATED_AUTO" },
];

//请求错误--处理
const requestErr = (err, content) => {
  customNotice({
    type: "error",
    message: content,
  });
};

//方案请求 hook
function useSchemeList(props) {
  const {
    schemeListData: { statusValues = [] } = {},
    systemPage: {
      pageRefresh,
      user: { id = "" } = {},
      dateRangeData = [],
    } = {},
  } = props;

  const curStatusValues = useRef();
  const schemeTimeoutId = useRef("");

  //获取--方案列表 @nextRefresh 是否开启下一轮定时
  const getSchemeList = useCallback(
    (nextRefresh = false) => {
      // console.log("获取--方案列表，statusValues是:"+curStatusValues.current);
      const p = new Promise((resolve, reject) => {
        let baseTime = "";
        let dateRangeData = props.systemPage.dateRangeData || [];
        if (dateRangeData.length === 0) {
          const date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          year = "" + year;
          month = month < 10 ? "0" + month : "" + month;
          day = day < 10 ? "0" + day : "" + day;
          baseTime = year + "" + month + "" + day;
        }
        const opt = {
          url: ReqUrls.schemeListUrl,
          method: "GET",
          params: {
            status: curStatusValues.current.join(","),
            startTime:
              dateRangeData.length > 0 ? dateRangeData[0] : baseTime + "0000",
            endTime:
              dateRangeData.length > 0 ? dateRangeData[1] : baseTime + "2359",
            userId: id,
          },
          resFunc: (data) => {
            //更新方案数据
            updateSchemeListData(data);
            if (props.schemeListData.loading) {
              props.schemeListData.toggleLoad(false);
            }
            //开启定时
            if (nextRefresh) {
              if (isValidVariable(schemeTimeoutId.current)) {
                clearTimeout(schemeTimeoutId.current);
                schemeTimeoutId.current = "";
                clearTimeout(schemeTimeoutId.current);
              }
              schemeTimeoutId.current = setTimeout(() => {
                // console.log("方案列表定时器-下一轮更新开始")
                getSchemeList(true);
              }, 30 * 1000);
            }
            // notification.destroy();
            resolve("success");
          },
          errFunc: (err) => {
            requestErr(err, "方案列表数据获取失败");
            if (props.schemeListData.loading) {
              props.schemeListData.toggleLoad(false);
            }
            //开启定时
            if (nextRefresh) {
              if (isValidVariable(schemeTimeoutId.current)) {
                clearTimeout(schemeTimeoutId.current);
                schemeTimeoutId.current = "";
              }
              schemeTimeoutId.current = setTimeout(() => {
                // console.log("方案列表定时器-下一轮更新开始")
                getSchemeList(true);
              }, 30 * 1000);
            }
            reject("error");
          },
        };
        requestGet(opt);
      });

      return p;
    },
    [id, dateRangeData]
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
    props.schemeListData.updateList(list, generateTime);
    props.systemPage.setBaseDate(generateTime);
  }, []);

  useEffect(() => {
    if (isValidVariable(id)) {
      //获取方案列表--开启下一轮更新
      curStatusValues.current = statusValues;
      props.schemeListData.toggleLoad(true);
      getSchemeList(true);
    } else {
      //没有user id 清定时器
      if (isValidVariable(schemeTimeoutId.current)) {
        clearTimeout(schemeTimeoutId.current);
        schemeTimeoutId.current = "";
      }
    }
  }, [id, statusValues]);

  //监听全局刷新
  useEffect(
    function () {
      if (pageRefresh && isValidVariable(id)) {
        console.log("方案刷新开启");
        props.schemeListData.toggleLoad(true);
        getSchemeList(false);
      }
    },
    [pageRefresh, id]
  );

  useEffect(() => {
    if (props.schemeListData.forceUpdate) {
      console.log("方案列表强制更新");
      getSchemeList(false);
      props.schemeListData.setForceUpdate(false);
    }
  }, [props.schemeListData.forceUpdate]);

  useEffect(() => {
    return () => {
      if (isValidVariable(schemeTimeoutId.current)) {
        clearTimeout(schemeTimeoutId.current);
        schemeTimeoutId.current = "";
      }
      props.schemeListData.updateList([], "");
      props.schemeListData.toggleSchemeActive("");
    };
  }, []);

  return getSchemeList;
}
//航班请求 hook
function useFlightsList(props) {
  const flightsTimeoutId = useRef([]);
  const { schemeListData, flightTableData, systemPage, match } = props;
  const { activeSchemeId, generateTime = "" } = schemeListData;
  const {
    pageRefresh,
    user: { id = "" } = {},
    dateRangeData = [],
  } = systemPage;
  const params = match.params || {};
  const from = params.from || ""; //来源

  // 获取选中方案计算状态值
  const getCalculateSatus = (activeSchemeData, generateTime) => {
    const tacticTimeInfo = activeSchemeData.tacticTimeInfo || {};
    const { startCalculateTime = "" } = tacticTimeInfo;
    let status = "calculating";
    if (isValidVariable(generateTime) && isValidVariable(startCalculateTime)) {
      // 1分钟
      const diff = 1000 * 60;
      // 差值大于1分钟则显示为已计算
      if (calculateStringTimeDiff(generateTime, startCalculateTime) > diff) {
        status = "calculated";
      }
    }
    return status;
  };

  //更新--航班列表 store数据
  const updateFlightTableData = useCallback(
    (flightData = {}) => {
      if (document.getElementsByClassName("collaborate_popover").length > 0) {
        console.log("有协调窗口打开中，跳过此次航班更新");
        return;
      }
      if (
        (isValidVariable(from) && from !== "web") ||
        isValidVariable(props.schemeListData.activeSchemeId)
      ) {
        let { flights, generateTime, performKpiResult } = flightData;
        if (flights !== null) {
          flightTableData.updateFlightsList(
            flights,
            generateTime,
            props.schemeListData.activeSchemeId
          );
          props.performanceKPIData.updatePerformanceKPIData(performKpiResult);
          sessionStorage.setItem(
            "flightTableGenerateTime",
            generateTime,
            props.schemeListData.activeSchemeId
          );
        } else {
          flightTableData.updateFlightsList([], generateTime);
        }
        flightTableData.lastSchemeId = props.schemeListData.activeSchemeId;
      }
    },
    [props.schemeListData.activeSchemeId]
  );

  //获取--航班列表数据
  const getFlightTableData = useCallback(
    (nextRefresh, showLoad = false) => {
      const p = new Promise((resolve, reject) => {
        let url = "";
        let params = {};
        let activeSchemeId = schemeListData.activeSchemeId;
        if (
          (!isValidVariable(from) || from === "web") &&
          !isValidVariable(activeSchemeId)
        ) {
          flightTableData.updateFlightsList([], "", "");
          return;
        }

        // console.log("本次方案id:", activeSchemeId)
        url = ReqUrls.flightsDataNoIdUrl + systemPage.user.id;
        let baseTime = "";
        if (generateTime !== "") {
          baseTime = generateTime.substring(0, 8);
        }
        let dateRangeData = props.systemPage.dateRangeData || [];
        if (dateRangeData.length === 0 || generateTime === "") {
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
        let trafficId = "";
        if (activeSchemeId.indexOf("focus") > -1) {
          trafficId = activeSchemeId.replace(/focus-/g, "");
          activeSchemeId = "";
          reqId = "";
        } else {
          reqId = activeSchemeId;
          trafficId = "";
        }
        params = {
          startTime:
            dateRangeData.length > 0 ? dateRangeData[0] : baseTime + "0000",
          endTime:
            dateRangeData.length > 0 ? dateRangeData[1] : baseTime + "2359",
          id: reqId, //方案id
          trafficId, //左上角选中的id
        };
        const timerFunc = function () {
          //开启定时
          if (nextRefresh) {
            if (isValidVariable(flightsTimeoutId.current)) {
              // console.log(" success 航班列表定时器-清理:"+flightsTimeoutId.current)
              flightsTimeoutId.current.map((t) => {
                clearTimeout(t);
              });
              flightsTimeoutId.current = [];
            }
            const timer = setTimeout(() => {
              if (!props.flightTableData.dataLoaded) {
                // console.log(" success 航班列表定时器-执行:"+flightsTimeoutId.current)
                getFlightTableData(true);
              }
            }, 30 * 1000);
            flightsTimeoutId.current.push(timer);
          }
        };
        //开始获取数据，修改状态
        const opt = {
          url,
          method: "GET",
          params,
          resFunc: (data) => {
            updateFlightTableData(data);
            timerFunc();
            if (props.flightTableData.loading) {
              customNotice({
                type: "success",
                message: "航班列表数据获取成功",
                duration: 5,
              });
            }
            props.flightTableData.toggleLoad(false, false);
            props.performanceKPIData.toggleLoad(false, false);
            resolve("success");
          },
          errFunc: (err) => {
            requestErr(err, "航班列表数据获取失败");
            //开启定时
            timerFunc();
            props.flightTableData.toggleLoad(false, false);
            props.performanceKPIData.toggleLoad(false, false);
            resolve("error");
          },
        };

        if (!props.flightTableData.dataLoaded) {
          requestGet(opt);
          props.flightTableData.toggleLoad(showLoad, true);
          props.performanceKPIData.toggleLoad(showLoad, true);
        }
      });
    },
    [dateRangeData]
  );

  useEffect(() => {
    if (isValidVariable(from) && from !== "web") {
      if (isValidVariable(activeSchemeId)) {
        flightsTimeoutId.current.map((t) => {
          clearTimeout(t);
        });
        flightsTimeoutId.current = [];
        getFlightTableData(false, true);
      } else {
        flightsTimeoutId.current.map((t) => {
          clearTimeout(t);
        });
        flightsTimeoutId.current = [];
        getFlightTableData(true, true);
      }
    } else {
      flightsTimeoutId.current.map((t) => {
        clearTimeout(t);
      });
      flightsTimeoutId.current = [];
      getFlightTableData(true, true);
    }
  }, [activeSchemeId]);

  //监听全局刷新
  useEffect(
    function () {
      if (pageRefresh && isValidVariable(id)) {
        // console.log("全局刷新开启")
        props.flightTableData.toggleLoad(true, true);
        props.performanceKPIData.toggleLoad(true, true);
        getFlightTableData(false);
      }
    },
    [pageRefresh, id]
  );

  useEffect(() => {
    if (flightTableData.forceUpdate) {
      console.log("航班数据强制更新");
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
//KPI数据请求 hook- 执行KPI模块下->影响航班/影响程度/正常率卡片
function useExecuteKPIData(props) {
  const { schemeListData, executeKPIData, systemPage } = props;
  const { activeSchemeId, generateTime = "" } = schemeListData;
  const { pageRefresh, leftActiveName, user: { id = "" } = {} } = systemPage;
  const ExecuteKPITimeoutId = useRef();

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
            if (isValidVariable(ExecuteKPITimeoutId.current)) {
              clearTimeout(ExecuteKPITimeoutId.current);
              ExecuteKPITimeoutId.current = "";
            }
            ExecuteKPITimeoutId.current = setTimeout(() => {
              // console.log("执行KPI数据 定时器-下一轮更新开始")
              getKPIData(true);
            }, 60 * 1000);
          }
          // notification.destroy();
          resolve("success");
        },
        errFunc: (err) => {
          requestErr(err, "KPI数据获取失败");
          if (executeKPIData.loading) {
            executeKPIData.toggleLoad(false);
          }
          //开启定时
          if (nextRefresh) {
            if (isValidVariable(ExecuteKPITimeoutId.current)) {
              clearTimeout(ExecuteKPITimeoutId.current);
              ExecuteKPITimeoutId.current = "";
            }
            ExecuteKPITimeoutId.current = setTimeout(() => {
              // console.log("执行KPI数据 定时器-下一轮更新开始")
              getKPIData(true);
            }, 60 * 1000);
          }
          resolve("error");
        },
      };
      requestGet(opt);
    });
    // }
    // },[leftActiveName]);
  }, []);

  useEffect(() => {
    if (isValidVariable(activeSchemeId)) {
      executeKPIData.toggleLoad(true);
      getKPIData(true);
    }
  }, [activeSchemeId]);

  //监听全局刷新
  useEffect(
    function () {
      if (pageRefresh && isValidVariable(id)) {
        // console.log("全局刷新开启")
        executeKPIData.toggleLoad(true);
        getKPIData(false);
      }
    },
    [pageRefresh, id]
  );

  useEffect(() => {
    return () => {
      if (isValidVariable(ExecuteKPITimeoutId.current)) {
        clearTimeout(ExecuteKPITimeoutId.current);
        ExecuteKPITimeoutId.current = "";
      }
      executeKPIData.updateExecuteKPIData({});
    };
  }, []);
}
// KPI数据请求- 执行KPI模块下-特殊航班卡片
function usePerformanceKPIData(props) {
  const { schemeListData, performanceKPIData, systemPage } = props;
  const { activeSchemeId } = schemeListData;
  const { pageRefresh, user: { id = "" } = {} } = systemPage;
  const PerformanceKPITimeoutId = useRef();

  //更新--执行KPI store数据
  const updateKPIData = useCallback((data) => {
    if (isValidObject(data)) {
      performanceKPIData.updatePerformanceKPIData(data);
    } else {
      performanceKPIData.updatePerformanceKPIData({});
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

      const now = getFullTime(new Date());
      const nowDate = now.substring(0, 8);
      const start = nowDate + "0000";
      const end = nowDate + "2359";
      let trafficId = "";
      if (activeSchemeId.indexOf("focus") > -1) {
        trafficId = activeSchemeId.replace(/focus-/g, "");
        activeSchemeId = "";
      }

      const opt = {
        url: ReqUrls.performanceKPIDataUrl + id,
        method: "GET",
        params: {
          // 开始时间
          startTime: start,
          // 结束时间
          endTime: end,
          // 方案id
          id: activeSchemeId,
          // 用户关注交通流id
          trafficId: trafficId,
        },
        resFunc: (data) => {
          updateKPIData(data);
          performanceKPIData.toggleLoad(false);
          //开启定时
          if (nextRefresh) {
            if (isValidVariable(PerformanceKPITimeoutId.current)) {
              clearTimeout(PerformanceKPITimeoutId.current);
              PerformanceKPITimeoutId.current = "";
            }
            PerformanceKPITimeoutId.current = setTimeout(() => {
              getKPIData(true);
            }, 60 * 1000);
          }
          // notification.destroy();
          resolve("success");
        },
        errFunc: (err) => {
          requestErr(err, "KPI数据获取失败");
          if (performanceKPIData.loading) {
            performanceKPIData.toggleLoad(false);
          }
          //开启定时
          if (nextRefresh) {
            if (isValidVariable(PerformanceKPITimeoutId.current)) {
              clearTimeout(PerformanceKPITimeoutId.current);
              PerformanceKPITimeoutId.current = "";
            }
            PerformanceKPITimeoutId.current = setTimeout(() => {
              getKPIData(true);
            }, 60 * 1000);
          }
          resolve("error");
        },
      };
      requestGet(opt);
    });
  }, []);

  useEffect(() => {
    if (isValidVariable(activeSchemeId)) {
      performanceKPIData.toggleLoad(true);
      getKPIData(true);
    }
  }, [activeSchemeId]);

  //监听全局刷新
  useEffect(
    function () {
      if (pageRefresh && isValidVariable(id)) {
        performanceKPIData.toggleLoad(true);
        getKPIData(false);
      }
    },
    [pageRefresh, id]
  );

  useEffect(() => {
    return () => {
      if (isValidVariable(PerformanceKPITimeoutId.current)) {
        clearTimeout(PerformanceKPITimeoutId.current);
        PerformanceKPITimeoutId.current = "";
      }
      performanceKPIData.updatePerformanceKPIData({});
    };
  }, []);
}

const useSchemeModal = (props) => {
  const [visible, setVisible] = useState(false); //详情模态框显隐
  const [modalId, setModalId] = useState(""); //当前选中方案详情的id，不一定和激活方案id一样
  const [modalType, setModalType] = useState(""); //当前选中方案详情的id，不一定和激活方案id一样
  const { systemPage } = props;

  //方案模态框显隐
  const toggleModalVisible = useCallback((flag, id) => {
    setVisible(flag);
    //选中方案id
    setModalId(id);
  }, []);

  //方案模态框类型切换
  const toggleModalType = useCallback((type) => {
    setModalType(type);
  }, []);

  return {
    visible,
    modalId,
    modalType,
    userId: systemPage.user.id,
    setVisible,
    toggleModalVisible,
    toggleModalType,
  };
};

//方案头
const STitle = (props) => {
  const { schemeListData } = props;
  const { statusValues } = schemeListData; //获取排序后的方案列表
  //状态-多选按钮组-切换事件
  const onChange = useCallback((checkedValues) => {
    // console.log('checked = ', checkedValues);
    schemeListData.setStatusValues(checkedValues);
  }, []);
  return (
    <div className="scheme-filter-items">
      <Checkbox.Group
        options={plainOptions}
        defaultValue={statusValues}
        onChange={onChange}
      />
    </div>
  );
};
const SchemeTitle = inject("schemeListData")(observer(STitle));

//方案列表
function SList(props) {
  const { match } = props;
  const params = match.params || {};
  const from = params.from || ""; //来源
  const getSchemeList = useSchemeList(props);
  useFlightsList(props);
  useExecuteKPIData(props);
  //   usePerformanceKPIData(props);
  const {
    userId,
    visible,
    modalId,
    modalType,
    setVisible,
    toggleModalVisible,
    toggleModalType,
  } = useSchemeModal(props);

  const { schemeListData } = props;
  const { sortedList, activeSchemeId, loading } = schemeListData; //获取排序后的方案列表

  //接收客户端传来方案id，用以自动切换到选中方案
  NWGlobal.setSchemeId = useCallback((schemeId, title) => {
    // alert("收到id:" + schemeId + "  title:" + title);
    //主动获取一次
    getSchemeList().then(function (data) {
      //验证有没有这个方案
      const res = props.schemeListData.activeScheme(schemeId);
      if (isValidObject(res)) {
        // 该方案是否已计算
        const isCalculated = res.isCalculated;
        // 若该方案已计算则切换为活动方案
        if (isCalculated) {
          handleActive(schemeId, title, "client");
        } 
      } else {
        customNotice({
          type: "warning",
          message: "暂未获取到方案，方案名称是：" + title,
          duration: 20,
        });
      }
    });
  }, []);

  //根据工作待办-协调类-【主办】跳转到放行监控，并高亮待办航班
  NWGlobal.targetToFlight = (schemeId, flightId) => {
    // alert("schemeId:"+schemeId+" flightId:"+flightId);
    //验证有没有这个方案
    const res = props.schemeListData.activeScheme(schemeId);
    if (isValidObject(res)) {
      //当前选中的方案
      const activeSchemeId = props.schemeListData.activeSchemeId;
      if (activeSchemeId !== schemeId) {
        //如果当前激活的id和传来的不一样，手动触发
        //选中方案
        props.schemeListData.toggleSchemeActive(schemeId + "");
        props.systemPage.setLeftNavSelectedName("");
      }
    } else {
      //选默认交通流
      if (props.systemPage.leftNavNameList.indexOf(schemeId) !== -1) {
        //选默认交通流
        props.schemeListData.toggleSchemeActive(schemeId);
        props.systemPage.setLeftNavSelectedName(schemeId);
      }
    }

    props.flightTableData.focusFlightId = flightId;
    //验证航班协调按钮是否激活 todo为已激活
    if (props.systemPage.modalActiveName !== "todo") {
      props.systemPage.setModalActiveName("todo");
    }
    if (props.todoList.activeTab !== "1") {
      props.todoList.activeTab = "1";
    }
    let taskId = props.todoList.getIdByFlightId(flightId);
    if (isValidVariable(taskId)) {
      //根据 taskId 高亮工作流
      props.todoList.focusTaskId = taskId;
    }
  };

  //高亮方案并获取航班数据和KPI数据
  const handleActive = useCallback(
    debounce((id, title, from) => {
      console.log("handleActive 方案:", id);
      if (!props.flightTableData.dataLoaded || from === "init") {
        const res = schemeListData.toggleSchemeActive(id + "");
        props.systemPage.setLeftNavSelectedName("");
        if (res) {
          //来自客户端定位，滚动到对应位置
          if (from === "client") {
            // 滚动条滚动到顶部
            const canvas =
              document.getElementsByClassName("scheme_list_canvas")[0];
            const boxContent =
              canvas.getElementsByClassName("list_container")[0];
            boxContent.scrollTop = 0;
          }
        }
      } else {
        customNotice({
          type: "warning",
          message: "航班数据请求中,请稍后再试",
          duration: 10,
        });
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (
      activeSchemeId === "" &&
      sortedList.length > 0 &&
      props.systemPage.leftNavSelectedName === ""
    ) {
      //默认选第一条 已计算
      let defaultId = "";
      //如果没from或者来自web,选中第一条方案
      if (!isValidVariable(from) || from === "web") {
        sortedList.map((item) => {
          if (item.isCalculated && defaultId === "") {
            defaultId = item.id;
          }
        });
      }

      handleActive(defaultId, "", "init");
    }
  }, [sortedList, activeSchemeId]);

  // console.log("方案列表 render")

  return (
    <Spin spinning={loading}>
      <div className="list_container">
        {sortedList.length > 0 ? (
          sortedList.map((item, index) => (
            <SchemeItem
              activeSchemeId={activeSchemeId}
              item={item}
              handleActive={handleActive}
              key={index}
              toggleModalVisible={toggleModalVisible}
              toggleModalType={toggleModalType}
              generateTime={props.schemeListData.generateTime}
            ></SchemeItem>
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ color: "#fff" }}
          />
        )}
        {visible ? (
          <SchemeModal
            userId={userId}
            visible={visible}
            setVisible={setVisible}
            modalType={modalType}
            modalId={modalId}
          />
        ) : (
          ""
        )}
      </div>
    </Spin>
  );
}

const SchemeList = withRouter(
  inject(
    "schemeListData",
    "flightTableData",
    "executeKPIData",
    "performanceKPIData",
    "systemPage",
    "todoList"
  )(observer(SList))
);

const SchemeListModal = () => {
  return (
    <div className="scheme_list_canvas">
      <SchemeTitle />
      <SchemeList />
    </div>
  );
};
export default SchemeListModal;
