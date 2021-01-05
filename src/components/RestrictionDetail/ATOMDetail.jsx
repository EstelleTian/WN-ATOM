
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect} from 'react'
import { Tag, Descriptions, Checkbox , Space, Card, Row, Col  } from 'antd'
import {getFullTime, getDayTimeFromString, isValidVariable } from '../../utils/basic-verify'
import './ATOMDetail.scss'

//顶部导航模块
function ATOMDetail(props){

    const options = [
        { label: '是否同意高度', value: 'sameHeight' },
        { label: '起飞申请', value: 'takeoffApply' },
        { label: '禁航', value: 'noFly' },
    ];

    console.log(props);
    const { flowData = {} } = props;
    const { atomFlowInfo = {} } = flowData;

    let { id, flowId, beginTime, endTime, flowName, forwardingtype,  sendUnit, recvUnit,
        reason, sendSubUnit, content, arrAirport, arrExempt, depAirport,  inArea, route, depExempt,
        contlPoint, controltype, dataStatus, delay, effective, flyArea, remark, sameHeight, takeoffApply,  noFly,
        htype, hvalue,
    } = atomFlowInfo;

    const checkedVal = [];
    if(sameHeight == "Y"){
        checkedVal.push(sameHeight);
    }
    if(takeoffApply == "Y"){
        checkedVal.push(takeoffApply);
    }
    if(noFly == "Y"){
        checkedVal.push(noFly);
    }



    return (
        <Row>
            <Col span={24}>
             <Card title="基本信息" size="small" className="advanced-card" bordered={false} >
                <Descriptions size="small" bordered column={3}>
                    <Descriptions.Item label="流控名称" span={3}>
                        {flowName}
                    </Descriptions.Item>
                    <Descriptions.Item label="流控ID">
                        {id}
                    </Descriptions.Item>
                    <Descriptions.Item label="流控类型">
                        { forwardingtype }
                    </Descriptions.Item>
                    <Descriptions.Item label="发布单位">
                        { sendUnit }
                    </Descriptions.Item>
                    <Descriptions.Item label="受控单位">
                        { recvUnit }
                    </Descriptions.Item>
                    <Descriptions.Item label="流控原因" >
                        { reason }
                    </Descriptions.Item>
                    <Descriptions.Item label="事发地">
                        { sendSubUnit }
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            </Col>
            <Col span={24}>
            <Card title="流控内容" size="small" className="advanced-card" bordered={false}  >
                <Descriptions size="small" title="" bordered column={3}>
                    <Descriptions.Item label="交接点(入点)">
                        { contlPoint }
                    </Descriptions.Item>
                    <Descriptions.Item label="开始时间">
                        { getDayTimeFromString( beginTime )}
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间">
                        { getDayTimeFromString( endTime )}
                    </Descriptions.Item>
                    <Descriptions.Item label="交接点(出点)">

                    </Descriptions.Item>
                    <Descriptions.Item label="开始时间">

                    </Descriptions.Item>

                    <Descriptions.Item label="结束时间">

                    </Descriptions.Item>
                    <Descriptions.Item label="起飞机场">
                        {depAirport}
                    </Descriptions.Item>
                    <Descriptions.Item label="飞越区域">
                        {flyArea}
                    </Descriptions.Item>

                    <Descriptions.Item label="起飞机场豁免">
                        {depExempt}
                    </Descriptions.Item>
                    <Descriptions.Item label="落地机场">
                        {arrAirport}
                    </Descriptions.Item>
                    <Descriptions.Item label="进...区域">
                        {inArea}
                    </Descriptions.Item>

                    <Descriptions.Item label="落地机场豁免">
                        {arrExempt}
                    </Descriptions.Item>
                    <Descriptions.Item label="高度限制" span={3}>
                        <Space size={ 50 }>
                        <span>
                            { hvalue }
                        </span>
                            <span>
                            <Checkbox.Group options={options} defaultValue={checkedVal} disabled  />
                        </span>

                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="航路">
                        {route}
                    </Descriptions.Item>
                    <Descriptions.Item label="持续时间">
                        { isValidVariable(effective) ? `${effective} 分钟` : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="迟发时间">
                        { isValidVariable(delay) ? `${delay} 分钟` : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="自由编辑" span={3}>
                        { content }
                    </Descriptions.Item>
                    <Descriptions.Item label="备注" span={3}>
                        {remark}
                    </Descriptions.Item>



                </Descriptions>
            </Card>
            </Col>
        </Row>
    )
}


export default ATOMDetail;


