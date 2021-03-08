/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-16 17:42:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React from 'react'
import ReactEcharts from 'echarts-for-react'


// 环形饼图
const GaugeChart = (props) => {
    const getOption = function (size) {

        const option = {
            tooltip: {
                formatter: '{a} <br/>{b} : {c}%'
            },
            toolbox: {
                // feature: {
                //     restore: {},
                //     saveAsImage: {}
                // }
            },
        };

        if(size === "small"){
            option.series= [
                {
                    name: '',
                    type: 'gauge',
                    detail: {formatter: '{value}%', fontSize: 10,offsetCenter: [0, "-10%"],},
                    data: [{value: props.value, name: props.name}],
                    pointer: {
                        width: 0.5
                    },
                    title: {
                        show: true,
                        fontSize: 10,
                        offsetCenter: [0, "60%"],
                        color:"#e7f1fa",
                    },
                    axisLabel: {
                        show: false
                    },
                    radius: "90%",
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: true,
                        splitNumber: 1
                    },
                    axisLine: {
                        show: true,
                        lineStyle:{
                            width: 5,
                        }
                    },

                },
            ]
        }else  {
            option.series= [
                {
                    name: '',
                    type: 'gauge',
                    detail: {formatter: '{value}%', fontSize: 20, offsetCenter: [0, "-20%"],},
                    data: [{value: props.value, name: '预计延误率'}],
                    pointer: {
                        width: 1
                    },
                    title: {
                        show: true,
                        color:"#e7f1fa",
                        offsetCenter: [0, "55%"],
                        fontSize: 14
                    },
                    axisLabel: {
                        show: false
                    },
                    radius: "90%",
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: true,
                        splitNumber: 1
                    },
                    axisLine: {
                        show: true,
                        lineStyle:{
                            width: 20,
                        }
                    },

                },
            ]
        }

        return option;
    }
    return (
        <div className="layout-row flex-wrap justify-content-center">
            <ReactEcharts
                theme="dark"
                option={getOption(props.size, props.value)}
                style={props.style}
                className='react_for_echarts'
            />
        </div>
    )
}


export default GaugeChart
