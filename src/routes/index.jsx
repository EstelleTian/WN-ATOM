/*
 * @Author: your name
 * @Date: 2020-12-23 20:23:17
 * @LastEditTime: 2021-01-25 13:57:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\routes\index.jsx
 */
import React, { lazy } from 'react';
import { withRouter } from 'react-router-dom';
const InfoPage = lazy(() => import('../pages/InfoPage/InfoPage'));
const InfoTodayPage = lazy(() => import('../pages/InfoPage/InfoTodayPage'));
const FangxingPage = lazy(() => import('../pages/FangxingPage/FangxingPage'));
const TotalPage = lazy(() => import('../pages/TotalPage/TotalPage'));
const RestrictionPage = lazy(() => import('../pages/RestrictionPage/RestrictionPage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const CreateFlowPage = lazy(() => import('../pages/CreateFlowPage/CreateFlowPage'));
const ModifySimulationSchemePage = lazy(() => import('../pages/ModifySimulationSchemePage/ModifySimulationSchemePage'));
const DisplaySimulationSchemeDetailPage = lazy(() => import('../pages/DisplaySimulationSchemeDetailPage/DisplaySimulationSchemeDetailPage'));
const DisplaySchemeDetailPage = lazy(() => import('../pages/DisplaySchemeDetailPage/DisplaySchemeDetailPage'));

const WorkFlowPage = lazy(() => import('../pages/WorkFlowPage/WorkFlowPage'));
const WorkFlowDetailPage = lazy(() => import('../pages/WorkFlowPage/WorkFlowDetailPage'));
const CapacityManagementPage = lazy(() => import('../pages/CapacityManagementPage/CapacityManagementPage'));
const InfoHistoryPage = lazy(() => import('../pages/InfoPage/InfoHistoryPage'));

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
        path: '/today_news',
        component: withRouter(InfoTodayPage),
        exact: true,
        title: '近两小时消息历史',
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
        path: '/modifySimulationScheme',
        component: withRouter(ModifySimulationSchemePage),
        exact: true,
        title: '方案修改',
    },
    {
        path: '/displaySimulationSchemeDetail',
        component: withRouter(DisplaySimulationSchemeDetailPage),
        exact: true,
        title: '方案详情',
    },
    {
        path: '/displaySchemeDetail',
        component: withRouter(DisplaySchemeDetailPage),
        exact: true,
        title: '方案详情',
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
    },{
        path: '/infoHistory',
        component: withRouter(InfoHistoryPage),
        exact: true,
        title: '消息历史',
    },
];