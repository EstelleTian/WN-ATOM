/*
 * @Author: your name
 * @Date: 2020-12-15 10:52:07
 * @LastEditTime: 2021-05-27 13:26:40
 * @LastEditors: Please set LastEditors
 * @Description: 表格列配置、列数据转换、右键协调渲染
 * @FilePath: \WN-CDM\src\pages\TablePage\TableColumns.js
 */
import React from "react";
import { Tag, Tooltip, Input } from "antd";
import {
  isValidVariable,
  getDayTimeFromString,
  getTimeAndStatus,
} from "utils/basic-verify";
import { FlightCoordination, PriorityList } from "utils/flightcoordination.js";
import RenderCell from "./RenderCell";
import FmeToday from "utils/fmetoday";
import FLIGHTIDPopover from "./FLIGHTIDPopover";

import debounce from "lodash/debounce";

/**
 * 告警列单元格渲染格式化
 * */
const randerAlarmCellChildren = (opt) => {
  const { text, record, index, col, colCN } = opt;
  // 置空title属性,解决title显示[object,object]问题
  return (
    <div className="alarm_cell" title="">
      {text}
    </div>
  );
};

/**
 * 根据航班id滚动到对应位置
 * @param classStr  定位容器class
 * */
const scrollTopById = (id, classStr) => {
  // console.log("目标定位航班是：",props.flightTableData.getTargetFlight.id, props.flightTableData.getTargetFlight.flightid );
  if (isValidVariable(id)) {
    const flightCanvas = document.getElementsByClassName(classStr);
    const boxContent = flightCanvas[0].getElementsByClassName("box_content");
    const contentH = boxContent[0].clientHeight; //表格外框高度
    const tableBody = boxContent[0].getElementsByClassName("ant-table-body");
    const tableTBody = boxContent[0].getElementsByClassName("ant-table-tbody");
    const tableTBodyH = tableTBody[0].clientHeight; //表格总高度
    // console.log("目标定位航班[contentH]是：",contentH, "tableBodyH:", tableBodyH );
    if (tableTBodyH * 1 > contentH * 1) {
      //计算定位航班
      const tr = boxContent[0].getElementsByClassName(id);
      if (tr.length > 0) {
        const trHeight = tr[0].clientHeight;
        const rowIndex =
          tr[0].firstElementChild.getElementsByClassName("text_cell_center")[0]
            .innerHTML; //当前航班所在行号

        let mtop = rowIndex * trHeight;
        // console.log("目标定位航班是：",tr , trHeight, rowIndex, mtop);
        if (contentH / 2 < mtop) {
          const scrollTop = Math.floor(mtop - contentH / 2);
          // console.log("目标定位航班  滚动高度是：", scrollTop);
          tableBody[0].scrollTop = scrollTop;
        }
      }
    }
  }
};
//设置行高亮-传入目标dom
const highlightRowByDom = (targetDom) => {
  let tClass = targetDom.getAttribute("class");
  const trs = targetDom.parentElement.children;
  clearHighlightRowByDom(trs);
  targetDom.setAttribute("class", tClass + " active_row");
};

//清除行高亮-定位容器class
const clearHighlightRowByDom = (trs) => {
  const len = trs.length;
  for (let i = 0; i < len; i++) {
    let trDom = trs[i];
    let trClass = trDom.getAttribute("class");
    trClass = trClass.replace(/active_row/g, "");
    trDom.setAttribute("class", trClass);
  }
};

