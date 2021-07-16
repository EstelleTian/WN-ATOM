/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-07-16 13:31:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\DirectionBar.jsx
 */

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import { observer, inject } from "mobx-react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Radio, Tag, Dropdown, Button, Menu } from "antd";
import { isValidVariable } from "utils/basic-verify";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { convertNameToTitle } from "utils/global";
import { customNotice } from "utils/common-funcs";

//方向 下拉框
function DirectionBar({ systemPage, schemeListData }) {
  const groupNameChange = (item) => {
    // console.log(item);
    systemPage.setActiveDir(item);
    schemeListData.setForceUpdate(true);
  };

  const { dirList = [] } = systemPage;
  const dirMenu = function () {
    return (
      <Menu>
        {dirList.map((item) => (
          <Menu.Item
            key={item.name || ""}
            value={`${item.name}`}
            onClick={(e) => {
              groupNameChange(item);
            }}
          >
            {item.nameCN}
          </Menu.Item>
        ))}
      </Menu>
    );
  };
  //   console.log(dirList);

  //获取方向列表
  const getDirectionList = useCallback(async () => {
    try {
      const res = await requestGet2({
        url: ReqUrls.directionListUrl,
      });
      const result = res.result || {};
      let list = [
        {
          name: "ALL",
          nameCN: "全部",
        },
      ];
      for (let key in result) {
        list.push({
          name: key,
          nameCN: result[key],
        });
      }
      systemPage.setDirList(list);
    } catch (e) {
      customNotice({
        type: "error",
        content: "获取方向列表失败",
      });
    }
  }, []);

  //系统名称赋值
  useEffect(() => {
    //获取方向列表
    getDirectionList();
  }, []);

  return (
    <Fragment>
      {systemPage.userHasAuth(12510) ? (
        // <Dropdown overlay={dirMenu}>
        //   <Button className="sys_dropdown">
        //     方向
        //     <Tag className="range_tag" color="#3d8424">
        //       {systemPage.activeDir.nameCN}
        //     </Tag>
        //     <DownOutlined />
        //   </Button>
        // </Dropdown>
        <Radio.Group value={systemPage.activeDir.name} buttonStyle="solid">
          {dirList.map((item) => {
            return (
              <Radio.Button
                key={item.name || ""}
                value={`${item.name}`}
                onClick={(e) => {
                  groupNameChange(item);
                }}
              >
                {item.nameCN}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      ) : (
        ""
      )}
    </Fragment>
  );
}

export default inject("systemPage", "schemeListData")(observer(DirectionBar));
