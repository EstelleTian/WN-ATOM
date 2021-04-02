/*
 * @Author: your name
 * @Date: 2021-01-28 15:56:44
 * @LastEditTime: 2021-04-01 20:20:42
 * @LastEditors: Please set LastEditors
 * @Description: 容量参数调整
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityParamsCont.jsx
 */

import React, { useContext, useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { QuestionCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { message, Table, Input, Button, Popconfirm, Tooltip, Form, Spin  } from "antd";

import './CapacityMiniTable.scss'


//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

 //处理列配置
 const getColumns = (type) => {
    const valRender = (text, record, index) => {
        let bgClass = "";
        let title = "";
        let showVal = text.value || "";
        if( showVal === -1){
            showVal = "-"
        }
        let source = "";
        if( text.hasOwnProperty("source") ){
             source = text.source || "";
            
            switch( source ){
                case "1" : {
                    bgClass = "alarm alarm_green";
                    title = "大于静态容量值";
                    break;
                }
                case "2" : {
                    bgClass = "alarm alarm_orange";
                    title = "小于静态容量值20%以内";
                    break;
                }
                case "3" : {
                    bgClass = "alarm alarm_red";
                    title = "小于静态容量值20%以上";
                    break;
                }
                case "wait" : {
                    bgClass = "alarm alarm_yellow";
                    showVal = text.originalValue || "";
                    title = (
                        <span>
                            <div>原&nbsp;&nbsp;&nbsp;&nbsp;值：{text.originalValue}</div>
                            <div>申请值：{text.value}</div>
                        </span>
                    );
                    break;
                }
                default: bgClass = "";  break;
            }
        }
        return <span className={bgClass} >
            {
                source === 'wait' 
                // ? ( showVal !== '-' && showVal !== -1 ) ?
                ? ( showVal !== '-'  ) ?
                    <Tooltip title={title} color="#164c69">
                    <span> { text.originalValue === -1 ? "-" : text.originalValue } <ArrowRightOutlined /> { text.value || ""} </span> 
                    </Tooltip>
                  : <span>{ showVal || ""}</span> 
                  
                : 
                <Tooltip title={title} color="#164c69">
                    <span>{ showVal || ""}</span>
                   { bgClass !== "" && <QuestionCircleOutlined className="cap_icon" />} 
                </Tooltip>
            }
                
            </span>
    }
    let cColumns = []
    if( type === "AIRPORT"){
        cColumns = [
            {
                title: "时间",
                dataIndex: "capacityTimeSource",
                align: 'center',
                key: "capacityTimeSource",
                fixed: 'left',
                width: (screenWidth > 1920) ? 30 : 30,
                render: (text, record, index) => {
                    if( text === "BASE" ){
                        return <span>全天</span>;
                    }
                    return <span>{text}</span>
                    // else{
                    //     return <span>{text}时</span>
                    // }
                    // if( text*1 < 10){
                    //     text = '0'+text;
                    // }
                    // return <span>{text}时</span>
                }
            },
            {
                title: "小时最大起降架次",
                dataIndex: "capacityDetailsDepArr60",
                align: 'center',
                key: "capacityDetailsDepArr60",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender,
            },
            {
                title: "小时最大起飞架次",
                dataIndex: "capacityDetailsDep60",
                align: 'center',
                key: "capacityDetailsDep60",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
            {
                title: "小时最大降落架次",
                dataIndex: "capacityDetailsArr60",
                align: 'center',
                key: "capacityDetailsArr60",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
            {
                title: "15分钟最大起降架次",
                dataIndex: "capacityDetailsDepArr15",
                align: 'center',
                key: "capacityDetailsDepArr15",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
            {
                title: "15分钟最大起飞架次",
                dataIndex: "capacityDetailsDep15",
                align: 'center',
                key: "capacityDetailsDep15",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
            {
                title: "15分钟最大降落架次",
                dataIndex: "capacityDetailsArr15",
                align: 'center',
                key: "capacityDetailsArr15",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
        ];
    }else{
        cColumns = [
            {
                title: "时间",
                dataIndex: "capacityTimeSource",
                align: 'center',
                key: "capacityTimeSource",
                fixed: 'left',
                width: (screenWidth > 1920) ? 30 : 30,
                render: (text, record, index) => {
                    if( text === "BASE" ){
                        return <span>全天</span>;
                    }
                    // if( text*1 < 10){
                    //     text = '0'+text;
                    // }
                    return <span>{text}</span>
                }
            },
            {
                title: "小时容量值",
                dataIndex: "capacityDetailsDepArr60",
                align: 'center',
                key: "capacityDetailsDepArr60",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
                
            },
            {
                title: "15分钟容量值",
                dataIndex: "capacityDetailsDepArr15",
                align: 'center',
                key: "capacityDetailsDepArr15",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            }
        ];
    }
    return cColumns;
}
//请求错误--处理
const requestErr = (err, content) => {
    message.error({
        content,
        duration: 10,
    });
}

//设置表格行的 class
const setRowClassName = (record, index) => {
    let classStr = "";
    if( index % 2 === 0 ){
        classStr += " even";
    }else{
        classStr += " odd";
    }
    return classStr;
};

//动态容量配置
const CapacityMiniTable = (props) => {
    const { elementType, updateData } = props;
    const mergedColumns = getColumns(elementType);
    for(let key in updateData){
        const item = updateData[key] || {};
        item["key"] = key;
    }
    let tableData = Object.values(updateData);
    // tableData = tableData.map(item=>{
    //     return item["key"] = item.capacityTime;
    // })

    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <div className="table_cont">
                
                
                {
                    tableData.length > 0 
                    && <Table
                            columns={ mergedColumns }
                            dataSource={ tableData }
                            size="small"
                            bordered
                            pagination={false}
                            rowClassName={ setRowClassName }
                            className="capacity_number_table"
                        />
                }
                
                   
            </div>
        </Suspense>
      );

}


export default CapacityMiniTable