//表格列名称-中英-字典
let defaultNames = {
  FLIGHTID: {
    en: "FLIGHTID",
    cn: "航班号",
  },
  ALARM: {
    en: "ALARM",
    cn: "告警",
  },
  // "TASK":{
  //     "en":"TASK",
  //     "cn":"优先级"
  // },
  FFIX: {
    en: "FFIX",
    cn: "基准点",
  },
  FFIXT: {
    en: "FFIXT",
    cn: "基准点时间",
  },
  CTO: {
    en: "CTO",
    cn: "计算基准点",
  },

  ETO: {
    en: "ETO",
    cn: "预计基准点",
  },
  COBT: {
    en: "COBT",
    cn: "计算预撤时间",
  },
  CTOT: {
    en: "CTOT",
    cn: "计算起飞时间",
  },
  SLOT: {
    en: "SLOT",
    cn: "时隙状态",
  },
  ACTYPE: {
    en: "ACTYPE",
    cn: "机型",
  },
  ATOT: {
    en: "ATOT",
    cn: "实际起飞时间",
  },
  DEPAP: {
    en: "DEPAP",
    cn: "起飞机场",
  },
  ARRAP: {
    en: "ARRAP",
    cn: "降落机场",
  },
  EOBT: {
    en: "EOBT",
    cn: "预计撤轮档时间",
  },
  TOBT: {
    en: "TOBT",
    cn: "目标撤轮档",
  },
  ASBT: {
    en: "ASBT",
    cn: "上客时间",
  },
  AGCT: {
    en: "AGCT",
    cn: "关舱门时间",
  },
  AOBT: {
    en: "AOBT",
    cn: "推出时间",
  },
  STATUS: {
    en: "STATUS",
    cn: "航班状态",
  },
  EAW: {
    en: "EAW",
    cn: "入区域点",
  },
  EAWT: {
    en: "EAWT",
    cn: "入区域点时间",
  },

  OAW: {
    en: "OAW",
    cn: "出区域点",
  },
  OAWT: {
    en: "OAWT",
    cn: "出区域点时间",
  },
  SOBT: {
    en: "SOBT",
    cn: "计划撤轮档",
  },
  SLOTSTATUS: {
    en: "SLOTSTATUS",
    cn: "时隙分配状态",
  },
  FETA: {
    en: "FETA",
    cn: "前段降落时间",
  },
  POS: {
    en: "POS",
    cn: "停机位",
  },
  RWY: {
    en: "RWY",
    cn: "跑道",
  },
  orgdata: {
    en: "orgdata",
    cn: "原数据",
  },
};

