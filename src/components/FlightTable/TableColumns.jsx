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
import { Input, Button , Popover, Checkbox, DatePicker     } from 'antd'



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
                <Input addonBefore="日期"  defaultValue={ record.FLIGHTID } />
                <DatePicker addonBefore="日期"  />
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


const render = (opt)  => {
    const {text, record, index, col} = opt;
    if(isValidVariable(text)){
        return  <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={getTitle(opt)}
            content={getContent(opt)}
            trigger={[`contextMenu`]}
        >
            <div className="ccc">{text}</div>
        </Popover >
    }else {

    }

}


//表格列配置
const names = {
    "FLIGHTID":{
        "en":"FLIGHTID",
        "cn":"CallSign"
    },
    "SPECIAL_STATUS":{
        "en":"SPECIAL_STATUS",
        "cn":"告警"
    },
    "DEPAP":{
        "en":"DEPAP",
        "cn":"ADEP"
    },
    "ARRAP":{
        "en":"ARRAP",
        "cn":"ADES"
    },
    "SOBT":{
        "en":"SOBT",
        "cn":"SOBT"
    },
    "EOBT":{
        "en":"EOBT",
        "cn":"EOBT"
    },
    "TOBT":{
        "en":"TOBT",
        "cn":"TOBT"
    },
    "COBT":{
        "en":"COBT",
        "cn":"COBT"
    },
    "CTOT":{
        "en":"CTOT",
        "cn":"CTOT"
    },
    "ATOT":{
        "en":"ATOT",
        "cn":"ATOT"
    },
    "ACCFIX":{
        "en":"ACCFIX",
        "cn":"CFix"
    },
    "FLOWCONTROL_POINT_PASSTIME_CTO":{
        "en":"FLOWCONTROL_POINT_PASSTIME_CTO",
        "cn":"CTO"
    },
    "FLOWCONTROL_POINT":{
        "en":"FLOWCONTROL_POINT",
        "cn":"FFix"
    },
    "FLOWCONTROL_POINT_PASSTIME":{
        "en":"FLOWCONTROL_POINT_PASSTIME",
        "cn":"FFixT"
    },
    "EXIT_POINT":{
        "en":"EXIT_POINT",
        "cn":"出区域点"
    },
    "EXIT_POINT_TIME":{
        "en":"EXIT_POINT_TIME",
        "cn":"出区时间"
    },
    "ENTRY_POINT":{
        "en":"ENTRY_POINT",
        "cn":"入区域点"
    },
    "ENTRY_POINT_TIME":{
        "en":"ENTRY_POINT_TIME",
        "cn":"入区时间"
    },
    "STATUS":{
        "en":"STATUS",
        "cn":"状态"
    },
    "GUID":{
        "en":"GUID",
        "cn":"数据来源"
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
    let tem = {
        title: cn,
        dataIndex: en,
        align: 'center',
        key: en,
        width: 63,
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
    if( en === "FLOWCONTROL_POINT_PASSTIME"){

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
        };
        return render(opt);
    }

    columns.push(tem)
}


//表格数据
const data = [];
for (let i = 0; i < 200; i++) {
    data.push({
        "FLIGHTID":"CCA3345",
        "SPECIAL_STATUS":"",
        "DEPAP":"ZLXY",
        "ARRAP":"ZBAA",
        "SOBT":"15/1200",
        "EOBT":"15/1200",
        "TOBT":"15/1200",
        "COBT":"15/1200",
        "CTOT":"15/1200",
        "ATOT":"15/1200",
        "ACCFIX":"ENH",
        "FLOWCONTROL_POINT_PASSTIME_CTO":"15/1200",
        "FLOWCONTROL_POINT":"ENH",
        "FLOWCONTROL_POINT_PASSTIME":"15/"+ (1250-i),
        "EXIT_POINT":"ENH",
        "EXIT_POINT_TIME":"15/1200",
        "ENTRY_POINT":"ENH",
        "ENTRY_POINT_TIME":"15/1200",
        "STATUS":"已起飞",
        "GUID":""
    });
}
export { columns, data }