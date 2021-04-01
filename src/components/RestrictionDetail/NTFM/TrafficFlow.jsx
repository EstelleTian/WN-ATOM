
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: NTFM流控交通流信息模块
 */
import React, { useEffect, Fragment } from 'react'
import { Checkbox, Divider, Card, Row, Col, Radio, Tag } from 'antd'
import { isValidVariable} from 'utils/basic-verify'


//NTFM流控交通流信息模块

function TrafficFlow(props) {
    const flightNatureOptions = [
        { label: '内地', value: 'D' },
        { label: '港澳台', value: 'G' },
        { label: '国际', value: 'I' },
    ];

    const { data = {} , index } = props;
    let groupRelation = data.groupRelation;
    
    
    // 目标点
    let trafficObj = data.trafficObj || "";
    // 来向-机场
    let directionComeAirport = data.directionComeAirport || "";
    // 来向-省/直辖市
    let directionComeProvince = data.directionComeProvince || "";
    // 来向-国际特区
    let directionComeDir = data.directionComeDir || "";
    // 来向-区域
    let directionComeAirCode = data.directionComeAirCode || "";
    // 来向-空域对象
    let directionComeAirspace = data.directionComeAirspace || "";

    // 去向-机场
    let directionTargetAirport = data.directionTargetAirport || "";
    // 去向-省/直辖市
    let directionTargetProvince = data.directionTargetProvince || "";
    // 去向-国际特区
    let directionTargetDir = data.directionTargetDir || "";
    // 去向-区域
    let directionTargetAirCode = data.directionTargetAirCode || "";
    // 去向-空域对象
    let directionTargetAirspace = data.directionTargetAirspace || "";



    // 航班号
    let groupConditionArcId = data.groupConditionArcId || "";
    // 航班性质
    let groupConditionFlightNature = data.groupConditionFlightNature || "";
    // 重要航班
    let groupConditionSpecial = data.groupConditionSpecial || "";
    // 巡航高度 
    let groupConditionHeightKind = data.groupConditionHeightKind || "";
    // 高度值
    let groupConditionRfl = data.groupConditionRfl || "";
    


    return (
        <Fragment>
            {
                (isValidVariable(groupRelation) && index > 0) ? (groupRelation ==="Y") ? 
                <Divider className="traffice-relation-divider"><Tag color="#f50">且</Tag></Divider>
                 : <Divider className="traffice-relation-divider" ><Tag color="#f50">或</Tag></Divider>
                 :""
            }
            <Card size="small" className="traffic-flow-wrapper-card" bordered={false} >
                <Row gutter={12}>
                    <Col span={10}>
                        <Card className="traffic-flow-card" title="来向" bordered={false}>
                            <Row className="info-row" >
                                <Col span={24}>
                                    <div className="ant-row ant-form-item" >
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" >
                                            <label className="ant-form-item-no-colon" title="机场">机场</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionComeAirport}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row" >
                                <Col span={24}>
                                    <div className="ant-row ant-form-item" >
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" >
                                            <label className="ant-form-item-no-colon" title="省/直辖市">省/直辖市</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionComeProvince}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row" >
                                <Col span={24}>
                                    <div className="ant-row ant-form-item" >
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" >
                                            <label className="ant-form-item-no-colon" title="国际特区">国际特区</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionComeDir}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row" >
                                <Col span={24}>
                                    <div className="ant-row ant-form-item" >
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" >
                                            <label className="ant-form-item-no-colon" title="区域">区域</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionComeAirCode}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="空域对象">空域对象</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionComeAirspace}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card title="目标对象" className="traffic-flow-card traffic-obj" bordered={false}>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{trafficObj}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card title="去向" className="traffic-flow-card" bordered={false}>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionTargetAirport}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="省份">省/直辖市：</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionTargetProvince}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="国际">国际特区：</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionTargetDir}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="区域">区域：</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionTargetAirCode}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{directionTargetAirspace}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row className="info-row">
                    <Col span={24}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                <label className="ant-form-item-no-colon" title="航班号">航班号</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">{groupConditionArcId}</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="info-row">
                    <Col span={24}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                <label className="ant-form-item-no-colon" title="航班性质">航班性质</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">
                                        <Checkbox.Group options={flightNatureOptions} defaultValue={groupConditionFlightNature.split(';')} disabled />
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
                                <label className="ant-form-item-no-colon" title="重要航班">重要航班</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">{groupConditionSpecial}</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="info-row">
                    <Col span={12}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                <label className="ant-form-item-no-colon" title="巡航高度">巡航高度</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">
                                        <Radio.Group value={groupConditionHeightKind}>
                                            <Radio value="N">无</Radio>
                                            <Radio value="O">指定</Radio>
                                            <Radio value="U">含以上</Radio>
                                            <Radio value="D">含以下</Radio>
                                        </Radio.Group>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                <label className="ant-form-item-no-colon" title="高度值">高度值</label>
                            </div>
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">{groupConditionRfl}</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Fragment>
    )
}


export default TrafficFlow;


