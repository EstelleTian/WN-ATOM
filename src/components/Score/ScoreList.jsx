/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-27 13:24:30
 * @LastEditors: Please set LastEditors
 * @Description: 贡献值\诚信值列表
 * @FilePath: \WN-ATOM\src\components\NavBar\ScoreList.jsx
 */
import React, {
  Fragment,
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import { Badge, Modal, Table } from "antd";
import { isValidVariable } from "utils/basic-verify";

import { customNotice } from "utils/common-funcs";

const data = [
  {
    key: "1",
    num: "1",
    name: "XXX",
    agent: "XXX",
    score: "XXX",
    change: "XXX",
  },
  {
    key: "2",
    num: "2",
    name: "XXX",
    agent: "XXX",
    score: "XXX",
    change: "XXX",
  },
  {
    key: "3",
    num: "3",
    name: "XXX",
    agent: "XXX",
    score: "XXX",
    change: "XXX",
  },
  {
    key: "4",
    num: "4",
    name: "XXX",
    agent: "XXX",
    score: "XXX",
    change: "XXX",
  },
];

const names = {
  num: {
    en: "num",
    cn: "序号",
    width: 60,
  },
  name: {
    en: "name",
    cn: "用户名",
    width: 80,
  },
  agent: {
    en: "agent",
    cn: "代理公司",
    width: 80,
  },
  score: {
    en: "score",
    cn: "诚信值综合值",
    width: 70,
  },
  change: {
    en: "change",
    cn: "贡献值变化",
    width: 70,
  },
};

const ScoreList = (props) => {
  const tableTotalWidth = useRef();
  const [loading, setLoading] = useState(false);
  const { name = "" } = props;

  const columns = useMemo(function () {
    let totalWidth = 0;
    //表格列配置-默认-计数列
    let columns = [];
    //生成表配置-全部
    for (let key in names) {
      const obj = names[key];
      const en = obj["en"];
      const cn = obj["cn"];
      const width = obj["width"];
      let tem = {
        title: cn,
        dataIndex: en,
        align: "center",
        key: en,
        width: width,
        ellipsis: true,
        className: en,
        showSorterTooltip: false,
        onHeaderCell: (column) => {
          //配置表头属性，增加title值
          return {
            title: cn,
          };
        },
      };

      totalWidth += tem.width * 1;
      columns.push(tem);
    }
    tableTotalWidth.current = totalWidth;
    return columns;
  }, []);

  return (
    <div className={`${name}_table`}>
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        bordered
        pagination={false}
        loading={loading}
        scroll={{
          x: tableTotalWidth.current,
          y: 600,
        }}
      />
    </div>
  );
};

export default ScoreList;
