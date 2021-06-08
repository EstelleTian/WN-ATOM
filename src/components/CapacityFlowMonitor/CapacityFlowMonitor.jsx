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
import {  Spin, List, Tooltip } from 'antd'
import { customNotice } from 'utils/common-funcs'
import { CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { getFullTime, isValidObject, isValidVariable, addStringTime } from 'utils/basic-verify'
import { openCapacityFlowMonitorUnitTclientFrame } from 'utils/client'

import AirportMonitor from 'components/MiniMonitor/AirportMonitor'
import { ReqUrls } from 'utils/request-urls'
import AddMonitorCard from 'components/MiniMonitor/AddMonitorCard'
import ModalBox from 'components/ModalBox/ModalBox'
import 'components/ModalBox/ModalBox.scss'
import "./CapacityFlowMonitor.scss"


//容流略图模块
const CapacityFlowMonitor = (props) => {
    const capacityFlowMonitorData = props.capacityFlowMonitorData || {};
    const { loading } = capacityFlowMonitorData;
    const monitorData = capacityFlowMonitorData.monitorData || {};
    const generateTime = monitorData.generateTime || "";
    const flow = monitorData.flow || {};
    let capacityFlowMonitorWeatherData = props.capacityFlowMonitorWeatherData || {};
    const weatherData = capacityFlowMonitorWeatherData.weatherData || [];
    // 格式化处理天气数据
    const formatWeatherData = () => {
        let obj = {}
        weatherData.map((item) => {
            obj[item.airport] = item.weatherCH || "";
        })
        return obj;
    };
    let weatherDataObj = formatWeatherData();

    const getSingleTypeData = (type) => {
        let arr = [];
        // 遍历并取监控数据中对应类型的容流数据
        for (let d in flow) {
            let singleData = flow[d];
            if (type === singleData.type) {
                let obj = {
                    key: d,
                    id: d,
                    title: d,
                    generateTime: generateTime,
                    data: singleData,
                };
                arr.push(obj);
            }
        }
        // 排序 按order字段值升序
        let sortArr = arr.sort((item1, item2) => {
            if (isValidObject(item1)
                && isValidObject(item1.data)
                && isValidVariable(item1.data.overCapacity)
                && isValidObject(item2.data)
                && isValidVariable(item2.data.overCapacity)) {
                // 超容量
                let overCapacityA = item1.data.overCapacity; // ignore upper and lowercase
                let overCapacityB = item2.data.overCapacity; // ignore upper and lowercase
                if (overCapacityA > overCapacityB) {
                    return -1;
                } else if (overCapacityA < overCapacityB) {
                    return 1;
                } else if (overCapacityA === overCapacityB) {
                    // 总流量
                    let totalFlowsA = item1.data.totalFlows || 0; // ignore upper and lowercase
                    let totalFlowsB = item2.data.totalFlows || 0; // ignore upper and lowercase
                    if (totalFlowsA > totalFlowsB) {
                        return -1;
                    } else if (totalFlowsA < totalFlowsB) {
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
    let APMonitorData = getSingleTypeData('AIRPORT');
    // 进近
    let APPMonitorData = getSingleTypeData('APP');
    // 扇区类型数据
    let SECTORMonitorData = getSingleTypeData('SECTOR');
    // 进近扇区类型数据
    let APPSECMonitorData = getSingleTypeData('APP_SEC');
    // 管制区
    let ACCMonitorData = getSingleTypeData('ACC');
    // 航路
    let ROUTEMonitorData = getSingleTypeData('ROUTE');
    // 航路点
    let POINTonitorData = getSingleTypeData('POINT');
    // 获取机场、进近、扇区监控单元集合
    monitorDataist = APMonitorData.concat(ACCMonitorData).concat(APPMonitorData).concat(SECTORMonitorData).concat(APPSECMonitorData);
    // 追加新增监控卡片
    const appendAddMonitorCard = (arrData) => {
        let addData = {
            id: 'ADD',
            title: '新增监控',
        }
        arrData.push(addData);
        return arrData;
    };
    // monitorDataist = appendAddMonitorCard(monitorDataist);
    // 绘制单个监控单元数据卡片
    const listItemData = (item) => {
        if (item.id === 'ADD') {
            return (
                <List.Item className="moitor-col" key={item.key} >
                    <ModalBox showDecorator={false} title={item.title} className="monitor-box add-monitor-box">
                        <div className="monitor-content">
                            <AddMonitorCard data={item.data} />
                        </div>
                    </ModalBox>
                </List.Item>
            )
        } else {
            return (
                <List.Item className={`moitor-col ${item.data.type}`} key={item.key}  >
                    <ModalBox showDecorator={false} showTooltip={true} title={item.title} data={item.data} className="monitor-box">
                        <div className="actions">
                            <Tooltip title="查看详情">
                                <div onClick={() => { openCapacityFlowMonitorUnitTclientFrame(item.key)}} className="detail">

                                    <FileTextOutlined />
                                </div>
                            </Tooltip>
                            {/* <Tooltip title="移除">
                                <div onClick={() => { console.log("sss") }} className="remove">
                                    <CloseCircleOutlined />
                                </div>
                            </Tooltip> */}
                        </div>
                        <div className="monitor-content">
                            <AirportMonitor dataKey = {item.key} data={item.data} weatherData={weatherDataObj[item.key]} />
                        </div>

                    </ModalBox>
                </List.Item >
            )
        }
    }
    // 更新--执行KPI store数据
    const updateCapacityFlowMonitorData = useCallback(capacityFlowMonitorData => {
        if (isValidObject(capacityFlowMonitorData)) {
            props.capacityFlowMonitorData.updateCapacityFlowMonitorData(capacityFlowMonitorData)
        } else {
            props.capacityFlowMonitorData.updateCapacityFlowMonitorData({});
            customNotice({
                type: 'error',
                message: "获取的航班执行数据为空"
            })
        }
    });
    // 更新--气象 store数据
    const updateCapacityFlowMonitorWeatherData = useCallback(weatherData => {
        if (isValidObject(weatherData) && isValidVariable(weatherData.result)) {
            props.capacityFlowMonitorWeatherData.updateCapacityFlowMonitorWeatherData(weatherData.result)
        } else {
            props.capacityFlowMonitorWeatherData.updateCapacityFlowMonitorWeatherData({});
            customNotice({
                type: 'error',
                message: "获取的气象数据为空"
            })
        }
    });

    // 请求错误处理
    const requestErr = useCallback((err, content) => {
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }

        customNotice({
            type: 'error',
            message: <div>
                <p>{content}</p>
                <p>{errMsg}</p>
            </div>
        })
    });


    useEffect(function () {
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
        props.capacityFlowMonitorData.timeoutId = setInterval(requestCapacityFlowMonitorData, 60 * 1000);
        props.capacityFlowMonitorWeatherData.timeoutId = setInterval(requestWeatherData, 60 * 1000);
        return function () {
            clearInterval(props.capacityFlowMonitorData.timeoutId);
            clearInterval(props.capacityFlowMonitorWeatherData.timeoutId);
            props.capacityFlowMonitorData.timeoutId = "";
            props.capacityFlowMonitorWeatherData.timeoutId = "";
        }
    }, [props.userSubscribeData.subscribeData])



    /**
     * 获取当前区域内的监控单元
     * */
    const getMonitorUnits = () => {
        const { userSubscribeData = {} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        let { monitorUnit, focus } = subscribeData;
        let arr = [];

        if (isValidObject(monitorUnit) && isValidVariable(focus)) {
            let focusArea = monitorUnit[focus] || {};
            let focusAreaData = focusArea.data;
            for (let type in focusAreaData) {
                let units = focusAreaData[type] || [];
                arr = [...arr, ...units];
            }
        }
        return arr;
    };

    // 获取当前区域内的机场类型的监控单元
    const getAPMonitorUnits = () => {
        const { userSubscribeData = {} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        let { monitorUnit, focus } = subscribeData;
        let arr = [];
        if (isValidObject(monitorUnit) && isValidVariable(focus)) {
            let focusArea = monitorUnit[focus] || {};
            let focusAreaData = focusArea.data;
            let APUnitsData = focusAreaData['AIRPORT'] || [];
            arr = APUnitsData;
        }
        return arr;
    };

    // 获取容流数据
    const requestCapacityFlowMonitorData = useCallback(() => {
        const now = getFullTime(new Date());
        const nextDate = addStringTime(now, 1000 * 60 * 60 * 24).substring(0, 8);
        const nowDate = now.substring(0, 8);
        const start = nowDate + '050000';
        const end = nextDate + '050000';
        const monitorUnits = getMonitorUnits();
        const units = monitorUnits.join(',');
        if (!isValidVariable(units)) {
            return;
        }
        const opt = {
            url: ReqUrls.capacityFlowMonitorDataUrl + '?targets=' + units + '&starttime=' + start + '&endtime=' + end,
            method: 'GET',
            params: {},
            resFunc: (data) => {
                updateCapacityFlowMonitorData(data);
                props.capacityFlowMonitorData.toggleLoad(false)
            },
            errFunc: (err) => {
                requestErr(err, '容流数据获取失败')
                props.capacityFlowMonitorData.toggleLoad(false)
            },
        };
        request(opt);
    });

    // 获取天气数据
    const requestWeatherData = useCallback(() => {
        const now = getFullTime(new Date());
        const nowDate = now.substring(0, 8);
        const monitorUnits = getAPMonitorUnits();
        const units = monitorUnits.join(',');
        if (!isValidVariable(units)) {
            return;
        }
        const opt = {
            url: ReqUrls.capacityFlowMonitorWeatherDataUrl + '?time=' + nowDate + '&airport=' + units,
            method: 'GET',
            params: {},
            resFunc: (data) => {
                updateCapacityFlowMonitorWeatherData(data);
            },
            errFunc: (err) => {
                requestErr(err, '气象数据获取失败')
            },
        };
        request(opt);
    });

    return (
        <Spin spinning={loading} >
            <div className="capacity_flow_monitor_container layout-column no-scrollbar">
                <List
                    className="layout-column"
                    grid={{ gutter: 6, column: 10 }}
                    dataSource={monitorDataist}
                    renderItem={item => (
                        listItemData(item)
                    )}
                />
            </div>
        </Spin>
    )
}

export default inject("userSubscribeData", "capacityFlowMonitorData", "capacityFlowMonitorWeatherData", "systemPage")(observer(CapacityFlowMonitor))
