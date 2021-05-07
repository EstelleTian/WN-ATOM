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



//前序航班信息
const FormerInfo = (props) => {
    const { flightDetailData } = props;
    const { flight } = flightDetailData;
    return (
        <Fragment>
            <Row className="info-row">
                <Col span={12}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="航班号">航班号</label>
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
                            <label className="ant-form-item-no-colon" title="所属公司">所属公司</label>
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
                            <label className="ant-form-item-no-colon" title="注册号">注册号</label>
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
                            <label className="ant-form-item-no-colon" title="机型">机型</label>
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
                            <label className="ant-form-item-no-colon" title="报文记录">报文记录</label>
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
                            <label className="ant-form-item-no-colon" title="最新报文">最新报文</label>
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
                            <label className="ant-form-item-no-colon" title="起飞机场">起飞机场</label>
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
                            <label className="ant-form-item-no-colon" title="降落机场">降落机场</label>
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
                            <label className="ant-form-item-no-colon" title="计划起飞时间">计划起飞时间</label>
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
                            <label className="ant-form-item-no-colon" title="计划降落时间">计划降落时间</label>
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
                            <label className="ant-form-item-no-colon" title="计划航路">计划航路</label>
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
                            <label className="ant-form-item-no-colon" title="FPL起飞时间">FPL起飞时间</label>
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
                            <label className="ant-form-item-no-colon" title="FPL降落时间">FPL降落时间</label>
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
                            <label className="ant-form-item-no-colon" title="FPL航路">FPL航路</label>
                        </div>
                        <div className="ant-col ant-form-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">WUR W190 ADPET W188 DAKPA W189 IPMUN W192 ESDEX W191 DNC W565 XIXAN W214 HO H14 P396 H131 P397/K0824S1010 H131 UGSUT H11 SHX W4 LIMGI H103 P52
</div>
                            </div>
                        </div>
                    </div>
                </Col>
                
            </Row>
            <Row className="info-row">
                <Col span={24}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                            <label className="ant-form-item-no-colon" title="CPL信息">CPL信息</label>
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
                            <label className="ant-form-item-no-colon" title="关门时间">关门时间	</label>
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
                            <label className="ant-form-item-no-colon" title="推出时间">推出时间</label>
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
                            <label className="ant-form-item-no-colon" title="实际起飞时间">实际起飞时间</label>
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
                            <label className="ant-form-item-no-colon" title="实际降落时间">实际降落时间</label>
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

export default inject("flightDetailData")(observer(FormerInfo))
