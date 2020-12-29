
import React, { Suspense } from  'react'
import './RestictionPage.scss'
import {Spin} from "antd";

//限制详情
function RestictionPage( props ) {

    return (
        <Suspense fallback={ <div className="load_spin"><Spin tip="加载中..."/></div> }>
            <div>流控详情</div>
        </Suspense>

    )

}

export default RestictionPage