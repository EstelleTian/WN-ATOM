
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM新增
 */
import React, {useEffect, useState} from 'react'
import { Row, Col, message as antdMessage,  } from 'antd'
import {getFullTime, getDayTimeFromString, isValidVariable } from 'utils/basic-verify'
import ATOMDetail  from 'components/RestrictionDetail/ATOMDetail'
import RestrictionForm  from 'components/RestrictionForm/RestrictionForm'
import FlowRelation  from 'components/RestrictionForm/FlowRelation'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { sendMsgToClient } from 'utils/client'
// ATOM新增导入生成方案
function ATOMAdd(props){
    const { title, setDisabledForm,  disabledForm} = props;
    let [flowData, setFlowData] = useState({});
    let [ message, setMessage ] = useState({});

    //更新方案列表数据
    const updateData = data => {
        let {  status } = data;
        if( status === 500 ){
            antdMessage.error('获取的流控数据为空');
        }else{
            setFlowData(data);
        }
    };
    // 请求ATOM数据失败
    const requestErr = (err, content) => {
        antdMessage.error({
            content,
            duration: 4,
        });
    };
    // 请求ATOM数据
    const requestATOMData = (id) => {
        // 获取当前用户
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        // 请求参数
        const opt = {
            url: ReqUrls.ATOMDataUrl + id,
            method:'GET',
            params:{
                userId: user.id
            },
            resFunc: (data)=> updateData(data),
            errFunc: (err)=> requestErr(err, '流控数据获取失败' ),
        };
        // 发送请求
        request(opt);
    };

    useEffect(() => {
        let msgStr = localStorage.getItem("message");
        let json = JSON.parse(msgStr);
        setMessage(json);
        let { data = {} } = json;
        data = JSON.parse(data);
        const id = data.id;
        console.log("id:", id);
        requestATOMData(id);
    }, []);

    return (
        <Row gutter={12} className="res_canvas">
            <Col span={12} className="res_left">
                <Row className="title">
                    <span>{ title }</span>
                </Row>
                <ATOMDetail flowData={ flowData } title="流控信息" />
            </Col>
            <Col span={12} className="res_right">
                <Row className="title">
                    <span>流控导入</span>
                    <FlowRelation
                        setDisabledForm = {setDisabledForm}
                        flowData={ flowData }
                        disabledForm = {disabledForm}
                        message={message}
                    />
                </Row>
                <RestrictionForm
                    pageType="IMPORT"
                    disabledForm = {disabledForm}
                    setDisabledForm = {setDisabledForm}
                    flowData={ flowData }
                    message={message}
                    showIgnoreBtn={true}
                />
            </Col>
        </Row>
    )
}
export default ATOMAdd;


