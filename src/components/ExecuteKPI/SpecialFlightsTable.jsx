/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-06-10 15:34:00
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {
  Suspense,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Table, Spin, Modal } from "antd";
import { inject, observer } from "mobx-react";
// import ModalBox from 'components/ModalBox/ModalBox';
import DraggableModal from "components/DraggableModal/DraggableModal";
import {
  getColumns,
  formatSingleFlight,
  scrollTopById,
  highlightRowByDom,
  clearHighlightRowByDom,
} from "components/FlightTable/TableColumns";
// import "./LeftMultiCanvas.scss";
import { isValidVariable } from "utils/basic-verify";
//根据key识别列表名称
const subKeys = {
  exempt: "全局豁免航班列表",
  interval: "半数间隔列表",
  critical: "临界航班列表",
  pool: "入池航班列表",
  coordination: "协调航班列表",
  closeWait: "关舱门等待航班列表",
};

function SpecialFlightsTable(props) {
  let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段
  //   const [modalVisible, setModalVisible] = useState(true);

  const { systemPage, flightTableData, tableName, collaboratePopoverData } =
    props;

  const { tableData, columns, totalWidth } = useMemo(() => {
    const columns = getColumns(
      props.systemPage.systemKind,
      props.collaboratePopoverData
    );
    const performanceKPIData = props.performanceKPIData || {};
    const performanceData = performanceKPIData.performanceData || {};

    let subTableData = [];
    switch (tableName) {
      case "exempt":
        subTableData = performanceData.exemptFlights || [];
        break;
      case "interval":
        subTableData = performanceData.halfIntervalFlights || [];
        break;
      case "critical":
        subTableData = performanceData.criticalFlights || [];
        break;
      case "pool":
        subTableData = performanceData.inPoolFlights || [];
        break;
      case "coordination":
        subTableData = performanceData.coordinationFlights || [];
        break;
      case "closeWait":
        subTableData = performanceData.closeWaitFlights || [];
        break;
      default:
    }
    //转换为表格数据
    let tableData = subTableData.map((flight) => formatSingleFlight(flight));
    let totalWidth = 0;
    columns.map((col) => {
      totalWidth += col.width * 1;
    });
    return { tableData, columns, totalWidth };
  }, [
    props.performanceKPIData.performanceData,
    props.performanceKPIData.showTableName,
    props.systemPage.systemKind,
  ]);

  const hideModal = () => {
    // setModalVisible(false);
    props.performanceKPIData.closeShowTableName(tableName);
  };

  //设置表格行的 class
  const rowClassName = useCallback((record, index) => {
    let { id } = record;
    return id;
  }, []);

  const getTitle = () => {
    return (
      <span>
        <span>{subKeys[tableName]}</span>
      </span>
    );
  };

  //   useEffect(() => {
  //     const { id } = props.flightTableData.getSelectedFlight;
  //     const flightCanvas = document.getElementsByClassName(
  //       tableName + "_canvas"
  //     )[0];
  //     if (isValidVariable(id)) {
  //       const trDom = flightCanvas.getElementsByClassName(id);
  //       if (trDom.length > 0) {
  //         highlightRowByDom(trDom[0]);
  //       } else {
  //         const tableTBody = flightCanvas.getElementsByClassName(
  //           "ant-table-tbody"
  //         );
  //         const trs = tableTBody[0].getElementsByTagName("tr");
  //         clearHighlightRowByDom(trs);
  //       }
  //       scrollTopById(id, tableName + "_canvas");
  //     }
  //   }, [props.flightTableData.getSelectedFlight.id]);
  console.log("tableName", tableName);
  return (
    <Suspense
      fallback={
        <div className="load_spin">
          <Spin tip="加载中..." />
        </div>
      }
    >
      <DraggableModal
        title={getTitle()}
        style={{ top: "320px", left: "-60px" }}
        visible={true}
        handleOk={() => {}}
        handleCancel={hideModal}
        width={1000}
        maskClosable={false}
        mask={false}
        // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
        destroyOnClose={true}
        footer={""}
      >
        <Table
          columns={columns}
          dataSource={tableData}
          size="small"
          bordered
          pagination={false}
          // loading={ loading }
          scroll={{
            x: totalWidth,
            y: 500,
          }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                // 点击行
                console.log(event);
                const fid = event.currentTarget.getAttribute("data-row-key");
                flightTableData.toggleSelectFlight(fid);
              },
            };
          }}
          rowClassName={rowClassName}
        />
      </DraggableModal>
    </Suspense>
  );
}

export default inject(
  "systemPage",
  "performanceKPIData",
  "flightTableData",
  "collaboratePopoverData"
)(observer(SpecialFlightsTable));
