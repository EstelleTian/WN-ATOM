import React, { useEffect, useState, useRef } from "react";
import { Graph, Shape, Node, Point } from "@antv/x6";
import { isValidVariable, getDayTimeFromString } from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import { NWGlobal } from "utils/global";
import { FlightCoordination } from "../../utils/flightcoordination";
import "./GraphPage.scss";
import { index } from "@antv/x6/lib/util/dom/elem";
// import './imgs/aaa'
// import isData from './indexs';

const mergeNodeSon = (newNodeSon, oldNodeSon) => {
  let mergeSon = [];
  let oldNames = oldNodeSon.reduce((result, item) => {
    return result + item.flowControlName || "";
  }, "");

  newNodeSon.map((newItem, index) => {
    const newName = newItem.flowControlName || "";
    let flag = false;
    oldNodeSon.map((oldItem, index) => {
      // if(flag) break;
      const oldName = oldItem.flowControlName || "";
      if (newName === oldName) {
        newItem["from"] = "update";
        mergeSon.push(newItem);
        flag = true;
      }
    });
    if (!flag) {
      newItem["from"] = "new";
      mergeSon.push(newItem);
    }
  });
  oldNodeSon.map((oldItem, index) => {
    let flag = false;
    const oldName = oldItem.flowControlName || "";
    newNodeSon.map((newItem, index) => {
      // if(flag) break;
      const newName = newItem.flowControlName || "";
      if (newName === oldName) {
        flag = true;
      }
    });
    if (!flag) {
      oldItem["from"] = "delete";
      mergeSon.push(oldItem);
    }
  });

  // console.log("mergeSon", mergeSon);
  return mergeSon;
};
//获取宽度
const GraphPage = (props) => {
  const [tacticId, setTacticId] = useState(
    "44c7e44b-b8a0-4e29-b65d-5c4b9e03d6a0"
  );
  // const [tacticId, setTacticId] = useState("");
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
      const { tacticInfos = [] } = res;
      let arr = [];
      let len = tacticInfos.length;
      for (let i = len; i > 0; i--) {
        const item = tacticInfos[i - 1];
        arr.push(item);
      }
      // console.log("arr", arr);656
      // alert(arr.length);
      setTacticInfos(arr);
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
          `</span> <span class='igada' title='基准单元：`+items.igada+`' >` +
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
      <div class='sonText' title='子流程名称'>` +
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
      <div class='sonText'title='子流程名称'>` +
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
          <div class='sonText'title='子流程名称'>` +
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
      // 判断数据是否为空
      if (tacticInfos.length > 0) {
        let num = 0;
        let xian1 = 0;
        tacticInfos.map((item, index) => {
          // 定义主节点内容数
          let nodeA = {
            id: "",
            title: "",
            igada: "",
            perform: "",
            titleNam: "",
            titleTim: "",
            titleDcb: "",
            isTim: "",
          };
          // 定义子节点内容
          let nodeS = {
            titleNam: "",
            titleTim: "",
            isTim: "",
            text: "",
            igada: "",
            dles: false,
            news: false,
          };
          // 设置默认数据
          let nodeBox = item.basicTacticInfo || {};
          let nodeSon = item.flowcontrolList || [];
          // 设置父节点内容
          nodeA.title = nodeBox.tacticName || "";
          nodeA.perform = FlightCoordination.getSchemeStatusZh(
            nodeBox.tacticStatus
          );
          nodeA.titleTim =
            // 调用格式化时间方法 进行拼接
            getDayTimeFromString(nodeBox.tacticTimeInfo.startTime, "", 2) +
            " — " +
            getDayTimeFromString(nodeBox.tacticTimeInfo.endTime, "", 2);
          const basicFlowcontrol = nodeBox.basicFlowcontrol || {};
          const flowControlMeasure = basicFlowcontrol.flowControlMeasure || {};
          nodeA.titleNam = flowControlMeasure.restrictionMode || "";
          nodeA.igada = nodeBox.directionList[0].targetUnit;
          let restrictionMITValue =
            flowControlMeasure.restrictionMITValue || "";
          if (restrictionMITValue === "") {
            nodeS.isTim = "";
          } else {
            nodeA.isTim = restrictionMITValue + "分钟";
          }
          nodeA.id = nodeBox.id;
          // DCB
          nodeA.titleDcb = "中";
          // 添加主节点
          const node01 = member(30 + num, 20, nodeA.id, nodeA, index, graph);

          num = num + 450;
          let num2 = 160;
          let xian2 = 180;

          let xianBlo = {
            dle: false,
            new: false,
          };
          if (index > 0) {
            let prevNodeSon = tacticInfos[index - 1].flowcontrolList;
            nodeSon = mergeNodeSon(nodeSon, prevNodeSon);
          }

          nodeSon.map((item, index) => {
            nodeS.text = item.flowControlName;
            nodeS.titleTim =
              getDayTimeFromString(item.flowControlTimeInfo.startTime, "", 2) +
              " — " +
              getDayTimeFromString(item.flowControlTimeInfo.endTime, "", 2);
            const restrictionMITValue =
              item.flowControlMeasure.restrictionMITValue || "";
            if (restrictionMITValue === "") {
              nodeS.isTim = "";
            } else {
              nodeS.isTim = restrictionMITValue + "分钟";
            }
            // 判断节点新增||删除，添加子节点
            if (item.from === "new") {
              nodeS.news = true;
            } else if (item.from === "delete") {
              nodeS.dles = true;
            }
            nodeS.titleNam = item.flowControlMeasure.restrictionMode;
            if (item.directionDoMain.targetUnit === null) {
              nodeS.igada = "";
            } else {
              nodeS.igada = item.directionDoMain.targetUnit
            }
            const node02 = memberS(80 + xian1, num2, nodeS.title, nodeS, graph);

            num2 = num2 + 110;
            xian2 = xian2 + 110;
            // 判断节点新增||删除，添加线
            if (item.from === "delete") {
              xianBlo.dle = true;
            } else if (item.from === "new") {
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
        // 判断数据是否为两条以上
        if (tacticInfos.length > 1) {
          let xx = 0;
          for (let i = 0; i < tacticInfos.length; i++) {
            if (tacticInfos[i + 1]) {
              let updateTime =
                tacticInfos[i + 1].basicTacticInfo.tacticTimeInfo.updateTime;
              updateTime =
                updateTime.slice(0, 4) +
                "/" +
                updateTime.slice(4, 6) +
                "/" +
                updateTime.slice(6, 8) +
                " " +
                updateTime.slice(8, 10) +
                ":" +
                updateTime.slice(10, 12);

              linkBox(
                { x: 255 + xx, y: 55 },
                { x: 445 + xx, y: 55 },
                updateTime,
                graph
              );
              xx = xx + 450;
            }
          }
        }
      }

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
