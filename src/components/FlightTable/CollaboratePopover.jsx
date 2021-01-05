import {Button, Checkbox, DatePicker, Input, Popover, Space} from "antd";
import React,{useCallback} from "react";
import { getDayTimeFromString, formatTimeString, getTimeAndStatus } from 'utils/basic-verify'
//航班号右键协调框
const FLIGHTIDPopover = (props) => {
    const getContent = useCallback((record)  =>{
        return (
            <div>
                <Button type="primary" >查看航班详情</Button>
                {/*<Button type="primary" size="small" >标记豁免</Button>*/}
            </div>
        )
    })
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title=""
            content={getContent(props.opt)}
            trigger={[`contextMenu`]}
        >
            <div className="ddd">{props.opt.text}</div>
        </Popover >
    )
}
//过点时间右键协调框
const FFIXTPopover = (props) => {
    const getTitle = useCallback((opt)  =>{
        const {text, record, index, col} = opt;
        return record.FLIGHTID
    })
    const getContent = useCallback((opt)  =>{
        const {text, record, index, col} = opt;
        return (
            <div>
                <div>
                    <Input addonBefore="航班"  defaultValue={ record.FLIGHTID }  disabled />
                </div>
                <div>
                    <Input addonBefore="机场"  defaultValue={ record.DEPAP +"-"+record.ARRAP } disabled  />
                </div>
                <div>
                    <Space size={1}>
                        <span className="ant-input-group-addon">日期</span>
                        <DatePicker />
                    </Space>
                </div>
                <div>
                    <Input addonBefore="时间"  defaultValue={ record.FLIGHTID } />
                </div>
                <div>
                    <Checkbox >禁止系统自动调整</Checkbox>
                </div>
                <div>
                    <Input.TextArea showCount maxLength={100} />
                </div>
                <div>
                    <Button type="primary">修改</Button>
                    <Button>重置</Button>
                </div>


            </div>
        )
    })
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={getTitle(props.opt)}
            content={getContent(props.opt)}
            trigger={[`contextMenu`]}
        >
            <div className="ddd">{getTimeAndStatus(props.opt.text)}</div>
        </Popover >
    )
}




export { FLIGHTIDPopover, FFIXTPopover }