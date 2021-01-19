/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-16 17:44:02
 * @LastEditors: Please set LastEditors
 * @Description: In U.3ser Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, { useEffect, useCallback } from 'react'
import { inject, observer } from 'mobx-react'
import { request } from 'utils/request'
import {  message, Spin, List, } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons';
import { getFullTime, isValidObject } from 'utils/basic-verify'
import AirportMonitor from 'components/MiniMonitor/AirportMonitor'
import { ReqUrls } from 'utils/request-urls'
import AddMonitorCard from 'components/MiniMonitor/AddMonitorCard'
import ModalBox from 'components/ModalBox/ModalBox'
import 'components/ModalBox/ModalBox.scss'
import "./CapacityFlowMonitor.scss"


//容流略图模块
const CapacityFlowMonitor =(props) => {

    const capacityFlowMonitorData = props.capacityFlowMonitorData || {};
    const monitorData = capacityFlowMonitorData.monitorData || {};
    const flow = monitorData.flow || {}
    console.log(flow);

    const getAirportMonitorData = (monitorData) => {
        let arr = [];
        for( let d in monitorData){
            let obj = {
                id: d,
                title: d,
                data: monitorData[d],
            };
            arr.push(obj);
        }
        return arr;
    };



    let airportMonitorData = getAirportMonitorData(flow);

    const appendAddMonitorCard = (arrData) => {
        let addData = {
            id: 'ADD',
            title: '新增',
        }

        arrData.push(addData);
        return arrData;
    };

    airportMonitorData = appendAddMonitorCard(airportMonitorData);




    const  listItemData = (item)=> {
        if(item.id ==='ADD'){
            return (
                <List.Item key={item.key}>
                    <ModalBox showDecorator = {true} title={item.title} className="monitor-box add-monitor-box">
                        <div className="monitor-content">
                            <AddMonitorCard data={ item.data }  />
                        </div>
                    </ModalBox>
                </List.Item>
            )
        }else {
            return (
                <List.Item key={item.key}>
                    <ModalBox showDecorator = {true} title={item.title} className="monitor-box">
                        <div className="actions">
                            <div onClick={()=>{console.log("sss")}} className="remove">
                                <CloseCircleOutlined />
                            </div>
                        </div>
                        <div className="monitor-content">
                            <AirportMonitor data={ item.data }  />

                        </div>

                    </ModalBox>
                </List.Item>
            )
        }
    }


    const SectorMonitorData = [
        {
            title: '西安01扇区',
        },
        {
            title: '西安02扇区',
        },
        {
            title: '西安03扇区',
        },
        {
            title: '西安04扇区',
        },

    ];

    // 更新--执行KPI store数据
    const updateCapacityFlowMonitorData = useCallback(capacityFlowMonitorData => {
        if( isValidObject(capacityFlowMonitorData) ){
            console.log(capacityFlowMonitorData)
            props.capacityFlowMonitorData.updateCapacityFlowMonitorData(capacityFlowMonitorData)
        }else{
            props.capacityFlowMonitorData.updateCapacityFlowMonitorData({});
            message.error({
                content:"获取的航班执行数据为空",
                duration: 4,
            });

        }
    });

    // 请求错误处理
    const requestErr = useCallback((err, content) => {
        const errMsg = err.message || "";
        message.error({
            content:(
                <span>
                    <span>{ content }</span>
                    <br/>
                    <span>{errMsg}</span>
                </span>
            ),
            duration: 4,
        });
    });


    useEffect(function(){
        // 初次获取数据启用loading
        props.capacityFlowMonitorData.toggleLoad(true);
        // 获取数据
        requestCapacityFlowMonitorData();
        // 清除定时
        clearInterval(props.capacityFlowMonitorData.timeoutId);
        // 开启定时获取数据
        props.capacityFlowMonitorData.timeoutId = setInterval(requestCapacityFlowMonitorData, 60*1000);
        return function(){
            clearInterval(props.capacityFlowMonitorData.timeoutId);
            props.capacityFlowMonitorData.timeoutId = "";
        }
    },[])




    // 获取容流数据
    const requestCapacityFlowMonitorData = useCallback(() => {
        const nowDate = getFullTime(new Date()).substring(0,8);
        const start = nowDate+'000000';
        const end = nowDate+'235900';
        const opt = {
            url: ReqUrls.capacityFlowMonitorDataUrl+'?targets=ZLXY,ZLLL,ZLXYACC,ZLLLACC,ZLXYAR01,ZLLLAR01&starttime='+ start+'&endtime='+end,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateCapacityFlowMonitorData(data)
                props.capacityFlowMonitorData.toggleLoad(false)
            },
            errFunc: (err)=> {
                requestErr(err, '容流数据获取失败')
                props.capacityFlowMonitorData.toggleLoad(false)
            } ,
        };
        request(opt);
    });





    return(
        <Spin spinning={false} >
        <div className="capacity_flow_monitor_container">
            <List
                grid={{ gutter: 16, column: 5 }}
                dataSource={airportMonitorData}
                renderItem={item => (
                    listItemData(item)
                )}
            />
            {/*<List*/}
                {/*grid={{ gutter: 16, column: 8 }}*/}
                {/*dataSource={SectorMonitorData}*/}
                {/*renderItem={item => (*/}
                    {/*<List.Item>*/}
                        {/*<Card size="small" title={item.title}><SectorMonitor/></Card>*/}
                    {/*</List.Item>*/}
                {/*)}*/}
            {/*/>*/}
        </div>
        </Spin>
    )
}

export default inject("capacityFlowMonitorData","systemPage")(observer(CapacityFlowMonitor))