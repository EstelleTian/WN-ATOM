import React, { useEffect, useState, Fragment } from 'react'
import { Checkbox, Radio, Form, Input, Row, Col, } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';

import { isValidObject, isValidVariable } from 'utils/basic-verify'



//方案信息
function RunwaySingleDataForm(props) {

    const runwayData = props.runwayData || {};
    const statusOptions = props.statusOptions || [];
    const runwayPointOptions = props.runwayPointOptions || [];

    const form = props.form || {};

    // 跑道id
    const id = runwayData.id || "";
    // 跑道名称
    const name = runwayData.rwName || "";
    // 逻辑跑道A名称
    const logicRWNameA = runwayData.logicRWNameA || "";
    // 逻辑跑道B名称
    const logicRWNameB = runwayData.logicRWNameB || "";
    // 获取当前跑道中选中的逻辑跑道名称 
    let selectedLogicRWName = "";
    if (isValidObject(form)) {
        selectedLogicRWName = form.getFieldValue(`selectedLogic_${id}`)
    }
    let [selectedLogic, setSelectedLogic] = useState(selectedLogicRWName);
    // 记录状态复选框勾选值
    let statusValues = [];
    if (isValidObject(form)) {
        statusValues = form.getFieldValue(`isDepRW_${id}`)
    }

    // 更新表单中指定跑道的选中的逻辑跑道名称
    const handleSingleRunwayLogicValChange = (e, runwayId) => {
        // 获取表单中该字段数值
        let selectedLogicRWName = form.getFieldValue(`selectedLogic_${runwayId}`);
        // const val = e.target.value;
        // let field = `selectedLogic_${runwayId}`
        // data[field] = val;
        // 更新表单中指定跑道的选中的逻辑跑道名称
        // form.setFieldsValue(data);
        // 更新selectedLogic
        setSelectedLogic(selectedLogicRWName);
    }

    // 获取最近一次变更的状态复选框操作信息
    const getChangeCheckbox = (checkedValues, oldValues) => {
        // 是否为选中
        let checked = false;
        // 复选框的值
        let value = "";
        if (checkedValues.length > oldValues.length) {
            checked = true;
            value = checkedValues.filter((item) => (oldValues.indexOf(item) === -1))[0]
        } else {
            checked = false;
            value = oldValues.filter((item) => (checkedValues.indexOf(item) === -1))[0]
        }
        return {
            value,
            checked
        }
    }


    // 状态复选框勾选状态变更
    function onStatusCheckboxChange(checkedValues, runwayId) {
        let data = {};
        let field = `isDepRW_${runwayId}`
        let newValue = [];
        let checkboxInfo = getChangeCheckbox(checkedValues, statusValues);
        const { checked, value } = checkboxInfo;
        // 若为取消勾选则不对表单作任何操作
        if (!checked) {
            // 更新 statusValues值,记录状态复选框勾选值
            statusValues = checkedValues;
            return
        }
        if (checked && value === "0") {
            // 勾选的关闭复选框
            newValue = ["0"];
        } else if (checked && (value === "1" || value === "-1")) {
            // 勾选的起飞或降落复选框
            newValue = checkedValues.filter((item) => (item !== "0"));
        }
        data[field] = newValue;
        // 更新表单中状态复选框选中状态
        form.setFieldsValue(data);
        // 更新 statusValues值,记录状态复选框勾选值
        statusValues = newValue;
    }
    // 走廊口复选框勾选状态变更
    function onRunwayPointCheckboxChange(checkedValues, runwayId) {
        // let data = {};
        // let field = `isDepRW_${runwayId}`
        // let newValue = [];
        // let checkboxInfo = getChangeCheckbox(checkedValues, statusValues);
        // const { checked, value } = checkboxInfo;
        // // 若为取消勾选则不对表单作任何操作
        // if (!checked) {
        //     // 更新 statusValues值,记录状态复选框勾选值
        //     statusValues = checkedValues;
        //     return
        // }
        // if (checked && value === "0") {
        //     // 勾选的关闭复选框
        //     newValue = ["0"];
        // } else if (checked && (value === "1" || value === "-1")) {
        //     // 勾选的起飞或降落复选框
        //     newValue = checkedValues.filter((item) => (item !== "0"));
        // }
        // data[field] = newValue;
        // // 更新表单中状态复选框选中状态
        // form.setFieldsValue(data);
        // // 更新 statusValues值,记录状态复选框勾选值
        // statusValues = newValue;
    }


    return (
        <Form.Item
            key={id}
            label={name}
        >
            <Row gutter={24} >
                <Col span={24}>
                    <Form.Item
                        name={`selectedLogic_${id}`}
                        label="默认方向"
                        required={true}
                        rules={[{ required: true }]}
                    >
                        <Radio.Group buttonStyle="solid" onChange={(e) => { handleSingleRunwayLogicValChange(e, id) }} >
                            <Radio.Button value={logicRWNameA}>{logicRWNameA}</Radio.Button>
                            <Radio.Button value={logicRWNameB}>{logicRWNameB}</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name={`isDepRW_${id}`}
                        label="状态"
                        required={true}
                        rules={[{ required: true }]}
                    >
                        <Checkbox.Group options={statusOptions} onChange={(checkedValues) => { onStatusCheckboxChange(checkedValues, id) }} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name={`runwayPoint_${id}`}
                        label="走廊口"
                        required={true}
                        rules={[{ required: true, message: '请至少选择一个走廊口' }]}
                    >
                        <Checkbox.Group options={runwayPointOptions} onChange={(checkedValues) => { onRunwayPointCheckboxChange(checkedValues, id) }}  />
                    </Form.Item>
                </Col>
                {
                    (selectedLogicRWName === logicRWNameA) ?
                        <Fragment>
                            <Col span={24}>
                                <Form.Item
                                    shouldUpdate
                                    name={`interval_${id}_${logicRWNameA}`}
                                    label={`${logicRWNameA}起飞间隔`}
                                    required={true}
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        style={{ width: 150 }}
                                        addonAfter="分钟"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    shouldUpdate
                                    name={`taxi_${id}_${logicRWNameA}`}
                                    label={`${logicRWNameA}滑行时间`}
                                    required={true}
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        style={{ width: 150 }}
                                        addonAfter="分钟"
                                    />
                                </Form.Item>
                            </Col>
                        </Fragment> : ""
                }
                {
                    (selectedLogicRWName === logicRWNameB) ?
                        <Fragment>
                            <Col span={24}>
                                <Form.Item
                                    shouldUpdate
                                    name={`interval_${id}_${logicRWNameB}`}
                                    label={`${logicRWNameB}起飞间隔`}
                                    required={true}
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        style={{ width: 150 }}
                                        addonAfter="分钟"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    shouldUpdate
                                    name={`taxi_${id}_${logicRWNameB}`}
                                    label={`${logicRWNameB}滑行时间`}
                                    required={true}
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        style={{ width: 150 }}
                                        addonAfter="分钟"
                                    />
                                </Form.Item>
                            </Col>
                        </Fragment> : ""
                }
            </Row>
        </Form.Item>
    )
}

export default RunwaySingleDataForm