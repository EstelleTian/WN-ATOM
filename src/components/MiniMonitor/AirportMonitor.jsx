/*
 * @Author: your name
 * @Date: 2020-12-16 13:17:47
 * @LastEditTime: 2020-12-16 13:50:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\MiniMonitor\AirportMonitor.jsx
 */
import React from 'react'
import {getFullTime, addStringTime, isValidVariable} from 'utils/basic-verify'

import MiniMonitor from './MiniMonitor'

function AirportMonitor(props) {

    const data = props.data || {};

    const flowMap = data.flowMap || {};

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

    const getOption = function () {
        let FPLData = [];
        let DEPData = [];
        let ARRData = [];
        let OFFLINEData = [];
        let SCHEDULEData = [];
        let CAPACITYData = [];

        axis.map((item, index) => {
            let data = flowMap[item];
            let FPL = isValidVariable(data.FPL) ? data.FPL : 0;
            let DEP = isValidVariable(data.DEP) ? data.DEP : 0;
            let ARR = isValidVariable(data.ARR) ? data.ARR : 0;
            let OFFLINE = isValidVariable(data.OFFLINE) ? data.OFFLINE : 0;
            let SCHEDULE = isValidVariable(data.SCHEDULE) ? data.SCHEDULE : 0;
            FPLData.push(FPL);
            DEPData.push(DEP);
            ARRData.push(ARR);
            OFFLINEData.push(OFFLINE);
            SCHEDULEData.push(SCHEDULE);
        })

        const option = {
            color: ["#8F959E", "#008200", "#8F959E", "#0076F7", "#00698C"],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['FPL', 'DEP', 'ARR', 'OFFLINE', 'SCHEDULE','容量'],
                show: false
            },
            grid: {
                top: '10px',
                left: '5px',
                right: '5px',
                bottom: '10px',
                containLabel: false
            },
            xAxis: [
                {
                    type: 'category',
                    data: axis,
                    axisLine: {
                        lineStyle: {
                            color: "#8F959E"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#8F959E"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                }
            ],
            series: [
                {
                    name: 'FPL',
                    type: 'bar',
                    stack: '1',
                    data: FPLData
                },
                {
                    name: 'DEP',
                    type: 'bar',
                    stack: '1',
                    data: DEPData
                },
                {
                    name: 'ARR',
                    type: 'bar',
                    stack: '1',
                    data: ARRData
                },
                {
                    name: 'OFFLINE',
                    type: 'bar',
                    stack: '1',
                    data: OFFLINEData
                },
                {
                    name: 'SCHEDULE',
                    type: 'bar',
                    stack: '1',
                    data: SCHEDULEData
                },
                {
                    name: '容量',
                    type: 'line',
                    data: CAPACITYData
                }
            ]
        };

        return option;

    };
    // getOption();



return (
    <MiniMonitor {...props} className="airport_monitor" option={getOption()}/>
)

}

export default AirportMonitor