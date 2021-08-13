import React, { useEffect, useState, useRef } from "react";
import { Graph, Shape, Node, Point } from "@antv/x6";
import {
  isValidVariable,
  getDayTimeFromString,
  formatTimeString,
} from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import { NWGlobal } from "utils/global";
import _ from "lodash";
import { FlightCoordination } from "utils/flightcoordination";
import { index } from "@antv/x6/lib/util/dom/elem";
import "./GraphPage.scss";

//前后节点数据对比
const mergeNodeSon = (newNodeSon = [], oldNodeSon = []) => {
  let mergeSon = [];
  let oldNames = oldNodeSon.reduce((result, item) => {
    return result + item.flowControlName || "";
  }, "");

  newNodeSon.map((newItem, index) => {
    const newName = newItem.flowControlName || "";
    const res = _.findIndex(oldNodeSon, { flowControlName: newName });
    if (res !== -1) {
      newItem["from"] = "update";
    } else {
      newItem["from"] = "new";
    }
    mergeSon.push(newItem);
  });
  oldNodeSon.map((oldItem, index) => {
    let flag = false;
    const oldName = oldItem.flowControlName || "";
    const res = _.findIndex(newNodeSon, { flowControlName: oldName });
    if (res === -1) {
      oldItem["from"] = "delete";
      mergeSon.push(oldItem);
    }
  });
  return mergeSon;
};

//根据限制类型获取限制值
const getRestrictionValue = (flowControlMeasure, restrictionMode) => {
  if (!restrictionMode) {
    restrictionMode = flowControlMeasure.restrictionMode || "";
  }
  let value = "";
  if (restrictionMode === "MIT") {
    const restrictionMITValue = flowControlMeasure.restrictionMITValue || "";
    const restrictionMITValueUnit =
      flowControlMeasure.restrictionMITValueUnit || "";
    let unit = "";
    if (restrictionMITValueUnit === "T") {
      unit = "分钟";
    } else if (restrictionMITValueUnit === "D") {
      unit = "公里";
    }
    value = restrictionMITValue !== "" ? restrictionMITValue + unit : "";
  } else if (restrictionMode === "AFP") {
    const restrictionAFPValueSequence =
      flowControlMeasure.restrictionAFPValueSequence || "";
    value =
      restrictionAFPValueSequence !== ""
        ? restrictionAFPValueSequence + "架"
        : "";
  }
  return value;
};
//处理方案类节点数据
const handleBasicTacticNode = (
  basicTacticInfo = {},
  kpi = {},
  ntfmMitMap = {}
) => {
  const id = basicTacticInfo.id || "";
  const tacticName = basicTacticInfo.tacticName || "";
  const tacticStatus = basicTacticInfo.tacticStatus || "";
  const tacticTimeInfo = basicTacticInfo.tacticTimeInfo || {};
  const basicFlowcontrol = basicTacticInfo.basicFlowcontrol || {};
  const directionList = basicTacticInfo.directionList || [];
  const tacticSourceId = basicTacticInfo.tacticSourceId || "";
  const ntfmObj = ntfmMitMap[tacticSourceId]|| {};
  const startTime = tacticTimeInfo.startTime || "";
  const endTime = tacticTimeInfo.endTime || "";
  const updateTime = tacticTimeInfo.updateTime || "";
  const flowControlMeasure = basicFlowcontrol.flowControlMeasure || {};
  const dcb = kpi.impactDegree || "";
  let titleDcb = "";
  switch (dcb) {
    case "H":
      titleDcb = "高";
      break;
    case "M":
      titleDcb = "中";
      break;
    case "L":
      titleDcb = "低";
      break;
  }
  const restrictionMode = flowControlMeasure.restrictionMode || "";
  let targetUnit = "";
  if (directionList.length > 0) {
    const dirObj = directionList[0] || {};
    targetUnit = dirObj.targetUnit || "";
  }
  // 调用格式化时间方法 进行拼接
  const titleTim =
    getDayTimeFromString(startTime, "", 2) +
    " — " +
    getDayTimeFromString(endTime, "", 2);
  const restrictionValue = getRestrictionValue(
    flowControlMeasure,
    restrictionMode
  );
  let ntfmData = {};
  if (tacticSourceId !== "") {
    ntfmData = ntfmMitMap[tacticSourceId] || {};
  }
  // 定义主节点内容数
  let node = {
    id,
    title: tacticName,
    igada: targetUnit,
    perform: FlightCoordination.getSchemeStatusZh(tacticStatus),
    titleNam: restrictionMode,
    titleTim,
    titleDcb,
    isTim: restrictionValue,
    updateTime,
    children: [],
    ntfmData: ntfmData,
  };

  return node;
};
//处理方案下多个子流控节点数据
const handleFlowListNode = (flowcontrolList = []) => {
  let nodeList = [];
  flowcontrolList.map((flow, index) => {
    const {
      flowControlName = "",
      flowControlTimeInfo = {},
      flowControlMeasure = {},
      directionDoMain = {},
      from = "",
    } = flow;
    const { startTime = "", endTime = "" } = flowControlTimeInfo;
    // 调用格式化时间方法 进行拼接
    const titleTim =
      getDayTimeFromString(startTime, "", 2) +
      " — " +
      getDayTimeFromString(endTime, "", 2);
    const { restrictionMode = "" } = flowControlMeasure;
    const restrictionValue = getRestrictionValue(
      flowControlMeasure,
      restrictionMode
    );
    const targetUnit = directionDoMain.targetUnit || "";
    let node = {
      titleNam: restrictionMode,
      titleTim,
      isTim: restrictionValue,
      text: flowControlName,
      igada: targetUnit,
      dles: from === "new" ? true : false,
      news: from === "delete" ? true : false,
    };

    nodeList.push(node);
  });
  return nodeList;
};

