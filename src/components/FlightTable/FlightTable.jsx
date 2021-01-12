/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-17 11:03:31
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, {useState, useEffect, useCallback} from 'react'
import { inject, observer } from 'mobx-react'
import {Table, message, Menu, Dropdown, Input, Checkbox} from 'antd'
import ModalBox from 'components/ModalBox/ModalBox'
import { getColumns} from 'components/FlightTable/TableColumns'
import { getDayTimeFromString, formatTimeString, getTimeAndStatus } from 'utils/basic-verify'
import './FlightTable.scss';
import {isValidVariable} from "../../utils/basic-verify";


//数据转换，将航班转化为表格格式
const formatSingleFlight = flight => {
    let { alarmField, taskField, eapField, oapField, tobtField, cobtField, ctotField, fmeToday, ffixField, ctoField, etoField, agctField } = flight;
    alarmField = alarmField || {};
    taskField = taskField || {};
    eapField = eapField || {};
    oapField = oapField || {};
    tobtField = tobtField || {};
    tobtField = tobtField || {};
    cobtField = cobtField || {};
    cobtField = cobtField || {};
    agctField = agctField || {};
    fmeToday = fmeToday || {};
    ffixField = ffixField || {};
    ctoField = ctoField || {};
    etoField = etoField || {};
    // if( flight.flightid === "CES9658"){
    //     debugger
    //     console.log("cobtField", cobtField.value, getDayTimeFromString(cobtField.value))
    //     console.log("ctotField", ctotField.value, getDayTimeFromString(ctotField.value))
    // }
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
        EAPT: eapField.value,
        OAP: oapField.name,
        OAPT: oapField.value,
        ACTYPE: flight.aircrafttype,
        DEPAP:  flight.depap,
        ARRAP: flight.arrap,
        SOBT: getDayTimeFromString(flight.sobt),
        EOBT: getDayTimeFromString(flight.eobt),
        TOBT: getDayTimeFromString(tobtField.value),
        COBT: cobtField.value,
        CTOT: ctotField.value,
        AGCT: getDayTimeFromString( agctField.value ),
        ATOT: getDayTimeFromString(flight.atd),
        FETA: getDayTimeFromString(flight.formerArrtime),
        FFIX: ffixField.name,
        FFIXT: ffixField.value,
        CTO: ctoField.value,
        ETO: getTimeAndStatus(etoField.value),
        STATUS: flight.runningStatus,
        orgdata: JSON.stringify(flight)
    }
    return flightObj;
};

function FlightTable(props){
    let [tableWidth, setWidth] = useState(0);
    let [tableHeight, setHeight] = useState(0);
    let [autoScroll, setAutoScroll] = useState(true);
    let [searchVal, setSearchVal] = useState(""); //输入框过滤 输入内容
    let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段
    let [sortOrder, setSortOrder] = useState("ascend"); //表格排序 顺序  升序ascend/降序
    //设置表格行的 class
    const setRowClassName = useCallback((record, index) => {
        let { FFIXT, orgdata, id } = record;
        if( sortKey === "FFIXT" ) {
            const activeScheme = props.schemeListData.activeScheme;
            let {startTime, endTime} = activeScheme.tacticTimeInfo;
            if( isValidVariable(FFIXT) && FFIXT.length > 12 ){
                FFIXT = FFIXT.substring(0, 12);
            }
            if( isValidVariable(startTime) && startTime.length > 12 ){
                startTime = startTime.substring(0, 12);
            }
            // console.log("FFIXT",FFIXT,"startTime",startTime,"endTime",endTime);
            if (startTime * 1 <= FFIXT * 1) {
                if (isValidVariable(endTime)) {
                    endTime = endTime.substring(0, 12);
                    if (FFIXT * 1 <= endTime * 1) {
                        return id + " in_range"
                    } else {
                        return id + " out_range";
                    }
                } else {
                    return id + " in_range";
                }
            } else {
                return id + " out_range";
            }
        }
        return id;
    });

    //转换为表格数据
    const coverFlightTableData = useCallback( list => {
        return list.map( flight => formatSingleFlight(flight) )
    });
    useEffect(() => {
      const dom = document.getElementsByClassName("flight_canvas")[0];
        dom.oncontextmenu = function(){
            return false;
        };
      let width = dom.offsetWidth;
      let height = dom.offsetHeight;
      height -= 40;//标题高度“航班列表”
      height -= 45;//表头高度
      setWidth( width );
      setHeight( height );

  }, [tableWidth, tableHeight]);
    useEffect(() => {
        if( autoScroll ){
            const { id, flightid } = props.flightTableData.getTargetFlight;
            // console.log("目标定位航班是：",props.flightTableData.getTargetFlight.id, props.flightTableData.getTargetFlight.flightid );
            if( isValidVariable(id) ){
                const flightCanvas = document.getElementsByClassName("flight_canvas");
                const boxContent = flightCanvas[0].getElementsByClassName("box_content");
                const contentH = boxContent[0].clientHeight; //表格外框高度
                const tableBody = boxContent[0].getElementsByClassName("ant-table-body");
                const tableTBody = boxContent[0].getElementsByClassName("ant-table-tbody");
                const tableTBodyH = tableTBody[0].clientHeight; //表格总高度
                // console.log("目标定位航班[contentH]是：",contentH, "tableBodyH:", tableBodyH );
                if( tableTBodyH*1 > contentH*1 ){
                    //计算定位航班
                    const tr = boxContent[0].getElementsByClassName( id );
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

  }, [ props.flightTableData.getTargetFlight.id ]);
    const onChange = useCallback((pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
        setSortOrder( sorter.order );
        setSortKey( sorter.columnKey )
    })
    //根据输入框输入值，检索显示航班
    const filterInput = useCallback((data) => {
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
    });
    const flightTableData = props.flightTableData;
    const { list, loading, generateTime } = flightTableData;
    let data = coverFlightTableData(list);
    data = filterInput(data);
    let columns = getColumns();
    return (
        <ModalBox
            className="flight_canvas"
            // title={`航班列表 (数据时间:${ formatTimeString(generateTime) })`}
            title={`航班列表`}
            showDecorator = {true}
        >
            <div className="statistics">
                <div className="auto_scroll">
                    <Checkbox.Group options={[{ label: '自动滚动', value: 'auto_scroll' }]} defaultValue={ 'auto_scroll' }
                        onChange={(checkedValues)=>{
                            console.log(checkedValues)
                            if( checkedValues.indexOf("auto_scroll") === -1 ){
                                setAutoScroll( false );
                            }else{
                                setAutoScroll( true );
                            }
                        }}
                    />
                </div>
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
                <span  className="total_num">总计{data.length}条</span>
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