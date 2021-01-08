/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-24 19:19:59
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { lazy, Suspense} from 'react';
import {inject, observer} from "mobx-react";
import {Spin} from "antd";
import ExecuteKPI  from 'components/ExecuteKPI/ExecuteKPI'
import ModalBox from 'components/ModalBox/ModalBox'
import SubTable  from './SubTable'
import './LeftMultiCanvas.scss'



function LeftMultiCanvas(props){
    const { systemPage } = props;
    const { leftActiveName } = systemPage;
    return (
        <div className="left_left_top">
            {
                leftActiveName === "kpi"
                    ? <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
                        <ModalBox
                            title="执行KPI"
                            showDecorator = {true}
                            className="kpi"
                        >
                            <ExecuteKPI />
                        </ModalBox>
                    </Suspense>
                    : <SubTable name={leftActiveName} leftActiveName={leftActiveName} />
            }
        </div>
    )

}

export default inject("systemPage")(observer(LeftMultiCanvas))



