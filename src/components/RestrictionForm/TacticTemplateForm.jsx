import React, { Fragment, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { inject, observer } from "mobx-react";
import { customNotice } from 'utils/common-funcs'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { isValidObject, isValidVariable } from 'utils/basic-verify'

const { Option } = Select;


//方案模板表单
function TacticTemplateForm(props) {
    const { schemeFormData, schemeTemplateData, form, systemPage, pageType } = props;
    // 用户信息
    const user = systemPage.user || {};
    // 用户名
    const userName = user.username || ""
    // 方案模板数据
    const templateData = schemeTemplateData.templateData || [];
    // 计数器
    const counter = schemeTemplateData.counter;
    // 下拉框选项
    const templateOptions = templateData.map((item) => <Option key={item.id}>{item.name}</Option>);

    // 请求方案模板数据
    const requeSchemeTemplateData = () => {
        // 模板类型
        const templateType = "schemeTemplateData"
        // 请求参数
        const opt = {
            url: ReqUrls.schemeTemplateDataUrl + userName + "/" + templateType,
            method: 'GET',
            params: {},
            resFunc: (data) => updateSchemeTemplateData(data),
            errFunc: (err) => requestErr(err, '方案模板数据获取失败'),
        };
        // 发送请求
        request(opt);
    };

    //更新方案模板数据
    const updateSchemeTemplateData = data => {
        if (isValidObject(data) && isValidVariable(data.userTemplateList)) {
            // 更新模板数据
            schemeTemplateData.updateTemplateData(data.userTemplateList)
        } else {
            customNotice({
                type: 'error',
                message: <div>
                    <p>获取到的方案模板数据为空</p>
                </div>
            })
        }
    };

    // 请求交通流快捷录入表单依赖数据失败
    const requestErr = (err, content) => {
        let errMsg = ""
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        customNotice({
            type: 'error',
            message: <div>
                < p>{`${content}`}</p>
                <p>{errMsg}</p>
            </div>
        })
    };

    // 
    const handleSelectedTemplateChange = (templateId) => {
        // schemeTemplateData.updateSelectedTemplateId(templateId);
        // 选中的模板数据
        const selectedTemplateData = getSelectedTemplateData(templateId);
        // 依据该模板数据更新方案表单数据
        schemeFormData.updateSchemeDataByTemplateData(selectedTemplateData);
    }

    // 依据id获取模板数据
    const getSelectedTemplateData = (templateId)=> {
        let data = {};
        if(isValidVariable(templateData) && Array.isArray(templateData) && templateData.length > 0){
            for( let i=0; i< templateData.length; i++){
                let item = templateData[i];
                if(item.id.toString() === templateId){
                    data = JSON.parse(item.value);
                    return data;
                }
            }
        }
        return data;
    }

    // 初始化获取数据
    useEffect(() => {
        if (isValidVariable(user.id)) {
            // 请求方案模板数据
            requeSchemeTemplateData();
        }
    }, [user.id, counter]);


    return (
        <Fragment>
            <Form
                form={form}
            >
                <Form.Item
                    label="模板"
                >
                    <Select
                        placeholder="选择模板"
                        onChange={handleSelectedTemplateChange}
                    >
                        {templateOptions}
                    </Select>
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeTemplateData", "schemeFormData", "systemPage")(observer(TacticTemplateForm));
