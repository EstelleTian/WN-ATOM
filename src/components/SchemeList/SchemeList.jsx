/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2021-06-30 15:47:37
 * @LastEditTime: 2021-03-04 14:40:22
 * @LastEditors: Please set LastEditors
 * @Description: 方案列表
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import debounce from "lodash/debounce";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import {
  Checkbox,
  Empty,
  Spin,
  Row,
  Col,
  Modal,
  Input,
  Badge,
  Button,
  Dropdown,
  Menu,
} from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

import { requestGet } from "utils/request";

import {
  isValidVariable,
  isValidObject,
  getFullTime,
  calculateStringTimeDiff,
} from "utils/basic-verify";
import { NWGlobal } from "utils/global";
import SchemeModal from "./SchemeModal";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import SchemeItem from "./SchemeItem";
import useSchemeList from "./useSchemeList";
import useFlightsList from "./useFlightsList";
import useExecuteKPIData from "./useExecuteKPIData";
import "./SchemeList.scss";

// 接收storage同源消息
window.addEventListener("storage", function (e) {
  if (e.key === "targetToFlight") {
    // console.log("storage", e);
    const newValue = e.newValue || "{}";
    let values = JSON.parse(newValue);
    const { tacticId = "", flightId = "" } = values;
    if (isValidVariable(tacticId) && isValidVariable(flightId)) {
      NWGlobal.targetToFlight(tacticId, flightId);
    }
  }
  localStorage.removeItem("targetToFlight");
});

//方案状态多选按钮组
const plainOptions = [
  { label: "正在执行", value: "RUNNING" },
  { label: "将要执行", value: "FUTURE" },
  { label: "已经终止", value: "TERMINATED" },
];
// NTFM方案过滤多选按钮组
const NTFMOptions = [
  { label: "NTFM流控", value: "NTFM-ORIGINAL-100" },
  { label: "NTFM消息", value: "NTFM-ORIGINAL-200" },
];

const useSchemeModal = ({ systemPage }) => {
  const [visible, setVisible] = useState(false); //详情模态框显隐
  const [modalId, setModalId] = useState(""); //当前选中方案详情的id，不一定和激活方案id一样
  const [modalType, setModalType] = useState(""); //当前选中方案详情的id，不一定和激活方案id一样

  //方案模态框显隐
  const toggleModalVisible = useCallback((flag, id) => {
    setVisible(flag);
    //选中方案id
    setModalId(id);
  }, []);

  //方案模态框类型切换
  const toggleModalType = useCallback((type) => {
    setModalType(type);
  }, []);

  return {
    visible,
    modalId,
    modalType,
    userId: systemPage.user.id,
    setVisible,
    toggleModalVisible,
    toggleModalType,
  };
};

//方案头
const STitle = (props) => {
  const { schemeListData } = props;
  const { statusValues, NTFMShowType, filterCount } = schemeListData; //获取排序后的方案列表

  //状态-多选按钮组-切换事件
  const onChange = useCallback((checkedValues) => {
    schemeListData.setStatusValues(checkedValues);
  }, []);
  //  NTFM方案显示类型-多选按钮组-切换事件
  const onNTFMShowTypeChange = useCallback((checkedValues) => {
    schemeListData.setNTFMShowType(checkedValues);
  }, []);

  // 快捷筛选
  const debounceUpdateSearchVal = useCallback(
    debounce(
      (value) => {
        let val = value.trim().toUpperCase();
        // 重置备选前序航班集合store
        schemeListData.setSearchVal(val);
      },
      200,
      { maxWait: 500 }
    ),
    []
  );

  const menu = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group
          className="scheme-filter-checkbox"
          options={plainOptions}
          defaultValue={statusValues}
          onChange={onChange}
        />
      </Menu.Item>
      <Menu.Divider></Menu.Divider>
      <Menu.Item>
        <Checkbox.Group
          className="scheme-filter-checkbox"
          options={NTFMOptions}
          defaultValue={NTFMShowType}
          onChange={onNTFMShowTypeChange}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="scheme-filter-items">
      <div className="filter-input">
        <Input
          prefix={<SearchOutlined />}
          className="text-uppercase"
          size="small"
          allowClear
          placeholder="方案筛选"
          // onPressEnter={(e)=>{debounceUpdateSearchVal(e)}}
          onChange={(e) => debounceUpdateSearchVal(e.target.value)}
        />
      </div>
      <div className="filter-options">
        <Dropdown overlay={menu} trigger={["hover", "click"]}>
          <span className="filter-wrapper">
            {filterCount > 0 ? (
              <Badge
                className="filter-badge"
                count={filterCount}
                style={{ background: "#08c9f7" }}
              ></Badge>
            ) : (
              <FilterOutlined></FilterOutlined>
            )}
            <span>筛选</span>
          </span>
        </Dropdown>
      </div>
    </div>
  );
};
const SchemeTitle = inject("schemeListData")(observer(STitle));

