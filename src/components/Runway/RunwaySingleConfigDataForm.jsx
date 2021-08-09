import React, { useEffect, useState, Fragment } from 'react'
import { Checkbox, Radio, Form, Input, Row, Col, } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';
import { REGEXP } from "utils/regExpUtil";
import { isValidObject, isValidVariable } from 'utils/basic-verify'



//单条逻辑跑道配置表单
function RunwaySingleConfigDataForm(props) {

    const runwayData = props.runwayData || {};
    const statusOptions = props.statusOptions || [];
    const runwayPointOptions = props.runwayPointOptions || [];
    // form表单
    const form = props.form || {};
    // stores 数据
    const storesData = props.storesData;
    // 所有跑道的状态勾选数据
    const ruwayStatusSelectedData = storesData.ruwayStatusSelectedData || {};

    // 跑道id
    const id = runwayData.id || "";
    // 跑道名称
    const name = runwayData.rwName || "";
    // 逻辑跑道A名称
    const logicRWNameA = runwayData.logicRWNameA || "";
    // 逻辑跑道B名称
    const logicRWNameB = runwayData.logicRWNameB || "";

    // 跑道状态 0:关闭  1:起飞  2:起降 -1:降落
    let isDepRW = isValidVariable(runwayData.isDepRW) ? runwayData.isDepRW : "";
    // 本条跑道状态勾选数值
    let statusSelectedData = ruwayStatusSelectedData[id];
    // 本条跑道状态勾选数值是否包含起飞选项
    let isIncludesDep = statusSelectedData.includes("1")

    // 获取当前跑道中选中的逻辑跑道名称 
    let selectedLogicRWName = runwayData.logicRWDef || "";
    if (isValidObject(form)) {
        // selectedLogicRWName = form.getFieldValue(`selectedLogic_${id}`)
    }
    // 选中的逻辑跑道名
    let [selectedLogic, setSelectedLogic] = useState(selectedLogicRWName);




    // 更新表单中指定跑道的选中的逻辑跑道名称
    const handleSingleRunwayLogicValChange = (e, runwayId) => {
        // 获取表单中该字段数值
        let selectedLogicRWName = form.getFieldValue(`selectedLogic_${runwayId}`);
        // 更新selectedLogic
        setSelectedLogic(selectedLogicRWName);
    }

    // 状态复选框勾选状态变更
    function onStatusCheckboxChange(checkedValues, runwayId) {
        // 调用stores数据更新方法
        storesData.updateSingleRunwayStatusChange(checkedValues, runwayId);
    }
    // 走廊口复选框勾选状态变更
    function onRunwayPointCheckboxChange(checkedValues, runwayId) {
        // 调用stores数据更新方法
        storesData.updateSingleRunwayPointChange(checkedValues, runwayId)
    }

    // 检查所有跑道勾选的状态数值中是否包括起飞选项
    const checkIsIncludesIncludesDepStatus = () => {
        for (let i in ruwayStatusSelectedData) {
            let singleRunwayStatusSelectedData = ruwayStatusSelectedData[i];
            if (singleRunwayStatusSelectedData.includes("1")) {
                return true;
            }
        }
        return false;
    }

    /**
     * 校验结束日期是否完整
     * */
    const validateRuwayStatusSelected = (getFieldValue) => {
        const validator = (rules, value) => {
            if (value.length > 0) {
                let isIncludesDep = checkIsIncludesIncludesDepStatus();
                if (!isIncludesDep) {
                    return Promise.reject('至少一条跑道用于起飞');
                }
                return Promise.resolve();
            } else {
                return Promise.resolve();
            }

        };
        return ({
            validator: validator,
        })
    };


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
                        rules={[{ required: true, message: '请选择状态' }]}
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
                        rules={[
                            { required: true, message: '请选择状态' },
                            ({ getFieldValue }) => validateRuwayStatusSelected(getFieldValue)
                        ]}
                    >
                        <Checkbox.Group options={statusOptions} onChange={(checkedValues) => { onStatusCheckboxChange(checkedValues, id) }} />
                    </Form.Item>
                </Col>
                {
                    isIncludesDep ?
                        <Fragment>
                            <Col span={24}>
                                <Form.Item
                                    name={`runwayPoint_${id}`}
                                    label="走廊口"
                                    required={true}
                                    rules={[{ required: true, message: '请至少选择一个走廊口' }]}
                                >
                                    <Checkbox.Group options={runwayPointOptions} onChange={(checkedValues) => { onRunwayPointCheckboxChange(checkedValues, id) }} />
                                </Form.Item>
                            </Col>
                            {
                                (selectedLogic === logicRWNameA) ?
                                    <Fragment>
                                        <Col span={24}>
                                            <Form.Item
                                                shouldUpdate
                                                name={`interval_${id}_${logicRWNameA}`}
                                                label={`${logicRWNameA}起飞间隔`}
                                                required={true}
                                                rules={[
                                                    { required: true },
                                                    {
                                                        pattern: REGEXP.NUMBER1_99,
                                                        message: "请输入1~99.9的整数或小数,小数仅支持一位小数",
                                                    },
                                                ]}
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
                                                rules={[
                                                    { required: true },
                                                    {
                                                        pattern: REGEXP.INTEGER1_99,
                                                        message: "请输入1~99的整数",
                                                    },
                                                ]}
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
                                (selectedLogic === logicRWNameB) ?
                                    <Fragment>
                                        <Col span={24}>
                                            <Form.Item
                                                shouldUpdate
                                                name={`interval_${id}_${logicRWNameB}`}
                                                label={`${logicRWNameB}起飞间隔`}
                                                required={true}
                                                rules={[
                                                    { required: true },
                                                    {
                                                        pattern: REGEXP.NUMBER1_99,
                                                        message: "请输入1~99.9的整数或小数,小数仅支持一位小数",
                                                    },
                                                ]}
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
                                                rules={[
                                                    { required: true },
                                                    {
                                                        pattern: REGEXP.INTEGER1_99,
                                                        message: "请输入1~99的整数",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    style={{ width: 150 }}
                                                    addonAfter="分钟"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Fragment> : ""
                            }
                        </Fragment>
                        : ""
                }
            </Row>
        </Form.Item>
    )
}
export default RunwaySingleConfigDataForm