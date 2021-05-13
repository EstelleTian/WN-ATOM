import React, { Fragment, useEffect  } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';


//方案发布用户表单
function TacticPublishUserForm(props) {
    const { schemeFormData, systemPage, form } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    const tacticPublishUser = schemeFormData.tacticPublishUser;
    const tacticPublishUserCH = schemeFormData.tacticPublishUserCH;
    // 用户信息
    const user = systemPage.user || {};
    // 用户名
    let username = user.username || "";
    // 用户名中文
    let userDescriptionCN = user.descriptionCN || "";
    
    if(isValidVariable(username) && !isValidVariable(tacticPublishUser)){
        schemeFormData.updateTacticPublishUser(username)
    }
    if(isValidVariable(userDescriptionCN) && !isValidVariable(tacticPublishUserCH)){
        schemeFormData.updateTacticPublishUserCH(userDescriptionCN)
    }
    //用户id发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [user.id]);
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);

    // 表单初始化默认值
    let initialValues = {
        tacticPublishUser,
        tacticPublishUserCH,
    }
    return (
        <Fragment>
            
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    hidden
                    name="tacticPublishUser"
                    label="发布用户"
                >
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item
                    name="tacticPublishUserCH"
                    label="发布用户"
                >
                    <Input disabled={true} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}
export default inject("schemeFormData", "systemPage")(observer(TacticPublishUserForm));
