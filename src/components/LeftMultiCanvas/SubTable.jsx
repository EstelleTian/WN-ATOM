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
import { setNames, getColumns } from 'components/FlightTable/TableColumns'
import './LeftMultiCanvas.scss'
//根据key识别列表名称
const subKeys = {
    "exempt": "豁免航班列表",
    "pool": "等待池列表",
    "special": "特殊航班列表",
    "expired": "失效航班列表",
    "todo": "待办航班列表",
}

const commonSubNames = {
    "FLIGHTID":{
        "en":"FLIGHTID",
        "cn":"航班号",
    },
    "DEPAP":{
        "en":"DEPAP",
        "cn":"起飞机场"
    },
    "ARRAP":{
        "en":"ARRAP",
        "cn":"降落机场"
    },
    "SOBT":{
        "en":"SOBT",
        "cn":"计划撤轮档"
    },
    "EOBT":{
        "en":"EOBT",
        "cn":"预计撤轮档时间"
    },
    "COMMENT":{
        "en":"COMMENT",
        "cn":"备注"
    },
}
//根据key识别列表列配置columns
const SubNames = {
    "exempt": "",
    "pool":{
        "FLIGHTID":{
            "en":"FLIGHTID",
            "cn":"航班号",
        },
        "DEPAP":{
            "en":"DEPAP",
            "cn":"起飞机场"
        },
        "ARRAP":{
            "en":"ARRAP",
            "cn":"降落机场"
        },
        "SOBT":{
            "en":"SOBT",
            "cn":"计划撤轮档"
        },
        "EOBT":{
            "en":"EOBT",
            "cn":"预计撤轮档时间"
        },
        "TOBT":{
            "en":"TOBT",
            "cn":"目标撤轮档"
        },
        "AGCT":{
            "en":"AGCT",
            "cn":"实际关门时间"
        },
    },
    "special": commonSubNames,
    "expired": commonSubNames,
    "todo": {
        "FLIGHTID":{
            "en":"FLIGHTID",
            "cn":"航班号",
        },
        "TYPE":{
            "en":"TYPE",
            "cn":"协调类型"
        },
        "VALUE":{
            "en":"VALUE",
            "cn":"协调值"
        },
        "USER":{
            "en":"USER",
            "cn":"申请人"
        },
        "TIMESTAMP":{
            "en":"TIMESTAMP",
            "cn":"申请时间"
        },
        "COMMENT":{
            "en":"COMMENT",
            "cn":"备注"
        },
    },
}

function SubTable(props){
    const { leftActiveName, flightTableData } = props;
    let tableData = [];
    switch (leftActiveName) {
        case "exempt": tableData = flightTableData.getExemptFlights; break;
        case "pool": tableData = flightTableData.getPoolFlights;break;
        case "special": tableData = flightTableData.getSpecialFlights;break;
        case "expired": tableData = flightTableData.getExpiredFlights;break;
        case "todo": tableData = flightTableData.getTodoFlights;break;
    }
    setNames( SubNames[leftActiveName] );
    const columns = getColumns();
    console.log(leftActiveName, columns, tableData);

    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <ModalBox
                title={subKeys[leftActiveName]}
                showDecorator = {true}
                className={`sub_table_modal ${leftActiveName}`}
            >
                <Table
                    columns={ columns }
                    dataSource={ tableData }
                    size="small" />
            </ModalBox>
        </Suspense>

    )

}

export default inject("flightTableData")(observer(SubTable))



