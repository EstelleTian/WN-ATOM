/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-11 17:27:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React from 'react'
import { Layout, Spin } from 'antd'
import { withRouter } from 'react-router-dom';
// import SearchWidget  from 'components/CapacityManagement/SearchWidget'
// import FilterWidget  from 'components/CapacityManagement/FilterWidget'
// import FilterList  from 'components/CapacityManagement/FilterList'
import CapacityTabs  from 'components/CapacityManagement/CapacityTabs'

// import DHXWindow from 'components/SimpleMap/DHXWindow'

import './CapacityManagementPage.scss'
const { Header, Footer, Sider, Content } = Layout;

//容量管理模块
function CapacityManagement (props){
    const { match } = props;
    const params = match.params || {};
    const name = params.name || "";
    console.log("激活的tab是：", name)
    return (
        <Layout className="capacity-page">
            {/*<Header>Header</Header>*/}
            <Layout className="capacity-page-layout">
                {/*<Sider width="360">
                    <div className="sider-content">
                        <div className="search-box">
                            <SearchWidget></SearchWidget>
                        </div>
                        <div className="option-box">
                            <FilterWidget></FilterWidget>
                        </div>
                        <div className="list-box">
                            <FilterList>
                            </FilterList>
                        </div>
                    </div>
                </Sider>*/}
                <Content>
                    <div className="content-wrapper">
                        <CapacityTabs activeName = {name}/>
                    </div>
                </Content>
            </Layout>
        </Layout>

    )
}

export default withRouter(CapacityManagement);


