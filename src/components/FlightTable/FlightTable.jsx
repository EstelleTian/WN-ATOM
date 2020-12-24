/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-17 11:03:31
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, {Component, useState, useEffect} from 'react'
import ProtoTypes from 'prop-types'
import ResizeObserver from "rc-resize-observer"
import { inject, observer } from 'mobx-react'
import { request } from '../../utils/request'

import { Table, message, Menu, Dropdown   } from 'antd'
import ModalBox from '../../components/ModalBox/ModalBox'
import { columns ,data} from '../../components/FlightTable/TableColumns'
import { getDayTimeFromString } from '../../utils/basic-verify'
import './FlightTable.scss';

@inject("flightTableData")
@observer


// FlightTable.ProtoTypes = {
//     tableWidth: ProtoTypes.number.isRequired,
//     tableHeight: ProtoTypes.number.isRequired,
//     dataSource: ProtoTypes.array,
//     columns: ProtoTypes.object,
//
// }

class FlightTable extends React.Component{
    constructor( props ){
        super(props);
    }



    /**
     * @function 设置表格行的 class
     * @param {array} record 当前行数据
     * @param {number} index 当前行索引
     * @return {string} className 类名
     * */
    setRowClassName = (record, index) => {
        let className = '';
        className = index % 2 === 0 ? 'odd-row' : "even-row";
        return className;
    };

    formatSingleFlight = flight => {
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



        let flightObj = {
            key: flight.id,
            id: flight.id,
            FLIGHTID: flight.flightid,
            ALARM: alarmField.value,
            TASK: taskField.value,
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

    coverFlightTableData = list => {
        return list.map((flight,index) => this.formatSingleFlight(flight))
    };


    updateFlightTableData = flightData => {
       let  { flights } = flightData;
       console.log(flights)
       this.props.flightTableData.updateList(flights)
    };


    requestErr(err){
        message.error('航班列表数据获取失败'+err);
    }

    requestFlightTableData(id = "1") {

        const opt = {
            url:'http://192.168.243.8:29890/tactic/' + id,
            method:'GET',
            params:{},
            resFunc: (data)=> this.updateFlightTableData(data),
            errFunc: (err)=> this.requestErr(err),
        };
        request(opt);
    }


    componentWillMount(){
        const arr = ["1","2","3","4"];

        // setInterval(()=>{
        //     var id = Math.floor(Math.random()+4);
        //     this.requestFlightTableData(id)
        // },3000)

        this.requestFlightTableData();

    }

    render(){

        const flightTableData = this.props.flightTableData;
        const { list } = flightTableData;
        const data = this.coverFlightTableData(list);


        return (
            <ModalBox
                className="flight_canvas"
                title="航班列表"
            >
                <Table
                    columns={columns}
                    dataSource={ data }
                    size="small"
                    bordered
                    pagination={false}
                    // onRow={onRow}
                    rowClassName={(record, index)=>this.setRowClassName(record, index)}

                />
            </ModalBox>
        )
    }



}
//航班列表
// function FlightTable(){
//   let [tableWidth, setWidth] = useState(0);
//   let [tableHeight, setHeight] = useState(0);
//   let [searchVal, setSearchVal] = useState("");
//   let [contextMenu, setContextMenu] = useState({visible:true});
//
//   useEffect(() => {
//     //   console.log("useEffect 触发");
//       const dom = document.getElementsByClassName("flight_canvas")[0];
//       let width = dom.offsetWidth;
//       let height = dom.offsetHeight;
//       height -= 31;
//       height -= 30;
//       setWidth( width );
//       setHeight( height );
//     //   console.log("useEffect：", width, height);
//
//   }, [tableWidth, tableHeight,  contextMenu])
//
//
//     /**
//      * @function 设置表格行的 class
//      * @param {array} record 当前行数据
//      * @param {number} index 当前行索引
//      * @return {string} className 类名
//      * */
//     const setRowClassName = (record, index) => {
//         let className = '';
//         className = index % 2 === 0 ? 'oddRow' : "evenRow";
//         return className;
//     }
//
//
//   return (
//       <ResizeObserver
//           onResize={({width, height}) => {
//               if( tableWidth != width ){
//                   setWidth( width );
//               }
//               if( tableHeight != height ){
//                   setHeight( height );
//               }
//
//           }}>
//             <ModalBox
//                 className="flight_canvas"
//                 title="航班列表"
//             >
//
//                 <div className="total_num">
//                     <div>{searchVal} </div>
//                     <Input.Search
//                         allowClear
//                         style={{ width: '180px', marginRight: '15px' }}
//                         defaultValue={searchVal}
//                         onPressEnter={(e)=>{
//                             setSearchVal( e.target.value )
//                         }}
//                         onSearch={(value)=>{
//                             setSearchVal( value )
//                         }}
//                     />
//
//                     <span>总计{data.length}条</span>
//                 </div>
//                 <Table
//                     columns={columns}
//                     dataSource={data}
//                     scroll={{
//                         x: 400,
//                         y: tableHeight
//                     }}
//                     size="small"
//                     bordered
//                     pagination={false}
//                     // onRow={onRow}
//                     rowClassName={setRowClassName()}
//
//                 />
//           </ModalBox>
//
//   </ResizeObserver>
// )
// }


export default FlightTable