import React from 'react'
import {Col, Progress, Row} from "antd";
import { getTimeFromString, getDayTimeFromString, isValidVariable, isValidObject } from 'utils/basic-verify'


//正常率
function PreDelay(props){
    const executeKPIData = props.executeKPIData || {};
    const KPIData = executeKPIData.KPIData || {};
    let { entiretyNormalRate, insideApNormalRate ={ }} = KPIData;

    if(isValidVariable(entiretyNormalRate)){
        entiretyNormalRate = (entiretyNormalRate*1) < 0 ? "N/A" : entiretyNormalRate;
    }else{
        entiretyNormalRate = "N/A";
    }

    let getApNormalRateList = (insideApNormalRate) => {
        let arr = [];
        for(let ap in insideApNormalRate){
            let obj = {
                key: ap,
                value: insideApNormalRate[ap],
            }
            arr.push(obj);
        }
        return arr;
    }

    let list = getApNormalRateList(insideApNormalRate);
    list = list.sort((item1,itme2)=>{
        let nameA = item1.key.toUpperCase(); // ignore upper and lowercase
        let nameB = itme2.key.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    })


    console.log(list);



    return <Col span={14} className="row_model delay-rate">
        <Col span={24} className="block ">
            <div className="block-title">正常率</div>
            <div className="flex justify-content-center layout-column">
                <Row className="total text-center justify-content-center">
                    <Progress
                        strokeLinecap="square"
                        type="dashboard"
                        percent={entiretyNormalRate}
                        // strokeWidth={8}
                        gapDegree={1}
                        trailColor="#64737a"
                    />

                </Row>
                <Row className="part">
                    {
                        list.map((item, index) => (
                                <Col span={12} className="block row_model flex" key={ item.key }>
                                    <div className="block-title percent text-center">{(item.value*1) < 0 ? "N/A" : item.value}%</div>
                                    <div className="flex justify-content-center layout-column">
                                        <Progress
                                            percent={(item.value*1) < 0 ? "N/A" : item.value}
                                            showInfo={false}
                                            trailColor="#64737a"
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
}

export default PreDelay;