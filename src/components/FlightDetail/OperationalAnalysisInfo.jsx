/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-03-05 11:01:38
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: WN-ATOM\src\components\FlightDetail\FlightDetail.jsx
 */
import React, { Fragment } from 'react'
import { Row, Col } from 'antd';
import { inject, observer } from 'mobx-react'



//运行分析信息
const OperationalAnalysisInfo = (props) => {
    const { flightDetailData } = props;
    const { flight } = flightDetailData;
    return (
        <Fragment>
            <Row className="info-row">
                <Col span={12}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="关门等待">关门等待</label>
                        </div>
                        <div className="ant-col ant-form-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">xxx</div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="滑行等待">滑行等待</label>
                        </div>
                        <div className="ant-col ant-form-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">xxx</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={12}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="离港延误SCH">离港延误SCH</label>
                        </div>
                        <div className="ant-col ant-form-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">xxx</div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="离港延误FPL">离港延误FPL</label>
                        </div>
                        <div className="ant-col ant-form-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">xxx</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={12}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="推出偏离(AOBT-COBT)">推出偏离(AOBT-COBT)</label>
                        </div>
                        <div className="ant-col ant-form-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">xxx</div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="关门偏离(AGCT-COBT)">关门偏离(AGCT-COBT)</label>
                        </div>
                        <div className="ant-col ant-form-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">xxx</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={24}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="起飞偏离(ATOT-CTOT)">起飞偏离(ATOT-CTOT)</label>
                        </div>
                        <div className="ant-col ant-form-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">xxx</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

export default inject("flightDetailData")(observer(OperationalAnalysisInfo))
