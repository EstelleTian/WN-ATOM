/*
 * @Author: your name
 * @Date: 2021-01-22 16:08:06
 * @LastEditTime: 2021-01-22 16:09:42
 * @LastEditors: Please set LastEditors
 * @Description: 消息历史数据
 * @FilePath: \WN-ATOM\src\pages\InfoPage\InfoHistoryPage.jsx
 */
import React, {useEffect, useState} from 'react'
import { Layout, Tooltip, Checkbox, Menu } from 'antd'
import { DeleteOutlined, CloseOutlined} from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { isValidVariable } from 'utils/basic-verify'
import { closeMessageDlg, openMessageDlg } from 'utils/client'
import InfoHistoryList from 'components/Info/InfoHistoryList'



//消息历史模块
function InfoHistoryPage(props){

    console.log(props.infoHistoryData);
    const [ login, setLogin ] = useState(false);
    const [ scrollChecked, setScrollChecked ] = useState(true);

    return (
        <Layout className="layout">

        <InfoHistoryList />

        </Layout>
    )
}

export default  InfoHistoryPage ;
// export default inject("infoHistoryData","systemPage")(observer(InfoHistoryPage));