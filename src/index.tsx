/*
 * @Author: your name
 * @Date: 2021-07-13 10:53:32
 * @LastEditTime: 2021-07-14 09:54:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\index.tsx
 */
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./Hello";

const root = document.createElement("div");
root.className = "root";
document.body.appendChild(root);

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    // <div>123123</div>,
    root
);