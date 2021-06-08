import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";

//方案名称表单
function TacticTemplateNameForm(props) {
    const { form } = props;
    // 表单初始化默认值
    let initialValues = {
        templateName: "",
    }

    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    name="templateName"
                    label="模板名称"
                    required={true}
                    rules={[
                        { required: true },
                        {
                            whitespace: true,
                        }]}
                >
                    <Input onBlur={(e) => { }} allowClear={true} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticTemplateNameForm));
