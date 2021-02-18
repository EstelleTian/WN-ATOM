/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-02-18 14:59:02
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: \WN-CDM\src\components\ExecuteKPI\ExecuteKPI.jsx
 */
import React, { useEffect, useCallback,useState } from 'react'
import { Row, Spin, message } from 'antd'
import { inject, observer } from 'mobx-react'
import { isValidVariable, isValidObject } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import { request } from 'utils/request'
import ImpactFlights from './ImpactFlights'
import ImpactLevel from './ImpactLevel'
import CTOTRate from './CTOTRate'
import PreDelay from './PreDelay'

import './ExecuteKPI.scss'

//单个方案执行KPI模块
const ExecuteKPI = (props) => {
    const executeKPIData = props.executeKPIData;
    const { loading } = executeKPIData;

    //更新--执行KPI store数据
    const updateExecuteKPIData = useCallback(executeKPIData => {
        console.log(executeKPIData)
        if( isValidObject(executeKPIData) ){
            props.executeKPIData.updateExecuteKPIData(executeKPIData)
        }else{
            props.executeKPIData.updateExecuteKPIData({});
            message.error({
                content:"获取的KPI数据为空",
                duration: 4,
            });

        }
    },[props.executeKPIData]);
    
    //获取--执行KPI数据
    const requestExecuteKPIData = useCallback( ( id, resolve, reject ) => {
        if(props.systemPage.leftActiveName === "kpi"){
            const opt = {
                url: ReqUrls.kpiDataUrl + id,
                method:'GET',
                params:{},
                resFunc: (data)=> {
                    updateExecuteKPIData(data)
                    props.executeKPIData.toggleLoad(false);
                    if( isValidVariable(resolve) ){
                        resolve("success");
                    }
                },
                errFunc: (err)=> {
                    requestErr(err, 'KPI数据获取失败')
                    props.executeKPIData.toggleLoad(false);
                    if( isValidVariable(resolve) ){
                        resolve("error")
                    }
                } ,
            };
            request(opt);
        }
    },[props.executeKPIData]);

     //请求错误处理
     const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    },[]);

    //高亮方案并获取航班数据和KPI数据
    const handleActive = useCallback(( id, title, from ) => {
        const res = props.schemeListData.toggleSchemeActive( id+"" );
        if( res ){
            props.executeKPIData.toggleLoad(true);
            requestExecuteKPIData(id+"");
        }
    },[props.schemeListData, props.executeKPIData]);

    useEffect(()=>{
        console.log("useEffect leftActiveName:",props.systemPage.leftActiveName);
        if(props.systemPage.leftActiveName === "kpi"){
            const id = props.schemeListData.activeScheme.id || "";
            requestExecuteKPIData(id);
        }
        
    }, [props.systemPage.leftActiveName]);

        // DidMount 激活方案列表id变化后，重新处理执行KPI定时器
        useEffect(function(){
            const id = props.schemeListData.activeScheme.id || "";
            // console.log("执行KPI useEffect id变了:"+id);
            if( isValidVariable( props.schemeListData.activeScheme.id ) ){
                // if( !isValidVariable(props.executeKPIData.timeoutId) ){
                    props.executeKPIData.toggleLoad(true);
                    requestExecuteKPIData(id);
                
                // }
                // console.log("执行KPI 清空定时器:"+props.flightTableData.timeoutId);
                clearInterval(props.executeKPIData.timeoutId);
                props.executeKPIData.timeoutId = "";
                //生成新定时器--轮询
                const timeoutid = setInterval(function(){
                    // console.log("执行KPI 定时开始执行， 获取数据，id是："+ id);
                    // setSchemeListRefresh(false);
                    if( props.systemPage.leftActiveName === "kpi"){
                        requestExecuteKPIData(id)
                    }
                },60 * 1000);
                // console.log("执行KPI 配置定时器:"+timeoutid);
                props.executeKPIData.timeoutId = timeoutid;
            }else{
                clearInterval(props.executeKPIData.timeoutId);
                props.executeKPIData.timeoutId = "";
                props.executeKPIData.updateExecuteKPIData({});
            }
        }, [ props.schemeListData.activeScheme.id ] );
    

    //监听全局刷新
    useEffect(function(){
        const id = props.systemPage.user.id;
        if( props.systemPage.pageRefresh && isValidVariable(id) ){
            const id = props.schemeListData.activeScheme.id || "";
            let p3;
            if( isValidVariable( id ) ){
                p3 = new Promise(function(resolve, reject) {
                    // 异步处理
                    props.executeKPIData.toggleLoad(true);
                    // 处理结束后、调用resolve 或 reject
                    requestExecuteKPIData(id, resolve, reject);
                } );
            }
        
        }
    },[ props.systemPage.pageRefresh ]);

    // DidMount 
    useEffect(function(){
        return function(){
            clearInterval(props.executeKPIData.timeoutId);
            props.executeKPIData.timeoutId = "";
        }
    },[]);
    return (
        <Spin spinning={loading} >

            <div className="kpi_canvas">
                <ImpactFlights executeKPIData={ executeKPIData } />
                <ImpactLevel executeKPIData={ executeKPIData }  />
                <Row className="ant-row-no-wrap">


                </Row>
                <CTOTRate executeKPIData={ executeKPIData }  />
                <PreDelay executeKPIData={ executeKPIData }  />
            </div>

        </Spin>
    )
}

export default inject("executeKPIData", "schemeListData", "systemPage")(observer(ExecuteKPI))
