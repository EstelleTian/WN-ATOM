import React, { useEffect, useState, useRef } from "react";
import { Graph, Shape, Node, Point } from "@antv/x6";
import { Spin, Empty } from "antd";
import {
  isValidVariable,
  getDayTimeFromString,
  formatTimeString,
  isValidObject
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
    let nItem = Object.assign({}, newItem);
    if (res !== -1) {
      nItem["from"] = "update";
    } else {
      nItem["from"] = "new";
    }
    mergeSon.push(nItem);
  });
  oldNodeSon.map((oldItem, index) => {
    let flag = false;
    const oldName = oldItem.flowControlName || "";
    const res = _.findIndex(newNodeSon, { flowControlName: oldName });
    let nItem = Object.assign({}, oldItem);
    if (res === -1) {
      nItem["from"] = "delete";
      mergeSon.push(nItem);
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
const handleBasicTacticNode = (basicTacticInfo = {}, kpi = {}) => {
  const id = basicTacticInfo.id || "";
  const tacticName = basicTacticInfo.tacticName || "";
  const tacticStatus = basicTacticInfo.tacticStatus || "";
  const tacticTimeInfo = basicTacticInfo.tacticTimeInfo || {};
  const basicFlowcontrol = basicTacticInfo.basicFlowcontrol || {};
  const directionList = basicTacticInfo.directionList || [];

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

  // 定义主节点内容数
  let node = {
    id,
    title: tacticName,
    igada: targetUnit,
    perform: FlightCoordination.getSchemeStatusZh(tacticStatus),
    tacticStatus: tacticStatus,
    titleNam: restrictionMode,
    titleTim,
    titleDcb,
    isTim: restrictionValue,
    updateTime,
    children: [],
    ntfmData: {}
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
      from = ""
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
      dles: from === "delete" ? true : false,
      news: from === "new" ? true : false
    };

    nodeList.push(node);
  });
  return nodeList;
};

//数据转换为图形数据
const convertDataToGraph = (tacticInfos, ntfmTacticInfos, tacticId) => {
  let graphData = [];
  let activeTactic = {
    tacticName: ""
  };
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
      const basicNode = handleBasicTacticNode(basicTacticInfo, kpi);

      // const tacticSource = basicTacticInfo.tacticSource || "";
      // const tacticSourceId = basicTacticInfo.tacticSourceId || "";
      // if (tacticSource === "EVENT:NTFM" && tacticSourceId !== "") {
      //   const ntfmObj = ntfmTacticInfos[tacticSourceId] || {};
      //   const ntfmObjBasicTacticInfo = ntfmObj.basicTacticInfo || {};
      //   if (isValidObject(ntfmObjBasicTacticInfo)) {
      //     const ntfmData = handleBasicTacticNode(ntfmObjBasicTacticInfo, {});
      //     basicNode["ntfmData"] = ntfmData;
      //   }
      // }

      //处理方案下多个子流控节点数据
      const flowNodeList = handleFlowListNode(flowcontrolList);

      basicNode["children"] = flowNodeList;

      graphData.push(basicNode);

      const id = basicTacticInfo.id || "";
      if (isValidVariable(id) && isValidVariable(tacticId) && id === tacticId) {
        const tacticName = basicTacticInfo.tacticName || "";
        activeTactic.tacticName = tacticName;
      }
    });
  }
  return { graphData, activeTactic };
};

