
import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import './CreateFlowPage.jsx'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'
import './CreateFlowPage.scss'


function CreateFlowPage(props){
    const { systemPage } = props;
    const { user = {} } = systemPage;
    useEffect(function(){
        const user = localStorage.getItem("user");
        props.systemPage.setUserData( JSON.parse(user) );
    }, []);
    return (
        <div className="create-flow-container">
            <div className="content">
                <RestrictionForm pageType="CREATE" user={user} showImportBtn={true} btnName="创建方案" />
            </div>

        </div>

    )
}

export default inject("systemPage")( observer(CreateFlowPage));