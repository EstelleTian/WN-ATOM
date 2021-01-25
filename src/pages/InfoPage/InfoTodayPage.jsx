/*
 * @Author: your name
 * @Date: 2021-01-22 16:09:16
 * @LastEditTime: 2021-01-22 16:55:00
 * @LastEditors: Please set LastEditors
 * @Description: 消息当日全部数据
 * @FilePath: \WN-ATOM\src\pages\InfoPage\InfoListPage.jsx
 */
import React, {useEffect, useState} from 'react'
import { Layout, Tooltip, Checkbox } from 'antd'
import { DeleteOutlined, CloseOutlined} from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { isValidVariable } from 'utils/basic-verify'
import { closeMessageDlg, openMessageDlg } from 'utils/client'
import InfoList from 'components/Info/InfoList'
import './InfoPage.scss'

//消息模块
function InfoPage(props){
    const [ login, setLogin ] = useState(false);

    const { newsList, systemPage } = props;
    const { user } = systemPage;
    useEffect(function(){
        const user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
        }
    }, []);

    const len = newsList.list.length;

    return (
        <Layout className="layout">
            {
                login ? <div className="info_canvas">
                    <div className="info_header">
                        <div className="title">消息记录</div>
                        <Tooltip title="清除">
                            <div className="radish">
                                <DeleteOutlined onClick={ emptyNews } />
                            </div>
                        </Tooltip>
                        <div className="">
                            
                        </div>
                        <Tooltip title="关闭">
                            <div className="close" onClick={()=>{ closeMessageDlg("")}}><CloseOutlined /> </div>
                        </Tooltip>

                    </div>
                    <InfoList newsList={newsList}/>
                </div> : ""
            }

        </Layout>
    )
}


// export default withRouter( InfoPage );
export default inject("newsList", "systemPage")(observer(InfoPage));

