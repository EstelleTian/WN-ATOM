/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-24 19:19:59
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {  Suspense, useCallback, useState, useEffect} from 'react';
import { Table, Spin } from 'antd';
import {inject, observer} from "mobx-react";
import ModalBox from 'components/ModalBox/ModalBox';
import { getColumns, formatSingleFlight} from 'components/FlightTable/TableColumns';
import './LeftMultiCanvas.scss';
import {isValidVariable} from "../../utils/basic-verify";
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
    let [tableWidth, setWidth] = useState(0);
    let [tableHeight, setHeight] = useState(0);
    let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段

    const { leftActiveName, flightTableData } = props;
    let subTableData = [];
    switch (leftActiveName) {
        case "exempt": subTableData = flightTableData.getExemptFlights; break;
        case "pool": subTableData = flightTableData.getPoolFlights;break;
        case "special": subTableData = flightTableData.getSpecialFlights;break;
        case "expired": subTableData = flightTableData.getExpiredFlights;break;
        case "todo": subTableData = flightTableData.getTodoFlights;break;
    }
    const columns = getColumns( SubNames[leftActiveName] );
    console.log(leftActiveName, columns, subTableData);


    useEffect(() => {
        const flightCanvas = document.getElementsByClassName(leftActiveName+"_canvas")[0];
        flightCanvas.oncontextmenu = function(){
            return false;
        };
        const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
        const tableHeader = flightCanvas.getElementsByClassName("ant-table-header")[0];

        let width = boxContent.offsetWidth;
        let height = boxContent.offsetHeight;
        // console.log("表格高度："+height );
        // height -= 40;//标题高度“航班列表”
        // height -= 45;//表头高度
        height -= tableHeader.offsetHeight;//表头高度
        setWidth( width );
        setHeight( height );

    }, [tableWidth, tableHeight]);


    //转换为表格数据
    const coverFlightTableData = useCallback( subTableData => {
        return subTableData.map( flight => formatSingleFlight(flight) )
    });
    //设置表格行的 class
    const setRowClassName = useCallback((record, index) => {
        let { FFIXT, orgdata, id } = record;
        if( sortKey === "FFIXT" ) {
            const activeScheme = props.schemeListData.activeScheme;
            let {startTime, endTime} = activeScheme.tacticTimeInfo;
            if( isValidVariable(FFIXT) && FFIXT.length > 12 ){
                FFIXT = FFIXT.substring(0, 12);
            }
            if( isValidVariable(startTime) && startTime.length > 12 ){
                startTime = startTime.substring(0, 12);
            }
            // console.log("FFIXT",FFIXT,"startTime",startTime,"endTime",endTime);
            if (startTime * 1 <= FFIXT * 1) {
                if (isValidVariable(endTime)) {
                    endTime = endTime.substring(0, 12);
                    if (FFIXT * 1 <= endTime * 1) {
                        return id + " in_range"
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
    });
    const tableData = coverFlightTableData( subTableData );
    console.log(tableData);
    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <ModalBox
                title={subKeys[leftActiveName]}
                showDecorator = {true}
                className={`sub_table_modal ${leftActiveName}_canvas ${leftActiveName}`}
            >
                <Table
                    columns={ columns }
                    dataSource={ tableData }
                    size="small"
                    bordered
                    pagination={false}
                    // loading={ loading }
                    scroll={{
                        x: tableWidth,
                        y: tableHeight
                    }}
                    // onChange={onChange}
                    rowClassName={(record, index)=>setRowClassName(record, index)}/>
            </ModalBox>
        </Suspense>

    )

}

export default inject("flightTableData", "schemeListData")(observer(SubTable))



