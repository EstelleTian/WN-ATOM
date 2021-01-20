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
                arr.push(0)
            }
        });


        return arr;
    };

    const getOption = function () {

        const xAxis = getTimeAxis();

        const option = {
            backgroundColor: "#00000000",
            color: ["#37A2DA", "#67E0E3", "#2d6b92a3", ],
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
                data: ['起降',  '飞越本区', '国际飞越'],
                // show:false,
            },
            grid: {
                top: '25px',
                left: '25px',
                right: '25px',
                bottom: '20px',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxis,
                    // axisTick: {
                    //     show: true
                    // },
                    axisLabel:{
                        show: true,
                        formatter: function (value, index) {
                            let hh = value.substring(8,10);
                            let mm = value.substring(10,12)
                            return hh +':' + mm;
                        }
                    },
                    // axisLine:{
                    //     lineStyle:{
                    //         color: "#00000000"
                    //     }
                    // },
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
                    axisLabel:{
                        formatter:'{value} 架次'
                    }
                }
            ],
            series: [
                {
                    name: '起降',
                    type: 'line',
                    stack: '架次',
                    smooth:true,
                    areaStyle: {},
                    data: randomValue(executeDAMap)
                },

                {
                    name: '飞越本区',
                    type: 'line',
                    stack: '架次',
                    smooth:true,
                    areaStyle: {},
                    data: randomValue(executeAOvfMap)
                },
                {
                    name: '国际飞越',
                    type: 'line',
                    stack: '架次',
                    smooth:true,
                    areaStyle: {},
                    data: randomValue(executeOvfMap)
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