const GraphPage = (props) => {
  // const [tacticId, setTacticId] = useState(
  //   "9feac108-f977-442f-a4fd-8d618bf14ee8"
  // );
  const [loading, setLoading] = useState(false);
  const [tacticId, setTacticId] = useState("");
  const [activeTactic, setActiveTactic] = useState({ tacticName: "" });
  const [tacticInfos, setTacticInfos] = useState([]);
  const [screenWidth, setScreenWidth] = useState(877);
  const [screenHeight, setScreenHeight] = useState(1035);

  const graphRef = useRef("");
  NWGlobal.setGraphSchemeId = (id) => {
    // alert(id);
    setTacticId(id);
  };
  NWGlobal.setGraphSize = (width, height) => {
    // alert(width + "  " + height);
    setScreenWidth(width * 1);
    setScreenHeight(height * 1);
  };

  //获取方案血缘关系链数据
  const requestSchemeInfos = async () => {
    try {
      setLoading(true);
      const res = await requestGet2({
        url: ReqUrls.schemeByIdIP + "/" + tacticId
      });
      const { tacticInfos = [], ntfmTacticInfos = {} } = res;

      // let arr = [];
      // let len = tacticInfos.length;
      // for (let i = len; i > 0; i--) {
      //   const item = tacticInfos[i - 1];
      //   arr.push(item);
      // }
      // const graphData = convertDataToGraph(arr);
      const { graphData, activeTactic } = convertDataToGraph(
        tacticInfos,
        ntfmTacticInfos,
        tacticId
      );
      if (graphData.join("") === "") {
        if (graphRef.current !== "") {
          graphRef.current.dispose();
        }
      }
      setTacticInfos(graphData.reverse());
      setActiveTactic(activeTactic);
      setLoading(false);
    } catch (e) {
      customNotice({
        type: "error",
        message: e
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isValidVariable(tacticId)) {
      requestSchemeInfos();
    }
  }, [tacticId]);

  // 创建主节点
  const member = (x, y, id, items, index, graph, type) => {
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
        const imgClass = type === "ntfm" ? "ntfmImg" : "";
        let innerHTML = `<div class='warpTop'>`;
        if (imgClass !== "") {
          innerHTML += `<div class='` + imgClass + `'><span>N</span></div>`;
        }
        innerHTML +=
          `<div class='sonText'title='方案名称：` +
          titleS +
          `'>` +
          titleS +
          `</div>
      </div>
          
             <div class='isTim'>  <span class='titleNam' title='限制类型'>` +
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
          `</span> </div> <div class='titleName'><span title='方案状态'  class='titState ` +
          items.tacticStatus +
          `'>` +
          items.perform +
          `</span><span title='起止时间'>` +
          items.titleTim +
          `</span></div>`;
        wrap.innerHTML = innerHTML;
        return wrap;
      }
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
      }
    });
  };

  // 创建edge边
  const link = (source, target, vertices = {}, is, graph) => {
    if (is.dle) {
      return graph.addEdge({
        vertices,
        source: { cell: source },
        target: { cell: target },
        connector: {
          name: "rounded"
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
              animation: "ant-line 30s infinite linear"
            }
          }
        }
      });
    } else if (is.new) {
      return graph.addEdge({
        vertices,
        source: { cell: source },
        target: { cell: target },
        connector: {
          name: "rounded"
        },
        attrs: {
          line: {
            fill: "none",
            strokeLinejoin: "round",
            strokeWidth: "2",
            stroke: "#77ff00",
            sourceMarker: null,
            targetMarker: null
          }
        }
      });
    } else {
      return graph.addEdge({
        vertices,
        source: { cell: source },
        target: { cell: target },
        connector: {
          name: "rounded"
        },
        attrs: {
          line: {
            fill: "none",
            strokeLinejoin: "round",
            strokeWidth: "2",
            stroke: "#03e9f4",
            sourceMarker: null,
            targetMarker: null
          }
        }
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
          sourceMarker: {
            size: 38,
            offset: -10,
            name: "block"
          },
          targetMarker:{

          },
          stroke: "#36a4da"
        },
        label: {
          textVerticalAnchor: "middle",
          textPath: { selector: "line", startOffset: "50%" },
          textAnchor: "middle",
          text: item,
          fontSize: 13,
          fill: "#fff"
        }
      },
      markup: [
        {
          tagName: "path",
          selector: "line",
          attrs: {
            fill: "none",
            pointerEvents: "none"
          }
        },
        {
          tagName: "text",
          selector: "label"
        }
      ]
    });
  }

  useEffect(() => {
    // alert("useEffect " + tacticInfos.length);
    if (tacticInfos.length > 0) {
      console.log(tacticInfos);
      if (graphRef.current !== "") {
        graphRef.current.dispose();
      }
      // 创建画布
      const option = {
        container: document.getElementById("container"),
        interacting: false,
        mousewheel: {
          enabled: true,
          modifiers: ["ctrl", "meta"]
        },
        scroller: {
          enabled: true,
          className: "scheme-scroll-bar",
          width: screenWidth,
          height: screenHeight,
          minVisibleWidth: screenWidth,
          minVisibleHeight: screenHeight
        }
      };
      let graph = new Graph(option);
      graphRef.current = graph;
      let num = 0;
      let xian1 = 0;
      let xx = 0;

      let baseWidth = 450;
      tacticInfos.map((item, index) => {
        let usedHeight = 0;
        //添加NTFM节点
        const ntfmData = item.ntfmData || {};
        let ntfmNode;
        const baseX = baseWidth * index;
        if (isValidObject(ntfmData)) {
          ntfmNode = member(
            baseX,
            0,
            ntfmData.id,
            ntfmData,
            index,
            graph,
            "ntfm"
          );
          usedHeight = 100;
        }
        // 添加方案节点
        const tacticNodeX = 30 + baseX;
        let tacticNodeY = 20 + usedHeight;
        const tacticNode = member(
          tacticNodeX,
          tacticNodeY,
          item.id,
          item,
          index,
          graph,
          ""
        );

        if (isValidObject(ntfmData)) {
          link(
            ntfmNode,
            tacticNode,
            [
              { x: baseX + 10, y: 100 },
              { x: baseX + 10, y: tacticNodeY + 50 },
              { x: tacticNodeX, y: tacticNodeY + 50 }
            ],
            {},
            graph
          );
        }

        if (index > 0) {
          const updateTime = formatTimeString(item.updateTime || "");
          //方案间箭头
          linkBox(
            { x: tacticNodeX - baseWidth + 220, y: tacticNodeY + 50 },
            { x: tacticNodeX - baseWidth + 420, y: tacticNodeY + 50 },
            updateTime,
            graph
          );
        }
        usedHeight += 120;
        // tacticNodeY = 120 + usedHeight;

        const children = item.children || [];
        const childX = 140 + baseX;
        const childLen = children.length || 0;
        // 添加子节点
        children.map((child, index) => {
          const childY = usedHeight + 20 + index * 100;
          const flowNode = memberS(childX, childY, child.title, child, graph);

          // 判断节点新增||删除，添加线
          const lineStyle = {
            dle: child.from === "delete",
            new: child.from === "new"
          };
          const childBaseX = tacticNodeX;
          const childBaseY = 120 + usedHeight;
          link(
            tacticNode,
            flowNode,
            [
              { x: childBaseX + 20, y: tacticNodeY + 100 },
              { x: childBaseX + 20, y: childBaseY + (childLen * 50) / 2 },
              { x: childBaseX + 50, y: childBaseY + (childLen * 50) / 2 },
              { x: childX - 20, y: childY + 50 }
            ],
            lineStyle,
            graph
          );
        });
      });

      graph.scrollToPoint(0, 0);
    }
  }, [tacticInfos, screenWidth, screenHeight]);

  useEffect(() => {
    const bar = document.getElementsByClassName("scheme-scroll-bar");
    if (bar.length > 0) {
      const barDom = bar[0];
      const content = barDom.getElementsByClassName(
        "x6-graph-scroller-content"
      );
      const cont = content[0];
      const cHeight = cont.offsetHeight;
      const cWidth = cont.offsetWidth;
      barDom.style = "width:" + cWidth + "px;" + "height:" + cHeight + "px;";
      console.log(cHeight, cWidth);
    }
  }, [tacticInfos, screenWidth, screenHeight]);
  return (
    <div className="graph_container">
      
      <Spin spinning={loading}>
        <div
          className={`tacticName ${
            isValidVariable(activeTactic.tacticName) ? "show" : "hiden"
          }`}
          title={activeTactic.tacticName}
        >
          {activeTactic.tacticName}
        </div>
        <div id="container">
          <div className='notYet'>
            <div className='notYetBox'>
            {/* <i className='iconfont icon-wj-czwj notYetI' ></i> */}
            <img src={require('./notYet.png')}  className='notYetI' alt="" />
            <div>暂未选中</div>
            </div>
          </div>
        </div>
        <div
          className={`empty_canvas ${
            isValidVariable(activeTactic.tacticName) ? "hiden" : "show"
          }`}
        >
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      </Spin>
    </div>
  );
};
export default GraphPage;
