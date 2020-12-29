
import React, { Suspense } from  'react'
import {Form, Input, Button, Checkbox, Spin, Row, Col} from "antd";
import ATOMDetail  from 'components/RestrictionDetail/ATOMDetail.jsx'
import NTFMDetail  from 'components/RestrictionDetail/NTFMDetail.jsx'
import './RestrictionPage.scss'

//限制详情
function RestrictionPage(props ) {

    return (
        <Suspense fallback={ <div className="load_spin"><Spin tip="加载中..."/></div> }>
            <Row className="res_canvas">
                <Col span={12} className="res_left">
                    <Row className="title">
                        <span>数据来源</span>
                        <Button onClick={ function(e){  } } >忽略</Button>
                    </Row>
                    <Row>
                        <Col>
                            {/*<ATOMDetail></ATOMDetail>*/}
                            <NTFMDetail></NTFMDetail>
                        </Col>
                    </Row>
                </Col>
                <Col span={12} className="res_right">
                    <Row className="title">
                        <span>流控导入</span>
                        <Button onClick={ function(e){  } } >流控关联</Button>
                    </Row>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item  name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Suspense>

    )

}

export default RestrictionPage