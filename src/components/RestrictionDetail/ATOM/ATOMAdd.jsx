
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-26 15:54:49
 * @LastEditors: Please set LastEditors
 * @Description: ATOM新增
 */
import React, { useEffect, useState } from 'react'
import { Row, Col, message as antdMessage, } from 'antd'
import ATOMDetail from 'components/RestrictionDetail/ATOM/ATOMDetail'
import SchemeForm from 'components/RestrictionForm/SchemeForm'
import { inject, observer } from "mobx-react";

import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
// ATOM新增导入生成方案
function ATOMAdd(props) {
    const { title, setDisabledForm, disabledForm, pageType } = props;
    let [flowData, setFlowData] = useState({});
    let [message, setMessage] = useState({});

    //更新方案列表数据
    const updateData = data => {
        let { status } = data;
        if (status === 500) {
            antdMessage.error('获取的流控数据为空');
        } else {
            // 更新数值
            setFlowData(data);
            // 更新方案表单store数据
            let tacticProcessInfo = data.tacticProcessInfo || {};
            props.schemeFormData.updateSchemeData(tacticProcessInfo);
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
        let url = ReqUrls.ATOMCreateDataUrl + id
        // 请求参数
        const opt = {
            url: url,
            method: 'GET',
            params: {
                userId: user.id
            },
            resFunc: (data) => updateData(data),
            errFunc: (err) => requestErr(err, '流控数据获取失败'),
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
                    <span>{title}</span>
                </Row>
                {
                    //新增
                    (pageType === "ATOMAdd") &&
                    <ATOMDetail flowType="ATOMData" flowData={flowData} title="流控信息" />
                }

            </Col>
            <Col span={12} className="res_right">
                <Row className="title">
                    <span>流控导入</span>
                </Row>
                
                <SchemeForm
                    pageType="IMPORT"
                    operationDescription="流控导入"
                    primaryButtonName="导入"
                    disabledForm={disabledForm}
                    setDisabledForm={setDisabledForm}
                    message={message}
                    showEditBtn={true}
                    showIgnoreBtn={true}
                    bordered={true}
                    operationBarClassName="outside"
                ></SchemeForm>
            </Col>
        </Row>
    )
}
// export default ATOMAdd;
export default inject("schemeFormData", "systemPage")(observer(ATOMAdd))


