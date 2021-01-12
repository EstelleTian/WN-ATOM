
import React from "react";
import './CreateFlowPage.jsx'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'
import './CreateFlowPage.scss'


function CreateFlowPage(props){
    return (
        <div className="create-flow-container">
            <div className="content">
                <RestrictionForm showImportBtn={true} btnName="创建方案" width={1280}  />
            </div>

        </div>

    )
}

export default CreateFlowPage;