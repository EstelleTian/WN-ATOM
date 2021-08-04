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
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
const GraphPage = (props) => {
  // const [tacticId, setTacticId] = useState(
  //   "2fae74a8-308d-4be4-b899-e9044463114d"
  // );
  const [tacticId, setTacticId] = useState("");
  const [tacticInfos, setTacticInfos] = useState([]);

  const graphRef = useRef("");
  NWGlobal.setGraphSchemeId = (id) => {
    setTacticId(id);
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
      // console.log("arr", arr);
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

  useEffect(() => {
    // alert("useEffect " + tacticInfos.length);
    if (tacticInfos.length > 0) {
      if (graphRef.current !== "") {
        graphRef.current.dispose();
      }

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
          height: 477,
          minVisibleWidth: screenWidth,
          minVisibleHeight: 477,
        },
      };
      let graph = new Graph(option);
      graphRef.current = graph;
      function member(x, y, id, items, index) {
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
                  <font class='font' title=` +
              titleS +
              `><div class='title'>` +
              titleS +
              `</div></font> <div class='isTim'>  <span class='titleNam'>` +
              items.titleNam +
              `</span><span>` +
              items.isTim +
              `</span> <span class='igada'>` +
              items.igada +
              `</span> <span class='titDcb' style='color:` +
              color +
              `'>` +
              items.titleDcb +
              `</span> </div> <div class='titleName'><span  class='titState'>` +
              items.perform +
              `</span><span>` +
              items.titleTim +
              `</span></div>`;
            return wrap;
          },
        });
      }
      function memberS(x, y, id, items) {
        if (items.dles) {
          return graph.addNode({
            shape: "html",
            id,
            x,
            y,
            width: 150,
            height: 90,
            html: () => {
              const wrap = document.createElement("div");

              wrap.className = "wrapDle";
              wrap.style.width = "100%";
              wrap.style.height = "100%";
              wrap.style.color = "#7d7b7b";
              wrap.innerHTML =
                `
            <div class='warpTop'>
            <div class='sonText'>` +
                items.text +
                `</div>
            </div>
            <div class='warpBottom'>
            <div class='isTim'><span class='titleNam'>` +
                items.titleNam +
                `</span><span>` +
                items.isTim +
                `</span><span class='igada'>` +
                items.igada +
                `</span></div>
            <div class='titleName'>` +
                items.titleTim +
                `</div>
            </div>
            </div>
        `;
              return wrap;
            },
          });
        }
        if (items.news) {
          return graph.addNode({
            shape: "html",
            id,
            x,
            y,
            width: 150,
            height: 90,
            html: () => {
              const wrap = document.createElement("div");
              wrap.className = "neWrap";

              wrap.style.width = "100%";
              wrap.style.height = "100%";
              wrap.innerHTML =
                ` 
            <div class='warpTop'>
            <div class='wrapImg'></div>
            <div class='sonText'>` +
                items.text +
                `</div>
            <span class='new' ></span>
            </div>
            <div class='warpBottom'>
            <div class='isTim'><span class='titleNam'>` +
                items.titleNam +
                `</span><span>` +
                items.isTim +
                `</span><span class='igada'>` +
                items.igada +
                `</span></div>
            <div class='titleName'>` +
                items.titleTim +
                `</div>
            </div>
            </div>
            `;
              return wrap;
            },
          });
        }
        return graph.addNode({
          shape: "html",
          id,
          x,
          y,
          width: 150,
          height: 90,
          html: () => {
            const wrap = document.createElement("div");

            wrap.className = "wrap";
            wrap.style.width = "100%";
            wrap.style.height = "100%";
            wrap.innerHTML =
              `
            <div class='warpTop'>
            <div class='wrapImg'></div>
            <div class='sonText'>` +
              items.text +
              `</div>
            </div>
            <div class='warpBottom'>
            <div class='isTim'><span class='titleNam'>` +
              items.titleNam +
              `</span><span>` +
              items.isTim +
              `</span><span class='igada'>` +
              items.igada +
              `</span></div>
            <div class='titleName'>` +
              items.titleTim +
              `</div>
            </div>
            </div>                
        `;
            return wrap;
          },
        });
      }

      function link(source, target, vertices, is) {
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
      }
      function linkBox(source, target, item) {
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

      if (tacticInfos.length > 0) {
        let num = 0;
        let xian1 = 0;
        tacticInfos.map((item, index) => {
          let a = {
            id: "",
            title: "",
            igada: "",
            perform: "",
            titleNam: "",
            titleTim: "",
            titleDcb: "",
            isTim: "",
          };
          let aaas = {
            titleNam: "",
            titleTim: "",
            isTim: "",
            text: "",
            igada: "",
            dles: false,
            news: false,
          };
          let nodeBox = item.basicTacticInfo || {};
          let nodeSon = item.flowcontrolList || [];
          a.title = nodeBox.tacticName || "";
          a.perform = FlightCoordination.getSchemeStatusZh(
            nodeBox.tacticStatus
          );
          a.titleTim =
            getDayTimeFromString(nodeBox.tacticTimeInfo.startTime, "", 2) +
            " — " +
            getDayTimeFromString(nodeBox.tacticTimeInfo.endTime, "", 2);
          const basicFlowcontrol = nodeBox.basicFlowcontrol || {};
          const flowControlMeasure = basicFlowcontrol.flowControlMeasure || {};
          a.titleNam = flowControlMeasure.restrictionMode || "";
          let arrIgada = [];
          nodeBox.directionList.map((item, index) => {
            arrIgada.push(item.targetUnit);
          });
          a.igada = arrIgada.join(";");
          let restrictionMITValue =
            flowControlMeasure.restrictionMITValue || "";
          if (restrictionMITValue === "") {
            aaas.isTim = "";
          } else {
            if (restrictionMITValue <= "60") {
              a.isTim = restrictionMITValue + "分钟";
            } else {
              function isNodeTime(str) {
                return (
                  (Math.floor(str / 60).toString().length < 2
                    ? "0" + Math.floor(str / 60).toString()
                    : Math.floor(str / 60).toString()) +
                  "小时" +
                  ((str % 60).toString().length < 2
                    ? "0" + (str % 60).toString()
                    : (str % 60).toString()) +
                  "分钟"
                );
              }
              a.isTim = isNodeTime(restrictionMITValue);
            }
          }
          a.id = nodeBox.id;
          a.titleDcb = "中";
          const node01 = member(30 + num, 20, a.id, a, index);
          num = num + 450;
          let num2 = 160;
          let xian2 = 180;
          let xianBlo = {
            dle: false,
            new: false,
          };
          // console.log(nodeSon);
          if (index > 0) {
            let prevNodeSon = tacticInfos[index - 1].flowcontrolList;
            nodeSon = mergeNodeSon(nodeSon, prevNodeSon);
          }

          nodeSon.map((item, index) => {
            let aaas = {
              titleNam: "",
              titleTim: "",
              isTim: "",
              text: "",
              igada: "",
              dles: false,
              news: false,
            };
            aaas.text = item.flowControlName;
            aaas.titleTim =
              getDayTimeFromString(item.flowControlTimeInfo.startTime, "", 2) +
              " — " +
              getDayTimeFromString(item.flowControlTimeInfo.endTime, "", 2);
            const restrictionMITValue =
              item.flowControlMeasure.restrictionMITValue || "";
            if (restrictionMITValue === "") {
              aaas.isTim = "";
            } else {
              if (restrictionMITValue <= "60") {
                aaas.isTim = restrictionMITValue + "分钟";
              } else {
                function isNodeTime(str) {
                  return (
                    (Math.floor(str / 60).toString().length < 2
                      ? "0" + Math.floor(str / 60).toString()
                      : Math.floor(str / 60).toString()) +
                    "小时" +
                    ((str % 60).toString().length < 2
                      ? "0" + (str % 60).toString()
                      : (str % 60).toString()) +
                    "分钟"
                  );
                }
                aaas.isTim = isNodeTime(restrictionMITValue);
              }
            }
            if (item.from === "new") {
              aaas.news = true;
            } else if (item.from === "delete") {
              aaas.dles = true;
            }
            aaas.titleNam = item.flowControlMeasure.restrictionMode;
            if (item.flowControlTargetUnit === null) {
              aaas.igada = "";
            } else {
              aaas.igada = item.flowControlTargetUnit;
            }
            const node02 = memberS(80 + xian1, num2, aaas.title, aaas);
            num2 = num2 + 110;
            xian2 = xian2 + 110;
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
              xianBlo
            );
          });
          xian1 = xian1 + 450;
        });

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
                updateTime
              );
              xx = xx + 450;
            }
          }
        }
      }
    }
  }, [tacticInfos]);

  return (
    <>
      <div id="container"></div>
    </>
  );
};
export default GraphPage;
