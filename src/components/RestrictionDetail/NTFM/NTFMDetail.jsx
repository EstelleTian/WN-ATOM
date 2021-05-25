
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-25 16:34:55
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, { useEffect, useState } from 'react'
import { Form, Tag, Space, Card, Row, Col, Checkbox, DatePicker, Tabs, Radio, Tooltip, Alert } from 'antd';
import { DownOutlined, UpOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ExemptionPane from 'components/RestrictionDetail/NTFM/ExemptionPane'
import RestrictionPane from 'components/RestrictionDetail/NTFM/RestrictionPane'

import { formatTimeString, getDayTimeFromString, isValidVariable } from 'utils/basic-verify';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
import './NTFMDetail.scss'

function NTFMDetail(props) {

    let [tabVisible, setTabVisible] = useState(true);
    const intvOption = {
        "D": {
            "type": "距离",
            "unit": "KM"
        },
        "T": {
            "type": "时间",
            "unit": "分钟"
        }
    }

    const setOperation = () => {
        if (tabVisible) {
            return <Tooltip title="折叠"><span className="extra" onClick={() => { setTabVisible(false) }}><UpOutlined /></span></Tooltip>
        } else {
            return <Tooltip title="展开"><span className="extra" onClick={() => { setTabVisible(true) }}><DownOutlined /></span></Tooltip>
        }

    }
    const { flowData = {}, flowType, title } = props;
    const { formerNtfmFlowInfo = {}, ntfmFlowInfo = {} } = flowData;

    let flowInfo = {};
    if (flowType === "NTFMData") {
        flowInfo = ntfmFlowInfo;
    } else if (flowType === "FormerNTFMData") {
        flowInfo = formerNtfmFlowInfo;
    }
    // 流控基本信息
    const ntfmFlowBasicInfo = flowInfo.ntfmFlow || {};
    // 流控类型
    const ftmiType = ntfmFlowBasicInfo.ftmiType || "";
    // 流控数据
    const singleTypeFlowData = getSingleTypeFlowData(ftmiType);

    // 限制数据
    const trfdData = singleTypeFlowData.trfd || [];
    // 措施豁免数据
    const expdData = singleTypeFlowData.expd || [];


    // FtmiType数据
    const ntfmFtmiType = singleTypeFlowData.ntfmFtmiType || {};
    // 未成功转换的数据集合
    const unConvertedData = singleTypeFlowData.unConverted || [];
    // 所有措施豁免未成功转换
    const unConvertedAllExpd = unConvertedData.includes('expd');
    // 所有限制未成功转换
    const unConvertedAllTrfd = unConvertedData.includes('trfd');
    // 所有FtmiType数据未成功转换
    const unConvertedAllFtmiType = unConvertedData.includes('ntfmFtmiType');

    // 未成功转换的措施豁免字段数据
    const unConverted_expd = singleTypeFlowData.unConverted_expd || {}
    // 未成功转换的限制字段数据
    const unConverted_trfd = singleTypeFlowData.unConverted_trfd || {}
    // 未成功转换的FtmiType数据字段集合
    const unConverted_ntfmFtmiType = singleTypeFlowData.unConverted_ntfmFtmiType || []

    // NTFM流控名称
    const name = ntfmFtmiType.resgName || "";

    // 发起单位
    const resCreateUnit = ntfmFlowBasicInfo.resCreateUnit || "";
    // 接收单位
    const resRecvUnit = ntfmFlowBasicInfo.resRecvUnit || "";
    // 等级
    const priority = ntfmFtmiType.priority || "";
    // 时段开始
    const ftmiStartTime = ntfmFtmiType.ftmiStartTime || "";
    // 时段结束
    const ftmiEndTime = ntfmFtmiType.ftmiEndTime || "";
    // 措施内容
    const ftmiContent = ntfmFtmiType.ftmiContent || "";

    // 总量/间隔限制 (F:总量  C:间隔)
    const mitType = ntfmFtmiType.mitType || "";

    // 间隔类型(D:距离 T:时间)
    const intvType = ntfmFtmiType.intvType || "";
    // 间隔单位
    const intvUnit = intvOption[intvType] ? intvOption[intvType].unit : "";
    // 间隔值
    const intvValue = ntfmFtmiType.intvValue || "";
    // 总量
    const volumePiece = ntfmFtmiType.volumePiece || "";
    // 架次
    const volumeNum = ntfmFtmiType.volumeNum || "";

    // 最小间隔类型(D:距离限制 T:时间限制)
    const minIntvType = ntfmFtmiType.minIntvType || "";

    // 最小间隔值 
    const minIntvValue = ntfmFtmiType.minIntvValue || "";

    // 最小间隔值单位
    const minIntvUnit = intvOption[minIntvType] ? intvOption[minIntvType].unit : "";
    // 是否同高度
    let sameAlt = ntfmFtmiType.sameAlt === "Y";

    // 特殊限制
    const resSpecial = ntfmFtmiType.resSpecial || "";
    // 高度限制
    const resAltType = ntfmFtmiType.resAltType || "";
    // 限制高度值
    const resAltValue = ntfmFtmiType.resAltValue || "";


    // 获取指定类型下的流控数据
    function getSingleTypeFlowData(type) {
        let result = {};
        const { ntfmGdp = {}, ntfmGs = {}, ntfmMit = {}, ntfmAfp = {} } = flowInfo;
        if (type === "MIT") {
            result = ntfmMit;
        } else if (type === "GDP") {
            result = ntfmGdp;
        } else if (type === "GS") {
            result = ntfmGs;
        } else if (type === "AFT") {
            result = ntfmAfp;
        }
        return result;
    }
    // 绘制间隔限制信息
    const drawIntervalInfo = () => {
        let info = "间隔";
        if (mitType === "C") {
            info = (
                <span>
                    <span>间隔</span>
                    <Tag style={{ marginLeft: 4 }}>{intvValue}</Tag>
                    <span>{intvUnit}</span>
                </span>
            )
        }
        return info;
    }

    // 绘制总量限制信息
    const drawVolumeInfo = () => {
        let info = "总量";
        if (mitType === "F") {
            info = (
                <span>
                    <span>总量</span>
                    <Tag style={{ marginLeft: 4 }}>{volumePiece}</Tag>分钟
                    <Tag style={{ marginLeft: 4 }}>{volumeNum}</Tag>架次
                    <span style={{ marginLeft: 12 }}>
                        最小<Tag style={{ marginLeft: 4 }}>{minIntvValue}</Tag>{minIntvUnit}
                    </span>
                </span>
            )
        }
        return info;
    }
    // 校验是否为未成功转换的字段
    const isUnConvertedField = (fields, fieldName) => {
        let result = false;
        if (Array.isArray(fields) && fields.length > 0) {
            result = fields.includes(fieldName);
        }
        return result;
    }

    return (
        <Row>
            <Col span={24}>
                <Alert
                    message="标红项为未转换成功，请自行处理"
                    type="warning"
                    closable
                    className="warning-alert"
                />
            </Col>
            <Col span={24}>
                <Form
                    className="advanced_form NTFM_detail_form bordered-form"
                    colon={false}
                    labelAlign="left"
                >
                    <Card title={title} size="small" className="advanced-card" bordered={false} >
                        <div className="info-content">
                            <Row>
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <Radio.Group defaultValue="MIT" buttonStyle="solid">
                                            <Space >
                                                <Radio.Button value="MIT">MIT</Radio.Button>
                                                {/* <Radio.Button value="GDP">GDP</Radio.Button>
                                                <Radio.Button value="GS">GS</Radio.Button>
                                                <Radio.Button value="AFT">AFT</Radio.Button> */}
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="流控名称">流控名称</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{name}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="发起单位">发起单位</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{resCreateUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="接收单位">接收单位</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{resRecvUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={isUnConvertedField(unConverted_ntfmFtmiType, 'priority') ? `ant-row ant-form-item un-coverted-item` : `ant-row ant-form-item`} >
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="等级">
                                                等级
                                                </label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{priority}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="时段">时段</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    <span>{formatTimeString(ftmiStartTime)}</span>
                                                    <Tag style={{ marginLeft: 20, marginRight: 20 }}>至</Tag>
                                                    <span>{formatTimeString(ftmiEndTime)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="措施内容">措施内容</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{ftmiContent}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Card title="交通流限制" size="small" className="advanced-card traffic-flow-box" bordered={false} >
                        <div className="info-content">
                            <Row>
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <Tabs className="traffic-flow-tab" defaultActiveKey="1" type="card" tabBarExtraContent={setOperation()}>

                                            <TabPane tab="限制" key="RESTRICTION">
                                                {tabVisible ? <RestrictionPane data={trfdData} unConvertedAll={unConvertedAllTrfd} unConverted_trfd={unConverted_trfd} ></RestrictionPane> : ""}
                                            </TabPane>
                                            <TabPane tab="措施豁免(占量)" key="EXEMPTION">
                                                {tabVisible ? <ExemptionPane data={expdData} unConvertedAll={unConvertedAllExpd} unConverted_expd={unConverted_expd}  ></ExemptionPane> : ""}
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Card title="总量/间隔限制" size="small" className="advanced-card" bordered={false}>
                        <div className="info-content">
                            <Row className="info-row">
                                <Col span={20}>
                                    <div className="ant-row ant-form-item">

                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    <Radio.Group value={mitType}>
                                                        <Radio value="N">无</Radio>
                                                        <Radio value="C">
                                                            {
                                                                drawIntervalInfo()
                                                            }
                                                        </Radio>
                                                        <Radio value="F">
                                                            {
                                                                drawVolumeInfo()
                                                            }
                                                        </Radio>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    <Checkbox checked={sameAlt} disabled >是否同高度</Checkbox>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Card title="特殊限制" size="small" className="advanced-card" bordered={false}>
                        <div className="info-content">
                            <Row className="info-row">
                                <Col span={24}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="特殊限制">特殊限制</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    <Radio.Group value={resSpecial}>
                                                        <Radio value="N">无</Radio>
                                                        <Radio value="D">起飞申请</Radio>
                                                        <Radio value="S">开车申请</Radio>
                                                        <Radio value="B">上客申请</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Card title="高度限制" size="small" className="advanced-card" bordered={false}>
                        <div className="info-content">
                            <Row className="info-row">
                                <Col span={12}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="高度限制">高度限制</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">
                                                    <Radio.Group value={resAltType}>
                                                        <Radio value="N">无</Radio>
                                                        <Radio value="O">指定</Radio>
                                                        <Radio value="U">含以上</Radio>
                                                        <Radio value="D">含以下</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="ant-row ant-form-item">
                                        <div className="ant-col ant-form-item-label ant-form-item-label-left">
                                            <label className="ant-form-item-no-colon" title="限制高度值">限制高度值</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <div className="ant-form-item-control-input">
                                                <div className="ant-form-item-control-input-content">{resAltValue}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Form>
            </Col>
        </Row>
    )
}


export default NTFMDetail;


