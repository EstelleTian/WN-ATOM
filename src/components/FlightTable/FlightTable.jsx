/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-01-25 16:32:11
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, {useState, useEffect, useCallback} from 'react'
import { inject, observer } from 'mobx-react'
import {Table, Input, Checkbox } from 'antd'
import ModalBox from 'components/ModalBox/ModalBox'
import { getColumns, formatSingleFlight, scrollTopById, highlightRowByDom} from 'components/FlightTable/TableColumns'
import { isValidVariable } from 'utils/basic-verify'
import './FlightTable.scss';

function FlightTable(props){
    let [tableWidth, setWidth] = useState(0);
    let [tableHeight, setHeight] = useState(0);
    let [autoScroll, setAutoScroll] = useState(true);
    let [searchVal, setSearchVal] = useState(""); //输入框过滤 输入内容
    let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段
    let [sortOrder, setSortOrder] = useState("ascend"); //表格排序 顺序  升序ascend/降序
    //设置表格行的 class
    const setRowClassName = useCallback((record, index) => {
        let FFIXT = record.FFIXT || "";
        let id = record.id || "";
        if( sortKey === "FFIXT" ) {
            const activeScheme = props.schemeListData.activeScheme || {};
            const tacticTimeInfo = activeScheme.tacticTimeInfo || {};
            let startTime = tacticTimeInfo.startTime || "";
            let endTime = tacticTimeInfo.endTime || "";
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
    },[]);


    //转换为表格数据
    const coverFlightTableData = useCallback( list => {
        return list.map( flight => formatSingleFlight(flight) )
    },[]);
    useEffect(() => {
        const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
        flightCanvas.oncontextmenu = function(){
            return false;
        };
        const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
        const tableHeader = flightCanvas.getElementsByClassName("ant-table-header")[0];

        let width = boxContent.offsetWidth;
        let height = boxContent.offsetHeight;
        // console.log("表格高度："+height );
        // height -= 40;//标题高度“航班列表”
        // height -= 45;//表头高度
        height -= tableHeader.offsetHeight;//表头高度
        setWidth( width );
        setHeight( height );

    }, [tableWidth, tableHeight]);



    
    useEffect(() => {
        if( autoScroll ){
            const { id } = props.flightTableData.getTargetFlight;
            scrollTopById(id, "flight_canvas");
        }

    }, [ props.flightTableData.getTargetFlight.id ]);

    useEffect(() => {
        const { id } = props.flightTableData.getSelectedFlight;
        if( isValidVariable( id ) ){
            const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
            const trDom = flightCanvas.getElementsByClassName(id);
            if( trDom.length > 0 ){
                highlightRowByDom(trDom[0]);
            }
            scrollTopById(id, "flight_canvas");
            
        }

    }, [ props.flightTableData.getSelectedFlight.id ]);

    // DidMount 激活方案列表id变化后，重新处理执行KPI定时器
    useEffect(function(){
        // console.log("执行KPI useEffect id变了:"+id);
        if( isValidVariable( props.schemeListData.activeScheme.id ) ){
            if( autoScroll ){
                const { id } = props.flightTableData.getTargetFlight;
                scrollTopById(id, "flight_canvas");
            }
        }
    }, [ props.schemeListData.activeScheme.id ] );


    const onChange = useCallback((pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
        setSortOrder( sorter.order );
        setSortKey( sorter.columnKey )
    },[])
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
    },[]);
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
                <Input
                    allowClear
                    style={{ width: '200px', marginRight: '15px' }}
                    defaultValue={searchVal}
                    placeholder="请输入要查询的关键字"
                    onPressEnter={(e)=>{
                        setSearchVal( e.target.value )
                    }}
                    onChange={(e)=>{
                        setSearchVal( e.target.value )
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
                onRow={record => {
                    return {
                      onClick: event => {// 点击行
                        console.log(event);
                        const popoverDom = document.getElementsByClassName("ant-popover");
                        if( popoverDom.length === 0 ){
                            const fid = event.currentTarget.getAttribute("data-row-key")
                            flightTableData.toggleSelectFlight(fid);
                        }
                        
                      }, 

                    };
                  }}
            />
        </ModalBox>

    )
}

export default inject("flightTableData", "schemeListData")(observer(FlightTable))