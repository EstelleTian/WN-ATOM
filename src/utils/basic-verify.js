/*
 * @Author: liutianjiao
 * @Date: 2020-12-15 15:12:48
 * @LastEditTime: 2021-02-03 16:33:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\utils\basic-verify.js
 */
//基础校验规则
/**
 * 判断是否为有效变量
 * @param variable
 */
const isValidVariable = ( variable ) => {
    if (variable !== undefined && variable !== null && variable !== 'null') {
        if (typeof variable === 'string') {
            if (variable.trim() !== '') {
                return true;
            } else {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
};
/**
 * 判断是否为对象类型且有值()
 *
 * @param variable
 */
const isValidObject = (variable) => {
    //null undefined "" 0 NaN
    if( variable ){
        if( typeof variable === "object" && !(variable instanceof Array) ){
            for(let key in variable){
                if( key ){
                    return true;
                }
            }
        }
    }
    return false;
};

/**
 * 计算两个时间差（前者-后者）, 返回毫秒值
 *
 * @param time1 yyyyMMddHHmm
 * @param time2 yyyyMMddHHmm
 * @returns {Number}
 */
const calculateStringTimeDiff = (time1, time2) => {
    let millis1;
    if( !isValidVariable(time1) ){
        millis1 = 0;
    }else{
        millis1 = parseFullTime(time1).getTime();
    }

    let millis2;
    if( !isValidVariable(time2) ){
        millis2 = 0;
    }else{
        millis2 = parseFullTime(time2).getTime();
    }
    return millis1 - millis2;
};

/**
 * 解析yyyyMMddHHmm格式时间
 *
 * @param str
 *            yyyyMMddHHmm
 * @returns {Date}
 */
const parseFullTime = (str) => {
    // 按照十进制解析
    let year = parseInt(str.substring(0, 4), 10);
    let month = parseInt(str.substring(4, 6), 10) - 1;
    let day = parseInt(str.substring(6, 8), 10);
    let hour = parseInt(str.substring(8, 10), 10);
    let mins = parseInt(str.substring(10, 12), 10);

    let date = new Date();
    date.setFullYear(year, month, day);
    date.setHours(hour);
    date.setMinutes(mins);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
};

/**
 * 获取Date对象的yyyyMMddHHmm格式数据
 *
 * @param date
 * @returns
 */
const getFullTime = (date, type) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let mins = date.getMinutes();
    let seconds = date.getSeconds();
    year = '' + year;
    month = month < 10 ? '0' + month : '' + month;
    day = day < 10 ? '0' + day : '' + day;
    hour = hour < 10 ? '0' + hour : '' + hour;
    mins = mins < 10 ? '0' + mins : '' + mins;
    seconds = seconds < 10 ? '0' + seconds : '' + seconds;
    let fullTime = year + month + day + hour + mins;
    if( type === 1 ){
        fullTime = year + "-" + month + "-" + day + " " + hour + ":" + mins + ":" + seconds;
    }
    if( type === 2 ){
        fullTime = day + "/" + hour + ":" + mins ;
    }
    if( type === 3 ){
        fullTime = hour  + mins ;
    }
    return fullTime;
};

/**
 * 时间加减
 *
 * @param date
 *            yyyyMMddHHmm
 * @param addMillis
 * @returns {Date}
 */
const addDateTime = (date, addMillis) => {
    let newDateMillis = date.getTime() + addMillis;
    let newDate = new Date();
    newDate.setTime(newDateMillis);
    return newDate;
};

/**
 * 时间加减
 *
 * @param time
 *            yyyyMMddHHmm
 * @param addMillis
 * @returns {String}
 */
const addStringTime = (time, addMillis) => {
    let date = parseFullTime(time);
    let newDate = addDateTime(date, addMillis);
    let newStringTime = getFullTime(newDate);
    return newStringTime;
}

/**
 * 12为字符串时间转换格式
 *
 * @param str  yyyyMMddHHmm 12位字符串
 * @param addMillis
 * @returns {String}
 */
const formatTimeString = ( str ) => {
    if( isValidVariable(str) && ( str.length === 12 || str.length === 14 ) ){
        // 解析各个值
        const year = str.substring(0, 4);
        const month = str.substring(4, 6);
        const day = str.substring(6, 8);
        const hour = str.substring(8, 10);
        const mins = str.substring(10, 12);

        return year + '-' + month + '-' + day + ' ' + hour  + ':' + mins;
    }
    return "";
};

/**
 * 12为字符串时间转换格式(转为HH:mm)
 *
 * @param str  yyyyMMddHHmm 12位字符串
 * @param addMillis
 * @returns {String}
 */
const getTimeFromString = ( str ) => {
    if( isValidVariable(str) && ( str.length === 12 || str.length === 14 ) ){
        // 解析各个值
        const hour = str.substring(8, 10);
        const mins = str.substring(10, 12);

        return hour  + ':' + mins;
    }
    return "";
};

/**
 * 12为字符串时间转换格式(转为DD/HHmm)
 *
 * @param str  yyyyMMddHHmm 12位字符串
 * @param addMillis
 * @param nomins {boolen}
 * @returns {String}
 */
const getDayTimeFromString = ( str, nomins, type ) => {
    if( isValidVariable(str) && ( str.length === 12 || str.length === 14 ) ){
        // 解析各个值
        const day = str.substring(6, 8);
        const hour = str.substring(8, 10);
        const mins = str.substring(10, 12);
        if( type === 2 ){
            if( nomins ){
                return day + "/" + hour  +  "00";
            }else{
                return  day + "/" +hour  +  mins;
            }
        }else{
            if( nomins ){
                return  hour  +  "00";
            }else{
                return  hour  +  mins;
            }
        }
        
    }
    return "";
};

/**
 * 8位字符串时间转换格式(转为YYYY-MM-DD)
 *
 * @param str  yyyyMMddHHmm 12位字符串
 * @param addMillis
 * @returns {String}
 */
const getDateFromString = ( str ) => {
    if( isValidVariable(str) && ( str.length === 12 || str.length === 14 ) ){
        // 解析各个值
        const year = str.substring(0, 4);
        const month = str.substring(4, 6);
        const day = str.substring(6, 8);

        return year + '-' + month + '-' + day;
    }
    return "";
};
/**
 * 字符串转化为时间+字母
 *
 * @param str  yyyyMMddHHmm A/E/C/P 15位字符串
 * @param addMillis
 * @returns {String}
 */
const getTimeAndStatus = ( str ) => {
    if( isValidVariable(str) && ( str.length >= 14 ) ){
        // 解析各个值
        const time = str.substring(0, 14);
        let status = "";
        if( str.length > 14 ){
            status = str.substring(14)
            return getDayTimeFromString( time ) + ' ' + status
        }
        return getDayTimeFromString( time )
    }
    return "";
};
/**
 * 根据毫秒返回用时
 *
 * @param str  毫秒数
 * @param addMillis
 * @returns {String}
 */
const millisecondToDate = ( msd ) => {
    let time = parseFloat(msd) / 1000; //先将毫秒转化成秒
    if ( isValidVariable(time) ) {
        if (time > 60 && time < 60 * 60) {
            time = parseInt(time / 60) + "分钟" + parseInt((parseFloat(time / 60) - parseInt(time / 60)) * 60) + "秒";
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time = parseInt(time / 3600) + "小时"
                + parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60) + "分钟"
                + parseInt((parseFloat((parseFloat(time / 3600) - parseInt(time / 3600)) * 60) - parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60)) * 60) + "秒";
        } else {
            time = parseInt(time) + "秒";
        }
    }
    return time;
};
export { isValidVariable, isValidObject, calculateStringTimeDiff, addStringTime, getFullTime, formatTimeString,
    getTimeFromString, getDayTimeFromString, getDateFromString, getTimeAndStatus, millisecondToDate, addDateTime };
