import React, { Fragment, useEffect, useCallback } from 'react'
import { Form, Radio, Row, Col, Button, Modal, Space } from 'antd'
import { inject, observer } from "mobx-react";
import { request } from "utils/request";
import { ReqUrls, } from "utils/request-urls";
import { isValidObject, isValidVariable } from 'utils/basic-verify'
import './NTFMConfigForm.scss'
//NTFM引接应用配置表单
function NTFMConfigForm(props) {
    const { systemPage, NTFMConfigFormData = {} } = props;
    // 用户
    const user = systemPage.user || {};
    // 用户名
    const userName = user.username || ""
    // 表单
    const [form] = Form.useForm();
    // 配置选项数据
    const configOptionData = NTFMConfigFormData.configOptionData || {};
    // 选项数据格式化为数组
    const optionData = Object.keys(configOptionData);
    // 当前系统选中的配置值
    const configValue = NTFMConfigFormData.configValue || "";
    console.log(configValue)
    // 配置下拉选项
    const options = optionData.map((item) => <Radio key={item} value={item}>{configOptionData[item].cn}</Radio>)
    // 表单初始化默认值
    let initialValues = {
        config: configValue,
    }
    // 处理表单提交数据
    const handleSubmitFormData = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            // 处理提交数据
            const value = values.config;
            Modal.info({
                title: "保存",
                // icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>确定保存NTFM引接应用配置?</p></div>,
                okText: '确定',
                cancelText: '取消',
                onOk: () => { submitData(value) },
            });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 提交数据
    const submitData = (value) => {
        const opt = {
            url: ReqUrls.switchConfigUrl + "/update/ntfmDataApplySwitch/" + value + "?username=" + userName,
            method: "POST",
            params: {},
            resFunc: (data) => requestSuccess(data),
            errFunc: (err) => requestErr(err),
        };
        request(opt);
    }

    //获取配置数据
    const fetchConfigData = () => {
        const opt = {
            url: ReqUrls.switchConfigUrl + "/switch/ntfmDataApplySwitch",
            method: "GET",
            resFunc: (data) => fetchSuccess(data),
            errFunc: (err) => fetchErr(err),
        };
        request(opt);
    }

    //获取配置数据成功
    const fetchSuccess = useCallback((data) => {
        NTFMConfigFormData.updateConfigData(data)
    });

    //数据提交失败回调
    const fetchErr = useCallback((err) => {
        NTFMConfigFormData.updateConfigData({})
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        Modal.error({
            title: '获取失败',
            content: (
                <span>
                    <span>获取NTFM引接应用配置数据失败</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            centered: true,
            okText: '确定',
        });
    });

    //数据提交失败回调
    const requestErr = useCallback((err) => {
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }

        Modal.error({
            title: '保存失败',
            content: (
                <span>
                    <span>NTFM引接应用配置保存失败</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            centered: true,
            okText: '确定',
        });

    });
    //数据提交成功回调
    const requestSuccess = useCallback((data) => {
        Modal.success({
            title: '保存成功',
            content: (
                <span>
                    <span>NTFM引接应用配置保存成功</span>
                </span>
            ),
            centered: true,
            okText: '确定',
            onOk: () => {
                NTFMConfigFormData.toggleModalVisible(false);
            },
        });

    });
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [configValue]);

    //初始化获取配置数据
    useEffect(function () {
        //获取配置数据
        fetchConfigData();
    }, []);

    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
                className="config-form"
            >
                <Row gutter={24} >
                    <Col span={24}>
                        <Form.Item
                            name="config"
                            label="NTFM引接应用"
                            rules={[
                                {
                                    required: true,
                                    message: "请选择配置"
                                }
                            ]}
                        >
                            <Radio.Group value={configValue}>
                                <Space size={50}>
                                    {options}
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} className="btn-box">
                    {systemPage.userHasAuth(12516) && (
                        <Button type="primary" onClick={handleSubmitFormData} >保存</Button>)}
                    </Col>
                </Row>

            </Form>
        </Fragment>
    )
}
export default inject("systemPage", "NTFMConfigFormData")(observer(NTFMConfigForm));
