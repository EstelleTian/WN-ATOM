/*
 * @Author: liutianjiao
 * @Date: 2021-09-08 14:24:09
 * @LastEditors: liutianjiao
 * @LastEditTime: 2021-09-09 19:42:13
 * @Description:
 * @FilePath: \WN-ATOM\src\components\FlightTable\VirtualTableColumns.jsx
 */
/*
 * @Author: your name
 * @Date: 2020-12-15 10:52:07
 * @LastEditTime: 2021-09-08 14:11:27
 * @LastEditors: liutianjiao
 * @Description: 表格列配置、列数据转换、右键协调渲染
 * @FilePath: \WN-ATOM\src\components\FlightTable\TableColumns.jsx
 */
import React from "react";
import { Tag, Tooltip, Input } from "antd";
import {
  isValidObject,
  isValidVariable,
  getDayTimeFromString,
  getTimeAndStatus
} from "utils/basic-verify";
import { FlightCoordination, PriorityList } from "utils/flightcoordination.js";
import RenderCell from "./RenderCell";
import FmeToday from "utils/fmetoday";
import debounce from "lodash/debounce";

/**
 * 告警列单元格渲染格式化
 * */
const renderAlarmCellChildren = (opt) => {
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
const scrollTopById = (rowIndex, classStr, gridRef) => {
  if (isValidVariable(rowIndex)) {
    const flightCanvas = document.getElementsByClassName(classStr);
    const contentH = flightCanvas[0].clientHeight; //表格外框高度
    let mtop = rowIndex * 45;
    const halfH = Math.floor(contentH / 2);
    // console.log("目标定位航班是：",tr , trHeight, rowIndex, mtop);
    if (halfH < mtop) {
      const scrollTop = Math.floor(mtop - halfH);
      console.log("目标定位航班  滚动高度是：", scrollTop);
      flightCanvas[0].scrollTop = scrollTop;
    }

    // if (cellDom.length > 0) {
    //   rowIndex = cellDom[0].innerHTML; //当前航班所在行号
    //   console.log(rowIndex);
    //   //滚动到指定行
    //   gridRef.current.scrollToItem(rowIndex);
    // }
  }
};
//设置行高亮-传入目标dom
const highlightRowByDom = (id) => {
  const flightCanvas = document.getElementsByClassName("virtual-grid");
  if (flightCanvas.length > 0) {
    const trs = flightCanvas[0].getElementsByClassName(id);
    if (trs.length > 0) {
      clearHighlightRowByDom(trs);
      flightTableData.focusFlightId = "";
    }
  }
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

//表格列名称-中英-字典-默认/CRS
const CRSNames = {
  FLIGHTID: {
    en: "FLIGHTID",
    cn: "航班号"
  },
  ALARM: {
    en: "ALARM",
    cn: "告警列"
  },
  FFIX: {
    en: "FFIX",
    cn: "基准点"
  },
  FFIXT: {
    en: "FFIXT",
    cn: "基准点时间"
  },
  CTO: {
    en: "CTO",
    cn: "计算基准点"
  },
  ETO: {
    en: "ETO",
    cn: "预计基准点"
  },
  // COBT: {
  //   en: "COBT",
  //   cn: "计算预撤时间",
  // },
  CTOT: {
    en: "CTOT",
    cn: "计算起飞时间"
  },
  SLOT: {
    en: "SLOT",
    cn: "未分配时隙原因"
  },
  ATOT: {
    en: "ATOT",
    cn: "实际起飞时间"
  },
  DEPAP: {
    en: "DEPAP",
    cn: "起飞机场"
  },
  ARRAP: {
    en: "ARRAP",
    cn: "降落机场"
  },
  EOBT: {
    en: "EOBT",
    cn: "预计撤轮档时间"
  },
  TOBT: {
    en: "TOBT",
    cn: "目标撤轮档时间"
  },
  RCTOT: {
    en: "RCTOT",
    cn: "各地CDM计算起飞时间"
  },
  NCTOT: {
    en: "NCTOT",
    cn: "NTFM计算起飞"
  },
  ASBT: {
    en: "ASBT",
    cn: "上客时间"
  },

  AGCT: {
    en: "AGCT",
    cn: "关舱门时间"
  },
  AOBT: {
    en: "AOBT",
    cn: "推出时间"
  },
  STATUS: {
    en: "STATUS",
    cn: "航班状态"
  },
  FEAL: {
    en: "FEAL",
    cn: "前段降落时间"
  },
  EAW: {
    en: "EAW",
    cn: "入区域点"
  },
  EAWT: {
    en: "EAWT",
    cn: "进区域点时间"
  },
  OAW: {
    en: "OAW",
    cn: "出区域点"
  },
  OAWT: {
    en: "OAWT",
    cn: "出区域点时间"
  },
  SOBT: {
    en: "SOBT",
    cn: "计划撤轮档时间"
  },
  // POS: {
  //   en: "POS",
  //   cn: "停机位",
  // },
  // RWY: {
  //   en: "RWY",
  //   cn: "跑道",
  // },
  // TYPE: {
  //   en: "TYPE",
  //   cn: "机型",
  // },
  orgdata: {
    en: "orgdata",
    cn: "原数据"
  }
};
//表格列名称-中英-字典-分局CRS
const FENJUCRSNames = {
  FLIGHTID: {
    en: "FLIGHTID",
    cn: "航班号"
  },
  ALARM: {
    en: "ALARM",
    cn: "告警列"
  },
  OAW: {
    en: "OAW",
    cn: "出区域点"
  },
  OAWT: {
    en: "OAWT",
    cn: "出区域点时间"
  },
  FFIX: {
    en: "FFIX",
    cn: "基准点"
  },
  FFIXT: {
    en: "FFIXT",
    cn: "基准点时间"
  },
  CTO: {
    en: "CTO",
    cn: "计算基准点"
  },
  ETO: {
    en: "ETO",
    cn: "预计基准点"
  },
  CTOT: {
    en: "CTOT",
    cn: "计算起飞时间"
  },
  EAW: {
    en: "EAW",
    cn: "入区域点"
  },
  EAWT: {
    en: "EAWT",
    cn: "进区域点时间"
  },
  SLOT: {
    en: "SLOT",
    cn: "未分配时隙原因"
  },
  ATOT: {
    en: "ATOT",
    cn: "实际起飞时间"
  },
  DEPAP: {
    en: "DEPAP",
    cn: "起飞机场"
  },
  ARRAP: {
    en: "ARRAP",
    cn: "降落机场"
  },
  EOBT: {
    en: "EOBT",
    cn: "预计撤轮档时间"
  },
  TOBT: {
    en: "TOBT",
    cn: "目标撤轮档时间"
  },
  NCOBT: {
    en: "NCOBT",
    cn: "NTFM计算撤轮档"
  },
  NCTOT: {
    en: "NCTOT",
    cn: "NTFM计算起飞"
  },
  ASBT: {
    en: "ASBT",
    cn: "上客时间"
  },

  AGCT: {
    en: "AGCT",
    cn: "关舱门时间"
  },
  AOBT: {
    en: "AOBT",
    cn: "推出时间"
  },
  STATUS: {
    en: "STATUS",
    cn: "航班状态"
  },
  FEAL: {
    en: "FEAL",
    cn: "前段降落时间"
  },
  SOBT: {
    en: "SOBT",
    cn: "计划撤轮档时间"
  },
  POS: {
    en: "POS",
    cn: "停机位"
  },
  RWY: {
    en: "RWY",
    cn: "跑道"
  },
  orgdata: {
    en: "orgdata",
    cn: "原数据"
  }
};
//表格列名称-中英-字典-CDM
const CDMNames = {
  FLIGHTID: {
    en: "FLIGHTID",
    cn: "航班号",
    display: 1
  },
  ALARM: {
    en: "ALARM",
    cn: "告警列"
  },
  POS: {
    en: "POS",
    cn: "停机位"
  },
  DEPAP: {
    en: "DEPAP",
    cn: "起飞机场"
  },
  ARRAP: {
    en: "ARRAP",
    cn: "降落机场"
  },
  SOBT: {
    en: "SOBT",
    cn: "计划撤轮档时间"
  },
  EOBT: {
    en: "EOBT",
    cn: "预计撤轮档时间"
  },
  TOBT: {
    en: "TOBT",
    cn: "目标撤轮档时间"
  },
  COBT: {
    en: "COBT",
    cn: "计算预撤时间"
  },
  CTOT: {
    en: "CTOT",
    cn: "计算起飞时间"
  },
  SLOT: {
    en: "SLOT",
    cn: "未分配时隙原因"
  },
  STATUS: {
    en: "STATUS",
    cn: "状态"
  },
  // HOBT: {
  //   en: "HOBT",
  //   cn: "协调撤轮档时间",
  // },
  ASBT: {
    en: "ASBT",
    cn: "上客时间"
  },
  AGCT: {
    en: "AGCT",
    cn: "关舱门时间"
  },
  AOBT: {
    en: "AOBT",
    cn: "推出时间"
  },
  ATOT: {
    en: "ATOT",
    cn: "实际起飞时间"
  },
  RWY: {
    en: "RWY",
    cn: "跑道"
  },
  FFIX: {
    en: "FFIX",
    cn: "受控航路点"
  },
  FFIXT: {
    en: "FFIXT",
    cn: "受控过点时间"
  },
  ALDT: {
    en: "ALDT",
    cn: "实际降落时间"
  },
  REGN: {
    en: "REGN",
    cn: "注册号"
  },
  TYPE: {
    en: "TYPE",
    cn: "航班机型"
  },
  WAKE: {
    en: "WAKE",
    cn: "航班尾流类型"
  },
  CODE: {
    en: "CODE",
    cn: "航班ACODE"
  },
  EXOT: {
    en: "EXOT",
    cn: "预计出港滑行时间"
  },

  FORMER: {
    en: "FORMER",
    cn: "前段航班"
  },
  FEAT: {
    en: "FEAT",
    cn: "前段起飞时间"
  },
  FEAL: {
    en: "FEAL",
    cn: "前段降落时间"
  },
  FLIGT_STATUS: {
    en: "FLIGT_STATUS",
    cn: "航班状态"
  },
  CLOSE_WAIT: {
    en: "CLOSE_WAIT",
    cn: "关门等待"
  },
  TAXI_WAIT: {
    en: "TAXI_WAIT",
    cn: "滑行等待"
  },
  DELAY: {
    en: "DELAY",
    cn: "延误时间"
  },
  CONTROL: {
    en: "CONTROL",
    cn: "流控状态"
  },

  EFPS_SID: {
    en: "EFPS_SID",
    cn: "EFPS_SID"
  },
  EFPS_STATUS: {
    en: "EFPS_STATUS",
    cn: "EFPS_航班状态"
  },
  EFPS_RWY: {
    en: "EFPS_RWY",
    cn: "EFPS_上跑道时间"
  },
  EFPS_TAXI: {
    en: "EFPS_TAXI",
    cn: "EFPS_开始滑行时间"
  },
  EFPS_ASRT: {
    en: "EFPS_ASRT",
    cn: "EFPS_申请时间"
  },
  EFPS_ASAT: {
    en: "EFPS_ASAT",
    cn: "EFPS_推出时间"
  }
};

const CRSSortNames = ["FFIXT", "EOBT", "ID"];
const CDMSortNames = ["ATOT", "CTOT", "TOBT", "EOBT", "SOBT", "ID"];

//生成表配置
const getColumns = (
  displayColumnList,
  systemName,
  collaboratePopoverData,
  sortable = false,
  onCellFilter = () => {}
) => {
  if (!isValidVariable(systemName)) {
    console.log("sort systemName", systemName);
    return;
  }
  // console.log("systemName2", systemName);
  // displayColumnList 列配置数据中设置为显示的列
  let names = displayColumnList;
  let sortKey = "FLIGHTID";
  if (systemName === "CRS") {
    if (!isValidObject(names)) {
      names = CRSNames;
    }
    sortKey = "FFIXT";
  } else if (systemName === "CRS-REGION") {
    if (!isValidObject(names)) {
      names = FENJUCRSNames;
    }
    sortKey = "FFIXT";
  } else if (systemName === "CDM") {
    if (!isValidObject(names)) {
      names = CDMNames;
    }
    sortKey = "ATOT";
  } else {
    if (!isValidObject(names)) {
      names = CRSNames;
    }
    sortKey = "FFIXT";
  }
  if (names[sortKey] === undefined) {
    sortKey = Object.keys(names)[0] || "FLIGHTID";
  }
  console.log("sort ", sortKey, names);

  //获取屏幕宽度，适配 2k
  let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
  //表格列配置-默认-计数列
  let columns = [
    {
      title: "行号",
      dataIndex: "rowNum",
      align: "center",
      key: "rowNum",
      width: screenWidth > 1920 ? 70 : 70
      // fixed: "left"
    }
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
      width: screenWidth > 1920 ? 90 : 75,
      ellipsis: true,
      className: en,
      showSorterTooltip: false,
      onHeaderCell: (columns, index) => {
        //配置表头属性，增加title值
        return {
          title: cn,
          onClick: (event) => {}
        };
      }
    };

    //普通排序
    const sortFunc = (a, b) => {
      let data1 = "";
      let data2 = "";
      if (typeof a[en] === "string") {
        data1 = a[en] || "";
        data2 = b[en] || "";
      } else if (typeof a[en] === "object") {
        const f1 = a[en] || {};
        const f2 = b[en] || {};
        data1 = f1.value || "";
        data2 = f2.value || "";
      }
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
      } else if (isValidVariable(data1)) {
        return -1;
      } else if (isValidVariable(data2)) {
        return 1;
      }
      return 0;
    };
    //排序
    tem["sorter"] = sortFunc;

    //默认排序
    if (en === "EAW" || en === "OAW") {
      tem["width"] = screenWidth > 1920 ? 95 : 80;
    }
    if (en === "FFIX") {
      tem["width"] = screenWidth > 1920 ? 110 : 90;
    }
    if (en === "CTOT" || en === "CTO" || en === "COBT") {
      tem["width"] = screenWidth > 1920 ? 95 : 80;
    }
    if (en === "FFIXT") {
      tem["width"] = screenWidth > 1920 ? 95 : 80;
      //CRS按过点时间基准开始排序
      // console.log("FFIXT 11");

      // console.log("FFIXT 22");
      if (sortKey === en) {
        console.log("sort FFIXT", sortKey);
        tem["defaultSortOrder"] = "ascend";
      }
      let sortNames = CRSSortNames;
      //field对象类型排序，用value再排
      const sorFunc2 = (a, b, dir, sortNames, ind) => {
        const sortName = sortNames[ind];
        if (ind > sortNames.length - 1) {
          return 0;
        }
        let data1 = "";
        let data2 = "";
        if (typeof a[sortName] === "string") {
          data1 = a[sortName] || "";
          data2 = b[sortName] || "";
          if (data1.length >= 12) {
            data1 = data1.substring(0, 12);
          }
          if (data2.length >= 12) {
            data2 = data2.substring(0, 12);
          }
        } else if (typeof a[sortName] === "object") {
          const f1 = a[sortName] || {};
          const f2 = b[sortName] || {};
          let aorgdataStr = a["orgdata"] || "{}";
          let aorgdata = JSON.parse(aorgdataStr);
          let borgdataStr = b["orgdata"] || "{}";
          let borgdata = JSON.parse(borgdataStr);
          data1 = f1.value || "";
          data2 = f2.value || "";

          if (isValidVariable(data1)) {
            if (a.atomConfigValue * 1 === 300) {
              if (aorgdata.areaStatus === "OUTER" && f1.type === "N") {
                data1 = "B" + data1;
              } else {
                data1 = "A" + data1;
              }
            } else {
              if (
                aorgdata.areaStatus === "OUTER" &&
                (f1.type === "N" || f1.type === "R")
              ) {
                data1 = "B" + data1;
              } else {
                data1 = "A" + data1;
              }
            }
          }
          if (isValidVariable(data2)) {
            if (b.atomConfigValue * 1 === 300) {
              if (borgdata.areaStatus === "OUTER" && f2.type === "N") {
                data2 = "B" + data2;
              } else {
                data2 = "A" + data2;
              }
            } else {
              if (
                borgdata.areaStatus === "OUTER" &&
                (f2.type === "N" || f2.type === "R")
              ) {
                data2 = "B" + data2;
              } else {
                data2 = "A" + data2;
              }
            }
          }
        }
        // console.log(
        //   "a.atomConfigValue",
        //   a.atomConfigValue,
        //   "b.atomConfigValue",
        //   b.atomConfigValue,
        //   "data1",
        //   data1,
        //   "data2",
        //   data2
        // );
        if (isValidVariable(data1) && isValidVariable(data2)) {
          let res = data1.localeCompare(data2);
          if (0 !== res) {
            return res;
          }
        } else if (isValidVariable(data1)) {
          return -1;
        } else if (isValidVariable(data2)) {
          return 1;
        } else {
          return sorFunc2(a, b, dir, sortNames, ++ind);
        }
      };
      tem["sorter"] = (a, b, dir) => {
        // console.log("FFIXT排序", a, b, dir);
        // ascend 升序  descend 降序
        return sorFunc2(a, b, dir, sortNames, 0);
      };
    }
    if (en === "ATOT") {
      if (sortKey === en) {
        // console.log("sort ATOT", sortKey);
        //CDM按起飞时间基准开始排序
        tem["defaultSortOrder"] = "ascend";
      }

      let sortNames = CDMSortNames;
      //field对象类型排序，用value再排
      const sorFunc2 = (a, b, sortNames, ind) => {
        const sortName = sortNames[ind];
        let data1 = "";
        let data2 = "";
        if (typeof a[sortName] === "string") {
          data1 = a[sortName];
          data2 = b[sortName];
        } else if (typeof a[sortName] === "object") {
          const f1 = a[sortName] || {};
          const f2 = b[sortName] || {};
          data1 = f1.value || "";
          data2 = f2.value || "";
        }
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
          //  else {
          //   return sorFunc2(a, b, sortNames, ++ind);
          // }
        } else if (isValidVariable(data1)) {
          return -1;
        } else if (isValidVariable(data2)) {
          return 1;
        } else {
          if (sortNames.length >= ind + 1) {
            return sorFunc2(a, b, sortNames, ++ind);
          }
        }
      };
      tem["sorter"] = (a, b, dir) => {
        // console.log("ATOT排序",a, b, dir);
        return sorFunc2(a, b, sortNames, 0);
      };
    }
    if (en === "ALARM") {
      tem["width"] = screenWidth > 1920 ? 140 : 120;
    }

    if (en === "FLIGHTID") {
      if (sortKey === en) {
        console.log("sort FLIGHTID", sortKey);
        tem["defaultSortOrder"] = "ascend";
      }
      tem["width"] = screenWidth > 1920 ? 120 : 100;
      // tem["fixed"] = "left";
    }

    if (en === "STATUS") {
      tem["width"] = screenWidth > 1920 ? 100 : 80;
    }
    if (en === "NCOBT" || en === "NCTOT") {
      tem["width"] = screenWidth > 1920 ? 90 : 80;
    }
    if (en === "DEPAP" || en === "ARRAP") {
      tem["width"] = screenWidth > 1920 ? 95 : 82;
    }

    if (
      en === "FLIGT_STATUS" ||
      en === "CLOSE_WAIT" ||
      en === "EFPS_SID" ||
      en === "TAXI_WAIT" ||
      en === "EFPS_STATUS" ||
      en === "EFPS_RWY" ||
      en === "EFPS_TAXI" ||
      en === "EFPS_ASRT" ||
      en === "EFPS_ASAT"
    ) {
      tem["width"] = screenWidth > 1920 ? 130 : 120;
    }

    //隐藏列
    if (en === "orgdata") {
      tem["className"] = "notshow";
      tem["width"] = 0;
    }
    if (sortable) {
      const handleInputVal = debounce((values) => {
        onCellFilter(en, values);
      }, 500);
      const doubleTem = {
        title: (
          <Input
            className="uppercase w-90"
            onChange={(e) => handleInputVal(e.target.value)}
          />
        ),
        dataIndex: en,
        align: "center",
        children: [{ ...tem }]
      };
      columns.push(doubleTem);
    } else {
      columns.push(tem);
    }
  }
  return columns;
};

// 单元格右键回调事件
const handleRightClickCell = (
  event,
  record,
  columnName,
  collaboratePopoverData
) => {
  const currentTarget = event.currentTarget;
  let flightId = "";
  if (columnName === "FLIGHTID") {
    flightId = currentTarget.textContent;
  }
  if (!isValidVariable(record.FLIGHTID)) {
    return;
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
    name: columnName,
    target: currentTarget,
    flightId,
    x,
    y,
    width,
    height
  });
};

export {
  CDMNames,
  getColumns,
  scrollTopById,
  highlightRowByDom,
  clearHighlightRowByDom,
  handleRightClickCell
};
