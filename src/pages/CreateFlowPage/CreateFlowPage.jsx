
import React from "react";
import './CreateFlowPage.jsx'
import SchemeForm from 'components/RestrictionForm/SchemeForm'
import './CreateFlowPage.scss'


function CreateFlowPage(props){

    return (
        <div className="create-flow-container">
            <div className="content">
                <SchemeForm
                    pageType="CREATE"
                    operationDescription="创建方案"
                    primaryButtonName="创建方案"
                    showSaveAsTemplateBtn = {true}
                />
            </div>
        </div>

    )
}

export default CreateFlowPage;