/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-24 15:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { Fragment, Suspense, useState, useEffect, useCallback } from 'react'
import { Spin, } from 'antd'
import { ReqUrls } from 'utils/request-urls'

//带loading遮罩的iframe地图组件
function LoadingIframe(props) {
    const [loading, setLoading] = useState(true);
    let focus = props.focus || "";
    // iframe 加载完成后关闭loading
    const iframeLoaded = () => {
        setLoading(false);
    }
    return (
        <Spin spinning={loading} >
            <iframe
                className="map-frame"
                id="simpleMap"
                width="100%"
                height="100%"
                frameBorder={0}
                scrolling="no"
                onLoad={() => { iframeLoaded() }}
                src={ReqUrls.mapUrl + '?region=' + focus
                }
            />
        </Spin>
    )
}

export default LoadingIframe


