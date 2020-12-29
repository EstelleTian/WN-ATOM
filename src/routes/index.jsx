import React, { lazy } from 'react';
import { withRouter } from 'react-router-dom';
const InfoPage = lazy(() => import('../pages/InfoPage/InfoPage'));
const FangxingPage = lazy(() => import('../pages/FangxingPage/FangxingPage'));
const TotalPage = lazy(() => import('../pages/TotalPage/TotalPage'));
const RestrictionPage = lazy(() => import('../pages/RestrictionPage/RestrictionPage'));

export default [
    {
        path: '/',
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
];