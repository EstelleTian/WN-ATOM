import React, { useEffect, useState } from "react";
import { Graph, Shape, Node, Point } from "@antv/x6";
import { withRouter } from "react-router-dom";
import { isValidVariable } from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import "./GraphPage.scss";
// import './imgs/aaa'
// import isData from './indexs';

const GraphPage = (props) => {
  const [tacticInfos, setTacticInfos] = useState([]);
  const { match } = props;
  const params = match.params || {};
  const tacticId = params.tacticId || "";

  //获取方案血缘关系链数据
  const requestSchemeInfos = async () => {
    try {
      const res = await requestGet2({
        url: ReqUrls.schemeByIdIP + "/" + tacticId,
      });
      const { tacticInfos = [] } = res;
      setTacticInfos(tacticInfos);
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
    console.log(tacticInfos);
    if (tacticInfos.length > 0) {
      //TODO 处理数据
    }
    const graph = new Graph({
      container: document.getElementById("container"),
      width: 1400,
      height: 750,
      interacting: false,

      scroller: true,
    });
    function member(x, y, id, items) {
      return graph.addNode({
        shape: "html",
        id,
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
          } else if (titleDcb === "中") {
            color = "#03f43f";
          } else {
            color = "#f9dd25";
          }
          wrap.className = "wrapBox";
          wrap.style.width = "100%";
          wrap.style.height = "100%";
          wrap.style.borderRadius = "5px";
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
            items.state +
            `</span><span>` +
            items.titleTim +
            `</span></div>`;
          return wrap;
        },
      });
    }
    function memberS(x, y, id, items) {
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

    function memberD(x, y, id, items) {
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

    function memberN(x, y, id, items) {
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
    function link(source, target, vertices, is) {
      if (is) {
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
      }
    }
    function linkBox(source, target) {
      return graph.addEdge({
        source,
        target,
        attrs: {
          line: {
            connection: true,

            strokeWidth: 15,
            targetMarker: {
              size: 35,
              offset: 5,
              name: "block",
            },
            stroke: "#36a4da",
          },
          label: {
            textVerticalAnchor: "middle",
            textPath: { selector: "line", startOffset: "50%" },
            textAnchor: "middle",
            text: "2021/07/07 05:30",
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

    const aaa = {
      title:
        "过JIG,MOPMA,P421点 去安徽、湖北(除ZHSY、ZHXF)、江苏、ZSCN落地 17分钟一架",
      igada: "IGADA",
      state: "正在执行",
      titleNam: "MIT",
      titleTim: "07/0600 — 07/1800",
      titleDcb: "高",
      isTim: "10分钟",
    };
    const aaas = {
      titleNam: "MIT",
      titleTim: "07/0600 — 07/1800",
      isTim: "10分钟",
      text: "区域空中",
      igada: "IGADA",
    };

    const aaad = {
      titleNam: "MIT",
      titleTim: "07/0600 — 07/1800",
      isTim: "10分钟",
      igada: "IGADA",
      text: "AGVLV-IGADA",
    };

    const aaan = {
      titleNam: "MIT",
      titleTim: "07/0600 — 07/1800",
      isTim: "10分钟",
      igada: "IGADA",
      text: "EVYIL-IEADA",
    };
    const maggie0 = member(50, 100, "node0", aaa);
    const maggie0_1 = memberS(120, 250, "node0-1", aaas);
    const maggie0_2 = memberS(120, 360, "node0-2", aaas);
    const maggie0_3 = memberS(120, 470, "node0-3", aaad);
    const maggie0_4 = memberS(120, 580, "node0-4", aaan);
    link(
      maggie0,
      maggie0_1,
      [
        { x: 80, y: 200 },
        { x: 80, y: 460 },
        { x: 100, y: 460 },
        { x: 100, y: 290 },
      ],
      true
    );
    link(
      maggie0,
      maggie0_2,
      [
        { x: 80, y: 200 },
        { x: 80, y: 460 },
        { x: 100, y: 460 },
        { x: 100, y: 400 },
      ],
      true
    );
    link(
      maggie0,
      maggie0_3,
      [
        { x: 80, y: 200 },
        { x: 80, y: 460 },
        { x: 100, y: 460 },
        { x: 100, y: 510 },
      ],
      true
    );
    link(
      maggie0,
      maggie0_4,
      [
        { x: 80, y: 200 },
        { x: 80, y: 460 },
        { x: 100, y: 460 },
        { x: 100, y: 620 },
      ],
      true
    );

    const maggie1 = member(500, 100, "node1", aaa);
    const maggie1_1 = memberS(570, 250, "node1-1", aaas);
    const maggie1_2 = memberS(570, 360, "node1-2", aaas);
    const maggie1_3 = memberD(570, 470, "node1-3", aaad);
    const maggie1_4 = memberD(570, 580, "node1-4", aaan);
    link(
      maggie1,
      maggie1_1,
      [
        { x: 530, y: 200 },
        { x: 530, y: 460 },
        { x: 550, y: 460 },
        { x: 550, y: 290 },
      ],
      true
    );
    link(
      maggie1,
      maggie1_2,
      [
        { x: 530, y: 200 },
        { x: 530, y: 460 },
        { x: 550, y: 460 },
        { x: 550, y: 400 },
      ],
      true
    );
    link(
      maggie1,
      maggie1_3,
      [
        { x: 530, y: 200 },
        { x: 530, y: 460 },
        { x: 550, y: 460 },
        { x: 550, y: 510 },
      ],
      false
    );
    link(
      maggie1,
      maggie1_4,
      [
        { x: 530, y: 200 },
        { x: 530, y: 460 },
        { x: 550, y: 460 },
        { x: 550, y: 620 },
      ],
      false
    );

    const maggie2 = member(950, 100, "node2", aaa);
    const maggie2_1 = memberS(1020, 250, "node2-1", aaas);
    const maggie2_2 = memberS(1020, 360, "node2-2", aaas);
    const maggie2_3 = memberN(1020, 470, "node2-3", aaad);
    link(
      maggie2,
      maggie2_1,
      [
        { x: 980, y: 200 },
        { x: 980, y: 460 },
        { x: 1000, y: 460 },
        { x: 1000, y: 290 },
      ],
      true
    );
    link(
      maggie2,
      maggie2_2,
      [
        { x: 980, y: 200 },
        { x: 980, y: 460 },
        { x: 1000, y: 460 },
        { x: 1000, y: 400 },
      ],
      true
    );
    link(
      maggie2,
      maggie2_3,
      [
        { x: 980, y: 200 },
        { x: 980, y: 460 },
        { x: 1000, y: 460 },
        { x: 1000, y: 510 },
      ],
      true
    );
    linkBox({ x: 270, y: 150 }, { x: 460, y: 150 });
    linkBox({ x: 720, y: 150 }, { x: 910, y: 150 });
  }, [tacticInfos]);

  return (
    <>
      <div id="container"></div>
    </>
  );
};
export default withRouter(GraphPage);
