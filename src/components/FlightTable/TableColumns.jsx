/*
 * @Author: your name
 * @Date: 2020-12-15 10:52:07
 * @LastEditTime: 2020-12-23 11:18:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\TablePage\TableColumns.js
 */
import React from 'react'
import { isValidVariable } from '../../utils/basic-verify'
import { Input, Button , Popover, Checkbox, DatePicker ,Space     } from 'antd'



const getTitle = (opt)  =>{
    const {text, record, index, col} = opt;
    return record.FLIGHTID
}
const getContent = (opt)  =>{
    const {text, record, index, col} = opt;
    return (
        <div>
            <div>
                <Input addonBefore="航班"  defaultValue={ record.FLIGHTID }  disabled />
            </div>
            <div>
                <Input addonBefore="机场"  defaultValue={ record.FLIGHTID } disabled  />
            </div>
            <div>
                <Space size={1}>
                    <span class="ant-input-group-addon">日期</span>
                    <DatePicker />
                </Space>
            </div>
            <div>
                <Input addonBefore="时间"  defaultValue={ record.FLIGHTID } />
            </div>
            <div>
                <Checkbox >禁止系统自动调整</Checkbox>
            </div>
            <div>
                <Input.TextArea showCount maxLength={100} />
            </div>
            <div>
                <Button type="primary">Primary Button</Button>
                <Button>Default Button</Button>
            </div>


        </div>
    )
}


const getCell = (opt) => {

    const {text, record, index, col, colCN} = opt;
    let color = "";

    let obj  = {
        children: <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={getTitle(opt)}
            content={getContent(opt)}
            trigger={[`contextMenu`]}
        >
            <div className="ccc">{text}</div>
        </Popover >,
        props: {
            "col-key":col,
        },
    };
    return obj;

};


const render = (opt)  => {
    const {text, record, index, col} = opt;
    if(isValidVariable(text)){
        return  getCell(opt);
    }else {
        return <div className="ccc">{text}</div>
    }
}


//表格列配置
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
        "cn":"状态"
    },
    "DEPAP":{
        "en":"DEPAP",
        "cn":"起飞机场"
    },
    "ARRAP":{
        "en":"ARRAP",
        "cn":"降落机场"
    },
    "CTOT":{
        "en":"CTOT",
        "cn":"计算起飞"
    },
    "ATOT":{
        "en":"ATOT",
        "cn":"实际起飞"
    },
    "SOBT":{
        "en":"SOBT",
        "cn":"计划撤轮档"
    },
    "EOBT":{
        "en":"EOBT",
        "cn":"预计撤轮档"
    },
    "TOBT":{
        "en":"TOBT",
        "cn":"目标撤轮档"
    },
    "COBT":{
        "en":"COBT",
        "cn":"计算撤轮档"
    },
    "OAP":{
        "en":"OAP",
        "cn":"出区域点"
    },
    "OAPT":{
        "en":"OAPT",
        "cn":"出区域点时间"
    }
}

const columns = [
    {
        title: "",
        dataIndex: "rowNum",
        align: 'center',
        key: "rowNum",
        width: 40,
        fixed: 'left',
        render: (text, record, index) => `${index+1}`
    }
];

for(let key in names){
    const obj = names[key]
    const en = obj["en"]
    const cn = obj["cn"]
    const cnLen = cn.length;
    let colWidth = cnLen*16+22;
    if( colWidth < 63){
        colWidth =  63;
    }
    let tem = {
        title: cn,
        dataIndex: en,
        align: 'center',
        key: en,
        width: colWidth,
        ellipsis: true,
        className: en,
    }

    //排序
    tem["sorter"] = (a,b) => {
        let data1 = a[en] + "";
        let data2 = b[en] + "";
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
    if( en === "FFIXT"){
        tem["defaultSortOrder"] ='ascend'
    }
    if( en === "FLIGHTID" ){
        tem["width"] = 80
        tem["fixed"] = 'left'
    }

    if( en === "EXIT_POINT" || en === "EXIT_POINT_TIME" || en === "ENTRY_POINT" || en === "ENTRY_POINT_TIME" || en === "GUID"){
        tem["width"] = 80
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


//表格数据
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