import React from 'react'
import { Col, Progress, Row, Spin } from "antd";
import { inject, observer } from 'mobx-react'
import { isValidVariable } from 'utils/basic-verify'


//正常率
function PreDelay(props) {
    const executeKPIData = props.executeKPIData || {};
    const { loading } = executeKPIData;
    const executeData = executeKPIData.executeData || {};
    let tacticProcessInfo = executeData.tacticProcessInfo || {};
    let kpi = tacticProcessInfo.kpi || {};
    //  entiretyNormalRate 计划起飞正常率   
    //  entiretyDepNormalRate 实际起飞正常率
    // apDepEstimateRateMap 大机场实际起飞正常率
    let { entiretyNormalRate, entiretyDepNormalRate, apDepEstimateRateMap } = kpi;

    // 设置初始值
    let normalRate = "N/A";
    // 设置初始值
    let depNormalRate = "N/A";
    const converPercent = (val) => {
        let result = 'N/A';
        if (isValidVariable(val)) {
            let number = (Number(val) * 100).toFixed(0);
            result = number < 0 ? 'N/A' : number;
        }
        return result;
    }
    normalRate = converPercent(entiretyNormalRate);
    depNormalRate = converPercent(entiretyDepNormalRate);


    /**
     * 格式化数值
     * */
    const formatPercent = (percent) => {
        if (percent === 'N/A') {
            return `N/A`
        } else {
            return `${percent}%`
        }
    }
    let getApNormalRateList = (apDepEstimateRateMap) => {
        let arr = [];
        for (let ap in apDepEstimateRateMap) {
            let obj = {
                key: ap,
                value: apDepEstimateRateMap[ap],
            }
            arr.push(obj);
        }
        return arr;
    }

    let list = getApNormalRateList(apDepEstimateRateMap);

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
                                        format={formatPercent}
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
                                        format={formatPercent}
                                        gapDegree={1}
                                        trailColor="#65737a"
                                    />
                                    <div className="text-center point">实际起飞正常率</div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="part">
                            {
                                list.map((item, index) => (
                                    <Col span={6} className="block row_model flex" key={item.key}>
                                        {/* <div className="block-title percent text-center">{`${converPercentText(item.value)}%`}</div> */}
                                        <div className="flex justify-content-center layout-column">
                                            <Progress
                                                strokeLinecap="square"
                                                type="dashboard"
                                                percent={converPercent(item.value)}
                                                status="normal"
                                                strokeColor="#35A5DA"
                                                format={formatPercent}
                                                gapDegree={1}
                                                trailColor="#65737a"
                                            />
                                            <div className="text-center point">{item.key}</div>
                                        </div>
                                    </Col>
                                )
                                )
                            }
                        </Row>


                    </div>
                </Col>
            </Col>

        </Spin>

    )
}

export default inject("executeKPIData")(observer(PreDelay));