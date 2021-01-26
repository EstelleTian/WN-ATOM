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
import { getFullTime, isValidObject, isValidVariable, formatTimeString } from 'utils/basic-verify'
import AirportMonitor from 'components/MiniMonitor/AirportMonitor'
import { ReqUrls } from 'utils/request-urls'
import AddMonitorCard from 'components/MiniMonitor/AddMonitorCard'
import ModalBox from 'components/ModalBox/ModalBox'
import 'components/ModalBox/ModalBox.scss'
import "./CapacityFlowMonitor.scss"


//容流略图模块
const CapacityFlowMonitor =(props) => {

    const capacityFlowMonitorData = props.capacityFlowMonitorData || {};
    const { loading } = capacityFlowMonitorData;
    const monitorData = capacityFlowMonitorData.monitorData || {};
    const generateTime = monitorData.generateTime || "";
    const describedMap = monitorData.selfDescribedMap || {};
    const flow = monitorData.flow || {}
    // 类型排序
    const typeOrder = ['AP', 'ACC', 'SECTOR', 'APP', 'ROUTE', 'POINT'];

    /**
     * 更新单条容流数据的描述数据
     * */
    const updateSingleDataDescription =(key, descriptionData) => {
        if(isValidObject(flow) && isValidObject(flow[key])){
            flow[key].description = descriptionData;
        }
    };

    /**
     * 分类
     * */
    const getClassifiedData = (typeData, describedMap)=> {
        for( let key in describedMap){
            let data = describedMap[key];
            updateSingleDataDescription(key, data);
            let type = data['type'];
            for(let t in typeData){
                if(type === t){
                    typeData[type][key] = data;
                }
            }
        }
    };

    // 分类数据
    const typeData = {
        // 机场
        'AP': {},
        // 航路点
        'POINT': {},
        // 航路
        'ROUTE': {},
        // 管制区
        'ACC': {},
        // 扇区
        'SECTOR': {},
        // 进近
        'APP': {},
    };
    // 进行分类
    getClassifiedData(typeData, describedMap);

    const getSingleTypeData = (type, monitorData) => {
        // 取出已分类数据对象中该类数据
        let typeDataMap = typeData[type];
        let arr=[];
        // 遍历并取monitorData数据中对应的容流数据
        for( let d in typeDataMap){
            let obj = {
                id: d,
                title: d,
                generateTime: generateTime,
                data: monitorData[d],
            };

            arr.push(obj);
        }

        // 排序 按order字段值升序
        let sortArr = arr.sort((item1,item2)=>{

            if(isValidObject(item1)
                && isValidObject(item1.data)
                && isValidObject(item1.data.description)
                && isValidObject(item1.data.description.order)
                && isValidObject(item2)
                && isValidObject(item2.data)
                && isValidObject(item2.data.description)
                && isValidObject(item2.data.description.order) ){
                let nameA = item1.data.description.order; // ignore upper and lowercase
                let nameB = item2.data.description.order; // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
            }
            // names must be equal
            return 0;
        });

        return sortArr;
    };


    // 容流列表
    let monitorDataist = [];

    // 机场类型数据
    let APMonitorData = getSingleTypeData('AP', flow);
    // 管制区
    let ACCMonitorData = getSingleTypeData('ACC', flow);
    // 扇区类型数据
    let SECTORMonitorData = getSingleTypeData('SECTOR', flow);
    // 进近
    let APPMonitorData = getSingleTypeData('APP', flow);
    // 航路
    let ROUTEMonitorData = getSingleTypeData('ROUTE', flow);
    // 航路点
    let POINTonitorData = getSingleTypeData('POINT', flow);
    monitorDataist = APMonitorData.concat(ACCMonitorData).concat(SECTORMonitorData).concat(APPMonitorData).concat(ROUTEMonitorData).concat(POINTonitorData);

    const appendAddMonitorCard = (arrData) => {
        let addData = {
            id: 'ADD',
            title: '新增监控',
        }
        arrData.push(addData);
        return arrData;
    };
    monitorDataist = appendAddMonitorCard(monitorDataist);

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
                    <ModalBox showDecorator = {false} title={`${item.title} (数据时间:${formatTimeString(item.generateTime)})`}className="monitor-box">
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
    // 更新--执行KPI store数据
    const updateCapacityFlowMonitorData = useCallback(capacityFlowMonitorData => {
        if( isValidObject(capacityFlowMonitorData) ){
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
        let errMsg = "";
        if(isValidObject(err) && isValidVariable(err.message)){
            errMsg = err.message;
        }else if(isValidVariable(err)){
            errMsg = err;
        }

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
            url: ReqUrls.capacityFlowMonitorDataUrl+'?targets=IGADA,P40,ZLXY,ZLLL,ZLXYACC,ZLLLACC,ZLXYAR01,ZLXYAR02,ZLXYAR07,ZLLLAR01,ZLLLAR02&starttime='+ start+'&endtime='+end,
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
        <Spin spinning={loading} >
        <div className="capacity_flow_monitor_container">
            <List
                grid={{ gutter: 16, column: 5 }}
                dataSource={monitorDataist}
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
