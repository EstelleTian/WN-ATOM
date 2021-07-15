import React, { Fragment,useState, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";

//方案名称表单
function TacticNameForm(props) {

    const { schemeFormData, form } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticNameStr = basicTacticInfo.tacticName || "";
    const tacticName = schemeFormData.tacticName;
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticNameStr]);
    // 表单初始化默认值
    let initialValues = {
        tacticName,
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
                    name="tacticName"
                    label="方案名称"
                    required={true}
                    rules={[{ required: true }]}
                >
                    <Input onBlur={(e) => {  }} allowClear={true} disabled={props.disabledForm} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticNameForm));
