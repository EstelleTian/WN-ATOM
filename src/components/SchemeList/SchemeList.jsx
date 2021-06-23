/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2021-06-23 14:17:51
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
  { label: "已经终止", value: "TERMINATED" },
];

//请求错误--处理
const requestErr = (err, content) => {
  customNotice({
    type: "error",
    message: content,
  });
};

// 清空各模块store数据
function clearStoreData(props) {
  const {
    schemeListData,
    executeKPIData,
    performanceKPIData,
    flightTableData,
  } = props;

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
  let [schemeTimeoutId, setSchemeTimeoutId] = useState(0);

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
        let filterArrap = "";
        let filterRegion = "";
        let region = "";
        let filterDepap = "";
        let system = "";
        const activeSystem = props.systemPage.activeSystem || {};
        filterArrap = activeSystem.filterArrap || "";
        filterRegion = activeSystem.filterRegion || "";
        region = activeSystem.region || "";
        filterDepap = activeSystem.filterDepap || "";
        system = activeSystem.system || "";
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
            filterArrap,
            filterRegion,
            filterDepap,
            system,
            region,
          },
          resFunc: (data) => {
            //更新方案数据
            updateSchemeListData(data);
            if (props.schemeListData.loading) {
              props.schemeListData.toggleLoad(false);
            }
            //开启定时
            if (nextRefresh) {
              if (isValidVariable(schemeTimeoutId)) {
                clearTimeout(schemeTimeoutId);
              }
              let timer = setTimeout(() => {
                getSchemeList(true);
              }, 40 * 1000);
              setSchemeTimeoutId(timer);
            }
            // notification.destroy();
            resolve("success");
          },
          errFunc: (err) => {
            requestErr(err, "方案列表数据获取失败");
            // 清空各模块store数据
            clearStoreData(props);
            if (props.schemeListData.loading) {
              props.schemeListData.toggleLoad(false);
            }
            //开启定时
            if (nextRefresh) {
              if (isValidVariable(schemeTimeoutId)) {
                clearTimeout(schemeTimeoutId);
              }
              let timer = setTimeout(() => {
                getSchemeList(true);
              }, 40 * 1000);
              setSchemeTimeoutId(timer);
            }
            // reject("error");
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
      // 复制一份
      let newStatusValues = [...statusValues];
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
        // console.log("方案刷新开启");
        props.schemeListData.toggleLoad(true);
        getSchemeList(false);
      }
    },
    [pageRefresh, id]
  );

  useEffect(() => {
    if (props.schemeListData.forceUpdate) {
      // console.log("方案列表强制更新");
      getSchemeList(false);
      props.schemeListData.setForceUpdate(false);
    }
  }, [props.schemeListData.forceUpdate]);

  useEffect(() => {
    return () => {
      if (isValidVariable(schemeTimeoutId)) {
        clearTimeout(schemeTimeoutId);
      }
      props.schemeListData.updateList([], "");
      props.schemeListData.toggleSchemeActive("");
    };
  }, []);

  return getSchemeList;
}
//航班请求 hook
function useFlightsList(props) {
  let [flightsTimeoutId, setFlightsTimeoutId] = useState(0);
  const { schemeListData, flightTableData, systemPage, match } = props;
  const { activeSchemeId, generateTime = "" } = schemeListData;
  const {
    pageRefresh,
    user: { id = "" } = {},
    dateRangeData = [],
  } = systemPage;
  const params = match.params || {};
  const systemType = params.systemType || ""; //来源

  //更新--航班列表 store数据
  const updateFlightTableData = useCallback(
    (flightData = {}) => {
      if (document.getElementsByClassName("collaborate_popover").length > 0) {
        // console.log("有协调窗口打开中，跳过此次航班更新");
        return;
      }
      // if (
      //   (isValidVariable(from) && from !== "web") ||
      //   isValidVariable(props.schemeListData.activeSchemeId)
      // ) {
      // }
      let { flights, generateTime, performKpiResult } = flightData;
      if (flights !== null) {
        flightTableData.updateFlightsList(
          flights,
          generateTime,
          props.schemeListData.activeSchemeId
        );
        sessionStorage.setItem(
          "flightTableGenerateTime",
          generateTime,
          props.schemeListData.activeSchemeId
        );
      } else {
        flightTableData.updateFlightsList([], generateTime);
      }
      // 若KPI数据有效则更新KPI数据-特殊航班模块
      if (isValidObject(performKpiResult)) {
        props.performanceKPIData.updatePerformanceKPIData(performKpiResult);
      } else {
        // 反之清除KPI数据
        props.performanceKPIData.updatePerformanceKPIData({});
      }
      // flightTableData.lastSchemeId = props.schemeListData.activeSchemeId;
    },
    [props.schemeListData.activeSchemeId]
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
              if (!props.flightTableData.dataLoaded) {
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
            // if (props.flightTableData.loading) {
            //   customNotice({
            //     type: "success",
            //     message: "航班列表数据获取成功",
            //     duration: 5,
            //   });
            // }
            props.flightTableData.toggleLoad(false, false);
            props.performanceKPIData.toggleLoad(false, false);
            console.timeEnd("tableTime");
            resolve("success");
          },
          errFunc: (err) => {
            // 清空航班表格数据
            flightTableData.updateFlightsList([], "");
            // 清除KPI数据
            props.performanceKPIData.updatePerformanceKPIData({});
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
    clearTimeout(flightsTimeoutId);
    getFlightTableData(true, true);
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
//KPI数据请求 hook- 执行KPI模块下->影响航班/影响程度/正常率卡片
function useExecuteKPIData(props) {
  const { schemeListData, executeKPIData, systemPage } = props;
  const { activeSchemeId, generateTime = "" } = schemeListData;
  const { pageRefresh, leftActiveName, user: { id = "" } = {} } = systemPage;
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
          executeKPIData.updateExecuteKPIData({}, generateTime);
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
    // }
    // },[leftActiveName]);
  }, []);

  useEffect(() => {
    clearTimeout(executeKPITimeoutId);
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
      if (isValidVariable(executeKPITimeoutId)) {
        clearTimeout(executeKPITimeoutId);
      }
      executeKPIData.updateExecuteKPIData({});
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
  if (
    props.systemPage.systemKind === "CRS" &&
    props.systemPage.leftActiveName !== ""
  ) {
    useExecuteKPIData(props);
  }

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
      sortedList.map((item) => {
        if (item.isCalculated && defaultId === "") {
          defaultId = item.id;
        }
      });

      handleActive(defaultId, "", "init");
    }
  }, [sortedList, activeSchemeId, props.systemPage.leftNavSelectedName]);

  // console.log("方案列表 render")

  return (
    // <Spin spinning={loading}>
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
    // </Spin>
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

const SchemeListModal = (props) => {
  const { schemeListData } = props;
  const loading = schemeListData.loading;
  return (
    <div className="scheme_list_canvas">
      <Spin spinning={loading}>
        <SchemeTitle />
        <SchemeList />
      </Spin>
    </div>
  );
};
// export default SchemeListModal;
export default inject("schemeListData")(observer(SchemeListModal));
