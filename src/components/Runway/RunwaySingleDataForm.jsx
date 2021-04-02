import React, { useEffect, useState, Fragment } from 'react'
import { Space, Button, Radio, DatePicker, Card, Form, Input, Row, Col, Select, Tooltip,Tag } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';

import ExemptCard from './ExemptCard'
import LimitedCard from './LimitedCard'
import moment from 'moment'
import { formatTimeString, parseFullTime, isValidObject, isValidVariable } from '../../utils/basic-verify'
import { REGEXP } from '../../utils/regExpUtil'

const { Option } = Select;


//方案信息
function StaticInfoCard(props) {


    

    const runwayData = props.runwayData || "";
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

    let selectedLogicRWName = form.getFieldValue(`selectedLogic_${id}`)
    if (isValidObject(form)) {
        selectedLogicRWName = form.getFieldValue(`selectedLogic_${id}`)
    }
    let [selectedLogic, setSelectedLogic] = useState(selectedLogicRWName)
     // 更新表单中指定跑道的选中的逻辑跑道名称
     const handleSingleRunwayLogicValChange = (e, runwayId) => {
        let data = {};
        const val = e.target.value;
        let field = `selectedLogic_${runwayId}`
        data[field] = val;
        // 更新表单中指定跑道的选中的逻辑跑道名称
        // form.setFieldsValue(data);

        setSelectedLogic(val)
        // const selectedLogicRWName = form.getFieldValue(`selectedLogic_${runwayId}`)
        // console.log(selectedLogicRWName)
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
                        <Checkbox.Group options={statusOptions} onChange={() => { }} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name={`runwayPoint_${id}`}
                        label="走廊口"
                        required={true}
                        rules={[{ required: true }]}
                    >
                        <Checkbox.Group options={runwayPointOptions} onChange={() => { }} />
                    </Form.Item>
                </Col>
                {
                    (selectedLogicRWName === logicRWNameA) ? <Fragment><Col span={24}>
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
                        </Col></Fragment> : ""
                }
                {
                    (selectedLogicRWName === logicRWNameB) ? <Fragment><Col span={24}>
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
                        </Col></Fragment> : ""
                }
            </Row>
        </Form.Item>
    )

}

export default StaticInfoCard