/* 
* 正式方案详情显示页面
*/
import React, { useEffect, useState } from "react";
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'
import SchemeForm from 'components/RestrictionForm/SchemeForm'

import { customNotice } from 'utils/common-funcs'


function DisplaySchemeDetailPage(props) {
    //  方案数据
    // let [flowData, setFlowData] = useState({});
    //  方案表单禁用状态
    let [disabledForm, setDisabledForm] = useState(true);

    //更新方案数据
    const updateSchemeData = data => {
        // let { status } = data;
        // setFlowData(data);
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
            url: ReqUrls.schemeDetailByIdUrl + schemeID,
            method: 'GET',
            params: {},
            resFunc: (data) => updateSchemeData(data),
            errFunc: (err) => requestErr(err, '方案数据获取失败'),
        };
        // 发送请求
        request(opt);
    };

    useEffect(() => {
        // 请求方案数据
        requestSchemeData();
    }, []);

    return (
        <div className="modify-scheme-container">
            <div className="content">
                {/* <RestrictionForm
                    flowData={flowData}
                    disabledForm={disabledForm}
                    setDisabledForm={setDisabledForm}
                /> */}
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
