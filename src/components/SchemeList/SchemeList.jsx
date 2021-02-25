/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2021-02-25 16:29:56
 * @LastEditors: Please set LastEditors
 * @Description: 方案列表
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import {message, Checkbox, Empty, Spin} from 'antd'
import { requestGet } from 'utils/request'
import { isValidVariable } from 'utils/basic-verify'
import { NWGlobal } from  'utils/global'
import  SchemeModal  from "./SchemeModal";
import { ReqUrls } from 'utils/request-urls'
import  SchemeItem  from "./SchemeItem";
import './SchemeList.scss'
import { clearTimeout } from 'highcharts';


//方案多选按钮组
const plainOptions = [
    { label: '正在执行', value: 'RUNNING' },
    { label: '将要执行', value: 'FUTURE' },
    { label: '正常结束', value: 'FINISHED' },
    { label: '人工终止', value: 'TERMINATED_MANUAL' },
    { label: '自动终止', value: 'TERMINATED_AUTO' },
];

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
    const timeoutId = useRef("");

    //获取--方案列表 @nextRefresh 是否开启下一轮定时
    const getSchemeList = useCallback(( nextRefresh = false ) => {
        console.log("获取--方案列表，statusValues是:"+curStatusValues.current);
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
                        timeoutId.current = setTimeout( ()=>{
                            console.log("方案列表定时器-下一轮更新开始")
                            getSchemeList( true );
                        }, 30*1000);
                    }
                    resolve("success")
    
                },
                errFunc: (err)=> {
                    requestErr(err, '方案列表数据获取失败' );
                    if( props.schemeListData.loading ){
                        props.schemeListData.toggleLoad(false);
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

     //请求错误--处理
     const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    },[]);
    
    useEffect( ()=>{
        if( isValidVariable(id) ){
            //获取方案列表--开启下一轮更新
            curStatusValues.current = statusValues;
            console.log("statusValues:"+statusValues)
            props.schemeListData.toggleLoad(true);
            let flag = (timeoutId.current === "");
            getSchemeList(flag);
        }else{
            //没有user id 清定时器
            clearTimeout( timeoutId.current );
            timeoutId.current = "";
        }
    }, [ id, statusValues ]);

    //监听全局刷新
    useEffect(function(){
        if( pageRefresh && isValidVariable(id) ){
            console.log("全局刷新开启")
            props.schemeListData.toggleLoad(true);
            getSchemeList( false );
        }
    },[ pageRefresh, id ]);

    // 卸载
    useEffect(function(){
        return function(){
            // console.log("方案列表卸载");
            clearTimeout( timeoutId.current );
            timeoutId.current = "";
        }
    },[]);
    return getSchemeList
}
//航班请求 hook
function useFlightsList(props){
    const timeoutId = useRef("");

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
    const updateFlightTableData = useCallback( ( flightData, id )  => {
        let  { flights, generateTime } = flightData;
        if( flights !== null ){
            flightTableData.updateFlightsList(flights, generateTime, id);
            sessionStorage.setItem("flightTableGenerateTime", generateTime);
        }else{
            flightTableData.updateFlightsList([], generateTime, id);
        }
    },[]);


    //获取--航班列表数据
    const getFlightTableData = useCallback( (nextRefresh) => {
        // console.log("requestFlightTableData requestFlightTableData")
        const p = new Promise( (resolve, reject) => {
            let url = "";
            let params = {};
            const activeSchemeId = schemeListData.activeSchemeId;
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
                params = {
                    startTime: baseTime + '000000',
                    endTime: baseTime+'235900',
                    id: activeSchemeId
                };
            const opt = {
                url,
                method:'GET',
                params,
                resFunc: (data)=> {
                    updateFlightTableData(data, activeSchemeId);
                    if( props.flightTableData.loading ){
                        props.flightTableData.toggleLoad(false);
                    }
                    //开启定时
                    if( nextRefresh ){
                        timeoutId.current = setTimeout( ()=>{
                            // console.log("航班列表定时器-下一轮更新开始")
                            getFlightTableData( true );
                        }, 60*1000);
                    }
                    resolve("success")
    
                }, 
                errFunc: (err)=> {
                    requestErr(err, '航班列表数据获取失败');
                    if( props.flightTableData.loading ){
                        // props.flightTableData.toggleLoad(false);
                    }
                    resolve("error");
                } ,
            };
            requestGet(opt);
        })

    }, []);

    useEffect( ()=>{
        props.flightTableData.toggleLoad(true);
        let flag = (timeoutId.current === "");
        getFlightTableData(flag);
    }, [activeSchemeId]);

    //监听全局刷新
    useEffect(function(){
        if( pageRefresh && isValidVariable(id) ){
            // console.log("全局刷新开启")
            props.flightTableData.toggleLoad(true);
            getFlightTableData( false );
        }
    },[ pageRefresh, id ]);
    
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
        });
    },[]);
    

    //高亮方案并获取航班数据和KPI数据
    const handleActive = useCallback( debounce( ( id, title, from ) => {
        // console.time("点击了方案id")
        // console.log("handleActive 方案")
        const res = schemeListData.toggleSchemeActive( id+"" );
        if( res ){
            //来自客户端定位，滚动到对应位置
            if( from === "client" ){
                // 滚动条滚动到顶部
                const canvas = document.getElementsByClassName("scheme_list_canvas")[0];
                const boxContent = canvas.getElementsByClassName("list_container")[0];
                boxContent.scrollTop = 0;
            }
        }else{
            if( isValidVariable(title) ){
                message.warning({
                    content: "暂未获取到方案，方案名称是：" + title ,
                    duration: 15,
                });
            }
        }
    } , 350),[]);

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

const SchemeList = inject("schemeListData", "flightTableData", "systemPage")(observer(SList))

const SchemeListModal = () => {
    return (
        <div className="scheme_list_canvas">
            <SchemeTitle />
            <SchemeList />
        </div>
    )
}
export default SchemeListModal