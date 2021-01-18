
import React, {useEffect, useState} from "react";
import {Radio} from "antd";
import {Window as WindowDHX} from "dhx-suite";
import "./WinBtn.scss"

function WinBtn(props){
    let [ window, setWindow ] = useState();
    const { btnTitle, type } = props;
    // eslint-disable-next-line no-undef
    useEffect(function () {
        const windowHtml = `
            <p>Here is a neat and flexible JavaScript window system with a fast and simple initialization.</p>
            <p>Inspect all the DHTMLX window samples to discover each and every feature.</p>`;
        setWindow( new WindowDHX({
            width: 440,
            height: 520,
            title: btnTitle+"列表",
            html: windowHtml,
            css: "bg-black",
            closable: true,
            movable: true,
            resizable: true
        }) );
    }, []);
    return (
        <Radio.Button value={type}
                      onClick={() => window.show()}
        >{btnTitle}</Radio.Button>
    )
}

export  default WinBtn;