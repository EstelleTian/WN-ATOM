/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-01-21 11:00:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: WorkFlowDetailPage.jsx
 */
import React  from 'react'
import { withRouter } from 'react-router-dom';
import {observer, inject} from "mobx-react";
import { Layout } from 'antd';
import WorkFlowContent from "components/WorkFlow/WorkFlowContent";
import './WorkFlowPage.scss'


//工作流模块
const WorkFlowDetailPage = (props) => {
    const { location, match } = props;
    const params = match.params || {};
    const id = params.id || "";
    const source = params.source || "";
    return (
        <Layout className="work_detail_layout">
            <WorkFlowContent modalId={id} from="simple" source={source}/>
        </Layout>
    )
}

export default withRouter( WorkFlowDetailPage );

