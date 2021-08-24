/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-24 19:53:23
 * @LastEditors: Please set LastEditors
 * @Description: 备降停机位信息
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
import { Badge, Modal, Table } from "antd";
import { isValidVariable } from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import DraggableModal from "components/DraggableModal/DraggableModal";
import "./PositionModal.scss";

const posData = [
  {
    key: "ZLXY",
    airport: "ZLXY",
    position: "158",
    used: "61",
    preDis: "13",
    noDis: "84",
  },
  {
    key: "ZLLL",
    airport: "ZLLL",
    position: "158",
    used: "61",
    preDis: "13",
    noDis: "84",
  },
  {
    key: "ZLIC",
    airport: "ZLIC",
    position: "158",
    used: "61",
    preDis: "13",
    noDis: "84",
  },
  {
    key: "ZLXN",
    airport: "ZLXN",
    position: "158",
    used: "61",
    preDis: "13",
    noDis: "84",
  },
];

const names = {
  airport: {
    en: "airport",
    cn: "机场",
    width: 80,
  },
  position: {
    en: "position",
    cn: "停机位",
    width: 70,
  },
  used: {
    en: "used",
    cn: "已占用",
    width: 70,
  },
  preDis: {
    en: "preDis",
    cn: "预分配",
    width: 70,
  },
  noDis: {
    en: "noDis",
    cn: "未分配",
    width: 70,
  },
};

const PositionModal = (props) => {
  const timerId = useRef();
  const tableTotalWidth = useRef();
  const [loading, setLoading] = useState(false);

  const hideModal = () => {
    props.setPositionModalVisible(false);
  };
  const posColumns = useMemo(function () {
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

      totalWidth += tem.width * 1;
      columns.push(tem);
    }
    tableTotalWidth.current = totalWidth;
    return columns;
  }, []);
  //获取时隙交换详情请求
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
      if (!isValidVariable(exchangeSlot.slotDetailId)) {
        timerFunc();
        return;
      }

      let url =
        ReqUrls.retrieveExchangeSlotDetailUrl + exchangeSlot.slotDetailId;

      try {
        let params = {};

        const data = await requestGet2({ url, params });
        // console.log(data);
        //更新详情
        // handleTasksData(data);
        timerFunc();
      } catch (e) {
        let msg = "时隙交换详情数据获取失败";
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

  //处理 时隙交换工作 数据
  const handleTasksData = useCallback((data) => {
    let tableData = [];
    const tasks = data.tasks || {};
    const flights = data.flights || {};
    const generateTime = data.generateTime || "";
    for (let key in tasks) {
      const task = tasks[key] || {}; //流水号
      const taskId = task.taskId || "";
      const instanceId = task.instanceId || "";
      const authorities = task.authorities || {};
      //交换方 航班A
      const businessId = task.businessId || "";
      // const sourceFlight = flights[businessId] || {};
      // const sourceVal = sourceFlight.flightid || "";
      const sourceVal = task.sourceVal || "";
      //被交换方 航班B
      const targetFmeId = task.targetFmeId || "";
      // const targetFlight = flights[targetFmeId] || {};
      // const targetVal = targetFlight.flightid || "";
      const targetVal = task.targetVal || "";
      //发起人
      const startUser = task.startUser || "";
      //发起时间
      const startTime = task.startTime || "";
      //状态
      const handleStatus = task.status || "";
      //到达环节
      const activityName = task.activityName || "";
      //更新时间
      const endTime = task.endTime || "";
      //备注
      const comments = task.comments || "";

      let options = {
        taskId: taskId,
        key: instanceId,
        // sourceFlight,
        // targetFlight,
        authorities,
        exchangeId: targetFmeId, //航班B
        flightId: businessId, //航班A
      };

      let obj = {
        key: instanceId,
        instanceId,
        taskId: taskId,
        opt: JSON.stringify(options),
        sourceVal,
        targetVal,
        startUser,
        startTime,
        handleStatus,
        activityName,
        endTime,
        comments,
      };
      tableData.push(obj);
    }

    // exchangeSlot.updateSlotListData(tableData, generateTime);
  }, []);

  useEffect(() => {
    //   requestData(true, true);

    return () => {
      clearTimeout(timerId.current);
      timerId.current = null;
    };
  }, []);

  return (
    <DraggableModal
      title="备降停机位信息"
      style={{ top: "110px", left: "940px" }}
      visible={props.visible}
      handleOk={() => {}}
      handleCancel={hideModal}
      width={650}
      maskClosable={false}
      mask={false}
      // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
      destroyOnClose={true}
      footer={""}
    >
      <div className="position_canvas">
        <div className="pos_title">
          <span className="bold">停机位</span>
          <span>
            已占用：<span>41个</span>
          </span>

          <span>
            未占用：<span>83个</span>
          </span>
        </div>
        <div className="pos_table">
          <Table
            columns={posColumns}
            dataSource={posData}
            size="small"
            bordered
            pagination={false}
            // rowClassName={setRowClassName}
            loading={loading}
            scroll={{
              x: tableTotalWidth.current,
              y: 600,
            }}
          />
        </div>
      </div>
    </DraggableModal>
  );
};

export default PositionModal;
