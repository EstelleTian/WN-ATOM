/* 
* 正式方案详情显示页面
*/
import React, { useEffect, useState } from "react";
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { inject, observer } from "mobx-react";
import SchemeForm from 'components/RestrictionForm/SchemeForm'
import { isValidObject, isValidVariable } from 'utils/basic-verify'
import { customNotice } from 'utils/common-funcs'

// 显示正式发布的方案数据
function DisplaySchemeDetailPage(props) {
    
    //  方案表单禁用状态
    let [disabledForm, setDisabledForm] = useState(true);

    const { systemPage } = props;
    // 用户信息
    const user = systemPage.user || {};
    // 用户id
    const userId = user.id || "";
    //更新方案数据
    const updateSchemeData = data => {
        // 更新方案表单store数据
        let tacticProcessInfo = data.tacticProcessInfo || {};
        props.schemeFormData.updateSchemeData(tacticProcessInfo);
    };
    // 请求方案数据失败
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

    // 请求方案数据
    const requestSchemeData = () => {
        // 获取方案ID
        let schemeID = props.location.search.replace(/\?/g, "");
        // 请求参数
        const opt = {
            url: ReqUrls.schemeDataByIdForUpdateUrl + schemeID,
            method: 'GET',
            params: {},
            resFunc: (data) => updateSchemeData(data),
            errFunc: (err) => requestErr(err, '方案数据获取失败'),
        };
        // 发送请求
        request(opt);
    };

    // 初始化用户信息
    useEffect(function () {
        const user = localStorage.getItem("user");
        if (isValidVariable(user)) {
            props.systemPage.setUserData(JSON.parse(user));
        }
    }, []);

    useEffect(() => {
        // 用户id有效则请求方案数据
        if(isValidVariable(userId)){
            // 请求方案数据
            requestSchemeData();
        }
        
    }, [userId]);

    return (
        <div className="modify-scheme-container">
            <div className="content">
                
                <SchemeForm
                    disabledForm = {disabledForm}
                    setDisabledForm = {setDisabledForm}
                ></SchemeForm>
            </div>
        </div>
    )
}
// export default DisplaySchemeDetailPage;
export default inject("schemeFormData", "systemPage")(observer(DisplaySchemeDetailPage))
