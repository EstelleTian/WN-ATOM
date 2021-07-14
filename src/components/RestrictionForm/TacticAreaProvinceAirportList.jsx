import React, { Fragment } from 'react'
import { Tooltip, Button, Space, } from 'antd'
import { inject, observer } from "mobx-react";
import './TacticAreaProvinceAirportList.scss'

//区域机场列表
function TacticAreaProvinceAirportList(props) {

    const { schemeFormData, } = props;
    // 排序后的区域省份机场列表
    let sortAreaProvinceAirportListData = schemeFormData.sortAreaProvinceAirportListData;
    // 绘制单个区域机场
    const drawSingleAreaAirport = (areaData) => {
        const {
            areaName,
            areaNameZH,
            provinceList,
        } = areaData;
        return (
            <div className="ant-row" key={areaName} >
                <div className="ant-col ant-form-item-label area-label">
                    <label htmlFor={areaName} className="" title={areaNameZH}>{areaNameZH}</label>
                </div>
                <div className="ant-col ant-form-item-control">
                    <div className="ant-form-item-control-input">
                        <div className="ant-form-item-control-input-content">
                            <Space>
                                {
                                    provinceList.map((item) => {
                                        return drawSingleProvince(item);
                                    })
                                }
                            </Space>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    //绘制单个省份按钮
    const drawSingleProvince = (province) => {
        const {
            provinceName,
            provinceNameZH,
            value,
        } = province;
        return (
            <Tooltip placement="bottom" title={value} key={provinceName}>
                <Button
                    className="province"
                    size="small"
                    onClick={() => { updateTargetFormValue(provinceNameZH) }}>
                    {provinceNameZH}
                </Button>
            </Tooltip>
        )
    }
    // 更新目标表单数值
    const updateTargetFormValue = (provinceNameZH) => {
        props.shortcutInputValue(provinceNameZH)
    }
    return (
        <Fragment>
            <div className="area-airport-list">
                {
                    sortAreaProvinceAirportListData.map((item) => {
                        return drawSingleAreaAirport(item);
                    })
                }
            </div>
        </Fragment>
    )
}
export default inject("schemeFormData", "systemPage")(observer(TacticAreaProvinceAirportList));
