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
import { getFullTime, isValidObject, isValidVariable, formatTimeString, addStringTime } from 'utils/basic-verify'
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
    const flow = monitorData.flow || {};
    let  capacityFlowMonitorWeatherData = props.capacityFlowMonitorWeatherData || {};
    const weatherData = capacityFlowMonitorWeatherData.weatherData || [];
    const monitorUnitsCNName = {
        "ZLXY": "西安机场",
        "ZLLL": "兰州机场",
        "ZLXN": "西宁机场",
        "ZLIC": "银川机场",
        "ZLXYAR01": "西安01扇区",
        "ZLXYAR02": "西安02扇区",
        "ZLXYAR03": "西安03扇区",
        "ZLXYAR04": "西安04扇区",
        "ZLXYAR05": "西安05扇区",
        "ZLXYAR06": "西安06扇区",
        "ZLXYAR07": "西安07扇区",
        "ZLXYAR08": "西安08扇区",
        "ZLXYAR09": "西安09扇区",
        "ZLXYAR10": "西安10扇区",
        "ZLXYAR11": "西安11扇区",
        "ZLXYAR12": "西安12扇区",
        "ZLXYAR13": "西安13扇区",
        "ZLLLAR01": "兰州01扇区",
        "ZLLLAR02": "兰州02扇区",
        "ZLLLAR03": "兰州03扇区",
        "ZLLLAR04": "兰州0扇4区",
        "ZLLLAR05": "兰州05扇区",
        "ZLLLAR06": "兰州06扇区",
        "ZLLLAR07": "兰州07扇区",
        "ZLLLAR08": "兰州08扇区",
        "ZLLLAR09": "兰州09扇区",
        "ZLLLAR11": "兰州11扇区",
        "ZLLLAR12": "兰州12扇区"
    };

    const formatWeatherData = ()=> {
        let obj = {}
        weatherData.map((item)=>{
            obj[item.airport] = item.weatherCH || "";
        })
        return obj;
    };

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
        // 扇区
        'SECTOR': {},
        // 进近
        'APP': {},
        // 航路点
        'POINT': {},
        // 航路
        'ROUTE': {},
        // 管制区
        'ACC': {},
        
    };
    let weatherDataObj =  formatWeatherData();
    // 进行分类
    getClassifiedData(typeData, describedMap);

    const getSingleTypeData = (type, monitorData) => {
        const { userSubscribeData={} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        let { monitorUnit } = subscribeData;
        // 取出已分类数据对象中该类数据
        let typeDataMap = typeData[type];
        let arr=[];
        // 遍历并取monitorData数据中对应的容流数据
        for( let d in typeDataMap){
            
            let obj = {
                key: d,
                id: d,
                // title: `${d}-${CN_Name}`,
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
                && isValidVariable(item1.data.overCapacity)
                && isValidObject(item2.data)
                && isValidVariable(item2.data.overCapacity) ){
                // 超容量
                let overCapacityA = item1.data.overCapacity; // ignore upper and lowercase
                let overCapacityB = item2.data.overCapacity; // ignore upper and lowercase
                if (overCapacityA > overCapacityB) {
                    return -1;
                }else if (overCapacityA < overCapacityB) {
                    return 1;
                } else if(overCapacityA === overCapacityB){
                    // 总流量
                    let totalFlowsA = item1.data.totalFlows || 0; // ignore upper and lowercase
                    let totalFlowsB = item2.data.totalFlows || 0; // ignore upper and lowercase
                    if (totalFlowsA > totalFlowsB) {
                        return -1;
                    }else if (totalFlowsA < totalFlowsB) {
                        return 1;
                    } else {
                        return 0
                    }
                }
            }
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
    monitorDataist = APMonitorData.concat(ACCMonitorData).concat(SECTORMonitorData);

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
                <List.Item className="moitor-col" key={item.key}>
                    <ModalBox showDecorator = {false} title={item.title} className="monitor-box add-monitor-box">
                        <div className="monitor-content">
                            <AddMonitorCard data={ item.data }  />
                        </div>
                    </ModalBox>
                </List.Item>
            )
        }else {
            return (
                <List.Item className="moitor-col" key={item.key}>
                    <ModalBox showDecorator = {false} title={item.title} data={item.data} className="monitor-box">
                        <div className="actions">
                            <div onClick={()=>{console.log("sss")}} className="remove">
                                <CloseCircleOutlined />
                            </div>
                        </div>
                        <div className="monitor-content">
                            <AirportMonitor data={ item.data } weatherData={ weatherDataObj[item.key]}  />
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
    // 更新--气象 store数据
    const updateCapacityFlowMonitorWeatherData = useCallback(weatherData => {
        if( isValidObject(weatherData) && isValidVariable(weatherData.result) ){
            props.capacityFlowMonitorWeatherData.updateCapacityFlowMonitorWeatherData(weatherData.result)
        }else{
            props.capacityFlowMonitorWeatherData.updateCapacityFlowMonitorWeatherData({});
            message.error({
                content:"获取的气象数据为空",
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
        // 获取气象数据
        requestWeatherData();
        // 清除定时
        clearInterval(props.capacityFlowMonitorData.timeoutId);
        clearInterval(props.capacityFlowMonitorWeatherData.timeoutId);
        // 开启定时获取数据
        props.capacityFlowMonitorData.timeoutId = setInterval(requestCapacityFlowMonitorData, 60*1000);
        props.capacityFlowMonitorWeatherData.timeoutId = setInterval(requestWeatherData, 60*1000);
        return function(){
            clearInterval(props.capacityFlowMonitorData.timeoutId);
            clearInterval(props.capacityFlowMonitorWeatherData.timeoutId);
            props.capacityFlowMonitorData.timeoutId = "";
            props.capacityFlowMonitorWeatherData.timeoutId = "";
        }
    },[props.userSubscribeData.subscribeData])



    /**
     * 获取监控单元
     * */
    const getMonitorUnits =()=> {
        const { userSubscribeData={} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        let {monitorUnit, focus} = subscribeData;
        let arr = [];
        if(isValidObject(monitorUnit) && isValidVariable(focus)){
            let focusArea= monitorUnit[focus] || {};
            let focusAreaData = focusArea.data;
            for( let type in focusAreaData){
                let units = focusAreaData[type];
                arr = [...arr, ...units];
            }
        }
        return arr;
    };

    const getAPMonitorUnits =()=> {
        const { userSubscribeData={} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        let {monitorUnit, focus} = subscribeData;
        let arr = [];
        /* if(isValidObject(monitorUnit) && isValidVariable(focus)){
            let focusArea= monitorUnit[focus] || {};
            let focusAreaData = focusArea.data;
            let APUnitsData = focusAreaData['AP'];
            arr = APUnitsData;
        } */
        return arr;
    };


    // 获取容流数据
    const requestCapacityFlowMonitorData = useCallback(() => {
        const now = getFullTime(new Date());
        const nextDate = addStringTime(now, 1000*60*60*24).substring(0,8);
        const nowDate = now.substring(0,8);
        const start = nowDate+'050000';
        const end =nextDate+'050000';
        const monitorUnits = getMonitorUnits();
        const units = monitorUnits.join(',');
        if(!isValidVariable(units)){
            return;
        }
        const opt = {
            url: ReqUrls.capacityFlowMonitorDataUrl+'?targets='+units+'&starttime='+ start+'&endtime='+end,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateCapacityFlowMonitorData(data);
                props.capacityFlowMonitorData.toggleLoad(false)
            },
            errFunc: (err)=> {
                requestErr(err, '容流数据获取失败')
                props.capacityFlowMonitorData.toggleLoad(false)
            } ,
        };
        request(opt);
    });

    // 获取天气数据
    const requestWeatherData = useCallback(() => {
        const now = getFullTime(new Date());
        const nowDate = now.substring(0,8);
        const monitorUnits = getAPMonitorUnits();
        const units = monitorUnits.join(',');
        if(!isValidVariable(units)){
            return;
        }
        const opt = {
            url: ReqUrls.capacityFlowMonitorWeatherDataUrl+'?time='+nowDate+'&airport='+ units,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateCapacityFlowMonitorWeatherData(data);
            },
            errFunc: (err)=> {
                requestErr(err, '气象数据获取失败')
            } ,
        };
        request(opt);
    });

    return(
        <Spin spinning={loading} >
        <div className="capacity_flow_monitor_container no-scrollbar">
            {/* <List
                grid={{ gutter: 6, column: 10 }}
                dataSource={monitorDataist}
                renderItem={item => (
                    listItemData(item)
                )}
            /> */}A
        </div>
        </Spin>
    )
}

export default inject("userSubscribeData","capacityFlowMonitorData","capacityFlowMonitorWeatherData","systemPage")(observer(CapacityFlowMonitor))
