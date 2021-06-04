import React, { Fragment, useEffect } from 'react'
import { Form, Row, Col, Input } from 'antd'
import { inject, observer } from "mobx-react";

//方案基准单元表单
function TacticAlterRouteForm(props) {


    const { schemeFormData, form, alterRoutesFieldData, validateSingleRouteFormat } = props;
    
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 备选航路数据
    const alterRoutesData = schemeFormData.alterRoutesData;
    // 表单初始化默认值
    let initialValues = getInitialFieldValue();

    function getInitialFieldValue() {
        let obj = {};
        for(let i=0; i< alterRoutesFieldData.length; i++){
            let field = alterRoutesFieldData[i];
            let name = field.name;
            // 从校验结果集合中查找与此表单匹配的项:遍历校验结果每项的paramIndex值(传递参数时的数字), 当alterRoute+paramIndex 与当前表单name相同则匹配
            let fieldData = alterRoutesData.find(element => `alterRoute${element.paramIndex}` === name) || {};
            let val = fieldData.routeStr || ""
            obj[name] = val;
        }
        return obj;
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
                className="alter-routes-form"
            >
                {alterRoutesFieldData.map((item, index) => {
                    return (
                        <Row gutter={24} key={item.name}>
                            <Col span={8} className="">
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    {
                                    ...item
                                    }
                                    label={`备选航路${index + 1}`}
                                    validateTrigger={['onBlur']}
                                    // hasFeedback
                                    rules={[
                                        ({ getFieldValue }) => validateSingleRouteFormat(getFieldValue),
                                    ]}
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8} className="">
                            </Col>
                        </Row>
                    )
                })}
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticAlterRouteForm));
