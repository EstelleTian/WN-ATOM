import React, { useEffect, useState, Fragment } from 'react'
import "moment/locale/zh-cn"
import { Space, Button, Form, Input, Row, Col, Menu, Dropdown } from 'antd'
import { PlusOutlined, MinusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { request } from 'utils/request'

const { Search } = Input;

function DynamicFieldSet(props) {
    const [form] = Form.useForm();
    const initialFieldSet = props.dynamicRouteFieldSet;
    // 用于点击取消重置表单数据
    let [restField, setRestField] = useState(initialFieldSet);
    const fieldName = "extensionRoutes"
    // 保存按钮点击
    const onFinish = values => {
        const val = values[fieldName];
        props.updateDynamicRouteFieldSet(val)
        props.setRouteMenuVisible(false)
        console.log('Received values of form:', values);
    };
    useEffect(function () {
        form.resetFields();//重置，用以表单初始值赋值
    }, [restField]);
    
    // 关闭按钮事件
    // const handleClose = async () => {
    //     try {
    //         // 触发表单验证取表单数据
    //         const fieldData = await form.validateFields();
    //         console.log(fieldData)
    //         props.setRouteMenuVisible(false)
    //         setRestField([])
    //     } catch (errorInfo) {
    //         console.log('Failed:', errorInfo);
    //     }
    // };
    // 关闭按钮事件
    const handleClose = () => {
        props.setRouteMenuVisible(false)
        setRestField([])
    };

    
    /**
     * 校验航路格式
     * */
     const validateRouteFormat = (getFieldValue) => {

        //
        const validator = (rules, value, callback) => {
            if(value){
                return  new Promise((resolve, reject) => {
                    // 请求校验
                    const opt = {
                        // url: "http://192.168.194.21:50012/runway/defaulat/and/dynamic/retrieve/new/100?airportStr=ZLXY,ZLLL&startTime=202104200000&endTime=202104202359",
                        url: "http://192.168.194.21:29890/implementTactics?status=FUTURE,RUNNING&startTime=&endTime=&userId=100",
                        method:'GET',
                        params:{},
                        resFunc: (data) => {
                            resolve()
                        },
                        errFunc: (err) => {
                            reject("请输入正确格式的航路信息")
                        },
                    };
                    // 发送请求
                    request(opt);
                })
            }else {
                return Promise.resolve();
            }

        };
        
        return ({
            validator: validator,
        })
    };

    return (
        <Form
            form={form}
            onFinish={onFinish}
            name="dynamic_form_item"
        >
            <div className="close-bar">
                <Button type="text" className="close-button" onClick={() => { handleClose() }}><CloseOutlined /></Button>
            </div>
            <Form.List
                initialValue={initialFieldSet}
                name={fieldName}
            // rules={[
            //     {
            //         validator: async (_, names) => {
            //             if (!names || names.length > 6) {
            //                 return Promise.reject(new Error('最多10条备选航路'));
            //             }
            //         },
            //     },
            // ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Row key={field.key}>
                                <Col span={21}>
                                    <Form.Item
                                        label={`备选航路${index + 4}`}
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onBlur']}
                                            rules={[
                                                // {
                                                //     required: true,
                                                //     whitespace: true,
                                                //     message: "请输入正确格式的航路",
                                                // },
                                                ({ getFieldValue }) => validateRouteFormat(getFieldValue),
                                            ]}
                                            noStyle
                                        >
                                            <Input className="text-uppercase" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    <div className="delete-button-box">
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        ))}
                        <Row>
                            <Col span={21}>
                                <Form.Item className="add-route-box">
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                        className="add-route-button"
                                        disabled={(fields.length > 6) ? true : false}
                                    >
                                        添加备选航路
                                    </Button>

                                    <Form.ErrorList errors={errors} />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={21}>
                                <Form.Item
                                    name=""
                                    label=""
                                    className="save-box"
                                >
                                    <Button type="primary" htmlType="submit">
                                        保存
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}

            </Form.List>

        </Form>
    )
}
export default DynamicFieldSet