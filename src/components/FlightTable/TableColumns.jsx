/*
 * @Author: your name
 * @Date: 2020-12-15 10:52:07
 * @LastEditTime: 2020-12-23 11:18:24
 * @LastEditors: Please set LastEditors
 * @Description: 表格列配置、列数据转换、右键协调渲染
 * @FilePath: \WN-CDM\src\pages\TablePage\TableColumns.js
 */
import React from 'react'
import { isValidVariable, getDayTimeFromString, formatTimeString, getTimeAndStatus } from 'utils/basic-verify'
import { FlightCoordination, PriorityList } from 'utils/flightcoordination'
import { FFIXTPopover, EAWTPopover, OAWTPopover, CTOPopover, ATOTPopover } from  './CollaboratePopover'
import FLIGHTIDPopover from  './FLIGHTIDPopover'
import TOBTPopover from  './TOBTPopover'
import CTPopover from  './CTPopover'
import {Tag, Tooltip} from "antd";
/**
 * 告警列单元格渲染格式化
 * */
const randerAlarmCellChildren =(opt)=> {
    const {text, record, index, col, colCN} = opt;
    // 置空title属性,解决title显示[object,object]问题
    return <div className="alarm" title="">{text}</div>
}


//表格列名称-中英-字典
let defaultNames = {
    "FLIGHTID":{
        "en":"FLIGHTID",
        "cn":"航班号",
    },
    "ALARM":{
        "en":"ALARM",
        "cn":"告警",
    },
    "TASK":{
        "en":"TASK",
        "cn":"优先级"
    },
    "FFIX":{
        "en":"FFIX",
        "cn":"基准点"
    },
    "FFIXT":{
        "en":"FFIXT",
        "cn":"基准点时间"
    },
    "CTO":{
        "en":"CTO",
        "cn":"计算基准点"
    },
    "ETO":{
        "en":"ETO",
        "cn":"预计基准点"
    },
    "COBT":{
        "en":"COBT",
        "cn":"计算预撤时间"
    },
    "CTOT":{
        "en":"CTOT",
        "cn":"计算起飞时间"
    },
    "ACTYPE":{
        "en":"ACTYPE",
        "cn":"机型"
    },
    "ATOT":{
        "en":"ATOT",
        "cn":"实际起飞时间"
    },
    "DEPAP":{
        "en":"DEPAP",
        "cn":"起飞机场"
    },
    "ARRAP":{
        "en":"ARRAP",
        "cn":"降落机场",
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
        "cn":"关舱门时间"
    },
    "STATUS":{
        "en":"STATUS",
        "cn":"航班状态"
    },
    "EAW":{
        "en":"EAW",
        "cn":"入区域点"
    },
    "EAWT":{
        "en":"EAWT",
        "cn":"入区域点时间"
    },

    "OAW":{
        "en":"OAW",
        "cn":"出区域点"
    },
    "OAWT":{
        "en":"OAWT",
        "cn":"出区域点时间"
    },
    "SOBT":{
        "en":"SOBT",
        "cn":"计划撤轮档"
    },
    "FETA":{
        "en":"FETA",
        "cn":"前段降落时间"
    },

    "orgdata": {
        "en":"orgdata",
        "cn":"原数据"
    }
}

// 右键渲染模块内容
let render = (opt)  => {
    const {text, record, index, col, colCN} = opt;
    let color = "";
    let popover = <div title={text}>{text}</div>;
    if( col === "FLIGHTID" ){
        popover = <FLIGHTIDPopover opt={opt} />
    }
    else if( col === "FFIXT" ){
        popover = <FFIXTPopover opt={opt} />
    }
    else if( col === "COBT" ){
        popover = <CTPopover opt={opt} />
    }
    else if( col === "CTOT" ){
        popover = <CTPopover opt={opt}/>
    }
    else if( col === "CTO" ){
        popover = <CTOPopover opt={opt}/>
    }
    else if( col === "EAWT" ){
        popover = <EAWTPopover opt={opt} />
    }
    else if( col === "OAWT" ){
        popover = <OAWTPopover opt={opt} />
    }
    else if( col === "ALARM" ){
        popover = randerAlarmCellChildren(opt)
    }
    else if( col === "TOBT" ){
        popover = <TOBTPopover opt={opt} />
    }
    else if( col === "ATOT" ){
        popover = <ATOTPopover opt={opt} />
    }
    let obj  = {
        children: popover,
        props: {
            "col-key":col, //td会增加这个属性
        },
    };
    return obj;
}

