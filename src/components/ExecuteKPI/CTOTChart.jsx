/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-16 17:42:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React from 'react'
import { Pie } from '@ant-design/charts';
import { getTimeFromString, getDayTimeFromString, isValidVariable, isValidObject } from 'utils/basic-verify'


// 环形饼图
const CTOTPieChart = (props) => {

    const { data, configData } = props;

    // let data = [
    //     {
    //         type: '小于-20',
    //         value: 27,
    //     },
    //     {
    //         type: '-20到-10',
    //         value: 25,
    //     },
    //     {
    //         type: '-10到-5',
    //         value: 18,
    //     },
    //     {
    //         type: '-5到5',
    //         value: 15,
    //     },
    //     {
    //         type: '5到10',
    //         value: 10,
    //     },
    //     {
    //         type: '10到20',
    //         value: 10,
    //     },
    //     {
    //         type: '大于20',
    //         value: 5,
    //     },
    // ];
    let config = {
        legend: false, // 关闭图例
        appendPadding: 2,
        data: data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.64,
        meta: {
            value: {
                formatter: function formatter(v) {
                    if(!isValidVariable(v)){
                        v = "N/A"
                    }
                    return ''.concat(v, ' \u67b6');
                },
            },
        },
        label: {
            type: 'inner',
            offset: '-50%',
            style: { textAlign: 'center',  fontSize:12, },
            autoRotate: false,
            content: '{value}',
        },
        interactions: [
            { type: 'element-selected' },
            { type: 'element-active' },
            { type: 'pie-statistic-active' },
        ],
        statistic: configData.statistic,
        theme: {
            // colors10: ['#FF0000', '#FF6B3B', '#FFC100',  '#9FB40F', '#FFC100',  '#FF6B3B', '#FF0000', ]
        }
    };
    return <Pie {...config} />;
}


export default CTOTPieChart
