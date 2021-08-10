import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Form, Input, Row, Col, Button, Select, Spin, Modal, Space, Typography, Divider } from 'antd'
import { inject, observer } from "mobx-react";
import debounce from 'lodash/debounce'
import { requestGet2, request } from "utils/request";
import { ReqUrls, CollaborateUrl } from "utils/request-urls";
import FmeToday from "utils/fmetoday";
import { parseFullTime, getFullTime, isValidObject, isValidVariable } from 'utils/basic-verify'

import "./FormerFlightUpdateForm.scss";
const { Option } = Select;

//指定前序航班表单
function FormerFlightUpdateForm(props) {

    // 备选航路表单字段配置集合
    let [fetching, setFetching] = useState(false);
    const { formerFlightUpdateFormData, systemPage } = props;
    // 用户信息
    const user = systemPage.user || {};
    // 本段航班数据
    const flightData = formerFlightUpdateFormData.flightData;
    // 本段航班航班id
    const flightid = formerFlightUpdateFormData.flightid;
    // 本段航班格式化后的信息
    const flightInfo = convertFlightDataInfo(flightData);
    // 备选前序航班id集合
    // const alterFormerFlightIdList = formerFlightUpdateFormData.alterFormerFlightIdList || [];
    // 备选前序航班集合
    const alterFormerFlightList = formerFlightUpdateFormData.alterFormerFlightList || [];

    // 格式转换后的备选前序航班集合
    const alterFormerFlightData = alterFormerFlightList.map((item) => {
        // 航班格式化后的信息
        const flightInfo = convertFlightDataInfo(item);
        let data = {
            value: item.id,
            text: flightInfo,
        }
        return data;
    })

    // 表单初始化默认值
    let initialValues = {
        flight: flightInfo,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        // 重置备选前序航班集合store
        formerFlightUpdateFormData.updateAlterFormerFlightList({});
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [flightid]);

    // 表单
    const [form] = Form.useForm();
    // 前序航班下拉选项
    const options = alterFormerFlightData.map((item) => <Option key={item.value}>{item.text}</Option>)
    // 请求备选前序航班数据
    const debounceFetcher = debounce((value) => {
        let val = value.trim().toUpperCase();
        if (!isValidVariable(val)) {
            return
        }
        // 重置备选前序航班集合store
        formerFlightUpdateFormData.updateAlterFormerFlightList({});
        setFetching(true);
        fetchAlterFormerFlightList(val);
    }, 500)

    // 变更选中航班
    const handleChangeSelectedFormerFlight = (value) => {
        // console.log(value)
    }

    // 处理表单提交数据
    const handleSubmitFormData = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            // 处理提交数据
            const paramsData = handleSubmitData(values);
            Modal.info({
                title: "提交",
                // icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>确定提交指定前序航班?</p></div>,
                okText: '确定',
                cancelText: '取消',
                onOk: () => { submitData(paramsData) },
            });

        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 提交数据
    const submitData = (paramsData) => {
        let fid = flightData.flightid;
        let title = "指定前序航班"
        const opt = {
            url: CollaborateUrl.updateFormerFlightUrl,
            method: "POST",
            params: paramsData,
            resFunc: (data) => requestSuccess(data, fid + title),
            errFunc: (err) => requestErr(err, fid + title),
        };
        request(opt);
    }

    // 处理表单提交数据
    const handleSubmitData = (values) => {
        //前序航班id
        let formerFlightid = values.formerFlight;
        // 本段航班数据
        let flightCoordination = flightData;
        // 本段航班id
        let id = flightid;
        let userId = user.id;

        let params = {
            id,
            userId,
            flightCoordination,
            timeVal: formerFlightid,

        };

        return params;
    }
    // 清空表单数据
    const handleClearForm = () => {
        // 重置备选前序航班集合store
        formerFlightUpdateFormData.updateAlterFormerFlightList({});
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }
    //获取备选前序航班列表数据
    const fetchAlterFormerFlightList = async (val) => {
        try {
            const userId = user.id || "";
            const result = await requestGet2({
                url: ReqUrls.getAlterFormerFlightListUrl + userId + "?param=" + val,
            });
            const alterFormerFlights = result.result || {}
            formerFlightUpdateFormData.updateAlterFormerFlightList(alterFormerFlights);
            setFetching(false);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setFetching(false);
            formerFlightUpdateFormData.updateAlterFormerFlightList({});
        }

    };
    // 转换航班信息
    function convertFlightDataInfo(flight) {
        const { flightid = "", depap = "", arrap = "", sobt = "", fmeToday = {}, flightStatus = "" } = flight;
        // sobt时间
        let sobtStr = "";
        if (isValidVariable(sobt)) {
            sobtStr = getFullTime(parseFullTime(sobt), 2);
        }
        // 降落时间
        let arrTime = FmeToday.getRPSArrTime(fmeToday) || "";

        let arrTimeStr = "";
        if (isValidVariable(arrTime)) {
            arrTimeStr = getFullTime(parseFullTime(arrTime), 2);
        }

        return `${flightid} ${depap}-${arrap} ${sobtStr} ${arrTimeStr} ${flightStatus} `
    }

    //数据提交失败回调
    const requestErr = useCallback((err, title) => {
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }

        Modal.error({
            title: '提交失败',
            content: (
                <span>
                    <span>{`${title}提交失败`}</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            centered: true,
            okText: '确定',
        });

    });
    //数据提交成功回调
    const requestSuccess = useCallback((data, title) => {
        const { flightCoordination } = data;
        //更新单条航班数据
        props.flightTableData.updateSingleFlight(flightCoordination);
        // 关闭表单模态框
        formerFlightUpdateFormData.toggleModalVisible(false);
        Modal.success({
            title: '提交成功',
            content: (
                <span>
                    <span>{`${title}提交成功`}</span>
                </span>
            ),
            centered: true,
            okText: '确定',
        });

    });

    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
                className="update-former-flight-form"
            >
                <Row gutter={24} >
                    <Col span={24}>
                        <Form.Item label="数据解释" className="form-text-item">
                            <span className="ant-form-text">
                                <Space size={0} split={<Divider type="vertical" />}>
                                    <span>航班号</span>
                                    <span>起降机场</span>
                                    <span>SOBT</span>
                                    <span>降落时间</span>
                                    <span>状态</span>
                                </Space>
                            </span>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} >
                    <Col span={24}>
                        <Form.Item
                            name="flight"
                            label="本段航班"
                            rules={[{ required: true }]}
                        >
                            <Input onBlur={(e) => { }} disabled={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} >
                    <Col span={24}>
                        <Form.Item
                            name="formerFlight"
                            label="前段航班"
                            required={true}
                            rules={[{ required: true }]}
                            className="text-uppercase"
                        >
                            <Select
                                showSearch
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                allowClear={true}
                                filterOption={false}
                                onSearch={debounceFetcher}
                                onChange={handleChangeSelectedFormerFlight}
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                placeholder="请输入航班号"
                            >
                                {options}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} className="btn-box">
                        <Button type="primary" onClick={handleSubmitFormData} >提交</Button>
                        <Button onClick={handleClearForm} >清空</Button>
                    </Col>
                </Row>

            </Form>
        </Fragment>
    )
}

export default inject("flightTableData", "formerFlightUpdateFormData", "systemPage")(observer(FormerFlightUpdateForm));
