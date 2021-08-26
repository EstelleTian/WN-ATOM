/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-26 16:08:04
 * @LastEditors: Please set LastEditors
 * @Description: 禁航信息列表
 * @FilePath: \WN-ATOM\src\components\NavBar\PositionModal.jsx
 */
import React, {
  Fragment,
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import { Badge, Modal, Table, Button } from "antd";
import { inject, observer } from "mobx-react";
import {
  getFullTime,
  getDayTimeFromString,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
import { requestGet2, request2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import DraggableModal from "components/DraggableModal/DraggableModal";
import ProhibitedForm from "./ProhibitedForm";
import { OptionBtn } from "components/Common/OptionBtn";
import "./ProhibitedModal.scss";

const names = {
  opt: {
    en: "opt",
    cn: "操作",
    width: 140,
  },
  unit: {
    en: "unit",
    cn: "禁航单位",
    width: 80,
  },
  unitType: {
    en: "unitType",
    cn: "禁航单位类型",
    width: 80,
  },
  startTime: {
    en: "startTime",
    cn: "开始时间",
    width: 70,
  },
  endTime: {
    en: "endTime",
    cn: "结束时间",
    width: 70,
  },
  updateTime: {
    en: "updateTime",
    cn: "修改时间",
    width: 70,
  },
  status: {
    en: "status",
    cn: "状态",
    width: 70,
  },
  source: {
    en: "source",
    cn: "数据来源",
    width: 70,
  },
};

const ProhibitedModal = (props) => {
  const timerId = useRef();
  const tableTotalWidth = useRef();
  const { prohibitedData, systemPage } = props;
  // 用户信息
  const user = systemPage.user || {};
  let userId = user.id || "";

  const hideModal = () => {
    prohibitedData.setProhibitedListModalVisible(false);
  };

  const showUpdateInfoModal = (data, type) => {
    if (!prohibitedData.updateInfoModalVisible) {
      prohibitedData.setUpdateInfoModalVisible(true);
    }
    prohibitedData.setFormData(data, type);
  };

  const handleOptBtn = async (type, data, setLoad) => {
    let params = {
      ...data,
      status: type,
      userId,
    };
    let statusCn = "";
    switch (type * 1) {
      case 1:
        statusCn = "启用";
        break;
      case 2:
        statusCn = "终止";
        break;
      case 3:
        statusCn = "忽略";
        break;
    }
    try {
      const res = await request2({
        url: ReqUrls.updateNoTamDataUrl,
        params: [params],
      });
      // setLoad(false);
      //刷新列表
      prohibitedData.setForceUpdate(true);
    } catch (e) {
      setLoad(false);
      customNotice({
        type: "error",
        content: statusCn + "禁航信息失败:" + e,
      });
    }
  };

  const prohibitedColumns = useMemo(function () {
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
      if (en === "startTime" || en === "endTime" || en === "updateTime") {
        tem["render"] = (text, record, index) => {
          const timeTitle = formatTimeString(text);
          const time = formatTimeString(text, 2);
          return <div title={timeTitle}>{time}</div>;
        };
      }
      if (en === "status") {
        tem["render"] = (text, record, index) => {
          let statusCn = "";
          switch (text * 1) {
            case 0:
              statusCn = "未生效";
              break;
            case 1:
              statusCn = "生效中";
              break;
            case 2:
              statusCn = "已终止";
              break;
            case 3:
              statusCn = "已忽略";
              break;
          }
          return (
            <div title={text} className={`status-${text}`}>
              {statusCn}
            </div>
          );
        };
      }
      if (en === "source") {
        tem["render"] = (text, record, index) => {
          let statusCn = "";
          switch (text * 1) {
            case 2:
              statusCn = "系统引接";
              break;
            case 1:
              statusCn = "人工录入";
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
          let status = dataObj.status * 1;

          return (
            <div style={{ textAlign: "right" }}>
              {status === 0 && (
                // <Button
                //   size="small"
                //   className="todo_opt_btn "
                //   onClick={() => {
                //     handleOptBtn(3, dataObj);
                //   }}
                // >
                //   忽略
                // </Button>
                <OptionBtn
                  type="ignore"
                  size="small"
                  text="忽略"
                  callback={(setLoad) => {
                    handleOptBtn(3, dataObj, setLoad);
                  }}
                />
              )}
              {(status === 0 || status === 3) && (
                // <Button
                //   size="small"
                //   className="todo_opt_btn  c-btn-blue"
                //   onClick={() => {
                //     handleOptBtn(1, dataObj);
                //   }}
                // >
                //   启用
                // </Button>
                <OptionBtn
                  type="agree"
                  size="small"
                  text="启用"
                  callback={(setLoad) => {
                    handleOptBtn(1, dataObj, setLoad);
                  }}
                />
              )}

              {status === 1 && (
                // <Button
                //   size="small"
                //   className="todo_opt_btn  c-btn-red"
                //   onClick={() => {
                //     handleOptBtn(2, dataObj);
                //   }}
                // >
                //   终止
                // </Button>
                <OptionBtn
                  type="refuse"
                  size="small"
                  text="终止"
                  callback={(setLoad) => {
                    handleOptBtn(2, dataObj, setLoad);
                  }}
                />
              )}
              {(status === 0 || status === 1 || status === 3) && (
                <Button
                  size="small"
                  className="todo_opt_btn c-btn-green"
                  onClick={() => {
                    showUpdateInfoModal(dataObj, "update");
                  }}
                >
                  修改
                </Button>
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
  //获取禁航信息列表请求
  const requestData = useCallback(
    async (triggerLoading, nextRefresh = false) => {
      const timerFunc = () => {
        if (nextRefresh) {
          if (isValidVariable(timerId.current)) {
            clearTimeout(timerId.current);
            timerId.current = "";
          }
          timerId.current = setTimeout(() => {
            requestData(false, nextRefresh);
          }, 60 * 1000);
        }
      };
      if (prohibitedData.forceUpdate) {
        prohibitedData.setForceUpdate(false);
      }

      let url = ReqUrls.findNoTamByUnitTypeUrl;

      try {
        let params = {};
        const res = await requestGet2({ url, params });

        // console.log(res.data);
        //更新详情
        handleData(res);
        timerFunc();
      } catch (e) {
        let msg = "禁航信息列表详情数据获取失败";
        if (isValidVariable(e)) {
          let msg = e;
        }
        customNotice({
          type: "error",
          message: msg,
        });
        timerFunc();
      }
    },
    []
  );

  //请求错误处理
  const requestErr = useCallback((err, content) => {
    customNotice({
      type: "error",
      message: content,
    });
  }, []);

  //处理 禁航信息列表 数据
  const handleData = useCallback((res) => {
    let tableData = [];
    const list = res.data || [];
    const generateTime = res.generateTime || "";
    for (let key in list) {
      const item = list[key] || {};

      const id = item.id || "";
      const notamId = item.notamId || "";
      //禁航单位
      const unit = item.unit || "";
      const unitType = item.unitType || "";

      //发起时间
      const startTime = item.startTime || "";
      const endTime = item.endTime || "";
      //更新时间
      const updateTime = item.updateTime || "";
      const status = item.status || "";
      const source = item.source || "";

      let obj = {
        key: id,
        notamId,
        opt: JSON.stringify(item),
        unit,
        unitType,
        startTime,
        endTime,
        updateTime,
        status,
        source,
      };
      tableData.push(obj);
    }

    prohibitedData.updateProhibitedListData(tableData, generateTime);
  }, []);

  useEffect(() => {
    if (prohibitedData.prohibitedListModalVisible) {
      requestData(true, true);
    }
    return () => {
      clearTimeout(timerId.current);
      timerId.current = null;
    };
  }, [prohibitedData.prohibitedListModalVisible]);

  useEffect(() => {
    if (prohibitedData.prohibitedListModalVisible) {
      requestData(true, false);
    }
  }, [prohibitedData.forceUpdate]);

  return (
    <DraggableModal
      title="禁航信息列表"
      style={{ top: "110px", right: "20px", float: "right" }}
      visible={prohibitedData.prohibitedListModalVisible}
      handleOk={() => {}}
      handleCancel={hideModal}
      width={1000}
      maskClosable={false}
      mask={false}
      // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
      destroyOnClose={true}
      footer={""}
    >
      <div className="prohibited_canvas">
        <div className="prohibited_table">
          <Table
            columns={prohibitedColumns}
            dataSource={prohibitedData.dataList}
            // dataSource={[]}
            size="small"
            bordered
            pagination={{
              size: "small",
              total: prohibitedData.dataList.length,
              showTotal: function (total, range) {
                return "总计" + total + "条";
              },
            }}
            // rowClassName={setRowClassName}
            // loading={loading}
            scroll={{
              x: tableTotalWidth.current,
              y: 600,
            }}
            footer={() => (
              <>
                <Button
                  size="small"
                  className="todo_opt_btn prohibited_add c-btn-green"
                  onClick={() => {
                    showUpdateInfoModal({}, "add");
                  }}
                >
                  新增禁航信息
                </Button>
                <div
                  className="generateTime"
                  style={{
                    position: "absolute",
                    border: "none",
                    left: "130px",
                    bottom: "10px",
                  }}
                >
                  数据时间: {formatTimeString(prohibitedData.generateTime)}
                  {/* 数据时间: {prohibitedData.generateTime} */}
                </div>
              </>
            )}
          />
        </div>
      </div>
    </DraggableModal>
  );
};

export default inject(
  "systemPage",
  "prohibitedData"
)(observer(ProhibitedModal));
