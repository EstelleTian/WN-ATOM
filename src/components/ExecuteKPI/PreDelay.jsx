import React from 'react'
import { Col, Progress, Row, Spin } from "antd";
import { inject, observer } from 'mobx-react'
import { isValidVariable, isValidObject } from 'utils/basic-verify'
import { format } from 'highcharts';


//正常率
function PreDelay(props) {
    const executeKPIData = props.executeKPIData || {};
    const { loading, entiretyNormalRate, entiretyDepNormalRate, apEstimateRateMap, apDepEstimateRateMap } = props.executeKPIData

    const executeData = executeKPIData.executeData || {};
    let tacticProcessInfo = executeData.tacticProcessInfo || {};
    let kpi = tacticProcessInfo.kpi || {};
    //  entiretyNormalRate 预计起飞正常率   
    //  entiretyDepNormalRate 实际起飞正常率
    // apEstimateRateMap 四大机场预计起飞正常率
    // apDepEstimateRateMap 四大机场实际起飞正常率
    

    // 设置初始值
    let normalRate = -1;
    // 设置初始值
    let depNormalRate = -1;
    const converPercent = (val) => {
        let result = -1;
        if (isValidVariable(val)) {
            let number =  (Number(val) * 100).toFixed(0);
            result = Number(number) ;
        }
        return result;
    }
    normalRate = converPercent(entiretyNormalRate);
    depNormalRate = converPercent(entiretyDepNormalRate);
    // 机场正常率排序依据
    const airportOrder = {
        ZLXY:0,
        ZLLL:1,
        ZLXN:2,
        ZLIC:3,
    }


    /**
     * 格式化数值
     * */
    const formatPercent = (percent, successPercent, rate) => {
        if (rate < 0) {
            return `N/A`
        } else {
            return `${percent}%`
        }
    }
    let getApRateList = (rateMap) => {
        let arr = [];
        for (let ap in rateMap) {
            let obj = {
                key: ap,
                value: rateMap[ap],
                order: airportOrder[ap]
            }
            arr.push(obj);
        }
        return arr;
    }

    
    // 四大机场预计起飞正常率
    let apEstimateRateList = getApRateList(apEstimateRateMap);
    // 四大机场实际起飞正常率
    let apDepEstimateRateList= getApRateList(apDepEstimateRateMap);


    // 排序按order升序排序
    let apEstimateSortList = apEstimateRateList.sort((a,b)=>{
        if (isValidObject(a)
            && isValidVariable(a.order)
            && isValidObject(b)
            && isValidVariable(b.order)) {
                if (a.order > b.order) {
                    return 1;
                } else if (a.order  < b.order) {
                    return -1;
                } else {
                    return 0
                }
            }
        return 0    
    })
    // 排序按order升序排序
    let apDepEstimateSortList = apDepEstimateRateList.sort((a,b)=>{
        if (isValidObject(a)
            && isValidVariable(a.order)
            && isValidObject(b)
            && isValidVariable(b.order)) {
                if (a.order > b.order) {
                    return 1;
                } else if (a.order  < b.order) {
                    return -1;
                } else {
                    return 0
                }
            }
        return 0    
    })

    return (
        <Spin spinning={loading} >
            <Col span={24} className="row_model delay-rate">
                <Col span={24} className="block ">
                    <div className="block-title">正常率</div>
                    <div className="flex justify-content-center layout-column">
                        <Row className="total text-center justify-content-center row_model">
                            <Col span={12} className="block">
                                <div className={`flex justify-content-center layout-column`}>
                                    <Progress
                                        strokeLinecap="square"
                                        type="dashboard"
                                        percent={normalRate}
                                        status="normal"
                                        strokeColor="#35A5DA"
                                        format={(percent, successPercent) => (formatPercent(percent, successPercent, normalRate))}
                                        gapDegree={1}
                                        trailColor="#65737a"
                                    />
                                    <div className="text-center point">预计起飞正常率</div>
                                </div>
                            </Col>
                            <Col span={12} className="block">
                                <div className="flex justify-content-center layout-column">
                                    <Progress
                                        strokeLinecap="square"
                                        type="dashboard"
                                        percent={depNormalRate}
                                        status="normal"
                                        strokeColor="#35A5DA"
                                        format={(percent, successPercent) => (formatPercent(percent, successPercent, depNormalRate))}
                                        gapDegree={1}
                                        trailColor="#65737a"
                                    />
                                    <div className="text-center point">实际起飞正常率</div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="part">
                            {
                                apEstimateSortList.map((item, index) => (
                                    <Col span={6} className="block row_model flex" key={item.key}>
                                        <div className="flex justify-content-center layout-column">
                                            <Progress
                                                width={80}
                                                className="text-center"
                                                strokeLinecap="square"
                                                type="dashboard"
                                                percent={converPercent(item.value)}
                                                status="normal"
                                                strokeColor="#35A5DA"
                                                format={(percent, successPercent) => (formatPercent(percent, successPercent, converPercent(item.value)))}
                                                gapDegree={1}
                                                trailColor="#65737a"
                                            />
                                            <div className="text-center point">{item.key}</div>
                                        </div>
                                    </Col>
                                )
                                )
                            }
                            <Col span={24} className="block row_model flex">
                                <div className="text-center point">机场预计起飞正常率</div>
                            </Col>
                        </Row>
                        <Row className="part">
                            {
                                apDepEstimateSortList.map((item, index) => (
                                    <Col span={6} className="block row_model flex" key={item.key}>
                                        <div className="flex justify-content-center layout-column">
                                            <Progress
                                                width={80}
                                                className="text-center"
                                                strokeLinecap="square"
                                                type="dashboard"
                                                percent={converPercent(item.value)}
                                                status="normal"
                                                strokeColor="#35A5DA"
                                                format={(percent, successPercent) => (formatPercent(percent, successPercent, converPercent(item.value)))}
                                                gapDegree={1}
                                                trailColor="#65737a"
                                            />
                                            <div className="text-center point">{item.key}</div>
                                        </div>
                                    </Col>
                                )
                                )
                            }
                            <Col span={24} className="block row_model flex">
                                <div className="text-center point">机场实际起飞正常率</div>
                            </Col>
                        </Row>


                    </div>
                </Col>
            </Col>

        </Spin>

    )
}

export default inject("executeKPIData")(observer(PreDelay));