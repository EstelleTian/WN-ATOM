/*
 * @Author: your name
 * @Date: 2020-12-16 13:18:11
 * @LastEditTime: 2020-12-16 17:20:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\MiniMonitor\SecotorMonitor.jsx
 */
import React from 'react'
import MiniMonitor from './MiniMonitor'

function SectorMonitor(props){
   const getOption = function(){
        let timeArr = [];
        let minArr = ['00','15','30','45']
        for(let n = 0; n < 24; n++){
            let hour = n+"";
            if(hour<10){
                hour = "0"+n;
            }
            let min = ""
            for(let m = 0; m < minArr.length; m++){
                min = minArr[m]
                timeArr.push( hour+min )
            }
            
        }
        let customArr = [];
        let customArrStack = [];
        let capArr = [];
        for(let i = 0; i< 96; i++){
            let customRandom = Math.floor(Math.random()*20)+5
            if( customRandom > 18 ){
                customArr.push(18);
                customArrStack.push(customRandom-18);
            }else{
                customArr.push(customRandom);  
                customArrStack.push(null);
            }

            capArr.push(18); 
       
        }
        const option = {
            color: [ "#8F959E", "#D48265", "#00698C"],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['流量', '超量', '容量'],
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
                    data: timeArr,
                    axisLine:{
                        lineStyle:{
                            color: "#8F959E"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel:{
                        show: false
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
                    axisTick: {
                        show: false
                    },
                    splitLine:{
                        show: false
                    },
                }
            ],
            series: [
                {
                    name: '流量',
                    type: 'bar',
                    stack: '1',
                    data: customArr
                },
                {
                    name: '超量',
                    type: 'bar',
                    stack: '1',
                    data: customArrStack
                },
                {
                    name: '容量',
                    type: 'line',
                    data: capArr
                }
            ]
        };

        return option;
    }

    return (
        <MiniMonitor {...props} className="airport_sector" option={getOption()} />
    )
}

export default SectorMonitor