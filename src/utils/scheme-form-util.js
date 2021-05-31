import { isValidObject, isValidVariable } from './basic-verify';
/**
 * 方案表单通用方法
 */
const SchemeFormUtil = {

    /* *
    * 页面类型
    */
    PAGETYPE_CREATE: 'CREATE', //手动创建 
    PAGETYPE_MODIFYSIM: 'MODIFYSIM', //修改模拟状态的方案
    PAGETYPE_MODIFY: 'MODIFY', //修改正式的方案
    PAGETYPE_IMPORT: 'IMPORT', //外区流控导入方案 
    PAGETYPE_IMPORTWITHFORMER: 'IMPORTWITHFORMER', //外区流控导入方案已有关联的方案

    // 交通流模块录入方式
    INPUTMETHOD_SHORTCUT : 'SHORTCUT', // 快捷录入
    INPUTMETHOD_CUSTOM : 'CUSTOM', // 自定义录入

    /**
     * 区域标签机场集合
     */
    AreaLabelAirport : [
        {
            label: '兰州',
            airport: 'ZBAL;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY',
            code: 'ZLLL'
        },
        {
            label: '西安',
            airport: 'ZLAK;ZLHZ;ZLQY;ZLXY;ZLYA;ZLYL',
            code: 'ZLXY'
        },
        {
            label: '山东',
            airport: 'ZSHZ;ZSJG;ZSJN;ZSDY;ZSWF;ZSRZ;ZSLY;ZSYT;ZSWH;ZSQD',
            code: 'ZSQD'
        },
    ],

    /**
     * 备选航路表单字段集合
     */
    InitialAlterRoutesFieldData : [
        {
            name: 'alterRoute1',
            extra: ""
        },
        {
            name: 'alterRoute2',
            extra: "",
        },
        {
            name: 'alterRoute3',
            extra: "",
        },
        {
            name: 'alterRoute4',
            extra: "",
        },
        {
            name: 'alterRoute5',
            extra: "",
        },
    ],


    /**
     * 需要将数值转换为大写的字段
     */
    UpperFields : [
        "targetUnit",
        "formerUnit",
        "behindUnit",
        "exemptFormerUnit",
        "exemptBehindUnit",
        "flightId",
        "exemptionFlightId",
        "aircraftType",
        "exemptionAircraftType",
        "depAp",
        "arrAp",
        "exemptDepAp",
        "exemptArrAp",
    ],

    
    /* 
    * 获取可显示快捷录入表单的页面类型集合
    */

    getIsShowShortcutFormPageType : function(){
        return [this.PAGETYPE_CREATE]
    },

    /* 
    * 获取限制方式和交通流信息表单禁用的页面类型集合
    */
    getIsDisabledPageType : function(){
        return [
            this.PAGETYPE_MODIFY,
            this.PAGETYPE_MODIFYSIM,
        ]
    },

    /**
     * 解析指定数值中的区域标签，转换为对应的机场
     *
     * @param arr 数组
     * @returns 机场数组
     */
    parseAreaLabelAirport : function (arr) {
        let result = [];
        if (Array.isArray(arr)) {
            if (arr.length == 0) {
                return result;
            }
            for (let i = 0; i < arr.length; i++) {
                let label = arr[i];
                let airports = this.filterAreadLabelAirport(label);
                if (isValidVariable(airports)) {
                    let airportArr = airports.split(';')
                    result = result.concat(airportArr);
                } else {
                    result = result.concat(label)
                }
            }
        }
        return result;
    },

    /**
     * 查找指定区域标签对应的机场集合
     *
     * @param label 标签
     * @returns 机场数组
     */
     filterAreadLabelAirport : function (label) {
        for (let i = 0; i < this.AreaLabelAirport.length; i++) {
            let data = this.AreaLabelAirport[i];
            let dataLabel = data.label.trim();
            if (label.trim() === dataLabel) {
                let airports = data.airport;
                return airports;
            }
        }
        return ''
    },

    /**
     * 在指定机场集合中查找能够匹配成区域标签的机场，将其替换为区域标签,
     * 并返回区域标签和未匹配成的剩余机场集合
     * @param airport 机场数组
     * @returns 机场数组
     */
     formatAreaLabel : function (airport) {
        let array = this.AreaLabelAirport.reduce(this.reducer, airport);
        let sortedArray = [...new Set(array)].sort((a, b) => a.localeCompare(b));
        return sortedArray;
    },

    /**
     * 筛选机场
     * @accumulator  
     * @param currentValue 机场数组
     * @returns 机场数组
     */
     reducer : function (accumulator, currentValue, index, array) {
        let currentArr = currentValue.airport.split(';');
        let len = currentArr.length;
        let includesArr = currentArr.filter((v) => accumulator.includes(v));
        if (includesArr.length === len) {
            accumulator =  accumulator.map((item)=>(currentArr.includes(item) ? currentValue.label : item  ))    
        }
        return accumulator
    },


    /**
     * 处理选择输入框的数值
     * 1.小写转大写
     * 2.去除空项
     * 3.去重
     * @param array 数组
     * @returns 数组
     */
    handleSelectValue : function (array) {
        let result = [];
        let value = [];
        // 转换字符串并转换为大写
        let valString = array.join(";").toUpperCase();
        // 转回数组
        let upperCaseArray = valString.split(";");
        for(let i=0; i<upperCaseArray.length; i++){
            // 单项数值
            let v = upperCaseArray[i];
            // 去掉空项
            if(isValidVariable(v)){
                // 将单项数值转为数组，用于将"ZLLL;ZLIC"格式的字符串拆分为多个数值
                let arr = v.split(';');
                value = [...value, ...arr];
            }
        }
        // 去重
        let uniqueValue = value.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
        result = uniqueValue;
        return result;
    },

    /**
     * 处理各机场选择输入框的数值
     * 1.先将数值中的区域标签转换为对应的机场
     * 2.小写转大写
     * 3.去除空项
     * 4.去重
     * 5.将可匹配成区域标签的机场格式化为区域标签
     * @param array 选择输入框的数值
     * @returns 数组
     */
     handleAirportSelectInputValue : function (array) {
        let result = [];
        let value = [];
        // 先将数值中的区域标签转换为对应的机场
        let airportArr = this.parseAreaLabelAirport(array)
        // 转换字符串并转换为大写
        let airportString = airportArr.join(";").toUpperCase();
        // 转回数组
        let upperCaseArray = airportString.split(";");
        for(let i=0; i<upperCaseArray.length; i++){
            // 单项数值
            let v = upperCaseArray[i];
            // 去掉空项
            if(isValidVariable(v)){
                // 将单项数值转为数组，用于将"ZLLL;ZLIC"格式的字符串拆分为多个数值
                let arr = v.split(';');
                value = [...value, ...arr];
            }
        }
        // 去重
        let uniqueValue = value.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
        // 将可匹配成区域标签的机场格式化为区域标签
        result = this.formatAreaLabel(uniqueValue);
        return result;
    },



    /**
     * 转换为大写
     * @values 被转换字段对象
     * @returns 被转换后的字段对象
     */
    toUpperCaseValues : function (values)  {
        for (var v in values) {
            if (this.UpperFields.includes(v)) {
                values[v] = this.upperCaseValue(values[v]);
            }
        }
        return values;
    },

    /**
     * 转换为大写
     * @values 要转换的数值 字符串或数组  
     * @returns 字符串或数组
     */

    // 转换为大写
    upperCaseValue : function(values) {
        if (typeof values === 'string') {
            return values.toUpperCase();
        } else if (Array.isArray(values)) {
            return values.join(',').toUpperCase().split(',')
        }
    },

    






};

export { SchemeFormUtil};