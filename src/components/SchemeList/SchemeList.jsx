/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2021-03-11 15:46:23
 * @LastEditTime: 2021-03-04 14:40:22
 * @LastEditors: Please set LastEditors
 * @Description: 方案列表
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { Checkbox, Empty, Spin, notification } from 'antd'
import { requestGet } from 'utils/request'
import { isValidVariable, isValidObject } from 'utils/basic-verify'
import { NWGlobal } from  'utils/global'
import  SchemeModal  from "./SchemeModal";
import { ReqUrls } from 'utils/request-urls'
import { customNotice } from 'utils/common-funcs'
import  SchemeItem  from "./SchemeItem";
import './SchemeList.scss'

//方案多选按钮组
const plainOptions = [
    { label: '正在执行', value: 'RUNNING' },
    { label: '将要执行', value: 'FUTURE' },
    { label: '正常结束', value: 'FINISHED' },
    { label: '人工终止', value: 'TERMINATED_MANUAL' },
    { label: '自动终止', value: 'TERMINATED_AUTO' },
];

//请求错误--处理
const requestErr = (err, content) => {
    customNotice({
        type: 'error',
        message: content
    })
}

//方案请求 hook
function useSchemeList(props){
    const { 
        schemeListData : { 
            statusValues = [],
        } = {}, 
        systemPage : { 
            pageRefresh,
            user: 
            { 
                id = ""
            } = {} 
        } = {} 
    } = props;
    const curStatusValues = useRef();
    const schemeTimeoutId = useRef("");
    
    //获取--方案列表 @nextRefresh 是否开启下一轮定时
    const getSchemeList = useCallback(( nextRefresh = false ) => {
        // console.log("获取--方案列表，statusValues是:"+curStatusValues.current);
        const p = new Promise( (resolve, reject) => {
            const opt = {
                url: ReqUrls.schemeListUrl,
                method: 'GET',
                params:{
                    status: curStatusValues.current.join(','),
                    startTime: "",
                    endTime: "",
                    userId: id
                },
                resFunc: (data)=> {
                    //更新方案数据
                    updateSchemeListData(data);
                    if( props.schemeListData.loading ){
                        props.schemeListData.toggleLoad(false);
                    }
                    //开启定时
                    if( nextRefresh ){
                        if( isValidVariable(schemeTimeoutId.current) ){
                            clearTimeout(schemeTimeoutId.current);
                            schemeTimeoutId.current = "";
                            clearTimeout(schemeTimeoutId.current);
                        }
                        schemeTimeoutId.current = setTimeout( ()=>{
                            // console.log("方案列表定时器-下一轮更新开始")
                            getSchemeList( true );
                        }, 30*1000);
                    }
                    notification.destroy();
                    resolve("success")
    
                },
                errFunc: (err)=> {
                    requestErr(err, '方案列表数据获取失败' );
                    if( props.schemeListData.loading ){
                        props.schemeListData.toggleLoad(false);
                    }
                    //开启定时
                    if( nextRefresh ){
                        if( isValidVariable(schemeTimeoutId.current) ){
                            clearTimeout(schemeTimeoutId.current);
                            schemeTimeoutId.current = "";
                        }
                        schemeTimeoutId.current = setTimeout( ()=>{
                            // console.log("方案列表定时器-下一轮更新开始")
                            getSchemeList( true );
                        }, 30*1000);
                    }
                    reject("error")
                },
            };
            requestGet(opt);
        })
        
        return p;
        
    }, [id]);

    //请求成功--处理 更新--方案列表 store数据
    const updateSchemeListData = useCallback( data => {
        let { 
            tacticProcessInfos, 
            generateTime = "" 
        } = data;
        if( tacticProcessInfos === null ){
            tacticProcessInfos = [];
        }
        const list = tacticProcessInfos.map((item) => {
            const { basicTacticInfo } = item;
            return basicTacticInfo;
        });
        //更新 方案列表 store
        props.schemeListData.updateList(list, generateTime);
    }, []);

    useEffect( ()=>{
        if( isValidVariable(id) ){
            //获取方案列表--开启下一轮更新
            curStatusValues.current = statusValues;
            props.schemeListData.toggleLoad(true);
            getSchemeList(true);
        }else{
            //没有user id 清定时器
            if( isValidVariable(schemeTimeoutId.current) ){
                clearTimeout(schemeTimeoutId.current);
                schemeTimeoutId.current = "";
            }
        }
    }, [ id, statusValues ]);

    //监听全局刷新
    useEffect(function(){
        if( pageRefresh && isValidVariable(id) ){
            // console.log("全局刷新开启")
            props.schemeListData.toggleLoad(true);
            getSchemeList( false );
        }
    },[ pageRefresh, id ]);

    useEffect(()=>{
        return ()=>{
            if( isValidVariable(schemeTimeoutId.current) ){
                clearTimeout(schemeTimeoutId.current);
                schemeTimeoutId.current = "";
            }
            props.schemeListData.updateList([], "");
            props.schemeListData.toggleSchemeActive("");
        }
    },[])
    
    return getSchemeList;
}
//航班请求 hook
function useFlightsList(props){
    const flightsTimeoutId = useRef([]);

    const { schemeListData, flightTableData, systemPage } = props;
    const { activeSchemeId, generateTime = "" } = schemeListData;
    const { 
        pageRefresh,
        user: 
        { 
            id = ""
        } = {} 
    } = systemPage;

    //更新--航班列表 store数据
    const updateFlightTableData = useCallback( ( flightData )  => {
        if( isValidVariable(props.schemeListData.activeSchemeId)  ){
            let  { flights, generateTime } = flightData;
            if( flights !== null ){
                flightTableData.updateFlightsList(flights, generateTime);
                sessionStorage.setItem("flightTableGenerateTime", generateTime);
            }else{
                flightTableData.updateFlightsList([], generateTime);
            }
        }
        
    },[props.schemeListData.activeSchemeId]);


    //获取--航班列表数据
    const getFlightTableData = useCallback( (nextRefresh, showLoad = false ) => {

        const p = new Promise( (resolve, reject) => {
            let url = "";
            let params = {};
            let activeSchemeId = schemeListData.activeSchemeId;
            if( !isValidVariable( activeSchemeId ) ){
                flightTableData.updateFlightsList([], "", "");
                return;
            }
            // console.log("本次方案id:", activeSchemeId)
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
            let reqId = activeSchemeId;
            let trafficId = "";
            if( activeSchemeId.indexOf("focus") > -1 ){
                trafficId = activeSchemeId.replace(/focus-/g, "");
                activeSchemeId = "";
                reqId = "";
                
            }
            params = {
                startTime: baseTime + '000000',
                endTime: baseTime+'235900',
                id: reqId,
                trafficId,
            };
            const timerFunc = function(){
                //开启定时
                if( nextRefresh ){
                    if( isValidVariable(flightsTimeoutId.current) ){
                        // console.log(" success 航班列表定时器-清理:"+flightsTimeoutId.current)
                        flightsTimeoutId.current.map( t => {
                            clearTimeout(t);
                        })
                        flightsTimeoutId.current = [];
                    }
                    const timer = setTimeout( ()=>{
                        if( !props.flightTableData.dataLoaded ){
                            // console.log(" success 航班列表定时器-执行:"+flightsTimeoutId.current)
                            getFlightTableData( true );
                        }
                    }, 30*1000);
                    flightsTimeoutId.current.push(timer);
                }
            }
            //开始获取数据，修改状态
            const opt = {
                url,
                method:'GET',
                params,
                resFunc: (data)=> {
                    updateFlightTableData(data);
                    timerFunc();
                    if( props.flightTableData.loading ){
                        customNotice({
                            type: 'success',
                            message: '航班列表数据获取成功',
                            duration: 5
                        })
                    }
                    props.flightTableData.toggleLoad(false, false);
                    resolve("success");
                }, 
                errFunc: (err)=> {
                    requestErr(err, '航班列表数据获取失败');
                    //开启定时
                    timerFunc();

                    props.flightTableData.toggleLoad(false, false);
                    resolve("error");
                } ,
            };
           
            if( !props.flightTableData.dataLoaded ){
                requestGet(opt);
                props.flightTableData.toggleLoad(showLoad, true);
            }
            
            
        })

    }, []);
    

    useEffect( ()=>{
        if( isValidVariable(activeSchemeId) ){
            flightsTimeoutId.current.map( t => {
                clearTimeout(t);
            })
            flightsTimeoutId.current = [];
            getFlightTableData(true, true);
        }
    }, [activeSchemeId]);

    //监听全局刷新
    useEffect(function(){
        if( pageRefresh && isValidVariable(id) ){
            // console.log("全局刷新开启")
            props.flightTableData.toggleLoad(true, true);
            getFlightTableData( false );
        }
    },[ pageRefresh, id ]);

    useEffect(()=>{
        return ()=>{
            if( isValidVariable(flightsTimeoutId.current) ){
                flightsTimeoutId.current.map( t => {
                    clearTimeout(t);
                })
                flightsTimeoutId.current = [];
            }
            flightTableData.updateFlightsList([], "");
        }
    },[])
   
    
    
}
//KPI请求 hook
function useKPIData(props){
    const { schemeListData, executeKPIData, systemPage } = props;
    const { activeSchemeId, generateTime = "" } = schemeListData;
    const { 
        pageRefresh,
        leftActiveName,
        user: 
        { 
            id = ""
        } = {} 
    } = systemPage;
    const KPITimeoutId = useRef();
    
    //更新--执行KPI store数据
    const updateKPIData = useCallback( data => {
        // console.log(data)
        if( isValidObject(data) ){
            executeKPIData.updateExecuteKPIData(data )
        }else{
            executeKPIData.updateExecuteKPIData({});
            customNotice({
                type: 'error',
                content:"获取的KPI数据为空",
            });

        }
    },[]);
    //获取--执行KPI数据
    const getKPIData = useCallback( nextRefresh => {
        // console.log("执行KPI数据 getKPIData")
        if(leftActiveName === "kpi"){
            const p = new Promise( (resolve, reject) => {
                let activeSchemeId = schemeListData.activeSchemeId;
                if( activeSchemeId.indexOf("focus") > -1 ){
                    activeSchemeId = activeSchemeId.replace(/focus-/g, "");
                }
                const opt = {
                    url: ReqUrls.kpiDataUrl + activeSchemeId,
                    method:'GET',
                    params:{},
                    resFunc: (data)=> {
                        updateKPIData(data)
                        executeKPIData.toggleLoad(false);
                        //开启定时
                        if( nextRefresh ){
                            if( isValidVariable(KPITimeoutId.current) ){
                                clearTimeout(KPITimeoutId.current);
                                KPITimeoutId.current = "";
                            }
                            KPITimeoutId.current = setTimeout( ()=>{
                                // console.log("执行KPI数据 定时器-下一轮更新开始")
                                getKPIData( true );
                            }, 60*1000);
                        }
                        notification.destroy();
                        resolve("success")
                    },
                    errFunc: (err)=> {
                        requestErr(err, 'KPI数据获取失败');
                        if( executeKPIData.loading ){
                            executeKPIData.toggleLoad(false);
                        }
                        //开启定时
                        if( nextRefresh ){
                            if( isValidVariable(KPITimeoutId.current) ){
                                clearTimeout(KPITimeoutId.current);
                                KPITimeoutId.current = "";
                            }
                            KPITimeoutId.current = setTimeout( ()=>{
                                // console.log("执行KPI数据 定时器-下一轮更新开始")
                                getKPIData( true );
                            }, 60*1000);
                        }
                        resolve("error");
                    } ,
                };
                requestGet(opt);
            })
        }
    },[leftActiveName]);

    useEffect( ()=>{
        // console.log("执行KPI数据 activeSchemeId, leftActiveName", activeSchemeId, leftActiveName)
        // && (leftActiveName === "kpi"
        if( isValidVariable(activeSchemeId) ){
            executeKPIData.toggleLoad(true);
            getKPIData(true);
        }

    }, [activeSchemeId, leftActiveName]);

    //监听全局刷新
    useEffect(function(){
        if( pageRefresh && isValidVariable(id) ){
            // console.log("全局刷新开启")
            executeKPIData.toggleLoad(true);
            getKPIData( false );
        }
    },[ pageRefresh, id ]);

    useEffect(()=>{
        return ()=>{
            if( isValidVariable(KPITimeoutId.current) ){
                clearTimeout(KPITimeoutId.current);
                KPITimeoutId.current = "";
            }
            executeKPIData.updateExecuteKPIData({});
        }
    },[])

}

