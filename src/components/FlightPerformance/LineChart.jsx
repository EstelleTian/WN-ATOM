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
import { getFullTime, addStringTime, isValidVariable } from 'utils/basic-verify'

//堆叠区域图
const LineChart =(props) => {

    const executeData = props.executeData || {};
    // 执行起降
    const executeDAMap = executeData.executeDAMap || {};
    // 执行区域飞越
    const executeAOvfMap = executeData.executeAOvfMap || {};
    // 执行国际飞越
    const executeOvfMap = executeData.executeOvfMap || {};

    const getTimeAxis = function () {
        let arr = [];
        // 以执行起降数据为基础遍历时间
        for ( let data in executeDAMap){
            arr.push(data);
        }

        return arr.sort((item1,item2)=>{
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

    let Axis = getTimeAxis();

    const  randomValue = function (value) {
        let arr = [];

        Axis.map((item, index)=> {

            let val = value[item];

            if(isValidVariable(val)){
                arr.push(val);
            }else {
                arr.push("")
            }
        });


        return arr;
    };

    const getOption = function () {

        const xAxis = getTimeAxis();

        const option = {
            backgroundColor: "#00000000",
            color: ["#267ba4", "#1b9acd", "#446683", ],
            animation: false ,
            tooltip: {
                trigger: 'axis',
                backgroundColor:'rgba(90, 90, 90, 0.8)',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['起降',  '飞越本区', '国际飞越'],
                icon: 'circle'
            },
            grid: {
                top:'30px',
                left: '1%',
                right: '2%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    axisLine: {
                        lineStyle: {
                            color: "#6c6c6c"
                        }
                    },
                    axisLabel:{
                        show: true,
                        formatter: function (value, index) {
                            let hh = value.substring(8,10);
                            let mm = value.substring(10,12)
                            return hh +':' + mm;
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisTick:{
                        show:false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#6c6c6c"
                        }
                    },
                    axisLabel:{
                        formatter:'{value} 架次'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type:'solid',
                        }
                    }
                }
            ],
            series: [
                {
                    name: '起降',
                    type: 'line',
                    stack: '架次',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {},
                    data: randomValue(executeDAMap)
                },

                {
                    name: '飞越本区',
                    type: 'line',
                    stack: '架次',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {},
                    data: randomValue(executeAOvfMap)
                },
                {
                    name: '国际飞越',
                    type: 'line',
                    stack: '架次',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {},
                    data: randomValue(executeOvfMap)
                },
            ]
        };

        return option;
    }
    return(
        <div id="flight-line-chart" style={{width: '100%', height:'200px', margin: '0px'}} >
            <ReactEcharts
                theme="dark"
                option={getOption()}
                className='react_for_echarts'
                style={{width: '100%',height:'100%'}}
            />
        </div>
    )
}


export default LineChart
