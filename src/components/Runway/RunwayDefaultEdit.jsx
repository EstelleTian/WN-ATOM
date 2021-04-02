
import React, { useEffect, useState, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Spin, Form, Space, Card, Row, Col, Input, Select, Modal, Radio, Checkbox } from 'antd'
import { InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { isValidObject, isValidVariable } from 'utils/basic-verify'
import RunwaySingleDataForm from 'components/Runway/RunwaySingleDataForm'

import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
// axios自带的qs库,用于将参数序列化
import qs from 'qs'


import './RunwayDefaultEdit.scss'

//表单整体
function RunwayDefaultEdit(props) {
    // 用于触发表单更新的变量
    let [formRenderStore, setFormRenderStore] = useState(0);
    // 确认提交模态框确定按钮loading变量
    let [confirmModalOkButtonLoading, setConfirmModalOkButtonLoading] = useState(false);
    // 确认提交模态框取消按钮是否禁用变量
    let [confirmModalCancelButtonDisabled, setConfirmModalCancelButtonDisabled] = useState(false);
    // 确认提交模态框右上角关闭按钮是否显示变量
    let [confirmModalClosableButtonVisible, setConfirmModalClosableButtonVisible] = useState(true);

    // 提交按钮是否禁用变量
    let [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    // 保存按钮
    let [confirmModalVisible, setConfirmModalVisible] = useState(false);
    // 跑道列表stores
    const { runwayListData } = props;

    const systemPage = props.systemPage || {};
    // 用户信息
    const user = systemPage.user || {};
    // 跑道详情数据
    const { data = {} } = props;

    const setModalVisible = props.setModalVisible;
    // 跑道数据集合
    const listRWGapInfoDefault = data.listRWGapInfoDefault || [];
    // 走廊口
    const lstRWPoint = data.lstRWPoint || [];
    // 取第一条跑道数据
    const firstRunway = listRWGapInfoDefault[0] || {};

    // 机场
    const apName = firstRunway.apName || "";
    // 运行模式
    const operationmode = firstRunway.operationmode || "";

    // 获取跑道字段及数值
    let runwayValues = updateRunwayFieldValue();
    // 表单初始数值对象集合
    let initialValues = { apName, operationmode, ...runwayValues }
    // 记录跑道id集合
    let runwayIds = listRWGapInfoDefault.map((item) => (item.id.toString()));
    console.log(runwayIds)


    // 跑道状态选项
    const statusOptions = [
        { label: '起飞', value: '1' },
        { label: '降落', value: '-1' },
        { label: '关闭', value: '0' },
    ]

    // 所有走廊口选项
    let runwayPointOptions = updateRunwayPointOptions();
    const [form] = Form.useForm();

    useEffect(function () {
        //重置表单，用于重新初始表单的initialValues属性
        form.resetFields();
        // 更新formRenderStore变量值以触发表单渲染
        setFormRenderStore(formRenderStore + 1)
    }, [data]);

    // 转换跑道状态数值
    function convertRunwayStauts(status) {
        let arr = [];
        let statusStr = status.toString();
        if (statusStr === "0") {
            // 关闭
            arr = ["0"];
        } else if (statusStr === "1") {
            // 起飞
            arr = ["1"];
        } else if (statusStr === "-1") {
            // 降落
            arr = ["-1"];
        } else if (statusStr === "2") {
            // 起降
            arr = ["1", "-1"];
        }
        return arr;
    }


    // 更新跑道字段及字段数值
    function updateRunwayFieldValue() {
        let field = {}
        for (let i = 0; i < listRWGapInfoDefault.length; i++) {
            let singleRunway = listRWGapInfoDefault[i];
            // 跑道id
            const id = singleRunway.id || "";
            // 选中的逻辑跑道
            const logicRWDef = singleRunway.logicRWDef || "";
            // 选中的走廊口
            const wayPoint = isValidVariable(singleRunway.wayPoint) ? singleRunway.wayPoint.split(',') : [];
            // 逻辑跑道A名称
            const logicRWNameA = singleRunway.logicRWNameA || "";
            // 逻辑跑道B名称
            const logicRWNameB = singleRunway.logicRWNameB || "";
            // 逻辑跑道A滑行时间
            const logicRWTaxitimeA = singleRunway.logicRWTaxitimeA || "";
            // 逻辑跑道B滑行时间
            const logicRWTaxitimeB = singleRunway.logicRWTaxitimeB || "";
            // 逻辑跑道A起飞间隔
            const logicRWValueA = singleRunway.logicRWValueA || "";
            // 逻辑跑道B起飞间隔
            const logicRWValueB = singleRunway.logicRWValueB || "";
            // 跑道状态 0:关闭  1:起飞  2:起降 -1:降落
            let isDepRW = singleRunway.isDepRW || "";
            // 转换跑道状态值
            isDepRW = convertRunwayStauts(isDepRW)
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

    // 更新所有走廊口选项
    function updateRunwayPointOptions() {
        let options = [];
        let points = lstRWPoint.sort((a, b) => {
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
        options = points.map((item, index) => ({ label: item.pointName, value: item.pointName }))
        return options;
    }

    // 绘制单条跑道
    const drawSingleRunway = (runwayData) => {
        return (
            <Fragment key={runwayData.id}>
                <RunwaySingleDataForm
                    form={form}
                    runwayData={runwayData}
                    statusOptions={statusOptions}
                    runwayPointOptions={runwayPointOptions}
                >
                </RunwaySingleDataForm>
            </Fragment>)
    }

    // 表单字段值更新时触发回调事件
    const valuesChange = (changedValues, allValues) => {
        console.log(changedValues);
        let key = Object.keys(changedValues)[0];
        let val = Object.values(changedValues)[0];
        let keyArr = key.split('_');
        let field = keyArr[0];
        let runwayId = keyArr[1];
        if (field === "isDepRW") {
            // 单条跑道状态变更
            setRunwayStatusFieldsValue(runwayId, val, allValues);
        }
    }

    // 设置跑道状态选项勾选状态
    const setRunwayStatusFieldsValue = (runwayId, values, allValues) => {
        // 设置本跑道状态选项勾选状态

        let data = {};
        let field = `isDepRW_${runwayId}`
        data[field] = [];
        // 更新表单中状态复选框选中状态
        // form.setFieldsValue(data);



    }

    // 保存按钮点击事件
    const handleSaveButtonClick = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            // 打开确认提示框
            setConfirmModalVisible(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }

    }

    // 关闭确认提示框
    const handleHideConfirmModalVisible = () => {
        // 关闭确认提示框
        setConfirmModalVisible(false);
    }

    // 处理表单提交数据
    const handleSubmitFormData = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            // 处理提交数据
            const submitData = handleSubmitData(values);
            // 数据提交
            submitFormData(submitData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    /**
     * handleSubmitData() 返回接口原数据与表单数据融合后的数据对象
     * @param {Object} 表单数据对象
     * @return {Object}  融合后的数据对象
     * */
    const handleSubmitData = (values) => {
        let opt = {};
        const firstRunway = listRWGapInfoDefault[0] || {};
        // 机场
        const apName = firstRunway.apName || "";
        // 运行模式
        const operationmode = firstRunway.operationmode || "";
        // 跑道groupId
        const groupId = firstRunway.groupId || "";
        // 是否显示就近模式选项按钮
        const showOperationNear = 0;

        opt.airportStr = apName;
        opt.operationMode = operationmode;
        opt.groupId = groupId;
        opt.showOperationNear = showOperationNear;

        for (let i = 0; i < listRWGapInfoDefault.length; i++) {
            let singleRunway = listRWGapInfoDefault[i];
            // 跑道id
            const id = singleRunway.id || "";
            // 跑道名称
            const name = singleRunway.rwName || "";
            // 选中的逻辑跑道
            const logicRWDef = values[`selectedLogic_${id}`] || "";
            // 选中的走廊口
            const wayPoint = values[`runwayPoint_${id}`] || "";
            // 跑道状态 0:关闭  1:起飞  2:起降 -1:降落
            let isDepRW = values[`isDepRW_${id}`] || [];
            // 逻辑跑道A名称
            const logicRWNameA = singleRunway.logicRWNameA || "";
            // 逻辑跑道B名称
            const logicRWNameB = singleRunway.logicRWNameB || "";
            // 逻辑跑道A滑行时间
            const logicRWTaxitimeA = values[`taxi_${id}_${logicRWNameA}`] || "";
            // 逻辑跑道B滑行时间
            const logicRWTaxitimeB = values[`taxi_${id}_${logicRWNameB}`] || "";
            // 逻辑跑道A起飞间隔
            const logicRWValueA = values[`interval_${id}_${logicRWNameA}`] || "";
            // 逻辑跑道B起飞间隔
            const logicRWValueB = values[`interval_${id}_${logicRWNameB}`] || "";

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
                // 注意：走廊口字段为固定字符串rwDefaultStrLst+索引
                [`rwDefaultStrLst[${i}]`]: isDepRW.join(','),
            }
            opt = { ...opt, ...obj }
        }
        return opt;
    };
    /**
     * 数据提交
     * */
    const submitFormData = (data) => {
        // 禁用提交按钮
        setSubmitButtonDisabled(true);
        // 开启确认框的确认按钮loading
        setConfirmModalOkButtonLoading(true);
        // 禁用确认框的取消按钮
        setConfirmModalCancelButtonDisabled(true)
        // 隐藏确认框右上角关闭按钮
        setConfirmModalClosableButtonVisible(false);
        const opt = {
            url: ReqUrls.runwayDefaultUpdatelUrl + user.id,
            headers: 'application/x-www-form-urlencoded; charset=UTF-8',
            method: 'POST',
            // 注意：此接口参数需要序列化，使用axios自带的qs库实现
            params: qs.stringify(data),
            resFunc: (data) => requestSuccess(data),
            errFunc: (err) => requestErr(err),
        };
        request(opt);
    };

    /**
     * 数据提交成功回调
     * */
    const requestSuccess = (data) => {
        // 触发获取跑道列表数据
        runwayListData.triggerRequest();
        // 关闭确认框的确认按钮loading
        setConfirmModalOkButtonLoading(false);
        // 启用用确认框的取消按钮
        setConfirmModalCancelButtonDisabled(false);
        // 显示确认框右上角关闭按钮
        setConfirmModalClosableButtonVisible(true);
        // 隐藏确认框
        setConfirmModalVisible(false);

        Modal.success({
            centered: true,
            title: '跑道修改成功',
        });
        // 关闭窗口
        if (typeof (setModalVisible) === 'function') {
            // setModalVisible(false)
        }
    };

    /**
     * 数据提交失败回调
     * */
    const requestErr = (err) => {
        // 启用提交按钮
        setSubmitButtonDisabled(false);
        // 关闭确认框的确认按钮loading
        setConfirmModalOkButtonLoading(false);
        // 启用用确认框的取消按钮
        setConfirmModalCancelButtonDisabled(false);
        // 显示确认框右上角关闭按钮
        setConfirmModalClosableButtonVisible(true);
        // 隐藏确认框
        setConfirmModalVisible(false);

        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        Modal.error({
            centered: true,
            title: '跑道修改失败',
            content: (
                <div>
                    <p>{errMsg}</p>
                </div>)
        });
    };

    return (
        <Spin spinning={false} >
            <div className="runway-edit-wrapper">
                <Form
                    form={form}
                    initialValues={initialValues}
                    onFinish={(values) => {
                    }}
                    onValuesChange={valuesChange}
                    colon={false}
                    className={props.bordered ? `advanced_form bordered-form` : "advanced_form"}
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

                                <Col span={20}>
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
                                        listRWGapInfoDefault.map((item, index) => (
                                            drawSingleRunway(item)
                                        ))
                                    }
                                </Col>
                            </Row>
                        </Card>
                    </Fragment>

                    <footer className="footer-bar">
                        <Space size="middle">
                            <Button type="primary" disabled={submitButtonDisabled} onClick={handleSaveButtonClick}>保存</Button>
                            <Button onClick={() => { setModalVisible(false) }}>关闭</Button>
                        </Space>
                    </footer>
                    <Modal
                        title="确认提交"
                        visible={confirmModalVisible}
                        maskClosable={false}
                        centered
                        closable={confirmModalClosableButtonVisible}
                        onOk={handleSubmitFormData}
                        onCancel={handleHideConfirmModalVisible}
                        // 取消按钮属性
                        cancelButtonProps={{ disabled: confirmModalCancelButtonDisabled }}
                        confirmLoading={confirmModalOkButtonLoading}
                    >
                        <p>提交默认跑道修改?</p>
                    </Modal>
                </Form>
            </div>
        </Spin>
    )

}

// export default RunwayDefaultEdit;
export default inject("systemPage", "runwayListData",)(observer(RunwayDefaultEdit))
