/*
 * @Author: your name
 * @Date: 2020-12-16 13:17:47
 * @LastEditTime: 2020-12-16 13:50:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\MiniMonitor\AirportMonitor.jsx
 */
import React from 'react'
import {Col, Progress, Tooltip } from "antd";

import {getFullTime, addStringTime, isValidVariable} from 'utils/basic-verify'

import MiniMonitor from './MiniMonitor'

function AirportMonitor(props) {
    const data = props.data || {};
    const flowMap = data.flowMap || {};
    const dataKey = props.dataKey || ""
    // 天气
    const weather = props.weatherData || "";
    // 起飞正常率
    const depRatio = data.depRatio || 0;
    // 超容量
    const overCapacity = data.overCapacity;
    // 总流量
    const totalFlows = data.totalFlows;

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
                // 若容量小于0,则超量值为流量
                if(capacity < 0){
                    overflow = flightNum;
                }else {
                    // 若流量大于容量，则超量值为流量-容量，未超出量值为容量
                    if(flightNum > capacity){
                        overflow = flightNum - capacity;
                        notOverflow = capacity
                    }else if(flightNum < capacity) {
                        // 若流量小于容量，则超量值为0，未超出量值为流量
                        notOverflow = flightNum
                    }else {
                        // 若流量等于容量，则超量值为0，未超出量值为流量
                        notOverflow = flightNum
                    }
                }
            }else {
                // 若容量无效,则超量值为流量
                overflow = flightNum;
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
                confine:true, //解决被遮挡问题
                backgroundColor:'rgba(50,50,50,0.9)',
                extraCssText: 'box-shadow: 0 3px 6px -4px rgb(0 0 0 / 48%), 0 6px 16px 0 rgb(0 0 0 / 32%), 0 9px 28px 8px rgb(0 0 0 / 20%);',
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
                top:'8px',
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
                    // axisLabel:{
                    //     formatter:'{value} 架次'
                    // },

                }
            ],
            series: [
                {
                    name: 'notOverflow',
                    type: 'bar',
                    stack: 'flow',
                    data: notOverflowData,
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
                    symbol: "none",
                    data: capacityData,
                }
            ]
        };

        return option;

    };


    const getWeatherIcon = function () {
        let icon = "";
        if(weather ==="晴"){
            icon = "sunny";
        }else if(weather ==="雨"){
            icon = "rain";
        }else if(weather ==="雷暴"){
            icon = "thunderstorm_rain";
        }else if(weather ==="雪"){
            icon = "snow";
        }else if(weather ==="冰针"){
            icon = "ice_needle";
        }else if(weather ==="冰粒"){
            icon = "ice_particle";
        }else if(weather ==="冰雹"){
            icon = "hail";
        }else if(weather ==="轻雾"){
            icon = "light_fog";
        }else if(weather ==="雾"){
            icon = "fog";
        }else if(weather ==="烟"){
            icon = "smoke";
        }else if(weather ==="浮尘"){
            icon = "floating_dust";
        }else if(weather ==="沙"){
            icon = "sand";
        }else if(weather ==="霾"){
            icon = "haze";
        }else if(weather ==="沙旋风"){
            icon = "whirlwind";
        }else if(weather ==="漏斗云"){
            icon = "funnel_cloud";
        }else if(weather ==="尘暴"){
            icon = "dust_storm";
        }else if(weather ==="飑"){
            icon = "squall";
        }else if(weather ==="沙暴"){
            icon = "sandstorm";
        }
        return icon;
    }

    const weatherIcon = getWeatherIcon();


    return (
        <div className="monitor">
            <div className="chart-container">
                <MiniMonitor {...props} className="airport_monitor" option={getOption()}/>
            </div>
            <div className="options">

                    <div className="normal-rate">
                        <Tooltip title={(<div><p>超容量: {overCapacity}</p><p>总流量: {totalFlows}</p></div>)}>
                        <div className="rate-progress">
                            <Progress
                                percent={ (depRatio*100).toFixed(0) }
                                showInfo={false}
                                strokeColor="#35a5da"
                                trailColor="#2d6b92"
                            />
                        </div>
                        </Tooltip>
                        <div className="rate-text">
                            {`正常率 ${(depRatio*100).toFixed(0)}%`}
                        </div>
                    </div>

                { isValidVariable(weather) ? <div className="weather">
                    <div className="text">{weather}</div>
                    <div className= { `weather-icon ${weatherIcon}`}></div>
                </div> : "" }
            </div>

        </div>

    )

}

export default AirportMonitor