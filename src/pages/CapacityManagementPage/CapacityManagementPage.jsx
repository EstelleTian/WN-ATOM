/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-24 17:28:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React from 'react'
import { Layout, Spin } from 'antd'
import { withRouter } from 'react-router-dom';
import ModalBox from 'components/ModalBox/ModalBox'
import SearchWidget  from 'components/CapacityManagement/SearchWidget'
import FilterWidget  from 'components/CapacityManagement/FilterWidget'
import FilterList  from 'components/CapacityManagement/FilterList'

// import DHXWindow from 'components/SimpleMap/DHXWindow'

import './CapacityManagementPage.scss'
const { Header, Footer, Sider, Content } = Layout;

//容量管理模块
function CapacityManagement (props){

    return (
        <Layout className="capacity-page">
            {/*<Header>Header</Header>*/}
            <Layout className="capacity-page-layout">
                <Sider width="360">
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
                </Sider>
                <Content >
                    <div className="content-wrapper">
                        sss
                    </div>
                </Content>
            </Layout>
        </Layout>

    )
}

export default withRouter(CapacityManagement);


