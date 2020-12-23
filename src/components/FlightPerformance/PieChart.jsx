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
const PieChart = (props) => {
    const getOption = function () {

        const option = {
            backgroundColor: "#00000000",
            color: [ "#0076F7", "#FFA500","#37A2DA", "#f04864","#8F959E", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f","#fb7293","#E062AE","#E690D1","#e7bcf3","#9d96f5","#8378EA","#96BFFF"],
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} <br> ({d}%)'
            },
            legend: {
                data: ['机场', '航路', '天气', '要客', '其他'],
                show: false
            },
            series: [{
                name: '',
                type: 'pie',
                radius: ['30%', '40%'],
                data: [
                    {value: 2, name: '机场'},
                    {value: 4, name: '航路'},
                    {value: 3, name: '天气'},
                    {value: 2, name: '要客'},
                    {value: 3, name: '其他'}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        return option;
    }
    return (
        <div>
            <ReactEcharts
                theme="dark"
                option={getOption()}
                style={props.style}
                className='react_for_echarts layout-row flex-wrap justify-content-center'/>
        </div>
    )
}


export default PieChart
