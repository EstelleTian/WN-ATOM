import React, { useEffect } from 'react'
import { Card, Checkbox, Col, Form, Select, Row,  } from "antd";
import { isValidVariable } from 'utils/basic-verify'
import { SchemeFormUtil } from 'utils/scheme-form-util'

import { inject, observer } from "mobx-react";
//尾流类型选项
const wakeFlowLevelOptions = [
    { label: 'G', value: 'G' },
    { label: 'H', value: 'H' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
];
//运营人
const auTypeOptions = [
    { label: '内机', value: 'DOMESTIC_AU' },
    { label: '外机', value: 'FOREIGN_AU' },
    { label: '台湾机', value: 'TAIWAN_AU' },
    { label: '港澳机', value: 'HKANDMC_AU' },
    { label: '未知', value: 'UNKNOWN' },
]

//航班类型选项
const airlineTypeOptions = [
    { label: '国内', value: 'DOMESTIC_AIRLINE' },
    { label: '国际', value: 'INTERNATIONAL_AIRLINE' },
    { label: '台湾地区', value: 'TAIWAN_AIRLINE' },
    { label: '港澳特区', value: 'HKANDMC_AIRLINE' },
    { label: '飞越', value: 'OVERFLY_AIRLINE' },
    { label: '未知', value: 'UNKNOWN' },
];
//客货类型选项
const missionTypeOptions = [
    { label: '客班', value: 'AIRLINE_MISSION' },
    { label: '货班', value: 'CARGO_MISSION' },
    { label: '未知', value: 'UNKNOWN' },
];
//任务类型选项
const taskOptions = [
    { label: '正班', value: 'REGULAR' },
    { label: '补班', value: 'PATCH' },
    { label: '加班包机', value: 'PAXCHARTER' },
    { label: '调机', value: 'FERRY' },
    { label: '校飞', value: 'CHECK' },
    { label: '急救', value: 'AMBULANCE' },
    { label: '公务机', value: 'BUSINESS' },
    { label: '其他', value: 'OTHER' },
];
//军民航选项
const organizationOptions = [
    { label: '军航', value: 'MILITARY' },
    { label: '民航', value: 'CIVIL' },
    { label: '未知', value: 'UNKNOWN' },
];
//限制资质选项
const abilityOptions = [
    { label: 'II类', value: 'CAT2' }
];

//包含航班表单
function TacticLimitedFlightForm(props) {

    const { schemeFormData, form, pageType } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    const {flightId, wakeFlowLevel, auType, airlineType, missionType,
            task, organization, ability, aircraftType,
        } = schemeFormData
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm  || isDisabledPageType;
    // 表单初始化默认值
    let initialValues = {
        // 包含-航班号
        flightId: isValidVariable(flightId) ? flightId.split(';') : [],
        // 包含-尾流类型
        wakeFlowLevel: isValidVariable(wakeFlowLevel) ? wakeFlowLevel.split(';') : [],
        // 包含-运营人
        auType: isValidVariable(auType) ? auType.split(';') : [],
        // 包含-航班类型
        airlineType: isValidVariable(airlineType) ? airlineType.split(';') : [],
        // 包含-客货类型
        missionType: isValidVariable(missionType) ? missionType.split(';') : [],
        // 包含-任务类型
        task: isValidVariable(task) ? task.split(';') : [],
        // 包含-军民航
        organization: isValidVariable(organization) ? organization.split(';') : [],
        // 包含-限制资质
        ability: isValidVariable(ability) ? ability.split(';') : [],
        // 包含-受控机型
        aircraftType: isValidVariable(aircraftType) ? aircraftType.split(';') : [],
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);
    return (
        <Form
            form={form}
            initialValues={initialValues}
        >
            <Card className="inner-card" title={props.title} size="">
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            name="flightId"
                            label="航班号"
                        >
                            <Select
                                disabled={disabled}
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder=""
                                open={false}
                                onChange={(val) => (console.log(val))}
                                className="text-uppercase"
                                allowClear={true}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="wakeFlowLevel"
                            label="尾流类型"
                        >
                            <Checkbox.Group options={wakeFlowLevelOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="auType"
                            label="运营人"
                        >
                            <Checkbox.Group options={auTypeOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="airlineType"
                            label="航班类型"
                        >
                            <Checkbox.Group options={airlineTypeOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="missionType"
                            label="客货类型"
                        >
                            <Checkbox.Group options={missionTypeOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="task"
                            label="任务类型"
                        >
                            <Checkbox.Group options={taskOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="organization"
                            label="军民航"
                        >
                            <Checkbox.Group options={organizationOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="ability"
                            label="限制资质"
                        >
                            <Checkbox.Group options={abilityOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="aircraftType"
                            label="受控机型"
                        >
                            <Select
                                disabled={disabled}
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder=""
                                open={false}
                                className="text-uppercase"
                                allowClear={true}
                            >

                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={24}>
                    <Form.Item
                        name="flowControlAltitude"
                        label="受控高度"
                    >
                        <Select
                            disabled={ disabled }
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder=""
                            open={ false }
                            className="text-uppercase"
                            allowClear={ true }
                        >

                        </Select>
                    </Form.Item>
                </Col> */}
                </Row>

            </Card>


        </Form>
    )
}

export default inject("schemeFormData",)(observer(TacticLimitedFlightForm));
