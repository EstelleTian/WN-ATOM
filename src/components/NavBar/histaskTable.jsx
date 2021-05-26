/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-05-26 16:56:13
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {
  Suspense,
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  message,
  Table,
  Spin,
  Button,
  Input,
  Radio,
  Select,
  Pagination,
} from "antd";
import { inject, observer } from "mobx-react";
import debounce from "lodash/debounce";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { requestGet, request } from "utils/request";
import {
  getFullTime,
  getDayTimeFromString,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
import {
  FlightCoordination,
  TodoType,
  StatusToCN,
  HandleStatusToCN,
} from "utils/flightcoordination";
import moment from "moment";
// import './MyApplication.scss';

const { Option } = Select;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
//根据key识别列表列配置columns
const getLockedCn = (value) => {
  let res = "";
  switch (value) {
    case "1":
      res = "禁止调整";
      break;
    case "0":
      res = "自动";
      break;
  }
  return res;
};

const names = {
  handleStatus: {
    en: "handleStatus",
    cn: "本席位处理状态",
    width: 140,
  },
  key: {
    en: "key",
    cn: "流水ID",
    width: 90,
  },
  type: {
    en: "type",
    cn: "类型",
    width: 120,
  },
  flightsId: {
    en: "flightsId",
    cn: "目标",
    width: 100,
  },
  depap: {
    en: "depap",
    cn: "起飞机场",
    width: 100,
  },
  sourceVal: {
    en: "sourceVal",
    cn: "原始值",
    width: 160,
  },
  targetVal: {
    en: "targetVal",
    cn: "协调值",
    width: 160,
  },
  startUser: {
    en: "startUser",
    cn: "发起人",
    width: 160,
  },
  startTime: {
    en: "startTime",
    cn: "发起时间",
    width: 100,
    defaultSortOrder: "descend",
  },
  activityName: {
    en: "activityName",
    cn: "当前处理环节",
    width: 170,
  },
  handler: {
    en: "handler",
    cn: "当前处理人",
    width: 160,
  },
  status: {
    en: "status",
    cn: "最终状态",
    width: 100,
  },
};

const HistaskTable = (props) => {
  const timerId = useRef();
  const tableTotalWidth = useRef();

  const { systemPage = {}, myApplicationList } = props;
  const user = systemPage.user || {};
  const userId = user.id || "";
  const loading = myApplicationList.loading || "";

  const updateFilterKey = useCallback(
    debounce(
      (value) => {
        props.myApplicationList.setFilterKey(value.trim().toUpperCase());
        console.log(value);
      },
      500,
      { leading: true }
    ),
    []
  );
  const updateFilterTimeRange = (value) => {
    props.myApplicationList.setFilterTimeRange(value);
  };

  // 处理错误信息
  const requestErr = useCallback((err, content) => {
    message.error({
      content,
      duration: 8,
    });
  }, []);

  // useEffect(function(){
  //     return function(){
  //         if(myApplicationList.filterKey){
  //             // 清空快速过滤关键字
  //             props.myApplicationList.setFilterKey("")
  //         }

  //     }
  // },[]);

  // 处理 办结 数据
  const handleMyApplicationData = useCallback((data) => {
    let tableData = [];
    const backLogTasks = data.tasks || {};
    const flights = data.flights || {};
    // console.log("qqq"+backLogTasks);
    const generateTime = data.generateTime || "";
    // generateTime.current = gTime;
    for (let key in backLogTasks) {
      const backLogTask = backLogTasks[key] || {}; //流水号
      const flight = backLogTask.flight || {};
      const authorities = backLogTask.authorities || {};
      const startUser = backLogTask.startUser || ""; //发起人
      const activityName = backLogTask.activityName || {};
      let startTime = backLogTask.startTime || ""; //发起时间
      const handler = backLogTask.handler || {}; //当前处理人
      const status = backLogTask.status || {}; //最终状态

      const businessId = backLogTask.businessId || {};
      const flightObj = flights[businessId] || {};
      const flightsId = flightObj.flightid || {}; //目标
      const depap = flightObj.depap || {}; //起飞机场
      const flightid = flight.flightid || "";

      const instance = backLogTask.instance || {};
      const type = backLogTask.type || {}; //类型

      const handleStatus = backLogTask.handleStatus || {};
      const processVariables = instance.processVariables || {};
      const agree = processVariables.agree || false;
      const flightCoorType = processVariables.flightCoorType || "";

      let sourceVal = backLogTask.sourceVal; //原始值
      let targetVal = backLogTask.targetVal; //协调值
      let tacticName = backLogTask.tacticName; //协调值
      //    console.log("targetVal", targetVal)
      const businessName = processVariables.businessName || "";
      let taskId = key;
      let options = {
        key,
        type,
        flightCoorType,
        agree,
        flight,
        authorities,
        taskId,
        targetVal,
      };

      let obj = {
        flightsId: flightsId,
        key: key,
        handler: handler,
        status: status,
        TASKID: key,
        type: type,
        sourceVal: sourceVal,
        handleStatus: handleStatus,
        activityName: activityName,
        FLIGHTID: flightid,
        TYPE: flightCoorType,
        targetVal: targetVal,
        startUser: startUser,
        startTime: startTime,
        depap: depap,
        COMMENT: businessName,
        tacticName,

        // abc: flightObj,
      };
      tableData.push(obj);
    }

    props.myApplicationList.updateMyApplicationsData(tableData, generateTime);
  }, []);

  const getColumns = useMemo(function () {
    let totalWidth = 0;
    //表格列配置-默认-计数列
    let columns = [];
    //生成表配置-全部
    for (let key in names) {
      const obj = names[key];
      const en = obj["en"];
      const cn = obj["cn"];
      const width = obj["width"];
      let tem = {
        title: cn,
        dataIndex: en,
        align: "center",
        key: en,
        width: width,
        ellipsis: true,
        className: en,
        showSorterTooltip: false,
        onHeaderCell: (column) => {
          //配置表头属性，增加title值
          return {
            title: cn,
          };
        },
      };
      //发起时间排序
      if (en === "startTime") {
        tem["defaultSortOrder"] = "descend";
        tem["sorter"] = (a, b) => {
          return a.startTime * 1 - b.startTime * 1;
        };
        tem["render"] = (text, record, index) => {
          const timeTitle = formatTimeString(text);
          const time = formatTimeString(text, 2);
          return <div title={timeTitle}>{time}</div>;
        };
      }
      //待办类型
      if (en === "type") {
        // tem["fixed"] = 'left'
        tem["render"] = (text, record, index) => {
          let type = TodoType[text] || text;

          return <div title={type}>{type}</div>;
        };
      }

      //最终状态
      if (en === "status") {
        tem["fixed"] = "right";
        tem["render"] = (text, record, index) => {
          let type = StatusToCN[text] || text;
          let style = "";
          if (text * 1 === 100) {
            style = { color: "#73bfe2" };
          } else if (text * 1 === 200) {
            style = { color: "green" };
          } else if (text * 1 === 300) {
            style = { color: "#ec4747" };
          }
          return (
            <div title={type} style={style}>
              {type}
            </div>
          );
        };
      }

      //当前处理环节
      if (en === "activityName") {
      }

      //本席位处理状态
      if (en === "handleStatus") {
        tem["fixed"] = "left";
        tem["render"] = (text, record, index) => {
          let type = HandleStatusToCN[text] || text;
          let style = {};
          if (text * 1 === 100) {
            // style = { color: '#73bfe2'};
          } else if (text * 1 === 200) {
            // style = { color: '#73bfe2'};
          } else if (text * 1 === 300) {
            style = { color: "#73bfe2" };
          } else if (text * 1 === 400) {
            style = { color: "#ec4747" };
          } else if (text * 1 === 500) {
            style = { color: "#29b329" };
          }

          // const HandleStatusToCN = {
          //     "100": "未处理",
          //     "200": "提交",
          //     "300": "同意",
          //     "400": "拒绝",
          //     "500": "确认",
          // };

          return (
            <div title={type} style={style}>
              {type}
            </div>
          );
        };
      }

      if (en === "sourceVal" || en === "targetVal") {
        tem["render"] = (text, record, index) => {
          const { type } = record;
          if (type === "TOBT") {
            if (isValidVariable(text) && text.length >= 12 && text * 1 > 0) {
              return (
                <div title={text}>{getDayTimeFromString(text, "", 2)}</div>
              );
            }
          } else if (type === "EXEMPT" || type === "UNEXEMPT") {
            // console.log(text)
            return (
              <div title={text}>{FlightCoordination.getPriorityZh(text)}</div>
            );
          } else if (
            type === "SINGLEEXEMPT" ||
            type === "UNSINGLEEXEMPT" ||
            type === "INTERVAL" ||
            type === "UNINTERVAL"
          ) {
            if (isValidVariable(text)) {
              const tacticName = record.tacticName || "";
              return <div title={`${tacticName} - ${text}`}>{tacticName}</div>;
            } else {
              return <div title={text}>{text}</div>;
            }
          } else if (type === "INPOOL" || type === "OUTPOOL") {
            return (
              <div title={text}>{FlightCoordination.getPoolStatusZh(text)}</div>
            );
          } else if (
            type === "COBT" ||
            type === "CTOT" ||
            type === "CTD" ||
            type === "FFIXT" ||
            type === "CTO"
          ) {
            const obj = JSON.parse(text) || {};
            return (
              <div>
                {Object.keys(obj).map((key, index) => {
                  let val = obj[key];
                  if (isValidVariable(val) && val.length >= 12 && val * 1 > 0) {
                    return (
                      <div key={index}>
                        {key}：{getDayTimeFromString(val, "", 2)}
                      </div>
                    );
                  } else {
                    return (
                      <div key={index}>
                        {key}：{getLockedCn(val)}
                      </div>
                    );
                  }
                })}
              </div>
            );
          } else {
            if (isValidVariable(text) && text.length >= 12 && text * 1 > 0) {
              return <div title={text}>{getDayTimeFromString(text)}</div>;
            }
          }
          return <div title={text}>{text}</div>;
        };
      }

      if (en === "FLIGHTID" || en === "USER" || en === "COMMENT") {
        tem["render"] = (text, record, index) => {
          return (
            <div title={text} className="full_cell">
              {text}
            </div>
          );
        };
      }
      totalWidth += tem.width * 1;
      columns.push(tem);
    }
    tableTotalWidth.current = totalWidth;
    console.log("tableTotalWidth", tableTotalWidth);
    return columns;
  }, []);
  //获取办结工作请求
  const requestMyApplicationDatas = useCallback(
    (triggerLoading, nextRefresh = false) => {
      if (!isValidVariable(user.username)) {
        return;
      }
      if (triggerLoading) {
        props.myApplicationList.toggleLoad(true);
      }

      let url = ReqUrls.histaskTableUrl + user.username;

      const timerFunc = () => {
        if (nextRefresh) {
          if (isValidVariable(timerId.current)) {
            clearTimeout(timerId.current);
            timerId.current = "";
          }
          timerId.current = setTimeout(() => {
            requestMyApplicationDatas(false, nextRefresh);
          }, 60 * 1000);
        }
      };
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
        url,
        params: {
          startTime:
            dateRangeData.length > 0 ? dateRangeData[0] : baseTime + "0000",
          endTime:
            dateRangeData.length > 0 ? dateRangeData[1] : baseTime + "2359",
        },
        method: "GET",
        resFunc: (data) => {
          //更新办结数据
          handleMyApplicationData(data);
          myApplicationList.toggleLoad(false);
          timerFunc();
        },
        errFunc: (err) => {
          requestErr(err, "办结工作数据获取失败");
          props.myApplicationList.toggleLoad(false);
          timerFunc();
        },
      };
      requestGet(opt);
    },
    [user.username]
  );

  useEffect(() => {
    if (props.myApplicationList.forceUpdate) {
      console.log("强制更新办结列表");
      requestMyApplicationDatas(false, false);
    }
  }, [props.myApplicationList.forceUpdate]);

  useEffect(() => {
    requestMyApplicationDatas(true, true);

    return () => {
      clearTimeout(timerId.current);
      timerId.current = null;
    };
  }, [user.id]);
  return (
    <Suspense
      fallback={
        <div className="load_spin">
          <Spin tip="加载中..." />
        </div>
      }
    >
      <div className="advanced-search-filters">
        <div className="advanced-search-base-input-filter">
          {/* <Input
                        allowClear
                        className="input-filter-key"
                        placeholder="请输入要查询的关键字"
                        style={{ width: '60%' }}
                        onChange={(e)=> { updateFilterKey(e.target.value) }}
                    /> */}
        </div>
        {/*<div className="advanced-search-base-radio-filter">
                    <Radio.Group value="ALL" onChange={(e)=> { updateFilterTimeRange(e.target.value) }}>
                        <Radio value="ALL">全部时段</Radio>
                        <Radio value="TODAY">今日</Radio>
                        <Radio value="WEEK">最近一周</Radio>
                        <Radio value="ONEMONTH">最近一个月</Radio>
                    </Radio.Group>
                </div>*/}
        {/* <div className="advanced-search-button-refresh">
                    <Button type="primary" loading = { refreshBtnLoading } style={{ marginLeft: "-5rem" }}
                            onClick = { e => { refreshData()  }}
                    >
                        刷新
                    </Button>
                </div> */}
      </div>
      <div>
        <Table
          columns={getColumns}
          dataSource={props.myApplicationList.myApplications}
          size="small"
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => {
              return `共${total}条`;
            },
          }}
          loading={loading}
          scroll={{
            x: tableTotalWidth,
            y: 600,
          }}
          // footer={() => <div className="generateTime">数据时间: {formatTimeString(props.myApplicationList.generateTime)}</div>}
        />
        {props.myApplicationList.myApplications.length > 0 && (
          <div
            className="generateTime"
            style={{ position: "absolute", bottom: "40px", left: "30px" }}
          >
            数据时间: {formatTimeString(props.myApplicationList.generateTime)}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default inject(
  "systemPage",
  "myApplicationList"
)(observer(HistaskTable));