const useSchemeModal = () =>{
    const [ visible, setVisible ] = useState(false); //详情模态框显隐
    const [ modalId, setModalId ] = useState(""); //当前选中方案详情的id，不一定和激活方案id一样
    const [ modalType, setModalType ] = useState(""); //当前选中方案详情的id，不一定和激活方案id一样

    //方案模态框显隐
    const toggleModalVisible = useCallback(( flag, id )=>{
        setVisible(flag);
        //选中方案id
        setModalId(id);
    },[]);
    
    //方案模态框类型切换
    const toggleModalType = useCallback(( type )=>{
        setModalType(type);
    },[]);

    return {
        visible,
        modalId,
        modalType,
        setVisible,
        toggleModalVisible,
        toggleModalType
    }
}



//方案头
const STitle = (props) => {
    const { schemeListData } = props;
    const { statusValues } = schemeListData; //获取排序后的方案列表
     //状态-多选按钮组-切换事件
     const onChange = useCallback((checkedValues)=>{
        // console.log('checked = ', checkedValues);
        schemeListData.setStatusValues( checkedValues );
    },[]);
    return (
        <div className="scheme-filter-items">
            <Checkbox.Group 
                options={plainOptions} 
                defaultValue={statusValues} 
                onChange={onChange} 
            />
        </div>
    )
}
const SchemeTitle = inject("schemeListData")(observer(STitle))