//数据转换为图形数据
const convertDataToGraph = (tacticInfos, ntfmMitMap) => {
  let graphData = [];
  //判断数据是否为空
  if (tacticInfos.length > 0) {
    let num = 0;
    let xian1 = 0;
    tacticInfos.map((item, index) => {
      if (index > 0) {
        const cur = item.flowcontrolList || [];
        const prev = tacticInfos[index - 1].flowcontrolList || [];
        item.flowcontrolList = mergeNodeSon(cur, prev);
      }
    });

    tacticInfos.map((item, index) => {
      // 设置默认数据
      const basicTacticInfo = item.basicTacticInfo || {};
      const flowcontrolList = item.flowcontrolList || [];
      const kpi = item.kpi || {};

      //处理方案类节点数据
      const basicNode = handleBasicTacticNode(basicTacticInfo, kpi, ntfmMitMap);
      //处理方案下多个子流控节点数据
      const flowNodeList = handleFlowListNode(flowcontrolList);

      basicNode["children"] = flowNodeList;

      graphData.push(basicNode);
    });
  }
  return graphData;
};

const GraphPage = (props) => {
  // const [tacticId, setTacticId] = useState(
  //   "82548b66-7e11-418a-b381-f3893a56c243"
  // );
  const [tacticId, setTacticId] = useState("");
  const [tacticInfos, setTacticInfos] = useState([]);
  const [screenWidth, setScreenWidth] = useState(
    document.getElementsByTagName("body")[0].offsetWidth
  );
  const [screenHeight, setScreenHeight] = useState(
    document.getElementsByTagName("body")[0].offsetHeight
  );

  const graphRef = useRef("");
  NWGlobal.setGraphSchemeId = (id) => {
    setTacticId(id);
  };
  NWGlobal.setGraphSize = (width, height) => {
    setScreenWidth(width * 1);
    setScreenHeight(height * 1);
  };

  //获取方案血缘关系链数据
  const requestSchemeInfos = async () => {
    try {
      const res = await requestGet2({
        url: ReqUrls.schemeByIdIP + "/" + tacticId,
      });
      const { tacticInfos = [], ntfmMitMap = {} } = res;
      // let arr = [];
      // let len = tacticInfos.length;
      // for (let i = len; i > 0; i--) {
      //   const item = tacticInfos[i - 1];
      //   arr.push(item);
      // }
      // const graphData = convertDataToGraph(arr);
      const graphData = convertDataToGraph(tacticInfos, ntfmMitMap);
      setTacticInfos(graphData);
    } catch (e) {
      customNotice({
        type: "error",
        message: e,
      });
    }
  };

  useEffect(() => {
    if (isValidVariable(tacticId)) {
      requestSchemeInfos();
    }
  }, [tacticId]);

  // 创建主节点
  const member = (x, y, id, items, index, graph) => {
    return graph.addNode({
      shape: "html",
      id: id + index,
      x,
      y,
      width: 200,
      height: 100,
      html: () => {
        const wrap = document.createElement("div");
        let titleS = items.title.replace(/ /g, "&#32;");
        let color = "";
        if (items.titleDcb === "高") {
          color = "#e03838";
        } else if (items.titleDcb === "中") {
          color = "#03f43f";
        } else {
          color = "#f9dd25";
        }
        if (id === tacticId) {
          wrap.style.border = "3px solid #fff";
          wrap.style.boxShadow = "0 0 8px #fff inset";
        }
        wrap.className = "wrapBox";
        wrap.style.width = "100%";
        wrap.style.height = "100%";
        wrap.style.padding = "0.5rem 0.5rem";
        wrap.style.color = "#fff";
        wrap.innerHTML =
          `
            <font class='font' title='方案名称：` +
          titleS +
          `'><div class='title'>` +
          titleS +
          `</div></font> <div class='isTim'>  <span class='titleNam' title='限制类型'>` +
          items.titleNam +
          `</span><span title='限制值'>` +
          items.isTim +
          `</span> <span class='igada' title='基准单元：` +
          items.igada +
          `' >` +
          items.igada +
          `</span> <span class='titDcb' title='DCB' style='color:` +
          color +
          `'>` +
          items.titleDcb +
          `</span> </div> <div class='titleName'><span title='方案状态'  class='titState'>` +
          items.perform +
          `</span><span title='起止时间'>` +
          items.titleTim +
          `</span></div>`;
        return wrap;
      },
    });
  };

  // 创建子节点
  const memberS = (x, y, id, items, graph) => {
    return graph.addNode({
      shape: "html",
      id,
      x,
      y,
      width: 150,
      height: 90,
      html: () => {
        const wrap = document.createElement("div");
        if (items.dles) {
          wrap.className = "wrapDle";
          wrap.style.width = "100%";
          wrap.style.height = "100%";
          wrap.style.color = "#7d7b7b";
          wrap.innerHTML =
            `
      <div class='warpTop'>
      <div class='sonText' title='子流程名称：` +
            items.text +
            `'>` +
            items.text +
            `</div>
      </div>
      <div class='warpBottom'>
      <div class='isTim'><span class='titleNam'  title='限制类型'>` +
            items.titleNam +
            `</span><span title='限制值'>` +
            items.isTim +
            `</span><span class='igada' title='受控点：` +
            items.igada +
            `'>` +
            items.igada +
            `</span></div>
      <div class='titleName'  title='起止时间'>` +
            items.titleTim +
            `</div>
      </div>
      </div>
      `;
        } else if (items.news) {
          wrap.className = "neWrap";

          wrap.style.width = "100%";
          wrap.style.height = "100%";
          wrap.innerHTML =
            ` 
      <div class='warpTop'>
      <div class='wrapImg'></div>
      <div class='sonText'title='子流程名称：` +
            items.text +
            `'>` +
            items.text +
            `</div>
      <span class='new' ></span>
      </div>
      <div class='warpBottom'>
      <div class='isTim'><span class='titleNam' title='限制类型'>` +
            items.titleNam +
            `</span><span title='限制值'>` +
            items.isTim +
            `</span><span class='igada' title='受控点：` +
            items.igada +
            `'>` +
            items.igada +
            `</span></div>
      <div class='titleName' title='起止时间'>` +
            items.titleTim +
            `</div>
      </div>
      </div>
      `;
        } else {
          wrap.className = "wrap";
          wrap.style.width = "100%";
          wrap.style.height = "100%";
          wrap.innerHTML =
            `
          <div class='warpTop'>
          <div class='wrapImg'></div>
          <div class='sonText'title='子流程名称：` +
            items.text +
            `'>` +
            items.text +
            `</div>
          </div>
          <div class='warpBottom'>
          <div class='isTim'><span class='titleNam'  title='限制类型'>` +
            items.titleNam +
            `</span><span title='限制值'>` +
            items.isTim +
            `</span><span class='igada' title='受控点：` +
            items.igada +
            `'>` +
            items.igada +
            `</span></div>
          <div class='titleName' title='起止时间'>` +
            items.titleTim +
            `</div>
          </div>
          </div>`;
        }
        return wrap;
      },
    });
  };

  // 创建edge边
  const link = (source, target, vertices, is, graph) => {
    if (is.dle) {
      return graph.addEdge({
        vertices,
        source: { cell: source },
        target: { cell: target },
        connector: {
          name: "rounded",
        },
        attrs: {
          line: {
            fill: "none",
            strokeLinejoin: "round",
            strokeWidth: "2",
            sourceMarker: null,
            targetMarker: null,
            strokeDasharray: 5,
            stroke: "#ebecee",
            style: {
              animation: "ant-line 30s infinite linear",
            },
          },
        },
      });
    } else if (is.new) {
      return graph.addEdge({
        vertices,
        source: { cell: source },
        target: { cell: target },
        connector: {
          name: "rounded",
        },
        attrs: {
          line: {
            fill: "none",
            strokeLinejoin: "round",
            strokeWidth: "2",
            stroke: "#77ff00",
            sourceMarker: null,
            targetMarker: null,
          },
        },
      });
    } else {
      return graph.addEdge({
        vertices,
        source: { cell: source },
        target: { cell: target },
        connector: {
          name: "rounded",
        },
        attrs: {
          line: {
            fill: "none",
            strokeLinejoin: "round",
            strokeWidth: "2",
            stroke: "#03e9f4",
            sourceMarker: null,
            targetMarker: null,
          },
        },
      });
    }
  };
  // 创建edge箭头
  function linkBox(source, target, item, graph) {
    return graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          connection: true,

          strokeWidth: 19,
          targetMarker: {
            size: 38,
            offset: 5,
            name: "block",
          },
          stroke: "#36a4da",
        },
        label: {
          textVerticalAnchor: "middle",
          textPath: { selector: "line", startOffset: "50%" },
          textAnchor: "middle",
          text: item,
          fontSize: 13,
          fill: "#fff",
        },
      },
      markup: [
        {
          tagName: "path",
          selector: "line",
          attrs: {
            fill: "none",
            pointerEvents: "none",
          },
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
    });
  }

  useEffect(() => {
    // alert("useEffect " + tacticInfos.length);
    if (tacticInfos.length > 0) {
      if (graphRef.current !== "") {
        graphRef.current.dispose();
      }
      // 创建画布
      const option = {
        container: document.getElementById("container"),
        interacting: false,
        mousewheel: {
          enabled: true,
          modifiers: ["ctrl", "meta"],
        },
        scroller: {
          enabled: true,
          className: "scheme-scroll-bar",
          width: screenWidth,
          height: screenHeight,
          minVisibleWidth: screenWidth,
          minVisibleHeight: screenHeight,
        },
      };
      let graph = new Graph(option);
      graphRef.current = graph;
      let num = 0;
      let xian1 = 0;
      let xx = 0;
      tacticInfos.map((item, index) => {
        // 添加主节点
        const node01 = member(30 + num, 20, item.id, item, index, graph);
        if (index > 0) {
          const updateTime = formatTimeString(item.updateTime || "");

          linkBox(
            { x: 255 + xx, y: 55 },
            { x: 445 + xx, y: 55 },
            updateTime,
            graph
          );
          xx = xx + 450;
        }

        num = num + 450;
        let num2 = 160;
        let xian2 = 180;

        let xianBlo = {
          dle: false,
          new: false,
        };
        const children = item.children || [];
        // 添加子节点
        children.map((child, index) => {
          const node02 = memberS(80 + xian1, num2, child.title, child, graph);

          num2 = num2 + 110;
          xian2 = xian2 + 110;
          // 判断节点新增||删除，添加线
          if (child.from === "delete") {
            xianBlo.dle = true;
          } else if (child.from === "new") {
            xianBlo.new = true;
          }
          link(
            node01,
            node02,
            [
              { x: 30 + xian1, y: 140 },
              { x: 30 + xian1, y: 400 },
              { x: 50 + xian1, y: 400 },
              { x: 50 + xian1, y: xian2 - 85 },
            ],
            xianBlo,
            graph
          );
        });
        xian1 = xian1 + 450;
      });

      graph.scrollToPoint(0, 0);
    }
  }, [tacticInfos, screenWidth, screenHeight]);

  return (
    <>
      <div id="container"></div>
    </>
  );
};
export default GraphPage;
