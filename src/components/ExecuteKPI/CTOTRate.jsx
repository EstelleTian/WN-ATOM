import React from 'react'
import {Col, Row} from "antd";
import { getTimeFromString, getDayTimeFromString, isValidVariable, isValidObject } from 'utils/basic-verify'

import CTOTPieChart from "./CTOTChart";

//CTOT符合率
function CTOTRate(props){
    const executeKPIData = props.executeKPIData || {};
    const KPIData = executeKPIData.KPIData || {};
    let { ctotChangeCountAverage, ctotMatchRate } = KPIData;
    // 平均跳变次数
    const average = isValidVariable(ctotChangeCountAverage) ? (((ctotChangeCountAverage*1) < 0 ) ? "N/A" : ctotChangeCountAverage): "N/A";
    // 跳变次数集合
    ctotMatchRate = isValidObject(ctotMatchRate) ? ctotMatchRate : {};



    /**
     * 获取各机场跳变次数集合
     * */
    let getApRateList = (rateData) => {
        let data = [];
        for(let rate in rateData){
            // 跳过TOTAL取值
            if(rate ==="TOTAL"){
                continue;
            }
            data.push({[rate]: rateData[rate]});
        }
        return data;
    };

    /**
     * 将数据转换为对象数组
     * */
    let getRateList = (rateData) => {
        let arr = [];
        for(let rate in rateData){
            // 跳过TOTAL取值
            if(rate ==="TOTAL"){
                continue;
            }
            let val = rateData[rate];
            if(!isValidVariable(val)){
                val = "N/A";
            }
            let obj = {
                key: rate,
                type: rate,
                value: val,
            };
            arr.push(obj);
        }
        return arr;
    };
    // 总计
    let totalRate = ctotMatchRate['TOTAL'] || {};
    let totalRateData =  getRateList(totalRate);

    let apRateList = getApRateList(ctotMatchRate);
    apRateList = apRateList.sort((item1,item2)=>{
        let nameA = Object.keys(item1)[0].toUpperCase(); // ignore upper and lowercase
        let nameB = Object.keys(item2)[0].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    });

    const totalChartConfig={
        statistic: {
            title: true,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize:24,
                    color:'#fff'
                },
            },
        },
    }


    return  <Col span={10} className="row_model ctot-rate">
        <Col span={24} className="block">
            <div className="block-title">CTOT符合率</div>
            <div className="flex justify-content-center layout-column" style={{ height: '150px'}}>
                <CTOTPieChart style={{fontSize: 12}} data={ totalRateData } configData ={ totalChartConfig } />
            </div>
        </Col>
        <Col span={24} className="block">
            <div className="block-title">平均跳变次数</div>
            <div className="flex justify-content-center layout-column">
                <div className="layout-row justify-content-center">
                    <div className="layout-row justify-content-center dance">
                        <div className="num layout-column justify-content-center">{average}</div>
                        <div className="unit layout-column ">次</div>
                    </div>
                </div>
            </div>
        </Col>
    </Col>
}

export default CTOTRate;