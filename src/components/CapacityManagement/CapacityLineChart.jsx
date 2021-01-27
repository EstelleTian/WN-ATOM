/*
 * @Author: your name
 * @Date: 2021-01-26 16:44:48
 * @LastEditTime: 2021-01-26 18:32:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityLineChart.jsx
 */
import React, {useState, useEffect, useCallback} from 'react'
import ReactEcharts from 'echarts-for-react'

//静态容量折线图
function CapacityLineChart (props){

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

        if(overflow > 0){
            result = `${axisValue} <br/> 容量: ${capacity} 架次 <br/> 流量: ${flowVal} 架次 <br/> 超容: ${overflow} 架次`;
        }else {
            result = `${axisValue} <br/> 容量: ${capacity} 架次 <br/> 流量: ${flowVal} 架次`;
        }
        return result
    }

    const getOption = function () {
        // 容量值
        let capacityVal = [];
        // 容量告警(黄)
        let capacityL1 = [];
        // 容量告警(橙)
        let capacityL2 = [];
        // 容量告警(红)
        let capacityL3 = [];

        let axis = [];
        for(let i = 0; i<24; i++){
            axis.push(i);
            capacityVal.push(73);
            capacityL1.push(78);
            capacityL2.push(80);
            capacityL3.push(83);
        }


        

        const option = {
            color: ["#00698c", "#fef263", "#f8b862","#ef857d"],
            tooltip: {
                show: true,
                trigger: 'axis',
                backgroundColor:'rgba(0, 0, 0, 0.7)',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:(data)=>{
                    return formatterTooltip(data);
                }
            },
            title: {
                text: props.title,
                left: 'center',
                textStyle: {
                    color: "#ffffff",
                    
                }
            },
            legend: {
                data: ['容量值', '容量告警(黄)', '容量告警(橙)', '容量告警(红)'],
                bottom: 0,
                textStyle: {
                    color: "#ffffff"
                }
            },
            grid: {
                left: '3%',
                right: '3%',
                top: '50px',
                bottom: '50px'
            },
            xAxis: [
                {
                    type: 'category',
                    data: axis,
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: "#8F959E"
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        formatter: function (value, index) {
                            // let hh = value.substring(8,10);

                            return value;
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color: "#8F959E"
                        }
                    },
                }
            ],
            series: [
                {
                    name: '容量值',
                    type: 'line',
                    data: capacityVal,
                },{
                    name: '容量告警(黄)',
                    type: 'line',
                    data: capacityL1,
                },{
                    name: '容量告警(橙)',
                    type: 'line',
                    data: capacityL2,
                },{
                    name: '容量告警(红)',
                    type: 'line',
                    data: capacityL3,
                },
            ]
        };




        return option;

    };
    return (
        <ReactEcharts
            option={ getOption() }
            className='cap_line_chart' />
        
    )
}

export default CapacityLineChart;