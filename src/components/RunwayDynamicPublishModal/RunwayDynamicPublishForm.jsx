import React, { Fragment, useEffect } from "react";
import { Form, Radio, Row, Col, Button, Input, Modal, Space, Spin, Card, Select, DatePicker } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { inject, observer } from "mobx-react";
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidVariable, isValidObject, parseFullTime, formatTimeString } from 'utils/basic-verify';
import { REGEXP } from 'utils/regExpUtil'
import moment from 'moment'
import { difference } from 'lodash';

// axios自带的qs库,用于将参数序列化
import qs from 'qs'
import RunwaySingleConfigDataForm from 'components/Runway/RunwaySingleConfigDataForm'
import './RunwayDynamicPublishForm.scss'


// 动态跑道发布表单
function RunwayDynamicPublishForm(props) {
    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'HHmm';
    const dateTimeFormat = "YYYYMMDDHHmm"

    // 跑道状态选项
    const statusOptions = [
        { label: '起飞', value: '1' },
        { label: '降落', value: '-1' },
        { label: '关闭', value: '0' },
    ]

    const { systemPage, RunwayDynamicPublishFormData, runwayListData } = props;
    // 用户id
    const userId = systemPage.user.id || ""
    // 当前系统
    const activeSystem = systemPage.activeSystem || {};
    // 系统region
    const region = activeSystem.region || "";
    // 机场
    const airport = region;
    // 表单
    const [form] = Form.useForm();
    // loading
    const loading = RunwayDynamicPublishFormData.loading;
    // 跑道状态勾选数值变更计数器
    const ruwayStatusSelectedDataChangeCounter = RunwayDynamicPublishFormData.ruwayStatusSelectedDataChangeCounter;
    // 跑道航路点勾选数值变更计数器
    const runwayPointSelectedDataChangeCounter = RunwayDynamicPublishFormData.runwayPointSelectedDataChangeCounter;
    // 配置数据
    const configData = RunwayDynamicPublishFormData.configData || {};
    // 机场名称
    const apName = RunwayDynamicPublishFormData.airport || "";
    // 运行模式
    const operationmode = RunwayDynamicPublishFormData.operationmode || "";
    // 各跑道状态勾选数值
    const ruwayStatusSelectedData = RunwayDynamicPublishFormData.ruwayStatusSelectedData || {};
    // 各跑道航路点勾选数值
    const runwayPointSelectedData = RunwayDynamicPublishFormData.runwayPointSelectedData || {};

    // 终端当前时间
    let now = moment();
    // 开始日期 Date类型
    const startDate = moment(now, dateFormat);
    // 结束日期 Date类型
    const endDate = moment(now, dateFormat);
    // 开始时间 HHmm
    const startTimeString = moment(now).format(dateTimeFormat).substring(8, 12);
    // 结束时间 HHmm
    const endTimeString = "";
    // 跑道航路点
    const runwayPoint = RunwayDynamicPublishFormData.runwayPoint || [];
    // 跑道配置数据
    const listRWGapInfo = RunwayDynamicPublishFormData.listRWGapInfo || [];
    // 跑道数量
    const runwayNumber = RunwayDynamicPublishFormData.runwayNumber || 0;
    // 获取跑道配置字段及数值
    let runwayValues = updateRunwayFieldValue();
    // 所有航路点选项
    let runwayPointOptions = getRunwayPointOptions();

    // 表单初始化默认值
    let initialValues = {
        apName,
        operationmode,
        startDate,
        endDate,
        startTime: startTimeString,
        endTime: endTimeString,
        ...runwayValues
    }

    // 更新跑道字段及字段数值
    function updateRunwayFieldValue() {
        let field = {}
        for (let i = 0; i < listRWGapInfo.length; i++) {
            let singleRunway = listRWGapInfo[i] || {};
            // 跑道id
            const id = singleRunway.id || "";
            // 选中的逻辑跑道
            const logicRWDef = singleRunway.logicRWDef || "";
            // 选中的走廊口
            const wayPoint = runwayPointSelectedData[id] || [];
            // 逻辑跑道A名称
            const logicRWNameA = singleRunway.logicRWNameA || "";
            // 逻辑跑道B名称
            const logicRWNameB = singleRunway.logicRWNameB || "";
            // 逻辑跑道A滑行时间
            const logicRWTaxitimeA = isValidVariable(singleRunway.logicRWTaxitimeA) ? singleRunway.logicRWTaxitimeA : "";
            // 逻辑跑道B滑行时间
            const logicRWTaxitimeB = isValidVariable(singleRunway.logicRWTaxitimeB) ? singleRunway.logicRWTaxitimeB : "";
            // 逻辑跑道A起飞间隔
            const logicRWValueA = isValidVariable(singleRunway.logicRWValueA) ? singleRunway.logicRWValueA : "";
            // 逻辑跑道B起飞间隔
            const logicRWValueB = isValidVariable(singleRunway.logicRWValueB) ? singleRunway.logicRWValueB : "";
            // 跑道状态 0:关闭  1:起飞  2:起降 -1:降落
            let isDepRW = isValidVariable(ruwayStatusSelectedData[id]) ? ruwayStatusSelectedData[id] : "";

            // 转换跑道状态值
            // isDepRW = convertRunwayStauts(isDepRW)
            let obj = {
                [`selectedLogic_${id}`]: logicRWDef,
                [`isDepRW_${id}`]: isDepRW,
                [`runwayPoint_${id}`]: wayPoint,
                [`interval_${id}_${logicRWNameA}`]: logicRWValueA,
                [`taxi_${id}_${logicRWNameA}`]: logicRWTaxitimeA,
                [`interval_${id}_${logicRWNameB}`]: logicRWValueB,
                [`taxi_${id}_${logicRWNameB}`]: logicRWTaxitimeB,
            }
            field = { ...field, ...obj }
        }
        return field;
    }
    // 所有走廊口选项
    function getRunwayPointOptions() {
        let options = [];
        let points = [...runwayPoint];
        let sortPoints = points.sort((a, b) => {
            if (isValidObject(a)
                && isValidVariable(a.id)
                && isValidObject(b)
                && isValidVariable(b.id)) {
                if (a.id > b.id) {
                    return 1;
                } else if (a.id < b.id) {
                    return -1;
                } else {
                    return 0
                }
            }
            return 0
        });
        options = sortPoints.map((item, index) => ({ label: item.pointName, value: item.pointName }))
        return options;
    }
    /**
    * 自动填充结束日期
    * */
    const autoFillInEndDate = (value) => {
        const startTime = form.getFieldValue('startTime');
        const startDate = form.getFieldValue('startDate');
        const endTime = form.getFieldValue('endTime');
        const endDate = form.getFieldValue('endDate');
        const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
        const startDateFormatValid = REGEXP.DATE8.test(startDateString);
        const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
        if (startDateFormatValid && startTimeFormatValid && value.length === 4 && !isValidVariable(endDate)) {
            if (value * 1 < startTime * 1 || value * 1 === startTime * 1) {
                const nextDate = moment(startDate).add(1, 'day');
                form.setFieldsValue({ 'endDate': moment(nextDate) })
            } else {
                form.setFieldsValue({ 'endDate': moment(startDate) })
            }
        }
    }
    // 结束时间输入框变化
    const handleEndTimeChange = ({ target: { value } }) => {
        // 自动填充结束日期
        autoFillInEndDate(value);
    };
    // 开始日期日历插件变化
    const onOpenStartDatePickerChange = (open) => {
        // 当前终端时间
        let now = new Date();
        const startDate = form.getFieldValue('startDate');
        // 若开始日期为空则填充当前日期
        if (open && !isValidVariable(startDate)) {
            form.setFieldsValue({ 'startDate': moment(now) });
        }

    };
    // 结束日期日历插件变化
    const onOpenEndDatePickerChange = (open) => {
        const startDate = form.getFieldValue('startDate');
        const endDate = form.getFieldValue('endDate');
        // 若结束日期为空且开始日期不为空,则填充结束日期值为开始日期
        if (open && isValidVariable(startDate) && !isValidVariable(endDate)) {
            form.setFieldsValue({ 'endDate': moment(startDate) });
        }
    };

    /**
     * 校验结束日期是否完整
     * */
    const validateEndDateFormat = (getFieldValue) => {
        const validator = (rules, value) => {
            const endTime = getFieldValue('endTime');
            const endDate = getFieldValue('endDate');
            if (!isValidVariable(endDate) && isValidVariable(endTime)) {
                return Promise.reject('请选择结束日期');
            }
            return Promise.resolve();
        };
        return ({
            validator: validator,
        })
    };

    // 结束日期不可选的日期限定
    const disabledEndDate = (currentDate) => {
        const startDate = form.getFieldValue('startDate');
        return currentDate < startDate;
    };

    /**
     * 校验开始时间和结束时间大小
     * */
    const validateTimeRange = (getFieldValue) => {
        const validator = (rules, value) => {
            // 开始时间HHmm
            const startTime = getFieldValue('startTime');
            // 开始日期 Date
            const startDate = getFieldValue('startDate');
            // 结束时间HHmm
            const endTime = getFieldValue('endTime');
            // 结束日期 Date
            const endDate = getFieldValue('endDate');

            if (isValidVariable(endDate)
                && isValidVariable(endTime)
                && isValidVariable(startDate)
            ) {
                const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
                const endDateString = moment(endDate).format(dateTimeFormat).substring(0, 8);
                const startDateTime = startDateString + startTime;
                const endDateTime = endDateString + endTime;
                const startDateFormatValid = REGEXP.DATE8.test(startDateString);
                const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
                const endDateFormatValid = REGEXP.DATE8.test(endDateString);
                const endTimeFormatValid = REGEXP.TIMEHHmm.test(endTime);
                if (startDateFormatValid && startTimeFormatValid && endDateFormatValid && endTimeFormatValid) {
                    if (parseFullTime(startDateTime).getTime() > parseFullTime(endDateTime).getTime()) {
                        return Promise.reject('结束时间不能早于开始时间');
                    } else {
                        return Promise.resolve();
                    }
                }
            }
            return Promise.resolve();
        };
        return ({
            validator: validator,
        })
    };
    // 绘制单条跑道配置
    const drawSingleRunway = (runwayData) => {
        return (
            <Fragment key={runwayData.id}>
                <RunwaySingleConfigDataForm
                    form={form}
                    runwayData={runwayData}
                    statusOptions={statusOptions}
                    runwayPointOptions={runwayPointOptions}
                    storesData={RunwayDynamicPublishFormData}
                >
                </RunwaySingleConfigDataForm>
            </Fragment>)
    }

    // 获取选中的状态中包含起飞状态的数量
    const getSelecedDepNumber = ()=> {
        let statusSelectedData = { ...ruwayStatusSelectedData };
        let number = 0;
        for (let i in statusSelectedData) {
            let singleRunwayStatusSelectedData = [...statusSelectedData[i]];
            if (singleRunwayStatusSelectedData.includes("1")) {
                number = number+1;
            }
        }
        return number
    }
    // 表单提交按钮点击
    const handleSaveButtonClick = async () => {
        try {
            // 触发表单验证获取取表单数据
            const values = await form.validateFields();
            // 处理提交数据
            const value = handleSubmitData(values);
            // 未勾选的航路点
            let unSelectedPoint = getUnSelectedPoint();
            let len = unSelectedPoint.length;
            // 已勾选全部航路点
            if (len == 0) {
                Modal.info({
                    title: "确定发布",
                    // icon: <ExclamationCircleOutlined />,
                    centered: true,
                    closable: true,
                    content: (
                        <div>
                            <p>确定提交动态跑道发布?</p>
                        </div>
                    ),
                    okText: "确定",
                    cancelText: "取消",
                    onOk: () => {
                        submitData(value);
                    },
                });
            } else {
                // 有未勾选的航路点，进行提示
                // 单条跑道或只有1条跑道选中了起飞状态则需要全部勾选走廊口后方可提交
                let selectedDepNumber = getSelecedDepNumber();
                if (runwayNumber == 1 || selectedDepNumber == 1) {
                    // 有未勾选的航路点，进行提示
                    let contentText = `${unSelectedPoint.join(',')} 走廊口尚未分配跑道，请手动添加`;
                    Modal.warning({
                        title: '提示',
                        icon: <ExclamationCircleOutlined />,
                        centered: true,
                        closable: true,
                        content: <div><p>{contentText}</p></div>,
                        okText: '手动添加',
                    });
                } else {
                    let contentText = `${unSelectedPoint.join(',')} 走廊口尚未分配跑道，建议手动添加`;
                    Modal.confirm({
                        title: '提示',
                        icon: <ExclamationCircleOutlined />,
                        centered: true,
                        closable: true,
                        content: <div><p>{contentText}</p></div>,
                        okText: '手动添加',
                        cancelText: `提交`,
                        onCancel: (close) => {
                            // 若close为函数则为取消按钮点击触发，反之为关闭按钮触发
                            if (typeof close === 'function') {
                                // 关闭模态框
                                close();
                                submitData(value);
                            }
                        },
                    });
                }
            }

        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
        }
    };
    // 获取所有航路点数据中在表单未勾选的数据项
    const getUnSelectedPoint = () => {
        // 所有航路点数据
        let allPoint = [...RunwayDynamicPublishFormData.allPoint];
        // 所有跑道勾选的航路点数据
        let selectedPoint = [];
        for (let i in runwayPointSelectedData) {
            let singleRunwayPointSelectedData = runwayPointSelectedData[i];
            selectedPoint = [...selectedPoint, ...singleRunwayPointSelectedData]
        }
        let arr = difference(allPoint, selectedPoint);
        return arr;
    }

    /**
     *  处理表单数据对象
     * @param values 表单数据对象
     * 
     * */
    const handleSubmitData = (values) => {
        let opt = {};
        // 运行模式
        const operationmode = values.operationmode || "";
        // 跑道groupId
        // const groupId = firstRunway.groupId || "";
        // 是否显示就近模式选项按钮
        const showOperationNear = 0;
        // 开始日期
        const startDate = values['startDate'];
        // 开始时间
        const startTime = values['startTime'];
        // 结束日期
        const endDate = values['endDate'];
        // 结束时间
        const endTime = values['endTime'];

        opt.startYY = moment(startDate).format("YYYYMMDDHHmm").substring(0, 8),
            opt.startHour = startTime,
            opt.endYY = moment(endDate).format("YYYYMMDDHHmm").substring(0, 8),
            opt.endHour = endTime,
            opt.airportStr = apName;
        opt.operationMode = operationmode;
        // opt.groupId = groupId;
        opt.showOperationNear = showOperationNear;

        for (let i = 0; i < listRWGapInfo.length; i++) {
            let singleRunway = listRWGapInfo[i];
            // 跑道id
            const id = singleRunway.id || "";
            // 跑道名称
            const name = singleRunway.rwName || "";
            // 选中的逻辑跑道
            const logicRWDef = values[`selectedLogic_${id}`] || "";
            // 选中的走廊口
            const wayPoint = values[`runwayPoint_${id}`] || [];
            // 跑道状态 0:关闭  1:起飞  2:起降 -1:降落
            let isDepRW = values[`isDepRW_${id}`] || [];
            // 逻辑跑道A名称
            const logicRWNameA = singleRunway.logicRWNameA || "";
            // 逻辑跑道B名称
            const logicRWNameB = singleRunway.logicRWNameB || "";
            // 逻辑跑道A滑行时间
            let logicRWTaxitimeA = values[`taxi_${id}_${logicRWNameA}`];
            logicRWTaxitimeA = isValidVariable(logicRWTaxitimeA) ? logicRWTaxitimeA : ""
            // 逻辑跑道B滑行时间
            let logicRWTaxitimeB = values[`taxi_${id}_${logicRWNameB}`];
            logicRWTaxitimeB = isValidVariable(logicRWTaxitimeB) ? logicRWTaxitimeB : ""
            // 逻辑跑道A起飞间隔
            let logicRWValueA = values[`interval_${id}_${logicRWNameA}`];
            logicRWValueA = isValidVariable(logicRWValueA) ? logicRWValueA : ""
            // 逻辑跑道B起飞间隔
            let logicRWValueB = values[`interval_${id}_${logicRWNameB}`];
            logicRWValueB = isValidVariable(logicRWValueB) ? logicRWValueB : ""

            // 注意：字段使用listRWGapInfoDefault前缀
            let obj = {
                [`listRWGapInfoDefault[${i}].id`]: id,
                [`listRWGapInfoDefault[${i}].apName`]: apName,
                [`listRWGapInfoDefault[${i}].rwName`]: name,
                [`listRWGapInfoDefault[${i}].logicRWDef`]: logicRWDef,
                [`listRWGapInfoDefault[${i}].logicRWValueA`]: logicRWValueA,
                [`listRWGapInfoDefault[${i}].logicRWValueB`]: logicRWValueB,
                [`listRWGapInfoDefault[${i}].logicRWTaxitimeA`]: logicRWTaxitimeA,
                [`listRWGapInfoDefault[${i}].logicRWTaxitimeB`]: logicRWTaxitimeB,
                [`listRWGapInfoDefault[${i}].logicRWNameA`]: logicRWNameA,
                [`listRWGapInfoDefault[${i}].logicRWNameB`]: logicRWNameB,
                // 注意：走廊口字段为固定字符串passagewaysA+索引
                [`passagewaysA${i}`]: wayPoint.join(','),
                // 注意：跑道使用状态字段为固定字符串rwDefaultStrLst+索引,且多值使用逗号分隔，无需反转换
                [`rwDefaultStrLst[${i}]`]: isDepRW.join(','),
            }
            opt = { ...opt, ...obj }
        }
        return opt;
    };

    // 提交数据
    const submitData = (value) => {
        RunwayDynamicPublishFormData.toggleLoad(true);
        const opt = {
            url: ReqUrls.runwayDynamicPublishUrl + userId,
            headers: 'application/x-www-form-urlencoded; charset=UTF-8',
            method: 'POST',
            // 注意：此接口参数需要序列化，使用axios自带的qs库实现
            params: qs.stringify(value),
            resFunc: (data) => requestSuccess(data),
            errFunc: (err) => requestErr(err),
        };
        request(opt);
    };

    //获取配置数据
    const fetchConfigData = () => {
        RunwayDynamicPublishFormData.toggleLoad(true);
        const opt = {
            url: ReqUrls.runwayTemplateCreateRunwayDataUrl + userId + '?airportStr=' + airport,
            method: "GET",
            resFunc: (data) => fetchSuccess(data),
            errFunc: (err) => fetchErr(err),
        };
        request(opt);
    };

    //获取配置数据成功
    const fetchSuccess = (data) => {
        RunwayDynamicPublishFormData.toggleLoad(false);
        let runwayData = {};
        if (isValidObject(data) && isValidObject(data.runwayMoudleTemplateBeanMap) && isValidObject(data.runwayMoudleTemplateBeanMap[airport])) {
            runwayData = data.runwayMoudleTemplateBeanMap[airport]
        }
        RunwayDynamicPublishFormData.updateConfigData(runwayData);
    };

    //数据获取失败回调
    const fetchErr = (err) => {
        RunwayDynamicPublishFormData.toggleLoad(false);
        RunwayDynamicPublishFormData.updateConfigData({});
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
                    <span>获取跑道配置数据失败</span>
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
        RunwayDynamicPublishFormData.toggleLoad(false);
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }

        Modal.error({
            title: "发布失败",
            content: (
                <span>
                    <span>动态跑道发布失败</span>
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
        RunwayDynamicPublishFormData.toggleLoad(false);
        // 触发获取跑道列表数据
        runwayListData.triggerRequest();
        Modal.success({
            title: "发布成功",
            content: (
                <span>
                    <span>动态跑道发布成功</span>
                </span>
            ),
            centered: true,
            okText: "确定",
            onOk: () => {
                closeModal();
            },
        });
    };

    // 关闭表单模态框
    const closeModal = () => {
        // 关闭模态框
        RunwayDynamicPublishFormData.toggleModalVisible(false);
    }

    //configData发生变化触发更新
    useEffect(
        function () {
            //重置表单，用以表单初始值赋值
            form.resetFields();
        },
        [JSON.stringify(configData)]
    );
    //跑道状态勾选数值变更计数器发生变化触发更新
    useEffect(
        function () {
            let field = {};
            for (let i = 0; i < listRWGapInfo.length; i++) {
                let singleRunway = listRWGapInfo[i] || {};
                // 跑道id
                const id = singleRunway.id || "";
                // 跑道状态 0:关闭  1:起飞  2:起降 -1:降落
                let isDepRW = isValidVariable(ruwayStatusSelectedData[id]) ? ruwayStatusSelectedData[id] : "";
                let obj = {
                    [`isDepRW_${id}`]: isDepRW,
                }
                field = { ...field, ...obj }
            }
            if (isValidObject(field)) {
                //改变指定字段表单值
                form.setFieldsValue(field);
                //重新校验
                form.validateFields(Object.keys(field));
            }
        },
        [ruwayStatusSelectedDataChangeCounter]
    );
    //跑道航路点勾选数值变更计数器发生变化触发更新      
    useEffect(
        function () {
            let field = {};
            for (let i = 0; i < listRWGapInfo.length; i++) {
                let singleRunway = listRWGapInfo[i] || {};
                // 跑道id
                const id = singleRunway.id || "";
                // 选中的走廊口
                const wayPoint = runwayPointSelectedData[id] || [];
                let obj = {
                    [`runwayPoint_${id}`]: wayPoint,
                }
                field = { ...field, ...obj }
            }
            if (isValidObject(field)) {
                //改变指定字段表单值
                form.setFieldsValue(field);
                //重新校验
                form.validateFields(Object.keys(field));
            }
        },
        [runwayPointSelectedDataChangeCounter]
    );

    // 初始化获取配置数据
    useEffect(
        function () {
            //获取配置数据
            fetchConfigData();
        }, [airport]);
    //卸载时清空store数据
    useEffect(
        function () {
            return () => {
                // 清空store数据
                RunwayDynamicPublishFormData.updateConfigData({})
            };
        },
        []
    );

    return (
        <Spin spinning={loading} >
            <div className="runway-edit-wrapper">
                <Form
                    form={form}
                    initialValues={initialValues}
                    // colon={false}
                    className="advanced_form"
                >
                    <Fragment>
                        <Card bordered={false} className="flow-control-flight">
                            <Row gutter={24} >
                                <Col span={4}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-no-colon" title="机场">机场</label>
                                        </div>
                                    </div>
                                </Col>

                                <Col span={20}>
                                    <Form.Item
                                        name="apName"
                                        label="机场"
                                        required={true}
                                        rules={[{ required: true }]}
                                    >
                                        <Radio.Group buttonStyle="solid">
                                            <Radio.Button value={apName}>{apName}</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} >
                                <Col span={4}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-no-colon" title="基本信息">基本信息</label>
                                        </div>
                                    </div>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        label="开始时间"
                                        colon={false}
                                        required={true}
                                        className="date-time-form-compact advanced-item"
                                    >
                                        <Form.Item
                                            name="startDate"
                                            className="date-picker-form"
                                            rules={[
                                                { required: true, message: '请选择开始日期' },
                                            ]}
                                        >
                                            <DatePicker
                                                // onChange={updateStartDateString}
                                                format={dateFormat}
                                                // disabledDate={disabledStartDate}
                                                placeholder={dateFormat}
                                                className="date-picker-form"
                                                showToday={false}
                                                mode="date"
                                                onOpenChange={onOpenStartDatePickerChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="startTime"
                                            label=""
                                            className="time-form"
                                            rules={[
                                                {
                                                    type: 'string',
                                                    pattern: REGEXP.TIMEHHmm,
                                                    message: '请输入有效的开始时间',
                                                },
                                                {
                                                    required: true,
                                                    message: '请输入开始时间',
                                                },
                                            ]}
                                        >
                                            <Input
                                                allowClear={true}
                                                placeholder={timeFormat}
                                            />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item
                                        label="结束时间"
                                        colon={false}
                                        className="date-time-form-compact advanced-item"
                                        required={true}
                                    >
                                        <Form.Item
                                            name="endDate"
                                            className="date-picker-form"
                                            dependencies={['endTime']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择结束日期'
                                                },
                                                ({ getFieldValue }) => validateEndDateFormat(getFieldValue),
                                            ]}
                                        >
                                            <DatePicker
                                                // onChange={updateEndTimeDisplay}
                                                format={dateFormat}
                                                disabledDate={disabledEndDate}
                                                placeholder={dateFormat}
                                                className="date-picker-form"
                                                showToday={false}
                                                onOpenChange={onOpenEndDatePickerChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="endTime"
                                            label=""
                                            className="time-form"
                                            dependencies={['endDate', 'startDate', 'startTime']}
                                            required={true}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入结束时间',
                                                },
                                                {
                                                    type: 'string',
                                                    pattern: REGEXP.TIMEHHmm,
                                                    message: '请输入有效的结束时间',
                                                },
                                                ({ getFieldValue }) => validateTimeRange(getFieldValue),
                                            ]}
                                        >
                                            <Input
                                                allowClear={true}
                                                placeholder={timeFormat}
                                                onChange={handleEndTimeChange}
                                            />
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item
                                        name="operationmode"
                                        label="运行模式"
                                        required={true}
                                        rules={[{ required: true }]}
                                    >
                                        <Radio.Group buttonStyle="solid">
                                            <Radio.Button value={200}>走廊口模式</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} >
                                <Col span={4}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-no-colon" title="模板配置">模板配置</label>
                                        </div>
                                    </div>
                                </Col>

                                <Col span={16}>

                                    <Form.Item
                                        label="选择模板"
                                    >
                                        <Select
                                            disabled={props.disabledForm}
                                            // mode="tags"
                                            style={{ width: '100%' }}
                                            placeholder="选择模板"
                                            allowClear={true}
                                        >
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} >
                                <Col span={4}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ">
                                            <label className="ant-form-item-no-colon" title="跑道配置">跑道配置</label>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={20}>
                                    {
                                        listRWGapInfo.map((item, index) => (
                                            drawSingleRunway(item)
                                        ))
                                    }
                                </Col>
                            </Row>
                        </Card>
                    </Fragment>

                    <footer className="footer-bar">
                        <Space size="middle">
                            <Button type="primary" onClick={handleSaveButtonClick}>发布</Button>
                            <Button onClick={closeModal}>关闭</Button>
                        </Space>
                    </footer>
                </Form>
            </div>
        </Spin>
    );
}
export default inject(
    "systemPage",
    "runwayListData",
    "RunwayDynamicPublishFormData",
)(observer(RunwayDynamicPublishForm));
