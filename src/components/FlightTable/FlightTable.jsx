/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-05 11:33:01
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, {memo, useState, useEffect, useCallback, useRef, useMemo} from 'react'
import { inject, observer } from 'mobx-react'
import {Table, Input, Checkbox, message, Spin } from 'antd'
import ModalBox from 'components/ModalBox/ModalBox'
import { getColumns, formatSingleFlight, scrollTopById, highlightRowByDom} from 'components/FlightTable/TableColumns'
import { isValidVariable, formatTimeString } from 'utils/basic-verify'
import debounce from 'lodash/debounce' 
import './FlightTable.scss';

let columns = getColumns();

/** start *****航班表格标题************/
function TTitle(props){
    const { flightTableData = {}, schemeListData } = props;
    
    const generateTime = useMemo(() => {
        return flightTableData.generateTime || "";
    }, [flightTableData.generateTime]);

    const tacticName = useMemo(() => {
        console.log(schemeListData.activeSchemeId)
        if( isValidVariable( schemeListData.activeSchemeId ) ){
            const activeScheme = schemeListData.activeScheme(schemeListData.activeSchemeId) || {};
            return activeScheme.tacticName;
        }else{
            return ""
        }
        
    }, [schemeListData.activeSchemeId]);
 
    return (
        <span className="tactic_title_span">
            <span>航班列表({ formatTimeString(generateTime)})</span> 
            { tacticName !== "" && <span>—</span> }
            { tacticName !== "" && <span style={{ color: "#36a5da"}} className="tactic_name">{tacticName}</span> }
        </span>
    )
}
const TableTitle = inject("flightTableData", "schemeListData")(observer(TTitle));
/** end *****航班表格标题************/

function useAutoSize(){
    let [tableWidth, setWidth] = useState(0);
    let [tableHeight, setHeight] = useState(0);
    useEffect(() => {
        // console.log("tableWidth, tableHeight: ",tableWidth, tableHeight)
        const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
        const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
        const tableHeader = flightCanvas.getElementsByClassName("ant-table-header")[0];
        let width = boxContent.offsetWidth;
        let height = boxContent.offsetHeight;
        // height -= 40;//标题高度“航班列表”
        // height -= 45;//表头高度
        height -= tableHeader.offsetHeight;//表头高度
        setWidth( width );
        setHeight( height );
        flightCanvas.oncontextmenu = function(){
            return false;
        };

    }, [tableWidth, tableHeight]);
    
    return { tableWidth, tableHeight }
}