//方案列表
function SList (props){
    const getSchemeList = useSchemeList(props);
    useFlightsList(props);
    useKPIData(props);
    const {
        visible,
        modalId,
        modalType,
        setVisible,
        toggleModalVisible,
        toggleModalType
    } = useSchemeModal();
    
    const { schemeListData } = props;
    const { sortedList, activeSchemeId, loading } = schemeListData; //获取排序后的方案列表

    //接收客户端传来方案id，用以自动切换到选中方案
    NWGlobal.setSchemeId = useCallback(( schemeId, title )  => {
        // alert("收到id:"+schemeId+"  title:"+title);
         //主动获取一次
        getSchemeList().then( function(data) {
            handleActive( schemeId, title, 'client' );
            if( isValidVariable(title) ){
                customNotice({
                    type: 'warning',
                    message: "暂未获取到方案，方案名称是：" + title,
                    duration: 15
                })
               
            }
        });
    },[]);
    

    //高亮方案并获取航班数据和KPI数据
    const handleActive = useCallback( debounce( ( id, title, from ) => {
        console.log("handleActive 方案:",id)
        if( (!props.flightTableData.dataLoaded) || ( from === "init" ) ){
            const res = schemeListData.toggleSchemeActive( id+"" );
            props.systemPage.setLeftNavSelectedName("");
            if( res ){
                //来自客户端定位，滚动到对应位置
                if( from === "client" ){
                    // 滚动条滚动到顶部
                    const canvas = document.getElementsByClassName("scheme_list_canvas")[0];
                    const boxContent = canvas.getElementsByClassName("list_container")[0];
                    boxContent.scrollTop = 0;
                }
            }
        }else{
            customNotice({
                type: 'warning',
                message: '航班数据请求中,请稍后再试',
                duration: 10
            });
            if( isValidVariable(title) ){
                message.warning({
                    content: "暂未获取到方案，方案名称是：" + title ,
                    duration: 15,
                });
            }
        }
        
    } , 500),[]);

    useEffect(() => {
         if( activeSchemeId === "" && sortedList.length > 0 ){
            handleActive( sortedList[0].id, "", "init")
        }
    }, [sortedList, activeSchemeId])


    // console.log("方案列表 render")
   
    return (
        <Spin spinning={ loading } >
            <div className="list_container" >
                {
                    ( sortedList.length > 0) ?
                    sortedList.map( (item, index) => (
                            <SchemeItem
                                activeSchemeId={activeSchemeId}
                                item={item}
                                handleActive={handleActive}
                                key={index}
                                toggleModalVisible={toggleModalVisible}
                                toggleModalType={toggleModalType}
                                userHasAuth={ props.systemPage.userHasAuth }
                            >
                            </SchemeItem>
                        )
                    ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ color:"#fff"}} />

                }
                { 
                    visible ? <SchemeModal
                        visible={visible}
                        setVisible={setVisible}
                        modalType={ modalType }
                        modalId={modalId} />
                        : ""
                            
                }

            </div>
        </Spin>
    )
}

const SchemeList = inject("schemeListData", "flightTableData", "executeKPIData", "systemPage")(observer(SList))

const SchemeListModal = () => {
    return (
        <div className="scheme_list_canvas">
            <SchemeTitle />
            <SchemeList />
        </div>
    )
}
export default SchemeListModal