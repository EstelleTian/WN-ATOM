/*
 * @Author: your name
 * @Date: 2021-02-05 11:08:47
 * @LastEditTime: 2021-05-11 21:44:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\ExecuteKPI\ExecuteKPIModal.jsx
 */
import React, { lazy, Suspense, useMemo } from "react";
import { inject, observer } from "mobx-react";
import { Spin } from "antd";
import ExecuteKPI from "components/ExecuteKPI/ExecuteKPI";
import ModalBox from "components/ModalBox/ModalBox";
import { isValidVariable, formatTimeString } from "utils/basic-verify";
/** start *****KPI标题************/

function TTitle(props) {
  const { executeKPIData = {}, schemeListData } = props;
  const generateTime = useMemo(() => {
    return executeKPIData.generateTime || "";
  }, [executeKPIData.generateTime]);

  const tacticName = useMemo(() => {
    const activeScheme =
      schemeListData.activeScheme(schemeListData.activeSchemeId) || {};
    return activeScheme.tacticName || "";
  }, [schemeListData.activeSchemeId]);

  return (
    <span>
      <span>执行KPI({formatTimeString(generateTime)})</span>
      {tacticName !== "" && <span>—</span>}
      <span
        title={tacticName}
        className="ellipsis_name"
        //  style={{ color: "#36a5da" }}
      >
        {tacticName}
      </span>
    </span>
  );
}
const TableTitle = inject("executeKPIData", "schemeListData")(observer(TTitle));
/** end *****KPI************/

function ExecuteKPIModal(props) {
  return (
    <Suspense
      fallback={
        <div className="load_spin">
          <Spin tip="加载中..." />
        </div>
      }
    >
      <ModalBox title={<TableTitle />} showDecorator={false} className="kpi">
        <ExecuteKPI />
      </ModalBox>
    </Suspense>
  );
}

export default ExecuteKPIModal;
