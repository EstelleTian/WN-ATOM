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

    const orderData = {
        "大于20": 100,
        "10到20": 200,
        "5到10": 300,
        "-5到5": 400,
        "-10到-5": 500,
        "-20到-10": 600,
        "小于-20": 700,
    }

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
            } else if(val === -1 || val ==="-1"){
                val = "N/A";
            }
            let obj = {
                key: rate,
                type: rate,
                value: val,
                order: orderData[rate],
            };
            arr.push(obj);
        }
        return arr;
    };
    // 总计
    let totalRate = ctotMatchRate['TOTAL'] || {};
    let totalRateData =  getRateList(totalRate);
    totalRateData.sort((item1,item2)=>{
        let nameA = item1.order; // ignore upper and lowercase
        let nameB = item2.order; // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    })

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

    let apRate = apRateList.map((item,index)=>{
        return getRateList(item);
    })

    console.log(apRate)


    const totalChartConfig={
        statistic: {
            title: {
                show: true,
                style: {
                    fontSize:20,
                    color:'#fff'
                },
            },
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize:20,
                    color:'#fff'
                },
            },
        },
    }

    const apChartConfig={
        statistic: {
            title: {
                show: true,
                style: {
                    fontSize:14,
                    color:'#fff'
                },
            },
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize:14,
                    color:'#fff'
                },
            },
            StatisticText: {
                style: {
                    fontSize:14,
                    color:'#fff'
                },
            }
        },
    }


    const getApRateChart = (data)=> {

        const { key , value} = data[0];

        const rateData = getRateList(value);


        return (
            <Col span={12} className="block row_model flex" key={ key }>
                <div className="block-title percent text-center"></div>
                <div className="flex justify-content-center layout-column">
                    <div className="flex justify-content-center layout-column" style={{ height: '100px'}}>
                        <CTOTPieChart style={{fontSize: 8}} data={ rateData } configData ={ apChartConfig } />
                    </div>
                    <div className="text-center point">{key}</div>
                </div>
            </Col>
        )

    }


    return  <Col span={24} className="row_model ctot-rate">
        <Col span={24} className="block">
            <div className="block-title">CTOT符合率</div>

            <div className="flex justify-content-center layout-column" >
                <Row className="total text-center justify-content-center" style={{ height: '150px'}}>
                    <CTOTPieChart style={{fontSize: 12}} data={ totalRateData } configData ={ totalChartConfig } />
                </Row>
                <Row className="part">
                    {
                        apRate.map((item, index)=>(

                            getApRateChart(item)

                        ))
                    }
                </Row>
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