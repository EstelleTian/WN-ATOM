import React, { Fragment,useState, useEffect  } from 'react'
import { Form, Select } from 'antd'
import { inject, observer } from "mobx-react";
const { Option } = Select;


//方案原因表单
function TacticReasonForm(props) {
    // 下拉选择项
    const reasonOptions = [
        { "key": "AIRPORT", "text": "机场" },
        { "key": "MILITARY", "text": "军事活动" },
        { "key": "CONTROL", "text": "流量" },
        { "key": "WEATHER", "text": "天气" },
        { "key": "AIRLINE", "text": "航空公司" },
        { "key": "SCHEDULE", "text": "航班时刻" },
        { "key": "JOINT_INSPECTION", "text": "联检" },
        { "key": "OIL", "text": "油料" },
        { "key": "DEPART_SYSTEM", "text": "离港系统" },
        { "key": "PASSENGER", "text": "旅客" },
        { "key": "PUBLIC_SECURITY", "text": "公共安全" },
        { "key": "MAJOR_SECURITY_ACTIVITIES", "text": "重大保障活动" },
        { "key": "OTHER", "text": "其它" },
    ]
    
    const { schemeFormData, form } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 更改WEATHER来更换默认原因
    let flowControlReason = schemeFormData.flowControlReason || "WEATHER";
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName, flowControlReason]);
    // 表单初始化默认值
    let initialValues = {
        flowControlReason,
    }
    return (
        <Fragment>
            <Form
                form={form}
                labelAlign='left'
                initialValues={initialValues}
            >
                <Form.Item
                    name="flowControlReason"
                    className="advanced-item"
                    colon={false}
                    label="原因"
                >
                    <Select style={{ width: 120 }} disabled={props.disabledForm} >
                        {reasonOptions.map(mode => (
                            <Option key={mode.key}>{mode.text}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Fragment>
    )
}
export default inject("schemeFormData",)(observer(TacticReasonForm));
