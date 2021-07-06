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
    }, [tacticName, originRoute]);

    
    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
                className="origin-routes-form"
            >
                <Form.Item
                    name="originRoute"
                    extra={originRouteField.extra}
                    validateStatus={originRouteField.validateStatus}
                    label="原航路"
                    validateTrigger={['onBlur']}
                    
                    rules={[
                        // { required: true },
                        ({ getFieldValue }) => validateOriginRouteFormat(getFieldValue),
                    ]}
                >
                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticOriginRouteForm));
