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
import { getDayTimeFromString, formatTimeString } from 'utils/basic-verify'
import './FlightTable.scss';

function FlightTable(props){
    let [tableWidth, setWidth] = useState(0);
    let [tableHeight, setHeight] = useState(0);
    let [searchVal, setSearchVal] = useState("");
    /**
     * @function 设置表格行的 class
     * @param {array} record 当前行数据
     * @param {number} index 当前行索引
     * @return {string} className 类名
     * */
    const setRowClassName = (record, index) => {
        let className = index % 2 === 0 ? 'odd-row' : "even-row";
        return className;
    };

    const formatSingleFlight = flight => {
        let { alarmField, taskField, eapField, oapField, tobtField, cobtField, ctotField, fmeToday, ffixField, ctoField,etoField, } = flight;
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
            EAPT: getDayTimeFromString(eapField.value),
            OAP: oapField.name,
            OAPT: getDayTimeFromString(oapField.value),
            ACTYPE: flight.aircrafttype,
            DEPAP:  flight.depap,
            ADES: flight.arrap,
            SOBT: getDayTimeFromString(flight.sobt),
            EOBT: getDayTimeFromString(flight.eobt),
            TOBT: getDayTimeFromString(tobtField.value),
            COBT: getDayTimeFromString(cobtField.value),
            CTOT: getDayTimeFromString(ctotField.value),
            ATOT: getDayTimeFromString(fmeToday.RDeptime),
            FETA: getDayTimeFromString(flight.formerArrtime),
            FFIX: ffixField.name,
            FFIXT:getDayTimeFromString(ffixField.value) ,
            CTO: getDayTimeFromString(ctoField.value),
            ETO: getDayTimeFromString(etoField.value),
            STATUS: flight.status,

        }
        return flightObj;
    };
    //转换为表格数据
    const coverFlightTableData = list => {
        return list.map((flight,index) => formatSingleFlight(flight))
    };
    useEffect(() => {
      const dom = document.getElementsByClassName("flight_canvas")[0];
      let width = dom.offsetWidth;
      let height = dom.offsetHeight;
      height -= 31;
      height -= 39;
      setWidth( width );
      setHeight( height );

  }, [tableWidth, tableHeight])

    const filterInput = (data) => {
        return data
    }
    const flightTableData = props.flightTableData;
    const { list, generateTime } = flightTableData;
    let data = coverFlightTableData(list);
    data = filterInput(data);
    return (
        <ModalBox
            className="flight_canvas"
            title={`航班列表 (数据时间:${ formatTimeString(generateTime) })`}
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
            scroll={{
                x: tableWidth,
                y: tableHeight
            }}
            rowClassName={(record, index)=>setRowClassName(record, index)}
        />
        </ModalBox>

    )
}

export default inject("flightTableData")(observer(FlightTable))