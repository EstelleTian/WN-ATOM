/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-15 15:56:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React from 'react'
import ReactEcharts from 'echarts-for-react'

import { getFullTime, addStringTime } from '../../utils/basic-verify'

//堆叠区域图
const LineChart =(props) => {

    const getTimeAxis = function () {
        const now = getFullTime(new Date());

        const number = 1000*60*60*24/(1000*60*10);

        let arr = [];

        for ( let i=0; i<number; i++){

            const str = addStringTime(now, -1*i*1000*60*10);
            arr.push(str.substring(8,10)+ ":" + str.substring(10,12) );

        }
        return arr;
    };


    const  randomValue = function () {
        const number = 1000*60*60*24/(1000*60*10);
        let arr = [];

        for ( let i=0; i<number; i++){
            const val = Math.floor(Math.random()*10);
            arr.push(val);
        }

        return arr;
    };

    const getOption = function () {

        const xAxis = getTimeAxis();

        const option = {
            backgroundColor: "#00000000",
            color: ["#37A2DA", "#67E0E3", "#FFDB5C", "#ff9f7f","#e7bcf3",],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['起飞', '降落', '飞越本区', '国际飞越'],
                show:false,
            },
            grid: {
                top: '10px',
                left: '5px',
                right: '5px',
                bottom: '2px',
                containLabel: false
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxis,
                    axisTick: {
                        show: false
                    },
                    axisLabel:{
                        show: false
                    },
                    axisLine:{
                        lineStyle:{
                            color: "#00000000"
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    splitLine:{
                        show: false
                    },
                    axisLine:{
                        lineStyle:{
                            color: "#00000000"
                        }
                    },
                }
            ],
            series: [
                {
                    name: '起飞',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    data: randomValue()
                },
                {
                    name: '降落',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    data: randomValue()
                },
                {
                    name: '飞越本区',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    data: randomValue()
                },
                {
                    name: '国际飞越',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    data: randomValue()
                },
            ]
        };

        return option;
    }
    return(
        <div>
            <ReactEcharts
                theme="dark"
                option={getOption()}
                className='react_for_echarts'/>
        </div>
    )
}


export default LineChart
