import React, { Fragment, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";

//方案高度表单
function TacticUseHeightForm(props) {

    const { schemeFormData, form } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    const useHeight = schemeFormData.useHeight;
    // 表单初始化默认值
    let initialValues = {
        useHeight,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);
    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    name="useHeight"
                    label="高度"
                >
                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticUseHeightForm));