// 右键渲染模块内容
let render = (opt) => {
  const { text, record, index, col, colCN } = opt;
  let color = "";
  let popover = (
    <div className="text_cell_center" title={text}>
      {text}
    </div>
  );
  if (col === "FLIGHTID") {
    let { orgdata } = record;
    if (isValidVariable(orgdata)) {
      orgdata = JSON.parse(orgdata);
    }
    let { priority } = orgdata;
    const fmeToday = orgdata.fmeToday || {};
    let hadDEP = FmeToday.hadDEP(fmeToday); //航班已起飞
    let hadARR = FmeToday.hadARR(fmeToday); //航班已落地
    let hadFPL = FmeToday.hadFPL(fmeToday); //航班已发FPL报
    let isInAreaFlight = FmeToday.isInAreaFlight(orgdata); //航班在本区域内
    let isInPoolFlight = FlightCoordination.isInPoolFlight(orgdata); //航班是否在等待池中
    let isCoordinationResponseWaitingFlight =
      FlightCoordination.isCoordinationResponseWaitingFlight(orgdata); //航班是否在协调响应等待中
    let getCoordinationResponseWaitingType =
      FlightCoordination.getCoordinationResponseWaitingType;
    let hadInAir = false;
    if (hadDEP && !hadARR) {
      hadInAir = true;
    }
    let colorClass = "";
    if (isValidVariable(priority) && priority * 1 > 0) {
      colorClass = "priority_" + priority;
    }
    if (isInPoolFlight) {
      colorClass += " in_pool " + orgdata.poolStatus;
    }
    if (isCoordinationResponseWaitingFlight) {
      colorClass += " WAIT";
    }
    popover = (
      <div className={` ${colorClass}`}>
        <div
          className={`text_cell_center ${
            isValidVariable(text) ? "" : "empty_cell"
          }`}
          title={`${text}-${PriorityList[priority]} ${
            isInAreaFlight ? "区内" : "区外"
          } ${hadInAir ? "空中" : "地面"} ${
            isCoordinationResponseWaitingFlight
              ? `${getCoordinationResponseWaitingType(orgdata)}协调中`
              : ""
          }`}
        >
          <span className={`${isInAreaFlight ? "inArea" : "outArea"}`}>
            {text}
          </span>
        </div>

        <div
          title={`${hadInAir ? "空中" : "地面"}`}
          className={`status_flag ${hadInAir ? "inAir" : "inGround"}`}
        ></div>
      </div>
    );
  } else if (
    col === "CTO" ||
    col === "EAWT" ||
    col === "OAWT" ||
    col === "ATOT" ||
    col === "TOBT" ||
    col === "AOBT" ||
    col === "ASBT" ||
    col === "COBT" ||
    col === "CTOT" ||
    col === "AGCT"
  ) {
    popover = <RenderCell opt={opt} />;
  } else if (col === "ALARM") {
    popover = randerAlarmCellChildren(opt);
  } else if (col === "FFIXT") {
    let { source = "", value = "", meetIntervalValue = "" } = text;
    let ftime = "";
    if (isValidVariable(value) && value.length >= 12) {
      ftime = getTimeAndStatus(value);
      if (source === "MANUAL") {
        getTimeAndStatus(value);
      }
    }
    if (ftime.indexOf("A") > -1) {
      source = "DEP";
    }
    let sourceCN = FlightCoordination.getSourceZh(source);
    popover = (
      <div
        // col-key={col}
        className={`full-cell time_${ftime} ${
          isValidVariable(value) && source
        }`}
      >
        <div
          className={`interval ${ftime !== "" && source}`}
          title={`${value}-${sourceCN}`}
        >
          <span
            className={`${
              meetIntervalValue === "200" && ftime !== "" && "interval_red"
            }`}
          >
            {ftime}
          </span>
        </div>
      </div>
    );
  } else if (col === "RWY" || col === "POS") {
    const { source = "", value = "" } = text;
    let sourceCN = FlightCoordination.getSourceZh(source);
    popover = (
      <div
        col-key={col}
        className={`full-cell ${isValidVariable(value) && source} ${col}`}
      >
        <div
          className={`${isValidVariable(value) ? "" : "empty_cell"}`}
          title={`${isValidVariable(value) ? value : ""}-${sourceCN}`}
        >
          <span className="">{value}</span>
        </div>
      </div>
    );
  } else if (col === "SLOTSTATUS") {
    // 时隙分配状态
    // 行原始数据
    let orgdata = JSON.parse(record.orgdata);
    // 未分配时隙原因
    let unSlotStatusReason = orgdata.unSlotStatusReason || "";
    popover = (
      <div col-key={col} className={`full-cell ${col}`}>
        <div
          className={`${isValidVariable(text) ? "" : "empty_cell"}`}
          title={`${
            isValidVariable(unSlotStatusReason) ? unSlotStatusReason : ""
          }`}
        >
          <span className="">{text}</span>
        </div>
      </div>
    );
  }
  let obj = {
    children: popover,
    props: {
      "col-key": col, //td会增加这个属性
    },
  };
  return obj;
};

