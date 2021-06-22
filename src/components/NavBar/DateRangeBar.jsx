/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-06-08 18:56:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, { useMemo, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Radio, Tag } from "antd";

//计划时间范围
function DateRange(props) {
  const [dateRangeStr, setDateRangeStr] = useState("");
  const { systemPage } = props;

  useEffect(() => {
    const dateRangeData = systemPage.getDateRangeData();
    setDateRangeStr(dateRangeData);
  }, [systemPage.dateRangeData]);

  return (
    <Radio.Group buttonStyle="solid">
      <Radio.Button
        value="a"
        onClick={(e) => {
          systemPage.setDateRangeVisible(true);
        }}
      >
        计划范围
        {dateRangeStr !== "" && (
          <Tag className="range_tag" color="#3d8424">
            {dateRangeStr}
          </Tag>
        )}
      </Radio.Button>
    </Radio.Group>
  );
}

export default inject("systemPage")(observer(DateRange));