//方案列表
function SList(props) {
  const {
    match,
    schemeListData,
    flightTableData,
    executeKPIData,
    performanceKPIData,
    systemPage,
    todoList,
  } = props;
  const params = match.params || {};
  const from = params.from || ""; //来源
  const getSchemeList = useSchemeList({
    systemPage,
    schemeListData,
    executeKPIData,
    performanceKPIData,
    flightTableData,
  });
  useFlightsList({
    schemeListData,
    performanceKPIData,
    systemPage,
    flightTableData,
  });
  const {
    userId,
    visible,
    modalId,
    modalType,
    setVisible,
    toggleModalVisible,
    toggleModalType,
  } = useSchemeModal({ systemPage });
  if (systemPage.systemKind === "CRS") {
    useExecuteKPIData({
      schemeListData,
      executeKPIData,
      systemPage,
    });
  }

  //接收客户端传来方案id，用以自动切换到选中方案
  NWGlobal.setSchemeId = useCallback((schemeId, title) => {
    // alert("收到id:" + schemeId + "  title:" + title);
    //主动获取一次
    getSchemeList().then(function (data) {
      //验证有没有这个方案
      const res = schemeListData.activeScheme(schemeId);
      if (isValidObject(res)) {
        // 该方案是否已计算
        const isCalculated = res.isCalculated;
        // 若该方案已计算则切换为活动方案
        if (isCalculated) {
          handleActive(schemeId, title, "client");
        }
      } else {
        customNotice({
          type: "warning",
          message: "暂未获取到方案，方案名称是：" + title,
          duration: 20,
        });
      }
    });
  }, []);

  //根据工作待办-协调类-【主办】跳转到放行监控，并高亮待办航班
  NWGlobal.targetToFlight = (schemeId, flightId) => {
    // alert("schemeId:"+schemeId+" flightId:"+flightId);
    //验证有没有这个方案
    const res = schemeListData.activeScheme(schemeId);
    if (isValidObject(res)) {
      //当前选中的方案
      const activeSchemeId = schemeListData.activeSchemeId;
      if (activeSchemeId !== schemeId) {
        //如果当前激活的id和传来的不一样，手动触发
        //选中方案
        schemeListData.toggleSchemeActive(schemeId + "");
        systemPage.setLeftNavSelectedName("");
      }
    } else {
      //选默认交通流
      if (systemPage.leftNavNameList.indexOf(schemeId) !== -1) {
        //选默认交通流
        schemeListData.toggleSchemeActive(schemeId);
        systemPage.setLeftNavSelectedName(schemeId);
      }
    }

    flightTableData.focusFlightId = flightId;
    //验证航班协调按钮是否激活 todo为已激活
    if (systemPage.modalActiveName !== "todo") {
      systemPage.setModalActiveName("todo");
    }
    if (todoList.activeTab !== "1") {
      todoList.activeTab = "1";
    }
    let taskId = todoList.getIdByFlightId(flightId);
    if (isValidVariable(taskId)) {
      //根据 taskId 高亮工作流
      todoList.focusTaskId = taskId;
    }
  };

  //高亮方案并获取航班数据和KPI数据
  const handleActive = useCallback(
    debounce((id, title, from) => {
      // console.log("handleActive 方案:", id);
      if (!flightTableData.dataLoaded || from === "init") {
        const res = schemeListData.toggleSchemeActive(id + "");
        systemPage.setLeftNavSelectedName("");
        if (res) {
          //来自客户端定位，滚动到对应位置
          if (from === "client") {
            // 滚动条滚动到顶部
            const canvas =
              document.getElementsByClassName("scheme_list_canvas")[0];
            const boxContent =
              canvas.getElementsByClassName("list_container")[0];
            boxContent.scrollTop = 0;
          }
        }
      } else {
        customNotice({
          type: "warning",
          message: "航班数据请求中,请稍后再试",
          duration: 10,
        });
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (
      schemeListData.activeSchemeId === "" &&
      schemeListData.sortedList.length > 0 &&
      systemPage.leftNavSelectedName === ""
    ) {
      //默认选第一条 已计算
      let defaultId = "";
      schemeListData.sortedList.map((item) => {
        if (item.isCalculated && defaultId === "") {
          defaultId = item.id;
        }
      });

      handleActive(defaultId, "", "init");
    }
  }, [
    schemeListData.sortedList,
    schemeListData.activeSchemeId,
    systemPage.leftNavSelectedName,
  ]);

  // useEffect(() => {
  //   // console.log(schemeListData.searchVal);
  // }, [schemeListData.searchVal]);

  // console.log(schemeListData.sortedList);
  return (
    <div className="list_container">
      {schemeListData.sortedList.length > 0 ? (
        schemeListData.sortedList.map((item, index) => (
          <SchemeItem
            activeSchemeId={schemeListData.activeSchemeId}
            item={item}
            handleActive={handleActive}
            key={index}
            toggleModalVisible={toggleModalVisible}
            toggleModalType={toggleModalType}
            generateTime={schemeListData.generateTime}
          ></SchemeItem>
        ))
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ color: "#fff" }}
        />
      )}
      {visible ? (
        <SchemeModal
          userId={userId}
          visible={visible}
          setVisible={setVisible}
          modalType={modalType}
          modalId={modalId}
        />
      ) : (
        ""
      )}
    </div>
  );
}

const SchemeList = withRouter(
  inject(
    "schemeListData",
    "flightTableData",
    "executeKPIData",
    "performanceKPIData",
    "systemPage",
    "todoList"
  )(observer(SList))
);

const SchemeListModal = (props) => {
  const { schemeListData } = props;
  const loading = schemeListData.loading;
  return (
    <div className="scheme_list_canvas">
      <Spin spinning={loading}>
        <SchemeTitle />
        <SchemeList />
      </Spin>
    </div>
  );
};
export default inject("schemeListData")(observer(SchemeListModal));
