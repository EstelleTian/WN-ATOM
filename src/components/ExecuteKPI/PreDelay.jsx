import React from 'react'
import {Col, Progress, Row} from "antd";

//预计延误
function PreDelay(props){
    return <Col span={14} className="row_model delay-rate">
        <Col span={24} className="block ">
            <div className="block-title">预计延误率</div>
            <div className="flex justify-content-center layout-column">
                <Row className="total text-center justify-content-center">
                    <Progress
                        strokeLinecap="square"
                        type="dashboard"
                        percent={30}
                        // strokeWidth={8}
                        gapDegree={1}
                        trailColor="#64737a"
                    />

                </Row>
                <Row className="part">
                    <Col span={12} className="block row_model flex">
                        <div className="block-title percent text-center">30%</div>
                        <div className="flex justify-content-center layout-column">
                            <Progress
                                percent={50}
                                showInfo={false}
                                trailColor="#64737a"
                            />
                            <div className="text-center point">西安机场</div>
                        </div>
                    </Col>
                    <Col span={12} className="block row_model flex ">
                        <div className="block-title percent text-center">30%</div>
                        <div className="flex justify-content-center layout-column">
                            <Progress
                                percent={50}
                                showInfo={false}
                                trailColor="#64737a"
                            />
                            <div className="text-center point">西安机场</div>
                        </div>
                    </Col>
                </Row>
                <Row className="part">
                    <Col span={12} className="block row_model flex">
                        <div className="block-title percent text-center">30%</div>
                        <div className="flex justify-content-center layout-column">
                            <Progress
                                percent={50}
                                showInfo={false}
                                trailColor="#64737a"
                            />
                            <div className="text-center point">西安机场</div>
                        </div>
                    </Col>
                    <Col span={12} className="block row_model flex">
                        <div className="block-title percent text-center">30%</div>
                        <div className="flex justify-content-center layout-column">
                            <Progress
                                percent={50}
                                showInfo={false}
                                trailColor="#64737a"
                            />
                            <div className="text-center point">西安机场</div>
                        </div>
                    </Col>
                </Row>

            </div>
        </Col>
    </Col>
}

export default PreDelay;