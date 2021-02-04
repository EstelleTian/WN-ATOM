/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-02 19:53:57
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { lazy, Suspense} from 'react';
import {inject, observer} from "mobx-react";
import {Spin} from "antd";
import ExecuteKPI  from 'components/ExecuteKPI/ExecuteKPI'
import ModalBox from 'components/ModalBox/ModalBox'
import { DoubleLeftOutlined } from '@ant-design/icons';
import TodoTable  from './TodoTable'
import SubTable  from './SubTable'
import './LeftMultiCanvas.scss'

function LeftMultiCanvas(props){
    const { systemPage } = props;
    const { leftActiveName, setLeftActiveName } = systemPage;
    return (
        <div className="left_left_top">
            <div className='unfold_icon'
                 onClick={()=>{
                     props.systemPage.setLeftActiveName("")
            }}><DoubleLeftOutlined/></div>
            {
                leftActiveName === "kpi" && 
                <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
                        <ModalBox
                            // title={`执行KPI (数据时间:${ formatTimeString(props.executeKPIData.generateTime) })`}
                            title="执行KPI"
                            showDecorator = {true}
                            className="kpi"
                        >
                            <ExecuteKPI />
                        </ModalBox>
                    </Suspense>
            }
            {
                leftActiveName === "todo" && 
                <TodoTable />
            }
            {
                ( leftActiveName !== "todo" && leftActiveName !== "kpi") && 
                <SubTable name={leftActiveName} key={leftActiveName} leftActiveName={leftActiveName} />
            }
        </div>
    )

}

// export default inject("systemPage", "executeKPIData")(observer(LeftMultiCanvas))
export default inject("systemPage")(observer(LeftMultiCanvas))



