import React, {
  Suspense,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Col, Row, Spin, Table } from "antd";
import { inject, observer } from "mobx-react";
import {
  getColumns,
  formatSingleFlight,
  scrollTopById,
  highlightRowByDom,
  clearHighlightRowByDom,
} from "components/FlightTable/TableColumns";
import DraggableModal from "components/DraggableModal/DraggableModal";

//KPI航班列表模态框
function FlightListModal(props) {
  const { executeKPIData = {}, schemeListData = {} } = props;
  const { activeSchemeId } = schemeListData;
  const {
    flightListModalVisible,
    getFocusCategoryFlight,
    flightListCategoryZh,
  } = executeKPIData;
  const tacticName = useMemo(() => {
    const activeScheme =
      schemeListData.activeScheme(schemeListData.activeSchemeId) || {};
    return activeScheme.tacticName || "";
  }, [schemeListData.activeSchemeId]);

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

  const columns = getColumns(
    commonSubNames,
    props.systemPage.systemKind,
    props.collaboratePopoverData
  );
  //转换为表格数据
  let tableData = getFocusCategoryFlight.map((flight) =>
    formatSingleFlight(flight)
  );

  // 关闭模态框
  const closeModal = () => {
    executeKPIData.toggleFlightListModalVisible(false);
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

  return (
    <Spin spinning={false}>
      <DraggableModal
        title={
          <span>
            {flightListCategoryZh}—{tacticName}{" "}
          </span>
        }
        style={{ top: "150px", left: "-100px" }}
        visible={flightListModalVisible}
        handleOk={() => {}}
        handleCancel={closeModal}
        width={1000}
        maskClosable={false}
        mask={false}
        // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
        destroyOnClose={true}
        footer={""}
      >
        <Table
          columns={columns}
          dataSource={[]}
          dataSource={tableData}
          size="small"
          bordered
          pagination={false}
          // loading={ loading }
          scroll={{
            x: 500,
            y: 800,
          }}
          // onRow={record => {
          //     return {
          //       onClick: event => {// 点击行
          //         console.log(event);
          //         const fid = event.currentTarget.getAttribute("data-row-key")
          //         flightTableData.toggleSelectFlight(fid);
          //       },

          //     };
          //   }}
          // rowClassName={rowClassName}
        />
      </DraggableModal>
    </Spin>
  );
}

export default inject(
  "systemPage",
  "collaboratePopoverData",
  "executeKPIData",
  "performanceKPIData",
  "schemeListData"
)(observer(FlightListModal));
