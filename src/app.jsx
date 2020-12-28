import React from "react";
import ReactDom from 'react-dom';
import 'moment/locale/zh-cn';
import Routes from './routes/route';
import './app.less';

const root = document.createElement("div");
root.className = "root";
document.body.appendChild(root);

ReactDom.render(
    <Routes />,
root);
