import React, {
  Suspense,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Tabs, Table, Spin, Steps, Button } from "antd";
import { inject, observer } from "mobx-react";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import { requestGet, request } from "utils/request";
import { OptionBtn } from "components/Common/OptionBtn";
import {
  getFullTime,
  getDayTimeFromString,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
//根据key识别列表列配置columns
const names = {
  opt: {
    en: "opt",
    cn: "操作",
    width: 140,
  },
  sourceVal: {
    en: "sourceVal",
    cn: "交换方",
    width: 100,
  },
  targetVal: {
    en: "targetVal",
    cn: "被交换方",
    width: 100,
  },
  startUser: {
    en: "startUser",
    cn: "发起人",
    width: 105,
  },
  startTime: {
    en: "startTime",
    cn: "发起时间",
    width: 100,
  },
  handleStatus: {
    en: "handleStatus",
    cn: "状态",
    width: 100,
  },
  activityName: {
    en: "activityName",
    cn: "到达环节",
    width: 160,
  },
  endTime: {
    en: "endTime",
    cn: "更新时间",
    width: 160,
  },
  comments: {
    en: "comments",
    cn: "备注",
    width: 160,
  },
};
function ExchangeSlotTable({ systemPage, exchangeSlot, requestData }) {
  const tableTotalWidth = useRef();
  const user = systemPage.user || {};
  const userId = user.id || "";
  const loading = exchangeSlot.loading || "";
  const exchangeSlotColumns = useMemo(function () {
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
      }
      if (en === "startTime" || en === "endTime") {
        tem["render"] = (text, record, index) => {
          const timeTitle = formatTimeString(text);
          const time = formatTimeString(text, 2);
          return <div title={timeTitle}>{time}</div>;
        };
      }

      if (en === "handleStatus") {
        tem["render"] = (text, record, index) => {
          let statusCn = "";
          switch (text * 1) {
            case 100:
              statusCn = "进行中";
              break;
            case 200:
              statusCn = "已同意";
              break;
            case 300:
              statusCn = "已拒绝";
              break;
            case 400:
              statusCn = "已失效";
              break;
          }
          return (
            <div title={text} className={`status-${text}`}>
              {statusCn}
            </div>
          );
        };
      }

      if (en === "opt") {
        tem["fixed"] = "left";
        tem["render"] = (text, record, index) => {
          const { opt = "{}" } = record;
          const dataObj = JSON.parse(opt);
          // const targetFlight = dataObj.targetFlight || {};
          // const sourceFlight = dataObj.sourceFlight || {};
          const authorities = dataObj.authorities || {};
          const taskId = dataObj.taskId || "";
          const instanceId = dataObj.key || "";

          const { agree, confirm, refuse } = authorities;

          return (
            <div style={{ textAlign: "right" }}>
              <Button
                size="small"
                className="todo_opt_btn todo_agree c-btn-blue"
                onClick={(setLoad) => {
                  exchangeSlot.slotDetailId = instanceId;
                  exchangeSlot.slotDetailModalVisible = true;
                }}
              >
                详情
              </Button>

              {agree && (
                <OptionBtn
                  type="agree"
                  size="small"
                  text="同意"
                  callback={(setLoad) => {
                    sendResultRequest("agree", text, setLoad);
                  }}
                />
              )}
              {refuse && (
                <OptionBtn
                  type="refuse"
                  size="small"
                  text="拒绝"
                  callback={(setLoad) => {
                    sendResultRequest("refuse", text, setLoad);
                  }}
                />
              )}
            </div>
          );
        };
      }
      totalWidth += tem.width * 1;
      columns.push(tem);
    }
    tableTotalWidth.current = totalWidth;
    return columns;
  }, []);

  //请求错误处理
  const requestErr = useCallback((err, content) => {
    customNotice({
      type: "error",
      message: content,
    });
  }, []);

  //数据提交成功回调
  const requestSuccess = useCallback((data, content) => {
    //重新请求数据
    requestData(true, false);
    customNotice({
      type: "success",
      message: content,
      duration: 8,
    });
  });
  //处理 操作 同意/拒绝
  const sendResultRequest = (type, text = "", setLoad) => {
    if (!isValidVariable(userId)) {
      return;
    }
    const dataObj = JSON.parse(text);
    console.log(dataObj);
    // const targetFlight = dataObj.targetFlight || {};
    // const sourceFlight = dataObj.sourceFlight || {};
    const authorities = dataObj.authorities || {};
    const taskId = dataObj.taskId || "";
    const instanceId = dataObj.key || "";
    const exchangeId = dataObj.exchangeId || "";
    const flightId = dataObj.flightId || "";

    let params = {
      exchangeId,
      flightId,
      comment: "", //备注
      userId,
      taskId,
    };

    let url = "";
    let title = "";
    let typeCn = "时隙交换";
    if (type === "agree") {
      //同意
      url = ReqUrls.approveFlightExchangeSlotUrl;
      title = "同意" + typeCn;
    } else if (type === "refuse") {
      //拒绝
      url = ReqUrls.refuseFlightExchangeSlotUrl;
      title = "拒绝" + typeCn;
    }

    if (isValidVariable(url)) {
      const opt = {
        url,
        method: "POST",
        params: params,
        resFunc: (data) => {
          requestSuccess(data, title + "成功");
          setLoad(false);
        },
        errFunc: (err) => {
          if (isValidVariable(err)) {
            requestErr(err, err);
          } else {
            requestErr(err, title + "失败");
          }
          setLoad(false);
        },
      };
      request(opt);
    }
  };
  //设置表格行的 class
  const setRowClassName = useCallback((record, index) => {
    let id = record.instanceId || "";
    return id;
  }, []);

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
  useEffect(() => {
    if (
      (isValidVariable(exchangeSlot.focusFlightId) ||
        isValidVariable(exchangeSlot.focusSid)) &&
      exchangeSlot.slotList.length > 0
    ) {
      let taskId = exchangeSlot.focusSid || "";
      if (taskId === "") {
        taskId = exchangeSlot.getIdByFlightId();
      }

      //高亮航班
      const canvas = document.getElementsByClassName("flight_cord_slot_canvas");
      const tr = canvas[0].getElementsByClassName(taskId);
      if (tr.length > 0) {
        highlightRowByDom(tr[0]);
        exchangeSlot.focusSid = "";
        exchangeSlot.focusFlightId = "";
      }
    }
  }, [
    exchangeSlot.focusFlightId,
    exchangeSlot.focusSid,
    exchangeSlot.slotList,
  ]);
  return (
    <Suspense
      fallback={
        <div className="load_spin">
          <Spin tip="加载中..." />
        </div>
      }
    >
      <div className="advanced-search-base-input-filter flight_cord_slot_canvas">
        <Table
          columns={exchangeSlotColumns}
          dataSource={exchangeSlot.slotList}
          size="small"
          bordered
          rowClassName={setRowClassName}
          loading={loading}
          scroll={{
            x: tableTotalWidth,
            y: 600,
          }}
        />
        {exchangeSlot.slotList.length > 0 && (
          <div
            className="generateTime"
            style={{
              position: "absolute",
              border: "none",
              left: "40px",
              bottom: "40px",
            }}
          >
            数据时间: {formatTimeString(exchangeSlot.generateTime)}
          </div>
        )}
      </div>
    </Suspense>
  );
}
export default inject(
  "systemPage",
  "exchangeSlot"
)(observer(ExchangeSlotTable));
