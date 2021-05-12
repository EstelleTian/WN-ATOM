import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Row, Col, Select } from 'antd'
import { inject, observer } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';
import { REGEXP } from 'utils/regExpUtil'
const { Option } = Select;


//方案措施信息表单
function TacticMeasureForm(props) {

    const restrictionModeOptions = [
        { "key": "AFP", "text": "AFP" },
        { "key": "MIT", "text": "MIT" },
        { "key": "CT", "text": "改航" },
        { "key": "GS", "text": "GS" },
        // {"key":"GDP", "text": "GDP"},
        // {"key":"AS", "text": "指定时隙"},
        // {"key":"BREQ", "text": "上客申请"},
        // {"key":"REQ", "text": "开车申请"},
        // {"key":"TC", "text": "总量控制"},
        // {"key":"AH", "text": "空中等待"},
        // {"key":"AA", "text": "空域开闭限制"},
    ]



    const { schemeFormData, systemPage, form } = props;
    // 方案限制方式
    const restrictionMode = schemeFormData.restrictionMode || "";

    // AFP限制方式下限制数值
    const restrictionAFPValueSequence = schemeFormData.restrictionAFPValueSequence || ""
    // MIT限制方式下的限制数值
    const restrictionMITValue = schemeFormData.restrictionMITValue || "";

    // MIT限制方式下限制类型 T:时间 D:距离
    const restrictionMITValueUnit = schemeFormData.restrictionMITValueUnit || "";
    // MIT限制方式下时间类型的限制值
    const restrictionMITTimeValue = schemeFormData.restrictionMITTimeValue || "";
    // MIT限制下公里类型限制的速度值
    const distanceToTime = schemeFormData.distanceToTime || "";

    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 限制数值
    let restrictionModeValue = schemeFormData.restrictionModeValue || "";

    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);

    // 依据流控限制方式取流控限制数值方法
    const getRestrictionModeValue = () => {

        if (restrictionMode == "MIT") {
            return restrictionMITValue;
        } else if (restrictionMode == "AFP") {
            return restrictionAFPValueSequence;
        }
    };

    // 表单初始化默认值
    let initialValues = {
        restrictionMode,
        restrictionMITValueUnit,
        restrictionModeValue: isValidVariable(restrictionModeValue) ? restrictionModeValue : getRestrictionModeValue(),
        restrictionMITTimeValue,
        distanceToTime
    }

    /* 
    * MIT限制类型下切换限制模式变更
    *
    */
    const handleRestrictionMITValueUnitChange = (modeType) => {
        schemeFormData.updateTacticRestrictionMITValueUnit(modeType);
        updateDistanceToTimeValueChange(modeType);        
    };

    //更新限制方式
    const handleRestrictionModeChange = (mode) => {
        schemeFormData.updateTacticRestrictionMode(mode);

    };

    const updateDistanceToTimeValueChange = (mode) => {
        // 若限制类型为MIT
        if (restrictionMode === 'MIT' && mode === 'D') {
            props.updateDistanceToTimeValue();
        }
    }

    // 绘制MIT限制类型下限制数值表单
    const drawMITModeValue = () => {
        return (
            <Form.Item
                label="限制值"
                required={true}
                className="MIT-mode-value-unit-form-compact"
            >
                <Form.Item
                    name="restrictionMITValueUnit"
                    className="MIT-value-unit"
                >
                    <Select onChange={handleRestrictionMITValueUnitChange} disabled={props.disabledForm} >
                        <Option key="T">分钟/架</Option>
                        <Option key="D">公里/架</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label=""
                    required={true}
                    name="restrictionModeValue"
                    className="value-item"
                    rules={[
                        {
                            required: true,
                            message: '请输入限制值'
                        },
                        {
                            type: 'string',
                            pattern: REGEXP.INTEGER0_999,
                            message: '请输入0~999范围内的整数',
                        },
                    ]}
                >
                    <Input
                        style={{ width: 70, marginLeft: 5 }}
                        onChange={props.updateMITTimeValueChange}
                        // onBlur={updateMITTimeValueChange}
                        disabled={props.disabledForm}
                    />
                </Form.Item>
                <Form.Item
                    label=""
                    className={restrictionMITValueUnit === "D" ? "" : "hidden"}
                >
                    <div className="symbol">/</div>
                </Form.Item>
                <Form.Item
                    label=""
                    required={true}
                    name="distanceToTime"
                    className={restrictionMITValueUnit === "D" ? "" : "hidden"}
                    rules={[
                        {
                            required: true,
                            message: '请输入速度值'
                        },
                        {
                            type: 'string',
                            pattern: REGEXP.INTEGER0_999,
                            message: '请输入0~999范围内的整数',
                        },
                    ]}
                >
                    <Input
                        style={{ width: 50 }}
                        disabled={true}
                    />
                </Form.Item>
                <Form.Item
                    label=""
                    className={restrictionMITValueUnit === "D" ? "" : "hidden"}
                >
                    <div className="symbol">≈</div>
                </Form.Item>
                <Form.Item
                    label=""
                    className={restrictionMITValueUnit === "D" ? "" : "hidden"}
                    name="restrictionMITTimeValue"
                >
                    <Input
                        style={{ width: 50 }}
                        disabled={true}
                    />
                </Form.Item>
                <Form.Item
                    label=""
                    className={restrictionMITValueUnit === "D" ? "" : "hidden"}
                >
                    <div className="">分钟/架</div>
                </Form.Item>

            </Form.Item>
        )
    }

    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Row gutter={24} >
                    <Col span={8}>
                        <Form.Item
                            name="restrictionMode"
                            label="限制方式"
                            required={true}
                            rules={[{ required: true, message: '请选择限制方式' }]}
                        >
                            <Select style={{ width: 120 }} onChange={handleRestrictionModeChange} disabled={props.disabledForm} >
                                {restrictionModeOptions.map(mode => (
                                    <Option key={mode.key}>{mode.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        {
                            restrictionMode === "MIT" ? drawMITModeValue() : ""
                        }
                        {
                            restrictionMode === "AFP" ?
                                <Form.Item
                                    label="限制值"
                                    required={true}
                                    name="restrictionModeValue"
                                    className="value-item"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入限制值'
                                        },
                                        {
                                            type: 'string',
                                            pattern: REGEXP.INTEGER0_999,
                                            message: '请输入0~999范围内的整数',
                                        },
                                    ]}
                                >
                                    <Input
                                        style={{ width: 150 }}
                                        disabled={props.disabledForm}
                                        // onChange={handleRestrictionModeValueChange}
                                        addonAfter="架"
                                    />
                                </Form.Item> : ""
                        }
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
export default inject("schemeFormData", "systemPage")(observer(TacticMeasureForm));
