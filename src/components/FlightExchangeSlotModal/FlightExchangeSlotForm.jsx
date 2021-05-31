import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Form, Input, Row, Col, Button, Select, Spin, Modal, Space, Divider, Collapse } from 'antd'
import { QuestionCircleOutlined, } from '@ant-design/icons'

import { inject, observer } from "mobx-react";
import debounce from 'lodash/debounce'
import { requestGet2, request } from "utils/request";
import { ReqUrls, CollaborateUrl } from "utils/request-urls";
import FmeToday from "utils/fmetoday";
import { parseFullTime, getFullTime, isValidObject, isValidVariable } from 'utils/basic-verify'
import RulesDescription from "components/FlightExchangeSlotModal/RulesDescription";
import "./FlightExchangeSlotForm.scss";
const { Panel } = Collapse;

const { Option } = Select;

//航班时隙交换表单
function FlightExchangeSlotForm(props) {

    // 获取备选目标航班请求中标记
    let [fetching, setFetching] = useState(false);

    const { flightExchangeSlotFormData, systemPage } = props;
    // 用户信息
    const user = systemPage.user || {};
    // 申请航班数据
    const claimantFlightData = flightExchangeSlotFormData.claimantFlightData;
    // 申请航班航班id
    const claimantFlightid = flightExchangeSlotFormData.claimantFlightid;
    // 申请航班格式化后的信息
    const claimantFlightInfo = convertFlightDataInfo(claimantFlightData);
    // 备选目标航班集合
    const alterTargetFlightList = flightExchangeSlotFormData.alterTargetFlightList || [];
    // 格式转换后的备选目标航班集合
    const alterTargetFlightData = alterTargetFlightList.map((item) => {
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
        claimantFlightid: claimantFlightInfo,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        // 重置备选目标航班集合store
        flightExchangeSlotFormData.updateAlterTargetFlightList({});
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [claimantFlightid]);

    // 表单
    const [form] = Form.useForm();
    // 目标航班表单下拉选项
    const options = alterTargetFlightData.map((item) => <Option key={item.value}>{item.text}</Option>)
    // 请求备选目标航班数据
    const debounceFetcher = debounce((value) => {
        let val = value.trim().toUpperCase();
        if (!isValidVariable(val)) {
            return
        }
        // 重置备选目标航班集合store
        flightExchangeSlotFormData.updateAlterTargetFlightList({});
        setFetching(true);
        fetchAlterTargetFlightList(val);
    }, 500)

    // 变更选中航班
    const handleChangeSelectedTargetFlight = (value) => {
        console.log(value)
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
                content: <div><p>确定提交指定目标航班?</p></div>,
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
        // 申请航班的航班号
        let fid = claimantFlightData.flightid;
        let title = "时隙交换"
        const opt = {
            // 接口待定
            // url: CollaborateUrl.updateTargetFlightUrl,
            method: "POST",
            params: paramsData,
            resFunc: (data) => requestSuccess(data, fid + title),
            errFunc: (err) => requestErr(err, fid + title),
        };
        request(opt);
    }

    // 处理表单提交数据
    const handleSubmitData = (values) => {
        //目标航班id
        let targetFlightid = values.targetFlight;
        // 申请航班数据
        let flightCoordination = claimantFlightData;
        // 申请航班id
        let id = claimantFlightid;
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
        // 重置备选目标航班集合store
        flightExchangeSlotFormData.updateAlterTargetFlightList({});
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }
    //获取备选目标航班列表数据
    const fetchAlterTargetFlightList = async (val) => {
        try {
            const userId = user.id || "";
            const result = await requestGet2({
                // 接口待定
                // url: ReqUrls.getAlterTargetFlightListUrl + userId + "?param=" + val,
            });
            const alterTargetFlights = result.result || {}
            flightExchangeSlotFormData.updateAlterTargetFlightList(alterTargetFlights);
            setFetching(false);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setFetching(false);
            flightExchangeSlotFormData.updateAlterTargetFlightList({});
        }

    };
    // 转换航班信息
    function convertFlightDataInfo(flight) {
        //  GSOBT、 时隙状、 受控点、 受控过点时间、 机型字段转换待处理
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

        return `${flightid} ${depap} ${arrap} ${sobtStr} ${arrTimeStr} ${flightStatus} `
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
                className="flight-exchange-slot-form"
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <div>
                            <Collapse bordered={false} ghost className="description-collapse">
                                <Panel showArrow={false} header={<span>时隙交换规则<QuestionCircleOutlined /></span>} key="1">
                                    <RulesDescription />
                                </Panel>
                                
                            </Collapse>
                            
                        </div>
                    </Col>
                </Row>
                <Row gutter={24} >
                    <Col span={24}>
                        <Form.Item label="数据解释" className="form-text-item">
                            <span className="ant-form-text">
                                <Space size={0} split={<Divider type="vertical" />}>
                                    <span>航班号</span>
                                    <span>起飞机场</span>
                                    <span> 降落机场</span>
                                    <span>SOBT</span>
                                    <span>GSOBT</span>
                                    <span>时隙状态</span>
                                    <span>受控点</span>
                                    <span>受控过点时间</span>
                                    <span>机型</span>
                                </Space>
                            </span>
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={24} >
                    <Col span={24}>
                        <Form.Item
                            name="flight"
                            label="航班A"
                            rules={[{ required: true }]}
                        >
                            <Input onBlur={(e) => { }} disabled={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} >
                    <Col span={24}>
                        <Form.Item
                            name="targetFlight"
                            label="航班B"
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
                                onChange={handleChangeSelectedTargetFlight}
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

export default inject("flightTableData", "flightExchangeSlotFormData", "systemPage")(observer(FlightExchangeSlotForm));