//生成表配置
const getColumns = (
  collaboratePopoverData,
  names = defaultNames,
  sortable = false,
  onCellFilter = () => {}
) => {
  if (!isValidVariable(names)) {
    names = defaultNames;
  }
  //获取屏幕宽度，适配 2k
  let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
  //表格列配置-默认-计数列
  let columns = [
    {
      title: "行号",
      dataIndex: "rowNum",
      align: "center",
      key: "rowNum",
      width: screenWidth > 1920 ? 70 : 60,
      fixed: "left",
      render: (text, record, index) => (
        <div className="text_cell_center">{index + 1}</div>
      ),
    },
  ];
  //生成表配置-全部
  for (let key in names) {
    const obj = names[key];
    const en = obj["en"];
    const cn = obj["cn"];
    let tem = {
      title: en,
      dataIndex: en,
      align: "center",
      key: en,
      width: screenWidth > 1920 ? 80 : 65,
      ellipsis: true,
      className: en,
      showSorterTooltip: false,
      onHeaderCell: (column) => {
        //配置表头属性，增加title值
        return {
          title: cn,
        };
      },
      onCell: (record) => {
        return {
          onContextMenu: (event) => {
            handleRightClickCell(event, record, collaboratePopoverData);
          },
        };
      },
    };

    const sortFunc = (a, b) => {
      let data1 = a[en] + "";
      if (data1.length >= 12) {
        data1 = data1.substring(0, 12);
      }
      let data2 = b[en] + "";
      if (data2.length >= 12) {
        data2 = data2.substring(0, 12);
      }
      if (isValidVariable(data1) && isValidVariable(data2)) {
        let res = data1.localeCompare(data2);
        if (0 !== res) {
          return res;
        }
      } else if (isValidVariable(data1)) {
        return -1;
      } else if (isValidVariable(data2)) {
        return 1;
      }
      return 0;
    };
    //排序
    tem["sorter"] = sortFunc;
    //特殊处理排序，FFIXT->EOBT
    if (en === "FFIXT") {
      //field对象类型排序，用value再排
      const sorFunc2 = (a, b, sortName) => {
        let data1 = "";
        let data2 = "";

        if (sortName === "FFIXT") {
          data1 = a[sortName].value || "";
          data2 = b[sortName].value || "";
        } else if (sortName === "EOBT") {
          data1 = a[sortName] || "";
          data2 = b[sortName] || "";
        }
        // console.log(sortName, a.FLIGHTID, data1, b.FLIGHTID, data2);
        if (data1.length >= 12) {
          data1 = data1.substring(0, 12);
        }
        if (data2.length >= 12) {
          data2 = data2.substring(0, 12);
        }
        if (isValidVariable(data1) && isValidVariable(data2)) {
          let res = data1.localeCompare(data2);
          if (0 !== res) {
            return res;
          }
          // return res;
        } else if (isValidVariable(data1)) {
          return -1;
        } else if (isValidVariable(data2)) {
          return 1;
        } else {
          return sorFunc2(a, b, "EOBT");
        }
      };
      tem["sorter"] = (a, b) => {
        return sorFunc2(a, b, "FFIXT");
      };
    }

    //默认排序
    if (en === "EAW" || en === "OAW") {
      tem["width"] = screenWidth > 1920 ? 95 : 65;
    }
    if (en === "FFIX") {
      tem["width"] = screenWidth > 1920 ? 95 : 80;
    }
    if (en === "FFIXT") {
      tem["defaultSortOrder"] = "ascend";
      tem["width"] = screenWidth > 1920 ? 95 : 80;
    }
    if (en === "ALARM") {
      tem["width"] = screenWidth > 1920 ? 140 : 120;
    }

    if (en === "FLIGHTID") {
      tem["width"] = screenWidth > 1920 ? 120 : 100;
      tem["fixed"] = "left";
    }

    if (en === "STATUS") {
      tem["width"] = screenWidth > 1920 ? 75 : 65;
    }

    //隐藏列
    if (en === "orgdata") {
      tem["className"] = "notshow";
      tem["width"] = 0;
    }

    tem["render"] = (text, record, index) => {
      const opt = {
        text,
        record,
        index,
        col: en,
        colCN: cn,
      };
      return render(opt);
    };
    if (sortable) {
      const handleInputVal = debounce((values) => {
        onCellFilter(en, values);
      }, 500);
      const doubleTem = {
        title: (
          <Input
            className="uppercase"
            onChange={(e) => handleInputVal(e.target.value)}
          />
        ),
        dataIndex: en,
        align: "center",
        children: [{ ...tem }],
      };
      columns.push(doubleTem);
    } else {
      columns.push(tem);
    }
  }
  return columns;
};

