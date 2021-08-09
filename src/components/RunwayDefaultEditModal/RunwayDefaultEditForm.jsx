import React, { Fragment, useEffect } from "react";
import { Form, Radio, Row, Col, Button, Input, Modal, Space, Spin, Card, Select, DatePicker } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { inject, observer } from "mobx-react";
import { request, requestGet } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidVariable, isValidObject, parseFullTime, formatTimeString } from 'utils/basic-verify';
import { REGEXP } from 'utils/regExpUtil'
import moment from 'moment'
import { difference } from 'lodash';

// axios自带的qs库,用于将参数序列化
import qs from 'qs'
import RunwaySingleConfigDataForm from 'components/Runway/RunwaySingleConfigDataForm'
// import './RunwayDefaultEditForm.scss'


// 默认跑道修改表单
function RunwayDefaultEditForm(props) {
    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'HHmm';
    const dateTimeFormat = "YYYYMMDDHHmm"

    // 跑道状态选项
    const statusOptions = [
        { label: '起飞', value: '1' },
        { label: '降落', value: '-1' },
        { label: '关闭', value: '0' },
    ]

    const { systemPage, RunwayDefaultEditFormData, runwayListData } = props;
    // 用户id
    const userId = systemPage.user.id || ""
    // 当前系统
    const activeSystem = systemPage.activeSystem || {};
    // 系统region
    const region = activeSystem.region || "";
    // 表单
    const [form] = Form.useForm();
    // loading
    const loading = RunwayDefaultEditFormData.loading;
    // 跑道状态勾选数值变更计数器
    const ruwayStatusSelectedDataChangeCounter = RunwayDefaultEditFormData.ruwayStatusSelectedDataChangeCounter;
    // 跑道航路点勾选数值变更计数器
    const runwayPointSelectedDataChangeCounter = RunwayDefaultEditFormData.runwayPointSelectedDataChangeCounter;

    // 获取数据时的请求参数
    const requestParams = RunwayDefaultEditFormData.requestParams || {};
    // 配置数据
    const configData = RunwayDefaultEditFormData.configData || {};
    // 机场名称
    const apName = RunwayDefaultEditFormData.airport || "";
    // 运行模式
    const operationmode = RunwayDefaultEditFormData.operationmode || "";
    // 各跑道状态勾选数值
    const ruwayStatusSelectedData = RunwayDefaultEditFormData.ruwayStatusSelectedData || {};
    // 各跑道航路点勾选数值
    const runwayPointSelectedData = RunwayDefaultEditFormData.runwayPointSelectedData || {};

    // 终端当前时间
    let now = moment();
    const groupId = RunwayDefaultEditFormData.groupId || ""
    // 开始时间
    const startTime = RunwayDefaultEditFormData.startTime || "";
    // 结束时间
    const endTime = RunwayDefaultEditFormData.endTime || "";

    // 开始日期 Date类型
    const startDate = isValidVariable(startTime) ? moment(startTime, dateFormat) : moment(now, dateFormat);
    // 结束日期 Date类型
    const endDate = isValidVariable(endTime) ? moment(endTime, dateFormat) : "";
    // 结束日期 HHmm
    const startTimeString = isValidVariable(startTime) ? startTime.substring(8, 12) : moment(now).format(dateTimeFormat).substring(8, 12);
    // 结束时间 HHmm
    const endTimeString = isValidVariable(endTime) ? endTime.substring(8, 12) : "";
    // 跑道航路点
    const runwayPoint = RunwayDefaultEditFormData.runwayPoint || [];
    // 跑道配置数据
    const listRWGapInfo = RunwayDefaultEditFormData.listRWGapInfo || [];
    // 跑道数量
    const runwayNumber = RunwayDefaultEditFormData.runwayNumber || 0;
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

    // 绘制单条跑道配置
    const drawSingleRunway = (runwayData) => {
        return (
            <Fragment key={runwayData.id}>
                <RunwaySingleConfigDataForm
                    form={form}
                    runwayData={runwayData}
                    statusOptions={statusOptions}
                    runwayPointOptions={runwayPointOptions}
                    storesData={RunwayDefaultEditFormData}
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
                    title: "确定修改",
                    // icon: <ExclamationCircleOutlined />,
                    centered: true,
                    closable: true,
                    content: (
                        <div>
                            <p>确定提交默认跑道修改?</p>
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
        let allPoint = [...RunwayDefaultEditFormData.allPoint];
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
        opt.airportStr = apName;
        opt.operationMode = operationmode;
        opt.groupId = groupId;
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
        RunwayDefaultEditFormData.toggleLoad(true);
        const opt = {
            url: ReqUrls.runwayDefaultUpdatelUrl + userId,
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
        RunwayDefaultEditFormData.toggleLoad(true);
        const opt = {
            url: ReqUrls.runwayDefaultDetailUrl + userId,
            method: "GET",
            params: requestParams,
            resFunc: (data) => fetchSuccess(data),
            errFunc: (err) => fetchErr(err),
        };
        requestGet(opt);
    };

    //获取配置数据成功
    const fetchSuccess = (data) => {
        RunwayDefaultEditFormData.toggleLoad(false);
        let runwayData = {};
        if (isValidObject(data)) {
            runwayData = data
        }
        RunwayDefaultEditFormData.updateConfigData(runwayData);
    };

    //数据获取失败回调
    const fetchErr = (err) => {
        RunwayDefaultEditFormData.toggleLoad(false);
        RunwayDefaultEditFormData.updateConfigData({});
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
        RunwayDefaultEditFormData.toggleLoad(false);
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }

        Modal.error({
            title: "修改失败",
            content: (
                <span>
                    <span>默认跑道修改失败</span>
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
        RunwayDefaultEditFormData.toggleLoad(false);
        // 触发获取跑道列表数据
        runwayListData.setForceUpdate(true);
        Modal.success({
            title: "修改成功",
            content: (
                <span>
                    <span>默认跑道修改成功</span>
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
        RunwayDefaultEditFormData.toggleModalVisible(false);
    }

    //groupId发生变化触发更新
    useEffect(
        function () {
            if (isValidVariable(groupId)) {
                //重置表单，用以表单初始值赋值
                form.resetFields();
                //重新校验
                form.validateFields();
            }
        },
        [groupId]
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
            //获取默认跑道配置数据
            fetchConfigData();
        },
        [JSON.stringify(requestParams)]
    );

    //卸载时清空store数据
    useEffect(
        function () {
            return () => {
                // 清空store数据
                RunwayDefaultEditFormData.updateConfigData({})
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
                            <Button type="primary" onClick={handleSaveButtonClick}>修改</Button>
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
    "RunwayDefaultEditFormData",
)(observer(RunwayDefaultEditForm));
