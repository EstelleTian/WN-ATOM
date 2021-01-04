import React from "react";
import ReactDom from 'react-dom';
import Routes from './routes/route';
import { ConfigProvider  } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import './custom-ant-theme.less'
import './app.less';

const root = document.createElement("div");
root.className = "root";
document.body.appendChild(root);

ReactDom.render(
    <ConfigProvider locale={zh_CN}>
        <Routes />
    </ConfigProvider>,
root);
