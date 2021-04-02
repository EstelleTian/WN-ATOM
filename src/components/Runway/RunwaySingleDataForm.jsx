import React, { useEffect, useState, Fragment } from 'react'
import { Checkbox, Radio, Form, Input, Row, Col, } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';

import { isValidObject, isValidVariable } from 'utils/basic-verify'



//方案信息
function RunwaySingleDataForm(props) {

    const runwayData = props.runwayData || {};
    const statusOptions = props.statusOptions || [];
    const runwayPointOptions = props.runwayPointOptions || [];
    const handleSingleRunwayLogicValChange = props.handleSingleRunwayLogicValChange;

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

    console.log(form.getFieldsValue())


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
                        <Checkbox.Group options={statusOptions} onChange={() => { }} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name={`runwayPoint_${id}`}
                        label="走廊口"
                        required={true}
                        rules={[{ required: true, message: '请至少选择一个走廊口' }]}
                    >
                        <Checkbox.Group options={runwayPointOptions} />
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