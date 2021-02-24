/*
 * @Author: liutianjiao
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-24 14:39:46
 * @LastEditors: Please set LastEditors
 * @Description: 表格列表组件
 * @FilePath: \WN-CDM\src\components\FlightTable\FlightTable.jsx
 */

import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react'
import { inject, observer } from 'mobx-react'
import {Table, Input, Checkbox, message } from 'antd'
import ModalBox from 'components/ModalBox/ModalBox'
import { getColumns, formatSingleFlight, scrollTopById, highlightRowByDom} from 'components/FlightTable/TableColumns'
import { isValidVariable, formatTimeString } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import { request, requestGet } from 'utils/request'
import './FlightTable.scss';

let columns = getColumns();

function FlightTable(props){
    let [tableWidth, setWidth] = useState(0);
    let [tableHeight, setHeight] = useState(0);
    let [autoScroll, setAutoScroll] = useState(true);
    let [searchVal, setSearchVal] = useState(""); //输入框过滤 输入内容
    let [sortKey, setSortKey] = useState("FFIXT"); //表格排序字段
    let [sortOrder, setSortOrder] = useState("ascend"); //表格排序 顺序  升序ascend/降序
    let schemeId = useRef("");

    const { flightTableData = {}, schemeListData, systemPage } = props;
    const { list, loading, generateTime = "" } = flightTableData;
    const activeScheme = schemeListData.activeScheme || {};
    const tacticName = activeScheme.tacticName || "";

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

    let data = useMemo( () => {
        const newList = list.map( flight => formatSingleFlight(flight) );
        return filterInput(newList);
    },[ list, searchVal ]);
    


    const handleRow = useCallback(
        (event, record) => {// 点击行
            const popoverDom = document.getElementsByClassName("ant-popover");
            if( popoverDom.length === 0 ){
                const fid = event.currentTarget.getAttribute("data-row-key")
                flightTableData.toggleSelectFlight(fid);
            }
            
          },
        [flightTableData]
        )

    const getTitle = useCallback(() => {
        return <span>
            <span>航班列表({ formatTimeString(generateTime) })</span>
            —
            <span style={{ color: "#36a5da"}}>{tacticName}</span>
        </span>
    },[generateTime, tacticName]);
    
    //设置表格行的 class
    const setRowClassName = useCallback((record, index) => {
        let FFIXT = record.FFIXT || "";
        let id = record.id || "";
        if( sortKey === "FFIXT" ) {
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
    },[activeScheme]);


    //更新--航班列表 store数据
    const updateFlightTableData = useCallback( ( flightData, id )  => {
        let  { flights, generateTime } = flightData;
        if( flights !== null ){
            flightTableData.updateFlightsList(flights, generateTime, id);
            sessionStorage.setItem("flightTableGenerateTime", generateTime);
        }else{
            flightTableData.updateFlightsList([], generateTime, id);
        }
        
    },[  ]);

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    },[]);
    
    //获取--航班列表数据
    const requestFlightTableData = useCallback( (  resolve, reject ) => {
        let url = "";
        let params = {};
        const activeSchemeId = schemeListData.activeSchemeId;
        console.log("本次方案id:", activeSchemeId)
        if( isValidVariable( activeSchemeId ) ){
            url = ReqUrls.flightsDataUrl + activeSchemeId;
        }else{
            url = ReqUrls.flightsDataNoIdUrl + systemPage.user.id;
            let baseTime = ""
            if( generateTime !== "" ){
                baseTime = generateTime.substring(0,8);
            }else{
                const date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                year = '' + year;
                month = month < 10 ? '0' + month : '' + month;
                day = day < 10 ? '0' + day : '' + day;
                baseTime =  year + "" + month + "" + day;
            }
            params = {
                startTime: baseTime + '000000',
                endTime: baseTime+'235900',
            };
        }
        const opt = {
            url,
            method:'GET',
            params,
            resFunc: (data)=> {
                updateFlightTableData(data, activeSchemeId);
                if( flightTableData.loading !== false){
                    flightTableData.toggleLoad(false);
                }
                if( isValidVariable(resolve) ){
                    resolve("success");
                }

            }, 
            errFunc: (err)=> {
                requestErr(err, '航班列表数据获取失败');
                flightTableData.toggleLoad(false);
                if( isValidVariable(resolve) ){
                    resolve("error")
                }

            } ,
        };
        requestGet(opt);
        // }

    }, [generateTime, schemeListData.activeSchemeId]);

    useEffect(() => {
        const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
        flightCanvas.oncontextmenu = function(){
            return false;
        };
        const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
        const tableHeader = flightCanvas.getElementsByClassName("ant-table-header")[0];

        let width = boxContent.offsetWidth;
        let height = boxContent.offsetHeight;
        // height -= 40;//标题高度“航班列表”
        // height -= 45;//表头高度
        height -= tableHeader.offsetHeight;//表头高度
        setWidth( width );
        setHeight( height );

    }, [tableWidth, tableHeight]);

    //监听全局刷新
    useEffect(function(){
        const id = systemPage.user.id;
        if( systemPage.pageRefresh && isValidVariable(id) ){
            const id = schemeListData.activeSchemeId || "";
            // if( isValidVariable( id ) ){
                new Promise( function(resolve, reject) {
                    // 异步处理
                    // 处理结束后、调用resolve 或 reject
                    flightTableData.toggleLoad(true);
                    requestFlightTableData(resolve, reject)
                } ).then((values) => {
                    // console.log(values);
                    systemPage.pageRefresh = false;
                });
            // }
        }
    },[ systemPage.pageRefresh ]);

    useEffect(() => {
        if( autoScroll ){
            const { id } = flightTableData.getTargetFlight;
            scrollTopById(id, "flight_canvas");
        }

    }, [ flightTableData.getTargetFlight.id, schemeListData.activeSchemeId ]);

    useEffect(() => {
        const { id } = flightTableData.getSelectedFlight;
        if( isValidVariable( id ) ){
            const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
            const trDom = flightCanvas.getElementsByClassName(id);
            if( trDom.length > 0 ){
                highlightRowByDom(trDom[0]);
            }
            // scrollTopById(id, "flight_canvas");
            
        }

    }, [ flightTableData.getSelectedFlight.id ]);

    // DidMount 激活方案列表id变化后，处理自动滚动
    useEffect(function(){
        console.timeEnd("点击了方案id")
        console.time("activeSchemeId请求数据耗时")
        requestFlightTableData(); 
        console.timeEnd("activeSchemeId请求数据耗时")
    }, [ schemeListData.activeSchemeId ] );

    // componentDidMount
    useEffect(function(){
        clearInterval(flightTableData.timeoutId);
        flightTableData.timeoutId = "";
        //生成新定时器--轮询
        const timeoutid = setInterval(function(){
            if( !flightTableData.loading ){
                requestFlightTableData();
            }else{
                console.log("本次航班正在更新中")
            }
           
        }, 60 * 1000);
        // console.log("航班列表 配置定时器:"+timeoutid);
        flightTableData.timeoutId = timeoutid;
        return function(){
            // console.log("航班列表卸载");
            clearInterval(flightTableData.timeoutId);
            flightTableData.timeoutId = "";
        }
    },[]);
    


    const onChange = useCallback((pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
        setSortOrder( sorter.order );
        setSortKey( sorter.columnKey )
    },[])



    return (
        <ModalBox
            className="flight_canvas" 
            title={getTitle()}
            
            // title={`航班列表`}
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
                      onClick: (event) => {// 点击行
                        handleRow(event, record);
                      }, 
                      onContextMenu: (event) => {// 点击行
                        handleRow(event, record);
                      },

                    };
                  }}
            />
        </ModalBox>

    )
}

export default inject("flightTableData", "schemeListData", "systemPage")(observer(FlightTable))