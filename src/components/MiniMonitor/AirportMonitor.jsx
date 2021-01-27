/*
 * @Author: your name
 * @Date: 2020-12-16 13:17:47
 * @LastEditTime: 2020-12-16 13:50:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\MiniMonitor\AirportMonitor.jsx
 */
import React from 'react'
import {Col, Progress, Row} from "antd";

import {getFullTime, addStringTime, isValidVariable} from 'utils/basic-verify'

import MiniMonitor from './MiniMonitor'

function AirportMonitor(props) {
    const data = props.data || {};
    const flowMap = data.flowMap || {};
    // 天气
    const weather = data.weather || "";
    // 起飞正常率
    const depRatio = data.depRatio || 0;
    const getTimeAxis = function () {
        let arr = [];
        // 以执行起降数据为基础遍历时间
        for (let data in flowMap) {
            arr.push(data);
        }

        return arr.sort((item1, item2) => {
            let nameA = item1.toUpperCase(); // ignore upper and lowercase
            let nameB = item2.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });
    };
    const axis = getTimeAxis();

    const formatterTooltip = (data) => {
        let capacityData = {};
        let notOverflowData = {};
        let overflowData = {};
        data.map((item)=>{
            if(item.seriesName ==='capacity'){
                capacityData= item;
            }else if(item.seriesName ==='notOverflow'){
                notOverflowData = item;
            }else if(item.seriesName ==='overflow'){
                overflowData = item;
            }
        });
        let axisValue = capacityData.axisValue;
        let capacity = capacityData.value;
        let overflow = overflowData.value;
        let notOverflow = notOverflowData.value;


        let flowVal = overflow+notOverflow;

        let result = ``;
        let capacityString = "";
        if(isValidVariable(capacity)){
            capacityString = `容量: ${capacity} 架次 <br/>`
        }

        if(overflow > 0){
            result = `${axisValue} <br/> ${capacityString} 流量: ${flowVal} 架次 <br/> 超容: ${overflow} 架次`;
        }else {
            result = `${axisValue} <br/> ${capacityString} 流量: ${flowVal} 架次`;
        }
        return result
    }

    const getOption = function () {
        // 流量
        let flightNumData = [];
        // 容量
        let capacityData = [];
        // 超量
        let overflowData = [];
        // 未超出
        let notOverflowData = [];

        let weatherData = [];


        axis.map((item, index) => {
            let data = flowMap[item];
            let flightNum = isValidVariable(data.flightNum) ? data.flightNum : 0;
            let capacity = isValidVariable(data.capacity) ? data.capacity : "";
            let overflow = 0;
            let notOverflow = 0;

            if(isValidVariable(capacity)){
                if(capacity < 0){
                    notOverflow = flightNum;
                    capacity = "";
                }else {
                    if(flightNum > capacity){
                        overflow = flightNum - capacity;
                        notOverflow = capacity
                    }else if(flightNum < capacity) {
                        notOverflow = flightNum
                    }
                }
            }else {
                notOverflow = flightNum
            }


            let weather = {
                value: data.weather || "",
                xAxis: item,
                yAxis: 0
            };
            flightNumData.push(flightNum);
            capacityData.push(capacity);
            overflowData.push(overflow);
            notOverflowData.push(notOverflow);
            if(isValidVariable(data.weather)){
                weatherData.push(weather);
            }
        });

        const option = {
            color: ["#8F959E", "#1479d1", "#cb6b6f"],
            darkMode:true,
            animation: false ,

            tooltip: {
                show: true,
                trigger: 'axis',
                backgroundColor:'rgba(90, 90, 90, 0.8)',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:(data)=>{
                    return formatterTooltip(data);
                }
            },
            legend: {
                data: ['流量', '超容', '容量'],
                show: false
            },
            grid: {
                top:'10px',
                left: '1%',
                right: '2%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: axis,
                    axisLine: {
                        lineStyle: {
                            color: "#969696"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        formatter: function (value, index) {
                            let hh = value.substring(8,10);
                            return hh;
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#969696"
                        }
                    },
                    axisTick:{
                      show:false
                    },
                    axisLabel:{
                        formatter:'{value} 架次'
                    },

                }
            ],
            series: [
                {
                    name: 'notOverflow',
                    type: 'bar',
                    stack: 'flow',
                    data: notOverflowData,
                    // markPoint: {
                    //     symbolSize: 40,
                    //     itemStyle: {
                    //         color:'#866216'
                    //     },
                    //     label:{
                    //         fontSize: 16,
                    //     },
                    //     data: weatherData,
                    // }
                },
                {
                    name: 'overflow',
                    type: 'bar',
                    stack: 'flow',
                    data: overflowData
                },
                {
                    name: 'capacity',
                    type: 'line',
                    data: capacityData,
                }
            ]
        };

        return option;

    };

    return (
        <div className="monitor">
            <div className="chart-container">
                <MiniMonitor {...props} className="airport_monitor" option={getOption()}/>
            </div>
            <div className="options">
                <div className="normal-rate">
                    <div className="rate-progress">
                        <Progress
                            percent={ (depRatio*100).toFixed(0) }
                            showInfo={false}
                            strokeColor="#35a5da"
                            trailColor="#2d6b92"
                        />
                    </div>
                    <div className="rate-text">
                        {`正常率 ${(depRatio*100).toFixed(0)}%`}
                    </div>
                </div>
                <div className="weather">{weather}</div>
            </div>

        </div>

    )

}

export default AirportMonitor