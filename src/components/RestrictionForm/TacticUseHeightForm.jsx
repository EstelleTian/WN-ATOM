import React, { Fragment, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";
import { SchemeFormUtil } from 'utils/scheme-form-util'


//方案高度表单
function TacticUseHeightForm(props) {

    const { schemeFormData, form, pageType } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    const useHeight = schemeFormData.useHeight;
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm || isDisabledPageType;
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
                    <Input allowClear={true} className="text-uppercase" disabled={disabled} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticUseHeightForm));
