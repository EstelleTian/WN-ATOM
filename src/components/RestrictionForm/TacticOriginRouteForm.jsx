import React, { Fragment, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";
import { request } from 'utils/request'
import { isValidObject } from 'utils/basic-verify'



//方案基准单元表单
function TacticOriginRouteForm(props) {
    const { schemeFormData, form, validateOriginRouteFormat, originRouteField } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm || isDisabledPageType;
    // 方案限制方式
    const restrictionMode = schemeFormData.restrictionMode || "";
    const originRouteData = schemeFormData.originRouteData;
    const originRoute = originRouteData.routeStr || "";

    
    // 表单初始化默认值
    let initialValues = {
        originRoute,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName, originRoute, restrictionMode]);

    
    return (
        <Fragment>
            <Form
                form={form}
                labelAlign='left'
                initialValues={initialValues}
                className="origin-routes-form multi-col-row-form"
            >
                <Form.Item
                    name="originRoute"
                    help={originRouteField.help}
                    validateStatus={originRouteField.validateStatus}
                    colon={false}
                    label="原航路"
                    validateTrigger={['onBlur']}
                    className="advanced-item"
                    rules={[
                        // { required: true },
                        ({ getFieldValue }) => validateOriginRouteFormat(getFieldValue),
                    ]}
                >
                    <Input allowClear={true} className="text-uppercase" disabled={disabled} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticOriginRouteForm));
