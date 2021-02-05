/*
 * @Author: your name
 * @Date: 2021-02-05 11:08:47
 * @LastEditTime: 2021-02-05 11:31:41
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
import React, { lazy, Suspense} from 'react';
import {inject, observer} from "mobx-react";
import {Spin} from "antd";
import ExecuteKPI  from 'components/ExecuteKPI/ExecuteKPI'
import ModalBox from 'components/ModalBox/ModalBox'
import { isValidVariable, formatTimeString } from 'utils/basic-verify'

function ExecuteKPIModal(props){
    const activeScheme = props.schemeListData.activeScheme || {};
    const tacticName = activeScheme.tacticName || "";
    const getTitle = () => {
        return <span>
            <span>执行KPI({formatTimeString(props.executeKPIData.KPIData.generateTime)})</span>
            —
            <span style={{ color: "#36a5da"}}>{tacticName}</span>
        </span>
    }
    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <ModalBox
                title={ getTitle() }
                showDecorator = {true}
                className="kpi"
            >
                <ExecuteKPI />
            </ModalBox>
        </Suspense>
    )
}

export default inject("executeKPIData", "schemeListData")(observer(ExecuteKPIModal))



