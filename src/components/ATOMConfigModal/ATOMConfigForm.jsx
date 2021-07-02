import React, { Fragment, useEffect } from "react";
import { Form, Radio, Row, Col, Button, Modal, Space } from "antd";
import { inject, observer } from "mobx-react";
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidObject, isValidVariable } from "utils/basic-verify";
import "./ATOMConfigForm.scss";
//ATOM引接应用配置表单
function ATOMConfigForm(props) {
    const { systemPage, ATOMConfigFormData = {}, flightTableData = {} } = props;
    // 用户
    const user = systemPage.user || {};
    // 用户名
    const userName = user.username || "";
    // 是否有编辑权限
    const hasAuth = systemPage.userHasAuth(12515);

    // 表单
    const [form] = Form.useForm();
    // 配置数据
    const configData = ATOMConfigFormData.configData || {};
    // 选项数据信息
    const alternative = configData.alternative || {};
    // 各地区配置值
    const valueInfo = configData.valueInfo || {};
    // 各地区按sn字段排序后的数组,用于有序的显示表单项
    const valueInfoArray = Object.keys(valueInfo).sort((a, b) => {
        let aSn = valueInfo[a].sn;
        let bSn = valueInfo[b].sn;
        if (aSn > bSn) {
            return 1;
        } else if (aSn < bSn) {
            return -1;
        } else {
            return 0
        }
    });
    // 单选按钮选项数据格式化为数组
    const optionData = Object.keys(alternative);
    // 单选按钮选项
    const options = optionData.map((item) => (
        <Radio key={item} value={item}>
            {alternative[item].cn}
        </Radio>
    ));
    // 表单初始化默认值
    let initialValues = getInitialFieldValue();
    // 初始化默认值
    function getInitialFieldValue() {
        let obj = {};
        for (let i = 0; i < valueInfoArray.length; i++) {
            let field = valueInfoArray[i];
            let val = valueInfo[field].val || ""
            obj[field] = val;
        }
        return obj;
    }
    // 格式化处理各地区配置值
    const formatSubmitValueInfoData = (newValueData) => {
        let result = {};
        for (let i = 0; i < valueInfoArray.length; i++) {
            let area = valueInfoArray[i];
            let oldValueData = valueInfo[area];
            let newValue = newValueData[area];
            result[area] = {
                ...oldValueData,
                val: newValue
            };
        }
        return result;
    }

    // 处理表单提交数据
    const handleSubmitFormData = async () => {
        try {
            // 触发表单验证获取取表单数据
            const values = await form.validateFields();
            // 处理提交数据
            const value = formatSubmitValueInfoData(values);
            Modal.info({
                title: "保存",
                // icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: (
                    <div>
                        <p>确定保存各地CDM引接应用配置?</p>
                    </div>
                ),
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                    submitData(value);
                },
            });
        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
        }
    };

    // 提交数据
    const submitData = (value) => {
        const opt = {
            url:
                ReqUrls.switchConfigUrl +
                "/updateCdm",
            method: "POST",
            params: {
                value: JSON.stringify(value),
                username: userName
            },
            resFunc: (data) => requestSuccess(data),
            errFunc: (err) => requestErr(err),
        };
        request(opt);
    };

    //获取配置数据
    const fetchConfigData = () => {
        const opt = {
            url: ReqUrls.switchConfigUrl + "/switch/cdmDataApplySwitch",
            method: "GET",
            resFunc: (data) => fetchSuccess(data),
            errFunc: (err) => fetchErr(err),
        };
        request(opt);
    };

    //获取配置数据成功
    const fetchSuccess = (data) => {
        let obj = {
            alternative: data.alternative,
            valueInfo: data.valueInfo,
        }
        ATOMConfigFormData.updateConfigData(obj);
    };

    //数据获取失败回调
    const fetchErr = (err) => {
        ATOMConfigFormData.updateConfigData({});
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        Modal.error({
            title: "获取失败",
            content: (
                <span>
                    <span>获取各地CDM引接应用配置数据失败</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            centered: true,
            okText: "确定",
        });
    };

    //数据提交失败回调
    const requestErr = (err) => {
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }

        Modal.error({
            title: "保存失败",
            content: (
                <span>
                    <span>各地CDM引接应用配置保存失败</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            centered: true,
            okText: "确定",
        });
    };
    //数据提交成功回调
    const requestSuccess = (data) => {
        Modal.success({
            title: "保存成功",
            content: (
                <span>
                    <span>各地CDM引接应用配置保存成功</span>
                </span>
            ),
            centered: true,
            okText: "确定",
            onOk: () => {
                let obj = {
                    alternative: data.alternative,
                    valueInfo: data.valueInfo,
                }
                ATOMConfigFormData.updateConfigData(obj);
                flightTableData.setForceUpdate(true);
                ATOMConfigFormData.toggleModalVisible(false);
            },
        });
    };
    // 取消按钮点击事件
    const handleCancel=()=> {
        // 关闭模态框
        ATOMConfigFormData.toggleModalVisible(false);
    }

    //方案名称发生变化触发更新
    useEffect(
        function () {
            //重置表单，用以表单初始值赋值
            form.resetFields();
        },
        [JSON.stringify(configData)]
    );

    // 初始化获取配置数据
    useEffect(function () {
        //获取配置数据
        fetchConfigData();
    }, []);

    return (
        <Fragment>
            <Form form={form} labelAlign="left" initialValues={initialValues} className="config-form">
                {valueInfoArray.map((item) => {
                    let info = valueInfo[item];
                    let cn = info.cn;
                    return (
                        <Row gutter={24} key={item}>
                            <Col span={24}>
                                <Form.Item
                                    className={hasAuth? "" : "no-pointer-event"}
                                    name={item}
                                    label={cn}
                                    rules={[
                                        {
                                            required: true,
                                            message: "请选择配置",
                                        },
                                    ]}
                                >
                                    <Radio.Group >
                                        <Space size={50}>{options}</Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    )
                })}

                <Row gutter={24}>
                    <Col span={24} className="btn-box">
                        {
                            hasAuth ? <div>
                                <Button type="primary" onClick={handleSubmitFormData}>
                                    保存
                                </Button>
                                <Button onClick={handleCancel}>
                                    取消
                                </Button>
                            </div> : ""
                        }
                    </Col>
                </Row>
            </Form>
        </Fragment>
    );
}
export default inject(
    "systemPage",
    "ATOMConfigFormData",
    "flightTableData"
)(observer(ATOMConfigForm));
