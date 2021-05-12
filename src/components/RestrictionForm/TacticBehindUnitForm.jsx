import React, { Fragment, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";

//方案后序单元表单
function TacticBehindUnitForm(props) {

    const { schemeFormData, form } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    const behindUnit = schemeFormData.behindUnit;
    //方案交通流录入方式 shortcut:快捷录入  custom:自定义
    const inputMethod = schemeFormData.inputMethod || "custom";
    // 方案限制方式
    const restrictionMode = schemeFormData.restrictionMode || "";

    let isHide = false;
    if(restrictionMode !=="CT" && inputMethod ==="shortcut"){
        isHide = true;
    }
    // 表单初始化默认值
    let initialValues = {
        behindUnit,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName,inputMethod]);
    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    name="behindUnit"
                    label="后序单元"
                    className={isHide ? "hidden-form-item" : ""}
                >
                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticBehindUnitForm));
