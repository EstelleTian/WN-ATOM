/*
 * @Author: your name
 * @Date: 2021-02-05 11:08:47
 * @LastEditTime: 2021-04-14 14:39:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\ExecuteKPI\ExecuteKPIModal.jsx
 */
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-05 10:57:07
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { lazy, Suspense, useMemo} from 'react';
import {inject, observer} from "mobx-react";
import {Spin} from "antd";
import ExecuteKPI  from 'components/ExecuteKPI/ExecuteKPI'
import ModalBox from 'components/ModalBox/ModalBox'
import { isValidVariable, formatTimeString } from 'utils/basic-verify'

/** start *****航班表格标题************/
function TTitle(props){
    const { executeKPIData = {}, schemeListData } = props;
    
    const generateTime = useMemo(() => {
        return executeKPIData.executeData.generateTime || "";
    }, [executeKPIData.executeData.generateTime]);

    const tacticName = useMemo(() => {
        const activeScheme = schemeListData.activeScheme(schemeListData.activeSchemeId) || {};
        return activeScheme.tacticName || "";
    }, [schemeListData.activeSchemeId]);

    return (<span>
         <span>执行KPI({formatTimeString(props.executeKPIData.executeData.generateTime)})</span>
         { tacticName !== "" && <span>—</span> }
         <span style={{ color: "#36a5da"}}>{tacticName}</span>
    </span>)
}
const TableTitle = inject("executeKPIData", "schemeListData")(observer(TTitle));
/** end *****航班表格标题************/


function ExecuteKPIModal(props){
    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <ModalBox
                title={ <TableTitle /> }
                showDecorator = {false}
                className="kpi"
            >
                <ExecuteKPI />
            </ModalBox>
        </Suspense>
    )
}

export default ExecuteKPIModal



