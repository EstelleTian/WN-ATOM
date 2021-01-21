import React, {useCallback, useEffect, useState} from 'react';
import {Form, Icon, Input, Button, Alert, Row, Col, message} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import md5 from 'js-md5'
import { requestGet } from 'utils/request';
import { ReqUrls } from 'utils/request-urls'
import { saveUserInfo } from 'utils/client';
import './LoginPage.scss'
const msgStyle = {
    top: '200px',
    position: 'relative',
    fontSize: '1.2rem',
}
function LoginPage(props){
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    // 点击登录按钮登录
    const handleSubmit = useCallback( () => {
        setLoading(true);
        form.validateFields()
            .then(values => {
                const username = values.username.trim();
                // 对密码 base64编码 处理
                const password =  values.password.trim();
                const cipher =  md5(password);
                const params = {
                    "username":username,
                    "cipher":cipher,
                    "macaddress":"4C-CC-6A-C9-BA-15",
                    "clientVersion":"1.5.6",
                };
                console.log(params);
                message.destroy();
                const opt = {
                    url: ReqUrls.loginUrl,
                    params,
                    resFunc: (data)=> {
                        // updateUserInfoData(data)
                        console.log(data);
                        const { status, user } = data;
                        if( status*1 === 200){
                            message.success({
                                content: "登录成功",
                                duration: 4,
                                style: msgStyle
                            });
                
                            localStorage.setItem("user", JSON.stringify(user) );
                            saveUserInfo(username, password);
                        }else{
                            const err = data.error;
                            const msg = err.message;
                            message.error({
                                content: msg || "登录失败",
                                duration: 10,
                                style: msgStyle
                            });
                        }
                        setLoading(false);
                    },
                    errFunc: (err)=> {
                        message.error({
                            content: "登录失败",
                            duration: 10,
                            style: msgStyle
                        });
                        setLoading(false);
                    }
                };
                requestGet( opt )
            })
            .catch(errorInfo => {
                console.error(errorInfo);
                setLoading(false);
            });
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
                <Col xs={{ span: 14}}  md={{ span: 11}} lg={{ span: 9}}  xl={{ span: 7}} xxl={{ span: 6}} >
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
                                <Input type="password" className="form_input" prefix={<LockOutlined />} placeholder="密码"/>
                            </Form.Item>
                            <div className="login_btn  justify-content-center">
                                <Button loading={loading} type="primary" htmlType="submit" size={'large'}
                                        className="login_button">
                                    登录
                                </Button>
                            </div>

                        </Form>

                    </div>
                    
                </Col>
            </Row>
            <div className="copyright">Copyright ADCC 民航数据通信有限责任公司</div>

        </div>
    )
}

export default LoginPage;
