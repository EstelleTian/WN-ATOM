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
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName, useHeight]);
    return (
        <Fragment>
            <Form
                form={form}
                labelAlign='left'
                initialValues={initialValues}
            >
                <Form.Item
                    name="useHeight"
                    colon={false}
                    label="高度"
                    className="advanced-item"
                >
                    <Input allowClear={true} className="text-uppercase" disabled={disabled} />
                </Form.Item>
            </Form>
            {
                disabled ? "" :
                    <div className="ant-row">
                        <div className="ant-col ant-form-item-label"></div>
                        <div className="ant-col ant-form-item-control skeleton-item-control">
                        </div>
                    </div>
            }
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticUseHeightForm));
