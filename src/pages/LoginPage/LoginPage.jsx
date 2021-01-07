import React, {useCallback, useEffect} from 'react';
import {Form, Icon, Input, Button, Alert,Row, Col} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import { Base64 } from 'js-base64';
import { requestGet, request } from 'utils/request';
import './LoginPage.scss'

function LoginPage(props){
    const [form] = Form.useForm();
    // 点击登录按钮登录
    const handleSubmit = useCallback( () => {
        form.validateFields()
            .then(values => {
                const username = values.username.trim();
                // 对密码 base64编码 处理
                const password =  values.password.trim();
                const params = {
                    "username":username,
                    "password":password
                };
                console.log(params);
            })
            .catch(errorInfo => {
                console.error(errorInfo);
            });
    })

    const notEmpty = useCallback((rule, value, callback) => {
        if( value === undefined || null === value || value.trim() === "" ){
            const name = rule.field;
            switch(name){
                case "username" : callback("用户名不能为空！");
                case "password" : callback("密码不能为空！");
            }
        }else{
            callback();
        }
    })

    // 更新用户信息
    const updateUserInfoData = useCallback( (res) => {
        const {updateUserInfo, updateFlowcontrolParams, history} = props;
        // 200 成功
        if (200 === res.status * 1) {
            // 用户信息
            const {username = "", id: userId, waypoints, system, flowAssemblyAirports, systemProgram, airports, description, deiceGroupName} = res.user;
            // 用户权限
            const {allAuthority} = res;
            const params = {
                username, // 用户名
                loginStatus: true, // 登录状态
                userId, // 用户id
                allAuthority, // 用户权限
                airports, // 用户机场
                description, // 用户中文名称
                deiceGroupName, // 除冰分组
            };
            // 更新用户信息
            updateUserInfo(params);
        }
    })


    return (
        <div className="login bc-image-11">
            <Row type="flex" justify="center" align="middle">
                <Col xs={{ span: 16}}  md={{ span: 12}} lg={{ span: 13}}  xl={{ span: 9}} xxl={{ span: 7}} >
                    <div className="content">
                        <Form
                            form={form}
                              size="small"
                              onFinish={ (e)=>{
                                  // e.preventDefault();
                                  handleSubmit(e)
                              } }
                              className="login_form"
                        >
                            <h2 className="title">空中交通运行放行监控系统</h2>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '用户名不能为空' }]}
                            >
                                <Input  className="form_input" prefix={<UserOutlined />} placeholder="用户名"/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '密码不能为空' }]}
                            >
                                <Input   className="form_input" prefix={<LockOutlined />} placeholder="密码"/>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size={'large'} className="login_button">
                                登录
                            </Button>
                        </Form>

                    </div>
                    <p className="copyright">Copyright ADCC 民航数据通信有限责任公司</p>
                </Col>
            </Row>

        </div>
    )
}

export default LoginPage;
