/*
 * @Author: your name
 * @Date: 2020-12-23 20:23:17
 * @LastEditTime: 2021-01-21 10:55:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\routes\index.jsx
 */
import React, { lazy } from 'react';
import { withRouter } from 'react-router-dom';
const InfoPage = lazy(() => import('../pages/InfoPage/InfoPage'));
const FangxingPage = lazy(() => import('../pages/FangxingPage/FangxingPage'));
const TotalPage = lazy(() => import('../pages/TotalPage/TotalPage'));
const RestrictionPage = lazy(() => import('../pages/RestrictionPage/RestrictionPage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const CreateFlowPage = lazy(() => import('../pages/CreateFlowPage/CreateFlowPage'));
const WorkFlowPage = lazy(() => import('../pages/WorkFlowPage/WorkFlowPage'));
const WorkFlowDetailPage = lazy(() => import('../pages/WorkFlowPage/WorkFlowDetailPage'));
const CapacityManagementPage = lazy(() => import('../pages/CapacityManagementPage/CapacityManagementPage'));

export default [
    {
        path: '/',
        component: withRouter(LoginPage),
        exact: true,
        title: '登录页面',
    },
    {
        path: '/news',
        component: withRouter(InfoPage),
        exact: true,
        title: '消息中心',
    },
    {
        path: '/fangxing',
        component: withRouter(FangxingPage),
        exact: true,
        title: '放行监控',
    },
    {
        path: '/total',
        component:withRouter(TotalPage),
        exact: true,
        title: '总体监控',
    },
    {
        path: '/restriction',
        component: withRouter(RestrictionPage),
        exact: true,
        title: '限制流控详情',
    },
    {
        path: '/create_flow',
        component: withRouter(CreateFlowPage),
        exact: true,
        title: '方案创建',
    },
    {
        path: '/workflow',
        component: withRouter(WorkFlowPage),
        exact: true,
        title: '工作流',
    },
    {
        path: '/workflow_detail/:source/:id',
        component: withRouter(WorkFlowDetailPage),
        exact: true,
        title: '工作流详情',
    },
    {
        path: '/capacity',
        component: withRouter(CapacityManagementPage),
        exact: true,
        title: '容量管理',
    },
];