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
import { Input, Button , Popover, Checkbox, DatePicker ,Space, Tooltip } from 'antd'
import { FLIGHTIDPopover, FFIXTPopover, COBTPopover, CTOTPopover } from  './CollaboratePopover'


// 右键渲染模块内容
const render = (opt)  => {
    const {text, record, index, col, colCN} = opt;
    let color = "";
    let popover = <div col-key= {col} >{text}</div>
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
    let obj  = {
        children: popover,
        props: {
            "col-key":col, //td会增加这个属性
        },
    };
    return obj;
}


//表格列名称-中英-字典
const names = {
    "FLIGHTID":{
        "en":"FLIGHTID",
        "cn":"航班号"
    },
    "ALARM":{
        "en":"ALARM",
        "cn":"告警"
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
    "orgdata": {
        "en":"orgdata",
        "cn":"原数据"
    }
}
//表格列配置-默认-计数列
const columns = [
    {
        title: "",
        dataIndex: "rowNum",
        align: 'center',
        key: "rowNum",
        width: 50,
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
        width: 80,
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
        if( data1.length > 14 ){
            data1 = data1.substring(0,14)
        }
        let data2 = b[en] + "";
        if( data2.length > 14 ){
            data2 = data1.substring(0,14)
        }
        if (isValidVariable(data1) && isValidVariable(data2)) {
            let res = data1.localeCompare(data2);
            if (0 != res) {
                return res;
            }
        } else if (isValidVariable(data1)) {
            return -1;
        } else if (isValidVariable(data2)) {
            return 1;
        } else {
            return 0;
        }
    }
    //默认排序
    if( en === "FFIXT" ){
        tem["defaultSortOrder"] ='ascend'
    }
    if( en === "FFIXT" || en === "CTO" || en === "ETO"|| en === "EAPT" || en === "OAPT"){
        tem["width"] = 90
    }
    if( en === "FLIGHTID" ){
        tem["width"] = 95
        tem["fixed"] = 'left'
    }

    if( en === "STATUS" ){
        tem["width"] = 80
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

//表格模拟数据
const data = [];
for (let i = 0; i < 200; i++) {
    data.push({
        "key": i,
        "FLIGHTID":"CCA3345",
        "ALARM":"",
        "TASK":"",
        "EAP":"OMBON",
        "EAPT":"15/1312",
        "OAP":"VISIN",
        "OAPT":"15/1345",
        "ACTYPE":"B737",
        "ADEP":"ZLXY",
        "ARRAP":"ZBAA",
        "SOBT":"15/1200",
        "EOBT":"15/1200",
        "TOBT":"15/1200",
        "COBT":"15/1200",
        "CTOT":"15/1200",
        "ATOT":"15/1200",
        "FETA":"15/1007",
        "FFIX":"ENH",
        "FFIXT":"15/"+ (1250-i),
        "CTO":"15/1200",
        "ETO":"15/1200",
        "STATUS":"已起飞",
    });
}


export { columns, data }