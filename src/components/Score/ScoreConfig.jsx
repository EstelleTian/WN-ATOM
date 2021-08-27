/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-08-27 13:23:32
 * @LastEditors: Please set LastEditors
 * @Description: 贡献值\诚信值列表
 * @FilePath: \WN-ATOM\src\components\NavBar\ScoreConfig.jsx
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

const data = {
  dedicated: [
    {
      key: "1",
      num: "1",
      dataType: "TOBT申请",
      desc: "提前90分钟未申请",
      score: "待定",
    },
    {
      key: "2",
      num: "2",
      dataType: "ASBT填写",
      desc: "及时填写航班上客时间",
      score: "待定",
    },
    {
      key: "3",
      num: "3",
      dataType: "AGCT填写",
      desc: "及时填写航班关舱门时间",
      score: "待定",
    },
    {
      key: "4",
      num: "4",
      dataType: "执行COBT",
      desc: "AOBT在COBT之后5分钟",
      score: "待定",
    },
    {
      key: "5",
      num: "5",
      dataType: "执行CTOT",
      desc: "AOBT在COBT之后1-5分钟",
      score: "待定",
    },
    {
      key: "6",
      num: "6",
      dataType: "执行CTOT",
      desc: "地面保障原因导致不能执行CTOT超过3分钟",
      score: "待定",
    },
    {
      key: "7",
      num: "7",
      dataType: "不正常航班",
      desc: "因公司原因导致的不正常航班",
      score: "待定",
    },
    {
      key: "8",
      num: "8",
      dataType: "等待池",
      desc: "进入等待池航班",
      score: "待定",
    },
  ],
  integrity: [
    {
      key: "1",
      num: "1",
      dataType: "航班取消",
      desc: "航班消减执行率",
      score: "待定",
    },
    {
      key: "2",
      num: "2",
      dataType: "时刻调整",
      desc: "时刻调整执行率",
      score: "待定",
    },
    {
      key: "3",
      num: "3",
      dataType: "提前申报",
      desc: "提前90分钟TOBT申报率",
      score: "待定",
    },
    {
      key: "4",
      num: "4",
      dataType: "提前申请",
      desc: "提前45分钟TOBT申请率",
      score: "待定",
    },
    {
      key: "5",
      num: "5",
      dataType: "执行率",
      desc: "COBT＋3分钟执行率",
      score: "待定",
    },
    {
      key: "6",
      num: "6",
      dataType: "执行率",
      desc: "非地面保障原因的CTOT＋3分钟执行率",
      score: "待定",
    },
    {
      key: "7",
      num: "7",
      dataType: "正常率",
      desc: "非公司原因的航班正常率",
      score: "待定",
    },
  ],
};

const names = {
  num: {
    en: "num",
    cn: "序号",
    width: 60,
  },
  dataType: {
    en: "dataType",
    cn: "数据项类型",
    width: 80,
  },
  desc: {
    en: "desc",
    cn: "描述",
    width: 160,
  },
  score: {
    en: "score",
    cn: "分值",
    width: 70,
  },
};

const ScoreConfig = (props) => {
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
        dataSource={data[name]}
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

export default ScoreConfig;
