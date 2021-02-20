/*
 * @Author: your name
 * @Date: 2020-12-15 10:52:07
 * @LastEditTime: 2021-02-19 15:48:47
 * @LastEditors: Please set LastEditors
 * @Description: 表格列配置、列数据转换、右键协调渲染
 * @FilePath: \WN-CDM\src\pages\TablePage\TableColumns.js
 */
import React from 'react'
import { isValidVariable, getDayTimeFromString, getTimeAndStatus } from 'utils/basic-verify'
import { FlightCoordination } from 'utils/flightcoordination'
import { ColorPopover } from  './CollaboratePopover'
import FLIGHTIDPopover from  './FLIGHTIDPopover'
import TOBTPopover from  './TOBTPopover'
import CTPopover from  './CTPopover'
import { Tag, Tooltip } from "antd";

/**
 * 告警列单元格渲染格式化
 * */
const randerAlarmCellChildren =(opt)=> {
    const {text, record, index, col, colCN} = opt;
    // 置空title属性,解决title显示[object,object]问题
    return <div className="alarm" title="">{text}</div>
}

/**
 * 根据航班id滚动到对应位置
 * @param classStr  定位容器class
 * */
const scrollTopById = (id, classStr ) => {
    // console.log("目标定位航班是：",props.flightTableData.getTargetFlight.id, props.flightTableData.getTargetFlight.flightid );
    if( isValidVariable(id) ){
        const flightCanvas = document.getElementsByClassName(classStr);
        const boxContent = flightCanvas[0].getElementsByClassName("box_content");
        const contentH = boxContent[0].clientHeight; //表格外框高度
        const tableBody = boxContent[0].getElementsByClassName("ant-table-body");
        const tableTBody = boxContent[0].getElementsByClassName("ant-table-tbody");
        const tableTBodyH = tableTBody[0].clientHeight; //表格总高度
        // console.log("目标定位航班[contentH]是：",contentH, "tableBodyH:", tableBodyH );
        if( tableTBodyH*1 > contentH*1 ){
            //计算定位航班
            const tr = boxContent[0].getElementsByClassName( id );
            if( tr.length > 0 ){
                const trHeight = tr[0].clientHeight;
                const rowIndex = tr[0].firstElementChild.innerHTML; //当前航班所在行号
                let mtop = rowIndex *  trHeight;
                // console.log("目标定位航班是：",tr , trHeight, rowIndex, mtop);
                if( contentH/2 < mtop ){
                    const scrollTop = Math.floor( mtop - contentH/2 );
                    // console.log("目标定位航班  滚动高度是：", scrollTop);
                    tableBody[0].scrollTop = scrollTop;
                }
            }
            
        }
    }
}
//设置行高亮-传入目标dom
const highlightRowByDom = targetDom => {
    let tClass = targetDom.getAttribute("class");
    const trs = targetDom.parentElement.children;
    clearHighlightRowByDom(trs);
    targetDom.setAttribute("class", tClass+" active_row");  
}

//清除行高亮-定位容器class
const clearHighlightRowByDom = trs => {
    const len = trs.length;
    for(let i = 0; i < len; i++){
        let trDom = trs[i];
        let trClass = trDom.getAttribute("class");
        trClass = trClass.replace("active_row", "");
        trDom.setAttribute("class", trClass);
    } 
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
        popover = <CTPopover opt={opt} />
    }
    else if( col === "COBT" ){
        popover = <CTPopover opt={opt} />
    }
    else if( col === "CTOT" ){
        popover = <CTPopover opt={opt}/>
    }
    else if( col === "CTO" ){
        popover = <ColorPopover opt={opt}/>
    }
    else if( col === "EAWT" ){
        popover = <ColorPopover opt={opt} />
    }
    else if( col === "OAWT" ){
        popover = <ColorPopover opt={opt} />
    }
    else if( col === "ALARM" ){
        popover = randerAlarmCellChildren(opt)
    }
    else if( col === "TOBT" ){
        popover = <TOBTPopover opt={opt} />
    }
    else if( col === "ATOT" ){
        popover = <ColorPopover opt={opt} />
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
            width: (screenWidth > 1920) ? 80 : 80,
            ellipsis: true,
            className: en,
            showSorterTooltip: false,
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
        if( en === "FFIX" || en === "EAW" || en === "OAW" ){
            tem["width"] = (screenWidth > 1920) ? 95 : 65
        }
        if( en === "FFIXT" ){
            tem["defaultSortOrder"] ='ascend';
            tem["width"] = (screenWidth > 1920) ? 95 : 65
        }
        // if( en === "FFIXT" || en === "CTO" || en === "CTOT" || en === "ETO"|| en === "EAWT" || en === "OAWT"){
        //     tem["width"] = (screenWidth > 1920) ? 70 : 58
        // }
        if(en === "ALARM" ){
            tem["width"] = (screenWidth > 1920) ? 105 : 90
        }
        // if( en === "CTO" || en === "CTOT" || en === "COBT" ){
        //     tem["align"] = "left"
        // }
        if( en === "FLIGHTID" ){
            tem["width"] = (screenWidth > 1920) ? 120 : 100
            tem["fixed"] = 'left'
        }

        if( en === "STATUS" ){
            tem["width"] = (screenWidth > 1920) ? 75 : 65;
        }
        // if( en === "FLIGHTID" ){
        //     tem["onCell"] = function(record, rowIndex){
        //         return {
        //             onContextMenu: event => {
        //                 console.log(event, record, rowIndex);
        //                 const cellDom = event.target;
        //                 ReactDOM.render( <FLIGHTIDPopover2 opt={record} /> ,cellDom)
        //             },
        //         };
        //     };
        // }

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
        ALARM: alarms.join("-"),
        // formatAlarmValue(alarms).map((item)=>(
        //     <Tooltip key={item.key} title={item.descriptions}>
        //         <Tag className={`alarm-tag alarm_${item.key} `}  key={item.key} color={item.color}>{item.zh}</Tag>
        //     </Tooltip>
        // )),
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


export {  getColumns, formatSingleFlight, scrollTopById, highlightRowByDom, clearHighlightRowByDom }