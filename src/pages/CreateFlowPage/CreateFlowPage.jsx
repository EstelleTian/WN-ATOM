
import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";

import './CreateFlowPage.jsx'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'
import {  isValidVariable,  } from 'utils/basic-verify'
import {NWGlobal} from "../../utils/global";

import './CreateFlowPage.scss'


function CreateFlowPage(props){
    const { systemPage } = props;
    const { user = {} } = systemPage;
    NWGlobal.setUserInfo = userStr =>{
        // alert("接收到客户端传来用户信息："+ userStr);
        const userInfo = JSON.parse(userStr);
        // alert("接收到客户端传来用户信息："+ userInfo.id);
        props.systemPage.setUserData(userInfo);
    }
    useEffect(function(){
        const id = user.id;

    },[ user.id ]);
    return (
        <div className="create-flow-container">
            <div className="content">
                <RestrictionForm pageType="CREATE" user={user} showImportBtn={true} btnName="创建方案" />
            </div>

        </div>

    )
}

export default inject("systemPage")( observer(CreateFlowPage));