//生成表配置
const getColumns = ( names = defaultNames ) => {
    if( !isValidVariable( names )){
        names = defaultNames
    }
    //获取屏幕宽度，适配 2k
    let screenWidth = document.getElementsByTagName("body")[0].offsetWidth
    //表格列配置-默认-计数列
    let columns = [{
        title: "",
        dataIndex: "rowNum",
        align: 'center',
        key: "rowNum",
        width: (screenWidth > 1920) ? 50 : 40,
        fixed: 'left',
        render: (text, record, index) => `${index+1}`
    }];
    //生成表配置-全部
    for(let key in names){
        const obj = names[key];
        const en = obj["en"];
        const cn = obj["cn"];
        let tem = {
            title: en,
            dataIndex: en,
            align: 'center',
            key: en,
            width: (screenWidth > 1920) ? 60 : 60,
            ellipsis: true,
            className: en,
            showSorterTooltip: false ,
            onHeaderCell: ( column ) => {
                //配置表头属性，增加title值
                return {
                    title: cn
                }
            }
        }
        //排序
        tem["sorter"] = (a,b) => {
            let data1 = a[en] + "";
            if( data1.length >= 12 ){
                data1 = data1.substring(0,12)
            }
            let data2 = b[en] + "";
            if( data2.length >= 12 ){
                data2 = data2.substring(0,12)
            }
            if (isValidVariable(data1) && isValidVariable(data2)) {
                let res = data1.localeCompare(data2);
                if (0 !== res) {
                    return res;
                }
            } else if (isValidVariable(data1)) {
                return -1;
            } else if (isValidVariable(data2)) {
                return 1;
            }
            return 0;
        }
        //默认排序
        if( en === "FFIXT" ){
            tem["defaultSortOrder"] ='ascend'
        }
        if( en === "FFIXT" || en === "CTO" || en === "CTOT" || en === "ETO"|| en === "EAWT" || en === "OAWT"){
            // tem["width"] = (screenWidth > 1920) ? 70 : 58
        }
        if(en === "ALARM" ){
            tem["width"] = (screenWidth > 1920) ? 105 : 90
        }
        // if( en === "CTO" || en === "CTOT" || en === "COBT" ){
        //     tem["align"] = "left"
        // }
        if( en === "FLIGHTID" ){
            tem["width"] = (screenWidth > 1920) ? 95 : 63
            tem["fixed"] = 'left'
        }

        if( en === "STATUS" ){
            tem["width"] = (screenWidth > 1920) ? 75 : 65
        }

        //隐藏列
        if( en === "orgdata" ){
            tem["className"] = "notshow";
            tem["width"] = 0
        }

        tem["render"] = (text, record, index) => {
            const opt = {
                text,
                record,
                index,
                col: en,
                colCN: cn,
            };
            return render(opt);
        }

        columns.push(tem)
    }
    return columns;
}

const { getAlarmValueZh } = FlightCoordination;

const formatAlarmValue = (values)=>{
    let arr = values.map((item)=> {
        return getAlarmValueZh(item);
    })
    return arr;
};
//数据转换，将航班转化为表格格式
const formatSingleFlight = flight => {
    let { alarmField, taskField, eapField, oapField, tobtField, cobtField, ctotField, fmeToday, ffixField, ctoField, etoField, agctField } = flight;
    alarmField = isValidVariable(alarmField) || {};
    taskField = taskField || {};
    eapField = eapField || {};
    oapField = oapField || {};
    tobtField = tobtField || {};
    tobtField = tobtField || {};
    cobtField = cobtField || {};
    ctotField = ctotField || {};
    agctField = agctField || {};
    fmeToday = fmeToday || {};
    ffixField = ffixField || {};
    ctoField = ctoField || {};
    etoField = etoField || {};
    let taskVal = taskField.value || "";
    if( !isValidVariable(taskVal) || taskVal === "普通" ){
        taskVal = "";
    }
    let alarms = flight.alarms || [];

    let flightObj = {
        key: flight.id,
        id: flight.id,
        FLIGHTID: flight.flightid,
        ALARM: formatAlarmValue(alarms).map((item)=>(
            <Tooltip key={item.key} title={item.descriptions}>
                <Tag className={`alarm-tag alarm_${item.key} `}  key={item.key} color={item.color}>{item.zh}</Tag>
            </Tooltip>
        )),
        TASK: taskVal,
        // TASK: PriorityList[flight.priority],
        EAW: eapField.name,
        EAWT: eapField.value,
        OAW: oapField.name,
        OAWT: oapField.value,
        ACTYPE: flight.aircrafttype,
        DEPAP:  flight.depap,
        ARRAP: flight.arrap,
        SOBT: getDayTimeFromString(flight.sobt),
        EOBT: getDayTimeFromString(flight.eobt),
        TOBT: tobtField.value,
        COBT: cobtField.value,
        CTOT: ctotField.value,
        AGCT: getDayTimeFromString( agctField.value ),
        ATOT: flight.atd,
        FETA: getDayTimeFromString(flight.formerArrtime),
        FFIX: ffixField.name,
        FFIXT: ffixField.value,
        CTO: ctoField.value,
        ETO: getTimeAndStatus(etoField.value),
        // STATUS: flight.runningStatus,
        STATUS: flight.flightStatus,
        orgdata: JSON.stringify(flight)
    }
    return flightObj;
};


export {  getColumns, formatSingleFlight }