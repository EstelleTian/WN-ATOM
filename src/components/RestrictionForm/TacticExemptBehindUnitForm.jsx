import React, { Fragment, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";
import { REGEXP } from 'utils/regExpUtil'
import { SchemeFormUtil } from 'utils/scheme-form-util'



//方案豁免后序表单
function TacticExemptBehindUnitForm(props) {

    const { schemeFormData, form, pageType } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 豁免后序
    const exemptBehindUnit = schemeFormData.exemptBehindUnit;
    //方案交通流录入方式 SHORTCUT:快捷录入  CUSTOM:自定义
    const inputMethod = schemeFormData.inputMethod;
    // 方案限制方式
    const restrictionMode = schemeFormData.restrictionMode || "";

    let isHide = false;
    if(restrictionMode !=="CR" && inputMethod ===SchemeFormUtil.INPUTMETHOD_SHORTCUT){
        isHide = true;
    }
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm || isDisabledPageType;
    // 表单初始化默认值
    let initialValues = {
        exemptBehindUnit,
    }
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName, inputMethod, exemptBehindUnit]);
    return (
        <Fragment>
            <Form
                form={form}
                labelAlign='left'
                initialValues={initialValues}
                className="multi-col-row-form"
            >
                <Form.Item
                    className={isHide ? "hidden-form-item advanced-item" : "advanced-item"}
                    name="exemptBehindUnit"
                    colon={false}
                    label="豁免后序"
                    rules={[
                        {
                            whitespace: true,
                        },
                        {
                            type: 'string',
                            pattern: REGEXP.COMBINEDCHARSET,
                            message: '请输入正确格式的豁免后序单元',
                        },
                    ]}
                >
                    <Input placeholder="选填项，只可录入英文半角字母、数字、问号、分号、逗号、加号、中划线、空格" allowClear={true} className="text-uppercase" disabled={disabled} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticExemptBehindUnitForm));
