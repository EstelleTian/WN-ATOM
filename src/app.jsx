import React from "react";
import ReactDom from 'react-dom';
import { LocaleProvider } from 'antd';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import Routes from './routes/route';
import './app.less';

const root = document.createElement("div");
root.className = "root";
document.body.appendChild(root);
let NewsList = {
    show: ""
}
ReactDom.render(
    <Routes />,
root);
