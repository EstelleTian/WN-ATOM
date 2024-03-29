
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-26 15:54:49
 * @LastEditors: Please set LastEditors
 * @Description: NTFM新增
 */
import React, {useEffect, useState} from 'react'
import { Row, Col, message as antdMessage,  } from 'antd'
import NTFMDetail  from 'components/RestrictionDetail/NTFM/NTFMDetail'
import SchemeForm from 'components/RestrictionForm/SchemeForm'
import { inject, observer } from "mobx-react";
import { customNotice } from 'utils/common-funcs'
import { isValidObject, isValidVariable } from 'utils/basic-verify'


import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
// NTFM新增导入生成方案
function NTFMAdd(props){
    const { title, setDisabledForm,  disabledForm, pageType} = props;
    let [flowData, setFlowData] = useState({});
    let [ message, setMessage ] = useState({});

    //更新方案列表数据
    const updateData = data => {
        let {  status } = data;
        if( status === 500 ){
            antdMessage.error('获取的流控数据为空');
        }else{
            // 更新数据
            setFlowData(data);
            // 更新方案表单store数据
            let tacticProcessInfo = data.tacticProcessInfo || {};
            props.schemeFormData.updateSchemeData(tacticProcessInfo);
        }
    };
    // 请求NTFM数据失败
    const requestErr = (err, content) => {
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }

        customNotice({
            type: 'error',
            message: <div>
                <p>{content}</p>
                <p>{errMsg}</p>
            </div>
        })
    };
    // 请求NTFM数据
    const requestNTFMData = (data) => {
        // 获取当前用户
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        // NTFM流控ID
        const id = data.id;
        // NTFM流控类型["MIT","GDP","GS","AFT"]
        const sourceType = data.sourceType || "";
        let url = ReqUrls.NTFMCreateDataUrl+ sourceType+"/" + id
        // 请求参数
        const opt = {
            url: url,
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
        // 取localStorage保存的消息数据
        let msgStr = localStorage.getItem("message");
        // 转换为对象
        let json = JSON.parse(msgStr);
        setMessage(json);
        // 将消息对象中的data字段值转为对象
        let { data = {} } = json;
        data = JSON.parse(data);
        // 请求NTFM数据
        requestNTFMData(data);
    }, []);

    return (
        <Row gutter={12} className="res_canvas">
            <Col span={12} className="res_left">
                <Row className="title">
                    <span>{ title }</span>
                </Row>
                {
                    //新增
                    ( pageType === "NTFMAdd" ) &&
                    <NTFMDetail flowType="NTFMData" flowData={ flowData } title="流控信息" />
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
                    disabledForm = {disabledForm}
                    setDisabledForm = {setDisabledForm}
                    message={message}
                    showEditBtn={true}
                    showIgnoreBtn={true}
                    bordered={ true }
                    operationBarClassName="outside"
                ></SchemeForm>
            </Col>
        </Row>
    )
}
// export default NTFMAdd;
export default inject("schemeFormData", "systemPage")(observer(NTFMAdd))


