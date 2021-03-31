
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-25 16:34:55
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, { useEffect } from 'react'
import { Form, Checkbox, Space, Card, Row, Col, Menu, Dropdown, Button, DatePicker, Tabs, Input, Radio, } from 'antd';
import { formatTimeString, getDayTimeFromString, isValidVariable } from 'utils/basic-verify';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
import './NTFMDetail.scss'

function NTFMDetail(props) {

    const options = [
        { label: '是否同一高度', value: 'sameHeight' },
        { label: '起飞申请', value: 'takeoffApply' },
        { label: '禁航', value: 'noFly' },
    ];

    //航班性质
    const groupConditionFlightNature = [
        { label: '内地', value: 'D' },
        { label: '港澳台', value: 'I' },
        { label: '国际', value: 'G' },
    ];

    const groupConditionFlightNatures = [
        { label: '内地', value: 'D' },
        { label: '港澳台', value: 'I' },
        { label: '国际', value: 'G' },
    ];
    const groupConditionFlightNaturess = [
        { label: '内地', value: 'D' },
        { label: '港澳台', value: 'I' },
        { label: '国际', value: 'G' },
    ];
    const groupConditionFlightNaturesss = [
        { label: '内地', value: 'D' },
        { label: '港澳台', value: 'I' },
        { label: '国际', value: 'G' },
    ];


    //巡航高度
    const [value, setValue] = React.useState(1);

    const onChange = e => {
        setValue(e.target.value);
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a>
                    1st menu item
                </a>
            </Menu.Item>
            <Menu.Item>
                <a>
                    2nd menu item
            </a>
            </Menu.Item>
            <Menu.Item>
                <a>
                    3rd menu item
            </a>
            </Menu.Item>
        </Menu>
    );

    const { flowData = {}, flowType, title } = props;
    const { formerNtfmFlowInfo = {}, ntfmFlowInfo = {} } = flowData;

    let flowInfo = {};
    let ntfmMit = {};
    let ntfmFtmiType = {};
    let conditionTrfd = {};
    let exemptTrfd = {};
    let conditionExpd = {};
    let exemptExpd = {};

    if (flowType === "NTFMData") {
        flowInfo = ntfmFlowInfo;
    } else if (flowType === "FormerNTFMData") {
        flowInfo = formerNtfmFlowInfo;
    }

    const ntfmFlowInfo = flowInfo.ntfmFlowInfo || {};
    const ntfmMit = flowInfo.ntfmMit || {};
    const ntfmType = flowInfo.ntfmType || {};
    const ntfmFlowInfo = flowInfo.ntfmFlowInfo || {};


    debugger

    ntfmMit = ntfmFlowInfo.ntfmMit || {};
    ntfmFtmiType = ntfmMit.ntfmFtmiType || {};
    conditionTrfd = ntfmMit.condition_trfd || [];
    exemptTrfd = ntfmMit.exempt_trfd || [];
    conditionExpd = ntfmMit.condition_expd || [];
    exemptExpd = ntfmMit.exempt_expd || [];



    let { id, flowId, beginTime, endTime, flowName, forwardingtype, sendUnit, recvUnit,
        reason, sendSubUnit, content, arrAirport, arrExempt, depAirport, inArea, route, depExempt,
        contlPoint, controltype, dataStatus, delay, effective, flyArea, remark, sameHeight, takeoffApply, noFly,
        htype, hvalue, resCreateUnit = "", resRecvUnit = "",
    } = flowInfo;

    let { priority = "", ftmiStartTime = "", ftmiEndTime = "", ftmiContent = "", mitType = "", resSpecial = "", resAltType = "", intvValue = "", volumePiece = "", volumeNum = "", minIntvValue = "" } = ntfmFtmiType;



    return (
        <Row>
            <Col span={24}>
                <Form
                    className="advanced_form ATOM__detail_form bordered-form"
                    colon={false}
                    labelAlign="left"
                >
                    <Card title={title} size="small" className="advanced-card" bordered={false} >
                        <div className="info-content">
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <Space >
                                            <Radio.Group >
                                                <Radio value="small">Small</Radio>
                                                <Radio value="middle">Middle</Radio>
                                                <Radio value="large">Large</Radio>
                                            </Radio.Group>
                                        </Space>

                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <Dropdown overlay={menu} placement="bottomLeft" className="ant-dropdown-link">
                                            <Button style={{ marginLeft: 10 }}>本地模式</Button>
                                        </Dropdown>
                                        <Button type="primary" style={{ marginLeft: 20 }}>MIT</Button>
                                        <Button style={{ marginLeft: 10 }}>GS</Button>

                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row" style={{ height: 30 }}>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                            <label className="ant-form-item-no-colon" title="发起单位">发起单位:</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content" style={{ fontSize: 10 }}>{resCreateUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                            <label className="ant-form-item-no-colon" title="接收单位">接收单位:</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content" style={{ fontSize: 10 }}>{resRecvUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                            <label className="ant-form-item-no-colon" title="等级">等级:</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content" style={{ fontSize: 10 }}>{priority}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row" style={{ height: 30 }}>
                                <Col span={12}>
                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                            <label className="ant-form-item-no-colon" title="时段">时段</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{formatTimeString(ftmiStartTime)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                            <label className="ant-form-item-no-colon" title="时段">至</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{formatTimeString(ftmiEndTime)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row" style={{ height: 30 }}>
                                <Col span={24} >
                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                            <label className="ant-form-item-no-colon" title="措施内容">措施内容</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control" style={{ height: 30 }}>
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    {ftmiContent}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Card title={"交通流限制"} size="small" className="advanced-card" bordered={false} >
                        <Tabs type="card">
                            <TabPane tab="限制" key="1">
                                <Tabs type="card">
                                    <TabPane tab="条件" key="1">
                                        {
                                            (conditionTrfd.length == 0)
                                                ? null
                                                : conditionTrfd.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className="site-card-wrapper">
                                                                <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                    <Col span={24}>
                                                                        <div style={{ textAlign: "center", color: "#f00" }}>{conditionTrfd[index].groupRelation === "Y" ? "且" : conditionTrfd[index].groupRelation === "N" ? "或" : ""}</div>
                                                                    </Col>
                                                                </Row>
                                                                <Row gutter={16}>
                                                                    <Col span={10}>
                                                                        <Card title="来向" bordered={false} style={{ textAlign: "center" }}>
                                                                            <Row className="info-row" style={{ height: 30 }}>
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                                                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionComeAirport}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                            <Row className="info-row" style={{ height: 30 }}>
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                                                                            <label className="ant-form-item-no-colon" title="省份">省/直辖市：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionComeProvince}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                            <Row className="info-row" style={{ height: 30 }}>
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                                                                            <label className="ant-form-item-no-colon" title="国际">国际特区：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionComeDir}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                            <Row className="info-row" style={{ height: 30 }}>
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item" style={{ height: 30 }}>
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 30 }}>
                                                                                            <label className="ant-form-item-no-colon" title="区域">区域：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionComeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col span={4}>
                                                                <div>
                                                                    <Dropdown overlay={menus} placement="bottomLeft" className="ant-dropdown-link">
                                                                        <Button>途径</Button>
                                                                    </Dropdown>
                                                                </div>
                                                            </Col> */}
                                                                            </Row>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionComeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                    </Col>
                                                                    <Col span={4}>
                                                                        <Card title="目标对象" bordered={false} style={{ textAlign: "center", }}>
                                                                            <Row className="info-row" style={{ height: 257 }}>
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].trafficObj}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>

                                                                        </Card>
                                                                    </Col>
                                                                    <Col span={10}>
                                                                        <Card title="去向" bordered={false} style={{ textAlign: "center" }}>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionTargetAirport}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionTargeProvince}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionTargeDir}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionTargeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col span={4}>
                                                                <div>
                                                                    <Dropdown overlay={menus} placement="bottomLeft" className="ant-dropdown-link">
                                                                        <Button>途径</Button>
                                                                    </Dropdown>
                                                                </div>
                                                            </Col> */}
                                                                            </Row>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].directionTargeAirspace}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-row ant-form-item">
                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                            <label className="ant-form-item-no-colon" title="航班号">航班号</label>
                                                                        </div>
                                                                        <div className="ant-col ant-form-item-control">
                                                                            <div className="ant-form-item-control-input">
                                                                                <div className="ant-form-item-control-input-content">{conditionTrfd[index].groupConditionArcId}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                        <label className="ant-form-item-no-colon" title="航班性质">航班性质</label>
                                                                    </div>
                                                                    <Checkbox.Group
                                                                        options={groupConditionFlightNature}

                                                                        value={[conditionTrfd[index].groupConditionFlightNature]}

                                                                        disabled
                                                                    />

                                                                </Col>
                                                            </Row>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 80 }}>
                                                                        <label className="ant-form-item-no-colon" title="巡航高度">巡航高度</label>
                                                                    </div>
                                                                    <div style={{ display: "inline-block" }}>
                                                                        <Radio.Group value={conditionTrfd[index].groupConditionRfl} disabled>
                                                                            <Radio value={'N'}>无</Radio>
                                                                            <Radio value={'O'}>指定</Radio>
                                                                            <Radio value={'U'}>含以上</Radio>
                                                                            <Radio value={'D'}>含以下</Radio>
                                                                        </Radio.Group>
                                                                        <Input placeholder="例:S0690,S750,S0890" disabled />
                                                                    </div>


                                                                </Col>
                                                            </Row>

                                                        </div>
                                                    )
                                                }, this)
                                        }


                                    </TabPane>
                                    <TabPane tab="排除" key="2">
                                        {
                                            (exemptTrfd.length == 0)
                                                ? null
                                                : exemptTrfd.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className="site-card-wrapper">
                                                                <Row gutter={16}>
                                                                    <Col span={10}>
                                                                        <Card title="来向" bordered={false} style={{ textAlign: "center" }}>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionComeAirport}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionComeProvince}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionComeDir}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionComeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col span={4}>
                                                                <div>
                                                                    <Dropdown overlay={menus} placement="bottomLeft" className="ant-dropdown-link">
                                                                        <Button>途径</Button>
                                                                    </Dropdown>
                                                                </div>
                                                            </Col> */}
                                                                            </Row>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionComeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                    </Col>
                                                                    <Col span={4}>
                                                                        <Card title="目标对象" bordered={false} style={{ textAlign: "center", }}>
                                                                            <Row className="info-row" style={{ height: 257 }}>
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].trafficObj}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>

                                                                        </Card>
                                                                    </Col>
                                                                    <Col span={10}>
                                                                        <Card title="去向" bordered={false} style={{ textAlign: "center" }}>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionTargetAirport}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionTargeProvince}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionTargeDir}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionTargeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col span={4}>
                                                                <div>
                                                                    <Dropdown overlay={menus} placement="bottomLeft" className="ant-dropdown-link">
                                                                        <Button>途径</Button>
                                                                    </Dropdown>
                                                                </div>
                                                            </Col> */}
                                                                            </Row>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].directionTargeAirspace}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-row ant-form-item">
                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                            <label className="ant-form-item-no-colon" title="航班号">航班号</label>
                                                                        </div>
                                                                        <div className="ant-col ant-form-item-control">
                                                                            <div className="ant-form-item-control-input">
                                                                                <div className="ant-form-item-control-input-content">{exemptTrfd[index].groupConditionArcId}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                        <label className="ant-form-item-no-colon" title="航班性质">航班性质</label>
                                                                    </div>
                                                                    <Checkbox.Group
                                                                        options={groupConditionFlightNatures}
                                                                        value={[exemptTrfd[index].groupConditionFlightNature]}

                                                                        disabled
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 80 }}>
                                                                        <label className="ant-form-item-no-colon" title="巡航高度">巡航高度</label>
                                                                    </div>
                                                                    <div style={{ display: "inline-block" }}>
                                                                        <Radio.Group value={exemptTrfd[index].groupConditionRfl} disabled>
                                                                            <Radio value={'N'}>无</Radio>
                                                                            <Radio value={'O'}>指定</Radio>
                                                                            <Radio value={'U'}>含以上</Radio>
                                                                            <Radio value={'D'}>含以下</Radio>
                                                                        </Radio.Group>
                                                                        <Input placeholder="例:S0690,S750,S0890" disabled />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                }, this)
                                        }
                                    </TabPane>
                                </Tabs>


                            </TabPane>
                            <TabPane tab="措施豁免（占量）" key="2">
                                <Tabs type="card">
                                    <TabPane tab="条件" key="1">
                                        {
                                            (conditionExpd.length == 0)
                                                ? null
                                                : conditionExpd.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className="site-card-wrapper">
                                                                <Row gutter={16}>
                                                                    <Col span={10}>
                                                                        <Card title="来向" bordered={false} style={{ textAlign: "center" }}>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionComeAirport}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionComeProvince}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionComeDir}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionComeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col span={4}>
                                                                <div>
                                                                    <Dropdown overlay={menus} placement="bottomLeft" className="ant-dropdown-link">
                                                                        <Button>途径</Button>
                                                                    </Dropdown>
                                                                </div>
                                                            </Col> */}
                                                                            </Row>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionComeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                    </Col>
                                                                    <Col span={4}>
                                                                        <Card title="目标对象" bordered={false} style={{ textAlign: "center", }}>
                                                                            <Row className="info-row" style={{ height: 257 }}>
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].trafficObj}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>

                                                                        </Card>
                                                                    </Col>
                                                                    <Col span={10}>
                                                                        <Card title="去向" bordered={false} style={{ textAlign: "center" }}>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionTargetAirport}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionTargeProvince}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionTargeDir}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionTargeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col span={4}>
                                                                <div>
                                                                    <Dropdown overlay={menus} placement="bottomLeft" className="ant-dropdown-link">
                                                                        <Button>途径</Button>
                                                                    </Dropdown>
                                                                </div>
                                                            </Col> */}
                                                                            </Row>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].directionTargeAirspace}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-row ant-form-item">
                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                            <label className="ant-form-item-no-colon" title="航班号">航班号</label>
                                                                        </div>
                                                                        <div className="ant-col ant-form-item-control">
                                                                            <div className="ant-form-item-control-input">
                                                                                <div className="ant-form-item-control-input-content">{conditionExpd[index].groupConditionArcId}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                        <label className="ant-form-item-no-colon" title="航班性质">航班性质</label>
                                                                    </div>
                                                                    <Checkbox.Group
                                                                        options={groupConditionFlightNaturess}
                                                                        value={[conditionExpd[index].groupConditionFlightNature]}

                                                                        disabled
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 80 }}>
                                                                        <label className="ant-form-item-no-colon" title="巡航高度">巡航高度</label>
                                                                    </div>
                                                                    <div style={{ display: "inline-block" }}>
                                                                        <Radio.Group value={conditionExpd[index].groupConditionRfl} disabled>
                                                                            <Radio value={'N'}>无</Radio>
                                                                            <Radio value={'O'}>指定</Radio>
                                                                            <Radio value={'U'}>含以上</Radio>
                                                                            <Radio value={'D'}>含以下</Radio>
                                                                        </Radio.Group>
                                                                        <Input placeholder="例:S0690,S750,S0890" disabled />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                }, this)
                                        }


                                    </TabPane>
                                    <TabPane tab="排除" key="2">
                                        {
                                            (exemptExpd.length == 0)
                                                ? null
                                                : exemptExpd.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className="site-card-wrapper">
                                                                <Row gutter={16}>
                                                                    <Col span={10}>
                                                                        <Card title="来向" bordered={false} style={{ textAlign: "center" }}>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionComeAirport}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionComeProvince}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionComeDir}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionComeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col span={4}>
                                                                <div>
                                                                    <Dropdown overlay={menus} placement="bottomLeft" className="ant-dropdown-link">
                                                                        <Button>途径</Button>
                                                                    </Dropdown>
                                                                </div>
                                                            </Col> */}
                                                                            </Row>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionComeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                    </Col>
                                                                    <Col span={4}>
                                                                        <Card title="目标对象" bordered={false} style={{ textAlign: "center", }}>
                                                                            <Row className="info-row" style={{ height: 257 }}>
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].trafficObj}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>

                                                                        </Card>
                                                                    </Col>
                                                                    <Col span={10}>
                                                                        <Card title="去向" bordered={false} style={{ textAlign: "center" }}>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="机场">机场：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionTargetAirport}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionTargeProvince}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionTargeDir}</div>
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
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionTargeAirCode}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col span={4}>
                                                                <div>
                                                                    <Dropdown overlay={menus} placement="bottomLeft" className="ant-dropdown-link">
                                                                        <Button>途径</Button>
                                                                    </Dropdown>
                                                                </div>
                                                            </Col> */}
                                                                            </Row>
                                                                            <Row className="info-row">
                                                                                <Col span={24}>
                                                                                    <div className="ant-row ant-form-item">
                                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                                            <label className="ant-form-item-no-colon" title="空域">空域对象：</label>
                                                                                        </div>
                                                                                        <div className="ant-col ant-form-item-control">
                                                                                            <div className="ant-form-item-control-input">
                                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].directionTargeAirspace}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-row ant-form-item">
                                                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                            <label className="ant-form-item-no-colon" title="航班号">航班号</label>
                                                                        </div>
                                                                        <div className="ant-col ant-form-item-control">
                                                                            <div className="ant-form-item-control-input">
                                                                                <div className="ant-form-item-control-input-content">{exemptExpd[index].groupConditionArcId}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                                                        <label className="ant-form-item-no-colon" title="航班性质">航班性质</label>
                                                                    </div>
                                                                    <Checkbox.Group
                                                                        options={groupConditionFlightNaturesss}
                                                                        value={[exemptExpd[index].groupConditionFlightNature]}
                                                                        disabled
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row className="info-row" style={{ marginLeft: 24, marginRight: 24 }}>
                                                                <Col span={24}>
                                                                    <div className="ant-col ant-form-item-label ant-form-item-label-left" style={{ height: 80 }}>
                                                                        <label className="ant-form-item-no-colon" title="巡航高度">巡航高度</label>
                                                                    </div>
                                                                    <div style={{ display: "inline-block" }}>
                                                                        <Radio.Group value={exemptExpd[index].groupConditionRfl} disabled>
                                                                            <Radio value={'N'}>无</Radio>
                                                                            <Radio value={'O'}>指定</Radio>
                                                                            <Radio value={'U'}>含以上</Radio>
                                                                            <Radio value={'D'}>含以下</Radio>
                                                                        </Radio.Group>
                                                                        <Input placeholder="例:S0690,S750,S0890" disabled />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                }, this)
                                        }
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                        </Tabs>
                    </Card>
                    <Card title={"总量/间隔限制"} size="small" className="advanced-card" bordered={false} style={{ marginLeft: 24, marginRight: 24 }} >
                        <div className="info-content">
                            <Row className="info-row" >
                                <Col span={24}>
                                    <div>
                                        <Radio.Group value={mitType} disabled>
                                            <Radio value='N'>无</Radio>
                                            <Radio value='C' style={{ marginLeft: 50 }}>间隔:<span>{intvValue}</span></Radio>
                                            <Radio value='F' style={{ marginLeft: 50 }}>总量:<span>{volumePiece}</span>分钟&nbsp;&nbsp;&nbsp;&nbsp;<span>{volumeNum}</span>架次&nbsp;&nbsp;&nbsp;&nbsp;最小 <span>{minIntvValue}</span>分钟</Radio>
                                            <Radio value='D' style={{ marginLeft: 50 }}>显示为:<span>{0}</span>分钟</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Card title={""} size="small" className="advanced-card" bordered={false} >
                        <div className="site-card-wrapper">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card title="特殊限制" bordered={false}>
                                        <Row className="info-row">
                                            <Col span={24}>

                                                <Radio.Group value={resSpecial} disabled>
                                                    <Radio value={'N'}>无</Radio>
                                                    <Radio value={'D'}>上客申请</Radio>
                                                    <Radio value={'S'}>开车申请</Radio>
                                                    <Radio value={'B'}>起飞申请</Radio>
                                                </Radio.Group>


                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title="高度限制" bordered={false}>
                                        <Row className="info-row">
                                            <Col span={24}>

                                                <Radio.Group value={resAltType} disabled>
                                                    <Radio value={'N'}>无</Radio>
                                                    <Radio value={'O'}>指定</Radio>
                                                    <Radio value={'U'}>含以上</Radio>
                                                    <Radio value={'D'}>含以下</Radio>
                                                    <Radio value={'F'}>禁用</Radio>
                                                </Radio.Group>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Form>
            </Col>
        </Row>
    )
}


export default NTFMDetail;


