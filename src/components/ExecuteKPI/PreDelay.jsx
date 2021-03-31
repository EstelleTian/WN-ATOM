import React from 'react'
import { Col, Progress, Row, Spin } from "antd";
import { inject, observer } from 'mobx-react'
import { isValidVariable } from 'utils/basic-verify'


//正常率
function PreDelay(props) {
    const executeKPIData = props.executeKPIData || {};
    const { loading } = executeKPIData;
    const KPIData = executeKPIData.KPIData || {};
    let tacticProcessInfo = KPIData.tacticProcessInfo || {};
    let kpi = tacticProcessInfo.kpi || {};
    let { entiretyNormalRate, entiretyDepNormalRate } = kpi;
    let normalRate = 0;
    let depNormalRate = 0;

    if (isValidVariable(entiretyNormalRate)) {
        normalRate = (entiretyNormalRate * 1) < 0 ? 0 : (entiretyNormalRate * 100).toFixed(0);
    }
    if (isValidVariable(entiretyDepNormalRate)) {
        depNormalRate = (entiretyDepNormalRate * 1) < 0 ? 0 : (entiretyDepNormalRate * 100).toFixed(0);
    }



    let getApNormalRateList = (insideApNormalRate) => {
        let arr = [];
        for (let ap in insideApNormalRate) {
            let obj = {
                key: ap,
                value: insideApNormalRate[ap],
            }
            arr.push(obj);
        }
        return arr;
    }

    // let list = getApNormalRateList(insideApNormalRate);

    /**
     * 格式化百分比数值
     * */
    const formatPercent = (percent) => {
        if (percent === "N/A") {
            return `N/A`
        } else if (percent === '100') {
            // 处理100%数值显示(原组件会显示成对号)
            return `100%`
        } else {
            return `${Math.round(percent)}%`
        }

    }


    /**
     * 转换百分比
     * */
    const converPercent = (percent) => {

        if (isValidVariable(percent)) {
            // 若值为'N/A'返回0
            if (percent === 'N/A') {
                return 0
            } else {
                // 小于0的返回0, 其他情况返回原值*100
                return (percent * 1) < 0 ? 0 : (percent * 100).toFixed(0)
            }

        } else {
            // 若无效则返回0
            return 0
        }
    }

    /**
     * 转换百分比显示
     *
     * */
    const converPercentText = (percent) => {

        if (isValidVariable(percent)) {
            // 若值为'N/A'返回0
            if (percent === 'N/A') {
                return 'N/A'
            } else {
                // 小于0的返回0, 其他情况返回原值*100
                return (percent * 1) < 0 ? 'N/A' : (percent * 100).toFixed(0)
            }

        } else {
            // 若无效则返回'N/A'
            return "N/A"
        }
    }


    // list = list.sort((item1, item2) => {
    //     let nameA = item1.key.toUpperCase(); // ignore upper and lowercase
    //     let nameB = item2.key.toUpperCase(); // ignore upper and lowercase
    //     if (nameA < nameB) {
    //         return -1;
    //     }
    //     if (nameA > nameB) {
    //         return 1;
    //     }
    //     // names must be equal
    //     return 0;
    // })



    return (
        <Spin spinning={loading} >
            <Col span={24} className="row_model delay-rate">
                <Col span={24} className="block ">
                    <div className="block-title">正常率</div>
                    <div className="flex justify-content-center layout-column">
                        {/* <Row className="total text-center justify-content-center">
                    <Progress
                        strokeLinecap="square"
                        type="dashboard"
                        percent={entiretyNormalRate}
                        // strokeWidth={8}
                        format={formatPercent}
                        strokeColor="#35A5DA"
                        strokeWidth="10"
                        gapDegree={1}
                        trailColor="#65737a"
                    />
                </Row> */}
                        <Row className="total text-center justify-content-center row_model">
                            <Col span={12} className="block">
                                <div className={`flex justify-content-center layout-column`}>
                                    <Progress
                                        strokeLinecap="square"
                                        type="dashboard"
                                        percent={normalRate}
                                        format={formatPercent}
                                        strokeColor="#35A5DA"
                                        strokeWidth="10"
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
                                        format={formatPercent}
                                        strokeColor="#35A5DA"
                                        strokeWidth="10"
                                        gapDegree={1}
                                        trailColor="#65737a"
                                    />
                                    <div className="text-center point">起飞正常率</div>
                                </div>

                            </Col>

                        </Row>
                        <Row className="part">
                            {/* {
                        list.map((item, index) => (
                            <Col span={12} className="block row_model flex" key={item.key}>
                                <div className="block-title percent text-center">{`${converPercentText(item.value)}%`}</div>
                                <div className="flex justify-content-center layout-column">
                                    <Progress
                                        percent={converPercent(item.value)}
                                        showInfo={false}
                                        strokeColor="#35A5DA"
                                        trailColor="#65737a"
                                    />
                                    <div className="text-center point">{item.key}</div>
                                </div>
                            </Col>
                        )
                        )
                    } */}
                        </Row>


                    </div>
                </Col>
            </Col>

        </Spin>

    )
}

export default inject("executeKPIData")(observer(PreDelay));