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
    // 区内空中
    const currentInAreaSkyMap = executeData.currentInAreaSkyMap || {};
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

    const  formatValue = function (value) {
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
            color: [ "#1b9acd", "#44d4e6","#6e95f7", "#f6a748", ],
            animation: false ,
            tooltip: {
                trigger: 'axis',
                backgroundColor:'rgba(50,50,50,0.9)',
                confine:true, //解决被遮挡问题
                extraCssText: 'box-shadow: 0 3px 6px -4px rgb(0 0 0 / 48%), 0 6px 16px 0 rgb(0 0 0 / 32%), 0 9px 28px 8px rgb(0 0 0 / 20%);',
                // axisPointer: {
                //     type: 'cross',
                //     label: {
                //         backgroundColor: '#6a7985'
                //     }
                // }
            },
            legend: {
                data: ['起降', '区内空中', '飞越本区', '国际飞越'],
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
                        // formatter:'{value} 架次'
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
                        width: 1
                    },
                    showSymbol: false,
                    areaStyle: {},
                    data: formatValue(executeDAMap)
                },
                {
                    name: '区内空中',
                    type: 'line',
                    stack: '架次',
                    smooth: true,
                    lineStyle: {
                        width: 1
                    },
                    showSymbol: false,
                    areaStyle: {},
                    data: formatValue(currentInAreaSkyMap)
                },

                {
                    name: '飞越本区',
                    type: 'line',
                    stack: '架次',
                    smooth: true,
                    lineStyle: {
                        width: 1
                    },
                    showSymbol: false,
                    areaStyle: {},
                    data: formatValue(executeAOvfMap)
                },
                {
                    name: '国际飞越',
                    type: 'line',
                    stack: '架次',
                    smooth: true,
                    lineStyle: {
                        width: 1
                    },
                    showSymbol: false,
                    areaStyle: {},
                    data: formatValue(executeOvfMap)
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