/** start *****航班表格 纯表格************/
function FTable(props){
    const { tableWidth, tableHeight } = useAutoSize();
    let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段
    let [sortOrder, setSortOrder] = useState("ascend"); //表格排序 顺序  升序ascend/降序

    const { flightTableData = {}, schemeListData } = props;
    const {  getShowFlights, autoScroll } = flightTableData;
    const { showList, targetFlight }= getShowFlights;
    if( showList.length < 3){
        console.log(showList)
    }
    
    const handleRow = useCallback((event, record) => {// 点击行
        const dom = event.currentTarget;
        // const refVal = dom.getAttribute("data-row-key");
        // flightTableData.toggleSelectFlight(refVal);
        // console.log("toggleSelectFlight", refVal)
        highlightRowByDom(dom)
    },[])
    
    const { schemeStartTime, schemeEndTime } = useMemo(() => {
        const activeScheme = schemeListData.activeScheme(schemeListData.activeSchemeId) || {};
        const { tacticTimeInfo = {} } = activeScheme;
        const { startTime, endTime } = tacticTimeInfo
        return { 
            schemeStartTime: startTime, 
            schemeEndTime: endTime 
        };
    }, [schemeListData.activeSchemeId]);

    // useEffect(() => {
    //     const flightCanvas = document.getElementsByClassName("flight_canvas");
    //     const boxContent = flightCanvas[0].getElementsByClassName("box_content");
    //     const tr = boxContent[0].getElementsByClassName( props.flightTableData.selectFlightId );
    //     console.log("自动选回高亮dom",  props.flightTableData.selectFlightId)
    //     if( tr.length > 0 ){
    //         highlightRowByDom(tr);
    //     }
        
    // }, [schemeListData.activeSchemeId]);
 
    //设置表格行的 class
    const setRowClassName = useCallback((record, index) => {
        let FFIXT = record.FFIXT || "";
        let id = record.id || "";
        if( sortKey === "FFIXT" ) {
            if( isValidVariable(FFIXT) && FFIXT.length >= 12 ){
                FFIXT = FFIXT.substring(0, 12);
            }
            let sTime = "";
            if( isValidVariable(schemeStartTime) && schemeStartTime.length >= 12 ){
                sTime = schemeStartTime.substring(0, 12);
            }
            // console.log("FFIXT",FFIXT,"startTime",startTime,"schemeEndTime",schemeEndTime);
            if (sTime * 1 <= FFIXT * 1) {
                let eTime = "";
                if (isValidVariable(schemeEndTime)) {
                    eTime = schemeEndTime.substring(0, 12);
                    if ( FFIXT * 1 <= eTime * 1 ) {
                        id += " in_range"
                    }
                } else {
                    id += " in_range";
                }
            }
        }
        // if( id.indexOf("in_range") === -1){
            if( index % 2 === 0 ){
                id += " even";
            }else{
                id += " odd";
            }
        // }
        return id;
    },[schemeStartTime, schemeEndTime]);

    const onChange = useCallback((pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
        setSortOrder( sorter.order );
        setSortKey( sorter.columnKey )
    },[])

    useEffect(() => {
        // console.log("table autoScroll")
        if( autoScroll && isValidVariable(targetFlight.id) ){
            scrollTopById(targetFlight.id, "flight_canvas");
        }
    }, [ targetFlight.id ]);

    // console.log("航班表格 render!!!",schemeStartTime, schemeEndTime)
    return (
        <Table
            columns={ columns }
            dataSource={ showList }
            size="small"
            bordered
            pagination={false}
            scroll={{
                x: tableWidth,
                y: tableHeight
            }}
            onChange={onChange}
            rowClassName={ setRowClassName }
            onRow={record => {
                return {
                    onClick: (event) => {// 点击行
                        handleRow(event, record);
                    }, 
                    onContextMenu: (event) => {// 点击行
                        handleRow(event, record);
                    },
                };
            }}
        />
            
        
    )
}
const FlightTable = inject("flightTableData", "schemeListData")(observer(FTable));
/** end *****航班表格 纯表格************/

const TSpin = inject("flightTableData")(observer((props) => {
    const { flightTableData = {} } = props;
    const { loading } = flightTableData;
    // console.log("航班loading render!!!")
    return (
        <Spin spinning={ loading }>
            <FlightTable/>
        </Spin>
    )
        
}))

const AutoScrollBtn = inject("flightTableData")(observer((props) => {
    return (
        <div className="auto_scroll">
            <Checkbox.Group options={[{ label: '自动滚动', value: 'auto_scroll' }]} defaultValue={ 'auto_scroll' }
                onChange={(checkedValues)=>{
                    if( checkedValues.indexOf("auto_scroll") === -1 ){
                        props.flightTableData.setAutoScroll( false );
                    }else{
                        props.flightTableData.setAutoScroll( true );
                    }
                }}
            />
        </div>
    )
}))

const SearchInput = inject("flightTableData")(observer((props) => {
    const { flightTableData = {} } = props;
    const { searchVal = "", setSearchVal } = flightTableData;

    const handleInputVal = useCallback(
        debounce((values) => {
            props.flightTableData.setSearchVal( values )
        },800),
    [])
    return (
        <Input
            allowClear
            style={{ width: '200px', marginRight: '15px' }}
            defaultValue={ searchVal }
            placeholder="请输入要查询的关键字"
            onPressEnter={ e => handleInputVal( e.target.value) }
            onChange={ e => handleInputVal( e.target.value) }
        />
    )
}))
const TotalDom = inject("flightTableData")(observer((props) => {
    const { flightTableData = {} } = props;
    const { getShowFlights } = flightTableData;
    const { showList }= getShowFlights;
    return (
        <span className="total_num">总计{ showList.length || 0}条</span>
    )
}))

/** start *****航班表格 列表框架************/
function FlightTableModal(props){
    return (
        <ModalBox
            className="flight_canvas" 
            title={ <TableTitle /> }
            showDecorator = {false}
        >
            <div className="statistics">
                <AutoScrollBtn/>
                <SearchInput/>
                <TotalDom/>
            </div>
            <TSpin />
            
        </ModalBox>
    )
}
/** end *****航班表格 列表框架************/
export default FlightTableModal