/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-06-16 19:37:44
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
import "./LeftMultiCanvas.scss";
import { isValidVariable } from "utils/basic-verify";
import { isValidObject } from "../../utils/basic-verify";
//根据key识别列表名称
const subKeys = {
  exempt: "豁免航班列表",
  pool: "等待池列表",
  special: "特殊航班列表",
  expired: "失效航班列表",
};

const commonSubNames = {
  FLIGHTID: {
    en: "FLIGHTID",
    cn: "航班号",
  },
  DEPAP: {
    en: "DEPAP",
    cn: "起飞机场",
  },
  ARRAP: {
    en: "ARRAP",
    cn: "降落机场",
  },
  SOBT: {
    en: "SOBT",
    cn: "计划撤轮档",
  },
  EOBT: {
    en: "EOBT",
    cn: "预计撤轮档时间",
  },
  COMMENT: {
    en: "COMMENT",
    cn: "备注",
  },
};
//根据key识别列表列配置columns
const SubNames = {
  exempt: "",
  pool: {
    FLIGHTID: {
      en: "FLIGHTID",
      cn: "航班号",
    },
    DEPAP: {
      en: "DEPAP",
      cn: "起飞机场",
    },
    ARRAP: {
      en: "ARRAP",
      cn: "降落机场",
    },
    SOBT: {
      en: "SOBT",
      cn: "计划撤轮档",
    },
    EOBT: {
      en: "EOBT",
      cn: "预计撤轮档时间",
    },
    TOBT: {
      en: "TOBT",
      cn: "目标撤轮档",
    },
    AGCT: {
      en: "AGCT",
      cn: "实际关门时间",
    },
  },
  special: commonSubNames,
  expired: commonSubNames,
};

function SubTable(props) {
  let [tableWidth, setWidth] = useState(0);
  let [tableHeight, setHeight] = useState(0);
  let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段
  const [modalVisible, setModalVisible] = useState(false);

  const { flightTableData, systemPage, columnConfig } = props;
  const modalActiveName = systemPage.modalActiveName || "";

  const { tableData, columns, totalWidth } = useMemo(() => {
    if (
      !isValidVariable(modalActiveName) ||
      !Object.keys(SubNames).includes(modalActiveName)
    ) {
      return { tableData: [], columns: [], totalWidth: 0 };
    }
    
    let namesObj = SubNames[modalActiveName];
    // 若列不是有效的对象则使用 columnConfig store中数据
    if(!isValidObject(namesObj)){
    // 从columnConfig store 中获取display为1的列数据
      namesObj = columnConfig.displayColumnData
    }
    
    const columns = getColumns(
      namesObj,
      props.collaboratePopoverData
    );
    let subTableData = [];
    switch (modalActiveName) {
      case "exempt":
        subTableData = props.flightTableData.getExemptFlights();
        break;
      case "pool":
        subTableData = props.flightTableData.getPoolFlights();
        break;
      case "special":
        subTableData = props.flightTableData.getSpecialFlights();
        break;
      case "expired":
        subTableData = props.flightTableData.getExpiredFlights();
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
  }, [props.flightTableData.list, modalActiveName, columnConfig.displayColumnData]);

  // console.log(modalActiveName, tableData.length)

  const hideModal = () => {
    setModalVisible(false);
    props.systemPage.setModalActiveName("");
  };

  //设置表格行的 class
  const rowClassName = useCallback((record, index) => {
    let { FFIXT, orgdata, id } = record;
    if (
      sortKey === "FFIXT" &&
      isValidVariable(props.schemeListData.activeSchemeId) &&
      props.schemeListData.activeSchemeId.indexOf("focus") === -1
    ) {
      const activeScheme = props.schemeListData.activeScheme(
        props.schemeListData.activeSchemeId
      );
      let { startTime, endTime } = activeScheme.tacticTimeInfo;
      if (isValidVariable(FFIXT) && FFIXT.length > 12) {
        FFIXT = FFIXT.substring(0, 12);
      }
      if (isValidVariable(startTime) && startTime.length > 12) {
        startTime = startTime.substring(0, 12);
      }
      // console.log("FFIXT",FFIXT,"startTime",startTime,"endTime",endTime);
      if (startTime * 1 <= FFIXT * 1) {
        if (isValidVariable(endTime)) {
          endTime = endTime.substring(0, 12);
          if (FFIXT * 1 <= endTime * 1) {
            return id + " in_range";
          } else {
            return id + " out_range";
          }
        } else {
          return id + " in_range";
        }
      } else {
        return id + " out_range";
      }
    }
    return id;
  }, []);
  const activeScheme =
    props.schemeListData.activeScheme(props.schemeListData.activeSchemeId) ||
    {};
  const tacticName = activeScheme.tacticName || "";

  const getTitle = () => {
    return (
      <span>
        <span>{subKeys[modalActiveName]}</span>
        {tacticName !== "" && "—"}
        <span style={{ color: "#36a5da" }}>{tacticName}</span>
      </span>
    );
  };

  // useEffect(() => {
  //     if( isValidVariable(modalActiveName) ){
  //         const flightCanvas = document.getElementsByClassName(modalActiveName+"_canvas")[0];
  //         flightCanvas.oncontextmenu = function(){
  //             return false;
  //         };
  //         const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
  //         const tableHeader = flightCanvas.getElementsByClassName("ant-table-header")[0];

  //         let width = boxContent.offsetWidth;
  //         let height = boxContent.offsetHeight;
  //         console.log("表格高度："+height );
  //         // height -= 40;//标题高度“航班列表”
  //         // height -= 45;//表头高度
  //         height -= tableHeader.offsetHeight;//表头高度
  //         setWidth( width );
  //         setHeight( height );
  //     }
  // }, [tableWidth, tableHeight, modalActiveName]);

  useEffect(() => {
    const { id } = props.flightTableData.getSelectedFlight;
    const flightCanvas = document.getElementsByClassName(
      modalActiveName + "_canvas"
    )[0];
    if (isValidVariable(id)) {
      const trDom = flightCanvas.getElementsByClassName(id);
      if (trDom.length > 0) {
        highlightRowByDom(trDom[0]);
      } else {
        const tableTBody =
          flightCanvas.getElementsByClassName("ant-table-tbody");
        const trs = tableTBody[0].getElementsByTagName("tr");
        clearHighlightRowByDom(trs);
      }
      scrollTopById(id, modalActiveName + "_canvas");
    }
  }, [props.flightTableData.getSelectedFlight.id]);

  useEffect(() => {
    if (
      modalActiveName === "exempt" ||
      modalActiveName === "pool" ||
      modalActiveName === "special" ||
      modalActiveName === "expired"
    ) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [modalActiveName]);

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
        style={{ top: "110px", left: "340px" }}
        visible={modalVisible}
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
  "collaboratePopoverData",
  "flightTableData",
  "schemeListData",
  "systemPage",
  "columnConfig",
)(observer(SubTable));
