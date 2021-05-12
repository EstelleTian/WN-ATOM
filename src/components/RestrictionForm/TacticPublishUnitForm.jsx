import React, { Fragment, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';

//方案发布单位表单
function TacticPublishUnitForm(props) {

    const { schemeFormData, systemPage, form } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    const tacticPublishUnit = schemeFormData.tacticPublishUnit;
    const tacticPublishUnitCH = schemeFormData.tacticPublishUnitCH;
    // 用户信息
    const user = systemPage.user || {};
    // 用户所属单位
    let userUnit = user.unit || "";
    // 用户所属单位
    let userUnitCn = user.unitCn || "";
    if(isValidVariable(userUnit) && !isValidVariable(tacticPublishUnit)){
        schemeFormData.updateTacticPublishUnit(userUnit)
    }
    if(isValidVariable(userUnitCn) && !isValidVariable(tacticPublishUnitCH)){
        schemeFormData.updateTacticPublishUnitCH(userUnitCn)
    }
    //用户id发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [user.id]);
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);

    // 表单初始化默认值
    let initialValues = {
        tacticPublishUnit,
        tacticPublishUnitCH,
    }
    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    hidden
                    name="tacticPublishUnit"
                    label="发布单位"
                >
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item
                    name="tacticPublishUnitCH"
                    label="发布单位"
                >
                    <Input disabled={true} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}
export default inject("schemeFormData","systemPage")(observer(TacticPublishUnitForm));
