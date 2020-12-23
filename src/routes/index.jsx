import React, { lazy } from 'react';
const InfoPage = lazy(() => import('../pages/InfoPage/InfoPage'));
const FangxingPage = lazy(() => import('../pages/FangxingPage/FangxingPage'));
const TotalPage = lazy(() => import('../pages/TotalPage/TotalPage'));

export default [
    {
        path: '/',
        component: InfoPage,
        exact: true,
        title: '消息中心',
    },
    {
        path: '/fangxing',
        component: FangxingPage,
        exact: true,
        title: '放行监控',
    },
    {
        path: '/total',
        component: TotalPage,
        exact: true,
        title: '总体监控',
    },
];