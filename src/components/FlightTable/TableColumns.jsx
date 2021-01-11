/*
 * @Author: your name
 * @Date: 2020-12-15 10:52:07
 * @LastEditTime: 2020-12-23 11:18:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\TablePage\TableColumns.js
 */
import React from 'react'
import { isValidVariable } from 'utils/basic-verify'
import { FLIGHTIDPopover, FFIXTPopover, COBTPopover, CTOTPopover, CTOPopover, EAPTPopover, OAPTPopover } from  './CollaboratePopover'

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
    "EAP":{
        "en":"EAP",
        "cn":"入区域点"
    },
    "EAPT":{
        "en":"EAPT",
        "cn":"入区域点时间"
    },
    "ACTYPE":{
        "en":"ACTYPE",
        "cn":"机型"
    },
    "STATUS":{
        "en":"STATUS",
        "cn":"航班状态"
    },
    "DEPAP":{
        "en":"DEPAP",
        "cn":"起飞机场"
    },
    "ARRAP":{
        "en":"ARRAP",
        "cn":"降落机场"
    },
    "EOBT":{
        "en":"EOBT",
        "cn":"预计撤轮档时间"
    },
    "COBT":{
        "en":"COBT",
        "cn":"计算预撤时间"
    },
     "CTOT":{
        "en":"CTOT",
        "cn":"计算起飞时间"
    },
    "ATOT":{
        "en":"ATOT",
        "cn":"实际起飞时间"
    },
    "SOBT":{
        "en":"SOBT",
        "cn":"计划撤轮档"
    },
    "TOBT":{
        "en":"TOBT",
        "cn":"目标撤轮档"
    },
    "OAP":{
        "en":"OAP",
        "cn":"出区域点"
    },
    "OAPT":{
        "en":"OAPT",
        "cn":"出区域点时间"
    },
    "FETA":{
        "en":"FETA",
        "cn":"前段降落时间"
    },
    "AGCT":{
        "en":"AGCT",
        "cn":"关舱门时间"
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
    let popover = <div col-key= {col} title={text}>{text}</div>
    if( col === "FLIGHTID" ){
        popover = <FLIGHTIDPopover opt={opt} />
    }
    else if( col === "FFIXT" ){
        popover = <FFIXTPopover opt={opt} />
    }
    else if( col === "COBT" ){
        popover = <COBTPopover opt={opt} />
    }
    else if( col === "CTOT" ){
        popover = <CTOTPopover opt={opt} />
    }
    else if( col === "CTO" ){
        popover = <CTOPopover opt={opt} />
    }
    else if( col === "EAPT" ){
        popover = <EAPTPopover opt={opt} />
    }
    else if( col === "OAPT" ){
        popover = <OAPTPopover opt={opt} />
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
    let columns = [
        {
            title: "",
            dataIndex: "rowNum",
            align: 'center',
            key: "rowNum",
            width: (screenWidth > 1920) ? 50 : 35,
            fixed: 'left',
            render: (text, record, index) => `${index+1}`
        }
    ];
    //生成表配置-全部
    for(let key in names){
        const obj = names[key]
        const en = obj["en"]
        const cn = obj["cn"]
        let tem = {
            title: en,
            dataIndex: en,
            align: 'center',
            key: en,
            width: (screenWidth > 1920) ? 80 : 65,
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
        if( en === "FFIXT" || en === "CTO" || en === "CTOT" || en === "ETO"|| en === "EAPT" || en === "OAPT"){
            tem["width"] = (screenWidth > 1920) ? 90 : 72
        }
        // if( en === "CTO" || en === "CTOT" || en === "COBT" ){
        //     tem["align"] = "left"
        // }
        if( en === "FLIGHTID" ){
            tem["width"] = (screenWidth > 1920) ? 95 : 78
            tem["fixed"] = 'left'
        }

        if( en === "STATUS" ){
            tem["width"] = (screenWidth > 1920) ? 80 : 65
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


export {  getColumns }