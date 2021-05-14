import React, { Fragment, useEffect } from 'react'
import { Form,  Radio } from 'antd'
import { inject, observer } from "mobx-react";

//方案模式表单
function TacticModeForm(props) {

    const { schemeFormData, form } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 方案模式
    const tacticMode = schemeFormData.tacticMode;
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);
    // 表单初始化默认值
    let initialValues = {
        tacticMode
    }

    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    name="tacticMode"
                    label="方案模式"
                >
                    <Radio.Group disabled={props.disabledForm} >
                        <Radio  value="100">普通模式</Radio>
                        <Radio  value="200">二类模式</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticModeForm));
