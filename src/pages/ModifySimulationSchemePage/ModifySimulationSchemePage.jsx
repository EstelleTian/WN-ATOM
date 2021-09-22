/* 
* 模拟状态的方案修改页面
*/
import React, { useEffect, useState } from "react";
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { isValidObject, isValidVariable, } from 'utils/basic-verify'
import SchemeForm from 'components/RestrictionForm/SchemeForm'
import { inject, observer } from "mobx-react";
import { customNotice } from 'utils/common-funcs'


function ModifySchemePage(props) {
    console.log(222);
    //  方案表单禁用状态
    let [disabledForm, setDisabledForm] = useState(true);

    // clearSimIdFlag 是否清除方案simId标记
    let [clearSimIdFlag, setClearSimIdFlag] = useState("")

    //更新方案数据
    const updateSchemeData = data => {
        
        const sourceType = data.tacticProcessInfo.basicTacticInfo.sourceType
        const tacticOriginalSource = data.tacticProcessInfo.basicTacticInfo.tacticOriginalSource
        // 更新方案表单store数据
        let tacticProcessInfo = data.tacticProcessInfo || {};
        props.schemeFormData.updateTacticPrimaryForward(sourceType)
        props.schemeFormData.updatePrimaryUnit(tacticOriginalSource)
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
        // url 参数
        let params = props.location.search.replace(/\?/g, "");
        // 以&分隔为数组
        let paramsArray = params.split('&');
        // 获取方案ID
        let schemeID = paramsArray[0];
        // clearSimId 清除simID标记的值
        let clearSimId = paramsArray[1];
        if(isValidVariable(clearSimId)){
            setClearSimIdFlag(clearSimId);
        }
        // 请求参数
        const opt = {
            url: ReqUrls.simulationSchemeDetailUrl + schemeID,
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
                
                <SchemeForm
                    pageType="MODIFYSIM" // MODIFYSIM:修改模拟方案
                    operationDescription="修改方案"
                    primaryButtonName="提交修改"
                    disabledForm={disabledForm}
                    setDisabledForm={setDisabledForm}
                    showEditBtn={true}
                    showIgnoreBtn={false}
                    clearSimIdFlag = {clearSimIdFlag}
                />
            </div>
        </div>
    )
}
// export default ModifySchemePage;
export default inject("schemeFormData", "systemPage")(observer(ModifySchemePage))
