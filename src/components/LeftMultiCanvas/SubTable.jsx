/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-24 19:19:59
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { lazy, Suspense} from 'react';
import { Table, Spin } from 'antd';
import {inject, observer} from "mobx-react";
import ModalBox from 'components/ModalBox/ModalBox'
import './LeftMultiCanvas.scss'

const subNames = {
    "exempt": "豁免航班列表",
    "pool": "等待池列表",
    "special": "特殊航班列表",
    "expired": "失效航班列表",
    "todo": "待办航班列表",
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
];
function SubTable(props){
    const { leftActiveName } = props;
    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <ModalBox
                title={subNames[leftActiveName]}
                showDecorator = {true}
                className={leftActiveName}
            >
                <Table columns={columns} dataSource={data} size="small" />
            </ModalBox>
        </Suspense>

    )

}

export default inject("executeKPIData")(observer(SubTable))



