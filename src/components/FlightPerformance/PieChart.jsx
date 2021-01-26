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
import { isValidObject, isValidVariable } from 'utils/basic-verify'


// 环形饼图
const PieChart = (props) => {
    // 限制原因对象
    const  restrictMap = props.data || {};;



    const reasonData = [
        {"key":"AIRPORT", "text": "机场"},
        {"key":"MILITARY", "text": "军事活动"},
        {"key":"CONTROL", "text": "流量"},
        {"key":"WEATHER", "text": "天气"},
        {"key":"AIRLINE", "text": "航空公司"},
        {"key":"SCHEDULE", "text": "航班时刻"},
        {"key":"JOINT_INSPECTION", "text": "联检"},
        {"key":"OIL", "text": "油料"},
        {"key":"DEPART_SYSTEM", "text": "离港系统"},
        {"key":"PASSENGER", "text": "旅客"},
        {"key":"PUBLIC_SECURITY", "text": "公共安全"},
        {"key":"MAJOR_SECURITY_ACTIVITIES", "text": "重大保障活动"},
        {"key":"OTHER", "text": "其它"},
    ];



    const  getData = function () {
        let arr = [];
        for( var d in reasonData){
            let key = reasonData[d].key;
            if(restrictMap.hasOwnProperty(key)){
                let obj = {
                    value: restrictMap[key],
                    name: reasonData[d].text
                };
                arr.push(obj);
            }
        }
        return arr;
    };


    const getLegendData = function () {
        let arr = [];

        for( var d in reasonData){
            arr.push(reasonData[d].text);
        }
        return arr;
    }


    const getOption = function () {



        const option = {
            backgroundColor: "#00000000",
            // color: [ "#0076F7", "#FFA500","#37A2DA", "#f04864","#8F959E", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f","#fb7293","#E062AE","#E690D1","#e7bcf3","#9d96f5","#8378EA","#96BFFF"],
            color: [ "#5babb1", "#065280","#2e6689", "#35a5da","#4b7ba4", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f","#fb7293","#E062AE","#E690D1","#e7bcf3","#9d96f5","#8378EA","#96BFFF"],
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} <br> ({d}%)'
            },
            legend: {
                data: getLegendData(),
                show: false
            },
            series: [{
                name: '',
                type: 'pie',
                radius: ['50%', '65%'],
                data: getData(),
                // emphasis: {
                //     itemStyle: {
                //         shadowBlur: 10,
                //         shadowOffsetX: 0,
                //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                //     }
                // },
            }]
        };

        return option;
    }
    return (
        <div  style={{width: '100%', height:'200px', margin: '0px'}}>
            <ReactEcharts
                theme="dark"
                option={getOption()}
                // style={props.style}
                className='react_for_echarts layout-row flex-wrap justify-content-center'
                style={{width: '100%',height:'100%'}}


            />
        </div>
    )
}


export default PieChart
