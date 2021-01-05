/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-17 11:03:31
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, {useState, useEffect} from 'react'
import { inject, observer } from 'mobx-react'
import { Table, message, Menu, Dropdown, Input   } from 'antd'
import ModalBox from 'components/ModalBox/ModalBox'
import { columns ,data} from 'components/FlightTable/TableColumns'
import { getDayTimeFromString, formatTimeString, getTimeAndStatus } from 'utils/basic-verify'
import './FlightTable.scss';
import {isValidVariable} from "../../utils/basic-verify";


//数据转换，将航班转化为表格格式
const formatSingleFlight = flight => {
    let { alarmField, taskField, eapField, oapField, tobtField, cobtField, ctotField, fmeToday, ffixField, ctoField, etoField, } = flight;
    alarmField = alarmField || {};
    taskField = taskField || {};
    eapField = eapField || {};
    oapField = oapField || {};
    tobtField = tobtField || {};
    tobtField = tobtField || {};
    cobtField = cobtField || {};
    ctotField = ctotField || {};
    fmeToday = fmeToday || {};
    ffixField = ffixField || {};
    ctoField = ctoField || {};
    etoField = etoField || {};
    let taskVal = taskField.value || "";
    if( taskVal === "null" ){
        taskVal = ""
    }
    let flightObj = {
        key: flight.id,
        id: flight.id,
        FLIGHTID: flight.flightid,
        ALARM: alarmField.value,
        TASK: taskVal,
        EAP: eapField.name,
        EAPT: getTimeAndStatus(eapField.value),
        OAP: oapField.name,
        OAPT: getTimeAndStatus(oapField.value),
        ACTYPE: flight.aircrafttype,
        DEPAP:  flight.depap,
        ARRAP: flight.arrap,
        SOBT: getDayTimeFromString(flight.sobt),
        EOBT: getDayTimeFromString(flight.eobt),
        TOBT: getDayTimeFromString(tobtField.value),
        COBT: cobtField.value,
        CTOT: getDayTimeFromString(ctotField.value),
        ATOT: getDayTimeFromString(flight.atd),
        FETA: getDayTimeFromString(flight.formerArrtime),
        FFIX: ffixField.name,
        FFIXT: ffixField.value,
        CTO: getTimeAndStatus(ctoField.value),
        ETO: getTimeAndStatus(etoField.value),
        STATUS: flight.runningStatus,
        orgdata: JSON.stringify(flight)
    }
    return flightObj;
};

function FlightTable(props){
    let [tableWidth, setWidth] = useState(0);
    let [tableHeight, setHeight] = useState(0);
    let [searchVal, setSearchVal] = useState("");
    let [sortKey, setSortKey] = useState("FFIXT");
    let [sortOrder, setSortOrder] = useState("ascend");
    /**
     * @function 设置表格行的 class
     * @param {array} record 当前行数据
     * @param {number} index 当前行索引
     * @return {string} className 类名
     * */
    const setRowClassName = (record, index) => {
        let { FFIXT, orgdata } = record;
        if( sortKey === "FFIXT" ) {
            const activeScheme = props.schemeListData.activeScheme;
            let {startTime, endTime} = activeScheme.tacticTimeInfo;
            FFIXT = FFIXT.substring(0, 12);
            startTime = startTime.substring(0, 12);

            // console.log("FFIXT",FFIXT,"startTime",startTime,"endTime",endTime);
            if (startTime * 1 < FFIXT * 1) {
                if (isValidVariable(endTime)) {
                    endTime = endTime.substring(0, 12);
                    if (FFIXT * 1 < endTime * 1) {
                        return "in_range"
                    } else {
                        return "out_range";
                    }
                } else {
                    return "in_range";
                }
            } else {
                return "out_range";
            }
        }
        return "aaa";
    };

    //转换为表格数据
    const coverFlightTableData = list => {
        return list.map( flight => formatSingleFlight(flight) )
    };
    useEffect(() => {
      const dom = document.getElementsByClassName("flight_canvas")[0];
        dom.oncontextmenu = function(){
            return false;
        };
      let width = dom.offsetWidth;
      let height = dom.offsetHeight;
      height -= 40;
      height -= 39;
      setWidth( width );
      setHeight( height );

  }, [tableWidth, tableHeight])

    //根据输入框输入值，检索显示航班
    const filterInput = (data) => {
        if( searchVal === "" ){
            return data;
        }
        let newArr = data.filter( flight => {
            for(let key in flight){
                let val = flight[key] || ""
                val = val + ""
                val = val.toLowerCase();
                const sVal = searchVal.toLowerCase();
                if( val.indexOf( sVal ) !== -1 ){
                    return true
                }
            }
            return false
        } )
        return newArr
    }
    const flightTableData = props.flightTableData;
    const { list, loading } = flightTableData;
    let data = coverFlightTableData(list);
    data = filterInput(data);
    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
        setSortOrder( sorter.order )
        setSortKey( sorter.columnKey )
    }
    return (
        <ModalBox
            className="flight_canvas"
            // title={`航班列表 (数据时间:${ formatTimeString(generateTime) })`}
            title={`航班列表`}
        >
            <div className="total_num">
                <Input.Search
                allowClear
                style={{ width: '180px', marginRight: '15px' }}
                defaultValue={searchVal}
                onPressEnter={(e)=>{
                    setSearchVal( e.target.value )
                }}
                onSearch={(value)=>{
                    setSearchVal( value )
                }}
            />
                <span>总计{data.length}条</span>
            </div>
        <Table
            columns={columns}
            dataSource={ data }
            size="small"
            bordered
            pagination={false}
            loading={ loading }
            scroll={{
                x: tableWidth,
                y: tableHeight
            }}
            onChange={onChange}
            rowClassName={(record, index)=>setRowClassName(record, index)}
        />
        </ModalBox>

    )
}

export default inject("flightTableData", "schemeListData")(observer(FlightTable))