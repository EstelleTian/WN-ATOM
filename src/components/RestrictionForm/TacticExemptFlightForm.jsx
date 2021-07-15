import React, { useEffect } from 'react'
import { Card, Checkbox, Col,  Form,  Select, Row, } from "antd";
import { isValidVariable } from 'utils/basic-verify'
import { SchemeFormUtil } from 'utils/scheme-form-util'


import { inject, observer } from "mobx-react";
//尾流类型选项
const exemptionWakeFlowLevelOptions = [
    { label: 'G', value: 'G' },
    { label: 'H', value: 'H' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
];
//运营人
const exemptionAuTypeOptions = [
    { label: '内机', value: 'DOMESTIC_AU' },
    { label: '外机', value: 'FOREIGN_AU' },
    { label: '台湾机', value: 'TAIWAN_AU' },
    { label: '港澳机', value: 'HKANDMC_AU' },
    { label: '未知', value: 'UNKNOWN' },
]
//航班类型选项
const exemptionAirlineTypeOptions = [
    { label: '国内', value: 'DOMESTIC_AIRLINE' },
    { label: '国际', value: 'INTERNATIONAL_AIRLINE' },
    { label: '台湾地区', value: 'TAIWAN_AIRLINE' },
    { label: '港澳特区', value: 'HKANDMC_AIRLINE' },
    { label: '飞越', value: 'OVERFLY_AIRLINE' },
    { label: '未知', value: 'UNKNOWN' },

];
//客货类型选项
const exemptionMissionTypeOptions = [
    { label: '客班', value: 'AIRLINE_MISSION' },
    { label: '货班', value: 'CARGO_MISSION' },
    { label: '未知', value: 'UNKNOWN' },
];
//任务类型选项
const exemptionTaskOptions = [
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
const exemptionOrganizationOptions = [
    { label: '军航', value: 'MILITARY' },
    { label: '民航', value: 'CIVIL' },
    { label: '未知', value: 'UNKNOWN' },
];
//限制资质选项
const exemptionAbilityOptions = [
    { label: 'II类', value: 'CAT2' }
];

//不包含航班表单
function TacticExemptFlightForm(props) {

    const { schemeFormData, form, pageType } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    const {exemptionFlightId, exemptionWakeFlowLevel, exemptionAirlineType, exemptionAuType, exemptionMissionType,
        exemptionTask, exemptionOrganization, exemptionAbility, exemptionAircraftType,} = schemeFormData;
    // 表单初始化默认值
    let initialValues = {
        // 不包含-航班号
        exemptionFlightId: isValidVariable(exemptionFlightId) ? exemptionFlightId.split(';') : [],
        // 不包含-尾流类型
        exemptionWakeFlowLevel: isValidVariable(exemptionWakeFlowLevel) ? exemptionWakeFlowLevel.split(';') : [],
        // 不包含-航班类型
        exemptionAirlineType: isValidVariable(exemptionAirlineType) ? exemptionAirlineType.split(';') : [],
        // 不包含-运营人
        exemptionAuType: isValidVariable(exemptionAuType) ? exemptionAuType.split(';') : [],
        // 不包含-客货类型
        exemptionMissionType: isValidVariable(exemptionMissionType) ? exemptionMissionType.split(';') : [],
        // 不包含-任务类型
        exemptionTask: isValidVariable(exemptionTask) ? exemptionTask.split(';') : [],
        // 不包含-军民航
        exemptionOrganization: isValidVariable(exemptionOrganization) ? exemptionOrganization.split(';') : [],
        // 不包含-限制资质
        exemptionAbility: isValidVariable(exemptionAbility) ? exemptionAbility.split(';') : [],
        // 不包含-受控机型
        exemptionAircraftType: isValidVariable(exemptionAircraftType) ? exemptionAircraftType.split(';') : [],
    }
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm  || isDisabledPageType;
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName,exemptionFlightId, exemptionWakeFlowLevel, exemptionAirlineType, exemptionAuType, exemptionMissionType,
        exemptionTask, exemptionOrganization, exemptionAbility, exemptionAircraftType,]);
    return (
        <Form
            form={form}
            labelAlign='left'
            initialValues={initialValues}
        >
            <Card className="inner-card exempt-flight-card" title={props.title} size="">
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            name="exemptionFlightId"
                            colon={false}
                            className="advanced-item"
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
                            name="exemptionWakeFlowLevel"
                            label="尾流类型"
                            colon={false}
                            className="advanced-item"
                        >
                            <Checkbox.Group options={exemptionWakeFlowLevelOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="exemptionAuType"
                            label="运营人"
                            colon={false}
                            className="advanced-item"
                        >
                            <Checkbox.Group options={exemptionAuTypeOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="exemptionAirlineType"
                            label="航班类型"
                            colon={false}
                            className="advanced-item"
                        >
                            <Checkbox.Group options={exemptionAirlineTypeOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="exemptionMissionType"
                            label="客货类型"
                            colon={false}
                            className="advanced-item"
                        >
                            <Checkbox.Group options={exemptionMissionTypeOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="exemptionTask"
                            label="任务类型"
                            colon={false}
                            className="advanced-item"
                        >
                            <Checkbox.Group options={exemptionTaskOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="exemptionOrganization"
                            label="军民航"
                            colon={false}
                            className="advanced-item"
                        >
                            <Checkbox.Group options={exemptionOrganizationOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="exemptionAbility"
                            label="限制资质"
                            colon={false}
                            className="advanced-item"
                        >
                            <Checkbox.Group options={exemptionAbilityOptions} disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="exemptionAircraftType"
                            label="受控机型"
                            colon={false}
                            className="advanced-item"
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
                        name="exemptAltitude"
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

export default inject("schemeFormData",)(observer(TacticExemptFlightForm));
