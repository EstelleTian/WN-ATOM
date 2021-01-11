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
import {Empty, Spin} from "antd";
import ModalBox from 'components/ModalBox/ModalBox'
import './RightMultiCanvas.scss'

//TODO 真实数据，用于公司环境
const SchemeList = lazy(() => import('components/SchemeList/SchemeList') );
//TODO 本地模拟数据，用于无接口调试样式
// const SchemeList = lazy(() => import('components/SchemeList/SchemeListMock') );

function RightMultiCanvas(props){
    const { systemPage } = props;
    const { rightActiveName } = systemPage;
    return (
        <div className="cont_right">
            {
                rightActiveName === "scheme"
                ? <ModalBox
                        title="方案列表"
                        showDecorator = {true}
                    >
                    <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
                        <SchemeList />
                    </Suspense>

                    </ModalBox>
                    : ""
            }
            {
                rightActiveName === "outer_scheme"
                    ? <ModalBox
                        title="外部流控列表"
                        showDecorator = {true}
                    >

                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ color:"#fff"}} />
                    </ModalBox>
                    : ""
            }
        </div>

    )

}

export default inject("systemPage")(observer(RightMultiCanvas))