// 单元格右键回调事件
const handleRightClickCell = (event, record, collaboratePopoverData) => {
  const currentTarget = event.currentTarget;
  // 点击的列名
  const clickColumnName = currentTarget.getAttribute("col-key");
  let flightId = "";
  if (clickColumnName === "FLIGHTID") {
    flightId = currentTarget.textContent;
  }

  //协调窗口 依托fc航班数据对象赋值
  collaboratePopoverData.setData(record);

  //获取点击坐标数据
  const bounds = currentTarget.getBoundingClientRect();
  const x = bounds.x || 0;
  const y = bounds.y || 0;
  const width = bounds.width || 0;
  const height = bounds.height || 0;
  //坐标数据 赋值
  collaboratePopoverData.setSelectedObj({
    name: clickColumnName,
    target: currentTarget,
    flightId,
    x,
    y,
    width,
    height,
  });
};

const { getAlarmValueZh } = FlightCoordination;

const formatAlarmValue = (values) => {
  let arr = values.map((item) => {
    return getAlarmValueZh(item);
  });
  return arr;
};
//数据转换，将航班转化为表格格式
const formatSingleFlight = (flight) => {
  const alarmField = flight.alarmField || {};
  const taskField = flight.taskField || {};
  const eapField = flight.eapField || {};
  const oapField = flight.oapField || {};
  const tobtField = flight.tobtField || {};
  const cobtField = flight.cobtField || {};
  const ctotField = flight.ctotField || {};
  const fmeToday = flight.fmeToday || {};
  const ffixField = flight.ffixField || {};
  const ctoField = flight.ctoField || {};
  const etoField = flight.etoField || {};
  const runwayField = flight.runwayField || {};
  const positionField = flight.positionField || {};
  const agctField = flight.agctField || {};
  const aobtField = flight.aobtField || {};
  const asbtField = flight.asbtField || {};
  let atd = flight.atd || "";
  atd = atd === null ? "" : atd;
  const atotField = {
    value: atd,
    source: isValidVariable(atd) ? "DEP" : "",
  };

  let taskVal = taskField.value || "";
  if (!isValidVariable(taskVal) || taskVal === "普通") {
    taskVal = "";
  }
  let alarms = flight.alarms || [];

  let flightObj = {
    key: flight.id,
    id: flight.id,
    FLIGHTID: flight.flightid,
    ALARM: formatAlarmValue(alarms).map((item) => (
      <Tooltip key={item.key} title={item.descriptions}>
        <Tag
          className={`alarm-tag alarm_${item.key} alarm_pos_${item.pos} `}
          key={item.key}
          color={item.color}
        >
          {item.zh}
        </Tag>
      </Tooltip>
    )),
    TASK: taskVal,
    // TASK: PriorityList[flight.priority],
    EAW: eapField.name,
    // EAWT: eapField.value,
    EAWT: eapField,
    OAW: oapField.name,
    // OAWT: oapField.value,
    OAWT: oapField,
    ACTYPE: flight.aircrafttype,
    DEPAP: flight.depap,
    ARRAP: flight.arrap,
    SOBT: getDayTimeFromString(flight.sobt),
    SLOTSTATUS: flight.unSlotStatusReasonAbbr,
    EOBT: getDayTimeFromString(flight.eobt),
    // TOBT: tobtField.value,
    TOBT: tobtField,
    // COBT: cobtField.value,
    // CTOT: ctotField.value,
    COBT: cobtField,
    CTOT: ctotField,
    // AGCT: getDayTimeFromString(agctField.value),
    AOBT: aobtField || {},
    AGCT: agctField || {},
    ASBT: asbtField || {},
    ATOT: atotField,
    FETA: getDayTimeFromString(flight.formerArrtime),
    FFIX: ffixField.name,
    FFIXT: ffixField || {},
    // CTO: ctoField.value,
    CTO: ctoField,
    ETO: getTimeAndStatus(etoField.value),
    STATUS: flight.flightStatus,
    RWY: runwayField || {},
    POS: positionField || {},

    orgdata: JSON.stringify(flight),
  };
  return flightObj;
};

export {
  getColumns,
  formatSingleFlight,
  scrollTopById,
  highlightRowByDom,
  clearHighlightRowByDom,
};
