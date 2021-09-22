import React, { Fragment,useState, useEffect } from 'react'
import { Form, Select  } from 'antd'
import { inject, observer } from "mobx-react";

//方案来源表单
function TacticPrimaryForwardForm(props) {

    const {schemeFormData, form } = props;
    const [whether, setWhether] = useState(false);
    const reasonOptions = [
        { "key": "NC", "text": "华北" },
        { "key": "EC", "text": "华东" },
        { "key": "NE", "text": "东北" },
        { "key": "CS", "text": "中南" },
        { "key": "SW", "text": "西南" },
        { "key": "NW", "text": "西北" },
        { "key": "XJ", "text": "新疆" },
    ]
    // // 方案基础信息
    const handleChange = (value) => {
        schemeFormData.updatePrimaryUnit(value)
    }
    // const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};=
    const tacticPrimaryForward = schemeFormData.tacticPrimaryForward;
    let tacticPrimaryUnit = schemeFormData.tacticPrimaryUnit ;
    // console.log(tacticPrimaryForward);
    const isWhether = (code)=>{
        console.log(29,code);
        if (code == '100') {
            setWhether(true)
            tacticPrimaryUnit="NW";
        }else{
            setWhether(false)
        }
    }
    useEffect(()=>{
        isWhether(tacticPrimaryForward)
        console.log(39,tacticPrimaryUnit);
    },[])
    useEffect(()=>{
        form.resetFields();
        isWhether(tacticPrimaryForward)
    },[tacticPrimaryUnit])
    useEffect(()=>{
        form.resetFields();
        isWhether(tacticPrimaryForward)
    },[tacticPrimaryForward])
    let initialValues = {
        tacticPrimaryUnit,
    }
    return (
        <Fragment>
            <Form
                form={form}
                labelAlign='left'
                initialValues={initialValues}
            >
                <Form.Item
                    colon={false}
                    className="advanced-item"
                    name="tacticPrimaryUnit"
                    label="原发单位"
                    required={true}
                    rules={[{ required: true,message: "请输入限制值" }]}
                >
                     <Select style={{ width: 120 }} disabled={whether} onChange={handleChange}>
                        {reasonOptions.map(mode => (
                            <Option key={mode.key}>{mode.text}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticPrimaryForwardForm));
