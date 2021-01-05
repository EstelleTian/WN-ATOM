import React, {useEffect} from 'react'
import "moment/locale/zh-cn"
import { Descriptions, Collapse, DatePicker, Card, Form, Input,} from 'antd'
import  moment  from 'moment'


//方案信息
function StaticInfoCard(props){

    const dateFormat = 'YYYYMMDD HHmm';

    const updateStartTimeDisplay =(date) => {
        let dateString = moment(date).format("YYYYMMDDHHmm");
        props.updateBasicStartTimeDisplay(dateString);
    };

    const updateEndTimeDisplay =(date) => {
        let dateString = moment(date).format("YYYYMMDDHHmm");
        props.updateBasicEndTimeDisplay(dateString);
    };

    return (
        <Card title="方案信息" size="small">
            <Descriptions size="small"  bordered column={2}>
                <Descriptions.Item label="方案名称">
                    <Form.Item
                        name="tacticName"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="原始流控">
                    <Form.Item
                        name="basicFlowControlName"
                    >
                        <Input disabled={ true }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="发布单位" >
                    <Form.Item
                        name="tacticPublishUnit"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="发布用户" >
                    <Form.Item
                        name="tacticPublishUser"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="开始时间" >
                        {
                            props.disabledForm
                                ? <Form.Item name="basicStartTimeDisplay">
                                    <Input disabled={ props.disabledForm }/>
                                </Form.Item>
                                : <Form.Item
                                    name="basicStartTimeEdit"
                                >
                                    <DatePicker allowClear={ false } onChange={ updateStartTimeDisplay } showTime format={dateFormat}/>
                                </Form.Item>
                        }
                </Descriptions.Item>
                <Descriptions.Item label="结束时间" >
                        {
                            props.disabledForm
                                ? <Form.Item name="basicEndTimeDisplay">
                                    <Input disabled={ props.disabledForm }/>
                                </Form.Item>
                                : <Form.Item
                                    name="basicEndTimeEdit"
                                >
                                    <DatePicker  allowClear={ false }  onChange={ updateEndTimeDisplay } showTime format={dateFormat} />
                                </Form.Item>
                        }
                </Descriptions.Item>
                <Descriptions.Item label="基准单元"  span={2}>
                    <Form.Item
                        name="targetUnit"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="前序单元">
                    <Form.Item
                        name="preorderUnit"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="后序单元">
                    <Form.Item
                        name="behindUnit"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="豁免前序">
                    <Form.Item
                        name="exemptPreUnit"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="豁免后序">
                    <Form.Item
                        name="exemptbehindUnit"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="限制高度" span={2}>
                    <Form.Item
                        name="highLimit"
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default  StaticInfoCard