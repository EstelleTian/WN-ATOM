/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2021-09-17 16:38:38
 * @LastEditTime: 2021-03-04 14:40:22
 * @LastEditors: liutianjiao
 * @Description: 方案列表
 * @FilePath: \WN-ATOM\src\components\SchemeList\SchemeList.jsx
 */
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef
} from "react";
import debounce from "lodash/debounce";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import {
  Checkbox,
  Empty,
  Spin,
  Input,
  Badge,
  Button,
  Dropdown,
  Menu
} from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

import { isValidVariable, isValidObject } from "utils/basic-verify";
import { NWGlobal } from "utils/global";
import SchemeModal from "./SchemeModal";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import SchemeItem from "./SchemeItem";
import useSchemeList from "./useSchemeList";
import useFlightsList from "./useFlightsList";
import useExecuteKPIData from "./useExecuteKPIData";
import "./SchemeList.scss";
import { exchangeSlot } from "../../stores/exchangeSlotStores";

// 接收storage同源消息
window.addEventListener("storage", function (e) {
  if (e.key === "targetToFlight") {
    // alert(111);
    const newValue = e.newValue || "{}";
    let values = JSON.parse(newValue);
    const { tacticId = "", flightStr = "{}", fromType = "" } = values;
    const flightObj = JSON.parse(flightStr) || {};
    NWGlobal.targetToFlight(tacticId, flightObj, fromType);
  }
  localStorage.removeItem("targetToFlight");
});

//方案状态多选按钮组
const plainOptions = [
  { label: "正在执行", value: "RUNNING" },
  { label: "将要执行", value: "FUTURE" },
  { label: "已经终止", value: "TERMINATED" }
];
// NTFM方案过滤多选按钮组
const NTFMOptions = [
  { label: "NTFM流控", value: "NTFM-ORIGINAL-100" },
  { label: "NTFM消息", value: "NTFM-ORIGINAL-200" }
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
    toggleModalType
  };
};

//方案头
const STitle = (props) => {
  const { schemeListData, systemPage } = props;
  const { statusValues, NTFMShowType, filterCount } = schemeListData; //获取排序后的方案列表
  let [dropdownVisible, setDropdownVisible] = useState(false);
  let [totalDropdownVisible, setTotalDropdownVisible] = useState(false);

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

  const handleDropdownVisible = (flage) => {
    setDropdownVisible(flage);
  };
  const handleTotalDropdownVisible = (flage) => {
    setTotalDropdownVisible(flage);
  };

  const menu = (
    <div className="spin-menu-wrapper">
      <Spin spinning={schemeListData.loading} indicator={null}>
        <Menu className="spin-menu" selectable={false}>
          <Menu.Item>
            <span className="menu-item-label">状态:</span>
            <Checkbox.Group
              className="scheme-filter-checkbox"
              options={plainOptions}
              defaultValue={statusValues}
              onChange={onChange}
            />
          </Menu.Item>
          <Menu.Divider></Menu.Divider>
          <Menu.Item>
            <span className="menu-item-label">NTFM:</span>
            <Checkbox.Group
              className="scheme-filter-checkbox"
              options={NTFMOptions}
              defaultValue={NTFMShowType}
              onChange={onNTFMShowTypeChange}
            />
          </Menu.Item>
        </Menu>
      </Spin>
    </div>
  );
  //根据方向过滤方案
  const schemeList = useMemo(() => {
    let list = schemeListData.sortedList || [];
    const activeDir = systemPage.activeDir || {};
    let name = activeDir.name || "";
    if (name !== "ALL") {
      list = list.filter((item) => {
        const tacticDirection = item.tacticDirection || "";
        // console.log("tacticDirection", tacticDirection);
        if (tacticDirection.indexOf(name) > -1) {
          return true;
        } else {
          return false;
        }
      });
    }

    return list;
  }, [schemeListData.sortedList, systemPage.activeDir]);

  //根据方向过滤方案-归类
  const schemeListObj = useMemo(() => {
    let group = {
      RUNNING: 0,
      FUTURE: 0,
      TERMINATED: 0,
      "NTFM-ORIGINAL-100": 0,
      "NTFM-ORIGINAL-200": 0
    };
    if (schemeList.length > 0) {
      schemeList.map((item, index) => {
        let tacticStatus = item.tacticStatus;
        switch (tacticStatus) {
          case "RUNNING":
            group.RUNNING++;
            break;
          case "FUTURE":
            group.FUTURE++;
            break;
          case "TERMINATED":
          case "TERMINATED_MANUAL":
          case "TERMINATED_AUTO":
            group.TERMINATED++;
            break;
          case "NTFM-ORIGINAL-100":
            group["NTFM-ORIGINAL-100"]++;
            break;
          case "NTFM-ORIGINAL-200":
            group["NTFM-ORIGINAL-200"]++;
            break;
        }
      });
    }
    return group;
  }, [schemeList]);

  let totalMenu = useMemo(() => {
    return (
      <div className="spin-menu-wrapper">
        <Spin spinning={schemeListData.loading} indicator={null}>
          <Menu className="spin-menu" selectable={false}>
            <Menu.Item>
              <span className="menu-item-label">状态:</span>
              {plainOptions.map((option, index) => (
                <span
                  key={option.value}
                  className="filter-wrapper"
                  style={{ paddingRight: "8px" }}
                >
                  <span style={{ marginRight: "2px" }}>{option.label}</span>
                  <Badge
                    className="filter-badge"
                    count={schemeListObj[option.value]}
                    style={{ background: "#08c9f7" }}
                  ></Badge>
                </span>
              ))}
            </Menu.Item>
            <Menu.Divider></Menu.Divider>
            <Menu.Item>
              <span className="menu-item-label">NTFM:</span>
              {NTFMOptions.map((option, index) => (
                <span
                  key={option.value}
                  className="filter-wrapper"
                  style={{ paddingRight: "8px" }}
                >
                  <span style={{ marginRight: "2px" }}>{option.label}</span>
                  <Badge
                    className="filter-badge"
                    count={schemeListObj[option.value]}
                    style={{ background: "#08c9f7" }}
                  ></Badge>
                </span>
              ))}
            </Menu.Item>
          </Menu>
        </Spin>
      </div>
    );
  }, [schemeListObj]);

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
      {/* 总计 */}
      <div className="filter-options" style={{ marginRight: "8px" }}>
        <Dropdown
          overlay={totalMenu}
          onVisibleChange={handleTotalDropdownVisible}
          visible={totalDropdownVisible}
          trigger={["click"]}
        >
          <span className="filter-wrapper">
            <span style={{ marginRight: "2px" }}>总计</span>
            <Badge
              className="filter-badge"
              count={schemeList.length}
              style={{ background: "#08c9f7" }}
            ></Badge>
          </span>
        </Dropdown>
      </div>
      {/* 显示条件 */}
      <div className="filter-options">
        <Dropdown
          overlay={menu}
          onVisibleChange={handleDropdownVisible}
          visible={dropdownVisible}
          trigger={["click"]}
        >
          <span className="filter-wrapper">
            <span style={{ marginRight: "2px" }}>显示条件</span>
            {filterCount > 0 ? (
              <Badge
                className="filter-badge"
                count={filterCount}
                style={{ background: "#08c9f7" }}
              ></Badge>
            ) : (
              <FilterOutlined></FilterOutlined>
            )}
          </span>
        </Dropdown>
      </div>
    </div>
  );
};
const SchemeTitle = inject("schemeListData", "systemPage")(observer(STitle));

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
    exchangeSlot,
    myApplicationList,
    prohibitedData
  } = props;
  const params = match.params || {};
  const from = params.from || ""; //来源
  const getSchemeList = useSchemeList({
    systemPage,
    schemeListData,
    executeKPIData,
    performanceKPIData,
    flightTableData
  });
  useFlightsList({
    schemeListData,
    performanceKPIData,
    systemPage,
    flightTableData
  });
  const {
    userId,
    visible,
    modalId,
    modalType,
    setVisible,
    toggleModalVisible,
    toggleModalType
  } = useSchemeModal({ systemPage });

  useExecuteKPIData({
    schemeListData,
    executeKPIData,
    systemPage
  });

  //接收客户端传来方案id，用以自动切换到选中方案
  NWGlobal.setSchemeId = useCallback((schemeId, title) => {
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
          duration: 20
        });
      }
    });
  }, []);

  //根据工作待办-协调类-【主办】跳转到放行监控，并高亮待办航班
  NWGlobal.targetToFlight = (schemeId, flightObj, fromType) => {
    if (fromType === "notam") {
      prohibitedData.setProhibitedListModalVisible(true);
      return;
    }
    //验证有没有这个方案
    if (isValidVariable(schemeId)) {
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
    }

    const flightId = flightObj.flightId || ""; //航班id
    const sid = flightObj.sid || ""; //流水号
    flightTableData.focusFlightId = flightId;

    if (fromType === "finished") {
      //验证航班协调按钮是否激活 todo为已激活
      if (systemPage.modalActiveName !== "todo") {
        systemPage.setModalActiveName("todo");
      }
      todoList.activeTab = "2";
      myApplicationList.focusSid = sid;
    } else if (fromType === "todo") {
      //验证航班协调按钮是否激活 todo为已激活
      if (systemPage.modalActiveName !== "todo") {
        systemPage.setModalActiveName("todo");
      }
      todoList.activeTab = "1";
      todoList.focusSid = sid;
    } else if (fromType === "slot") {
      //验证时隙交换按钮是否激活 slot为已激活
      if (systemPage.modalActiveName !== "slot") {
        systemPage.setModalActiveName("slot");
      }
      exchangeSlot.focusSid = sid;
    }
  };

  //高亮方案并获取航班数据和KPI数据
  const handleActive = useCallback(
    debounce((id, title, from) => {
      if (!flightTableData.dataLoaded || from === "init") {
        let res = {};

        if (
          systemPage.activeSystem.system.indexOf("CDM") > -1 &&
          id === schemeListData.activeSchemeId
        ) {
          // alert("切换模块11:" + id);
          systemPage.setLeftNavSelectedName("all");
          res = schemeListData.toggleSchemeActive("");
        } else {
          // alert("切换模块22:" + id);
          res = schemeListData.toggleSchemeActive(id + "");
          systemPage.setLeftNavSelectedName("");
        }
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
          duration: 10
        });
      }
    }, 500),
    []
  );
  //根据方向过滤方案
  const schemeList = useMemo(() => {
    let list = schemeListData.sortedList || [];
    const activeDir = systemPage.activeDir || {};
    let name = activeDir.name || "";
    if (name !== "ALL") {
      list = list.filter((item) => {
        const tacticDirection = item.tacticDirection || "";
        if (tacticDirection.indexOf(name) > -1) {
          return true;
        } else {
          return false;
        }
      });
    }
    return list;
  }, [schemeListData.sortedList, systemPage.activeDir]);

  useEffect(() => {
    if (schemeList.length > 0) {
      const selectOne = () => {
        //默认选第一条 已计算
        let defaultId = "";
        schemeList.map((item) => {
          if (item.isCalculated && defaultId === "") {
            defaultId = item.id;
          }
        });

        handleActive(defaultId, "", "init");
      };
      if (
        schemeListData.activeSchemeId === "" &&
        systemPage.leftNavSelectedName === ""
      ) {
        //默认选第一条 已计算
        // alert(
        //   "默认选第一条 都是空 activeSchemeId:" +
        //     schemeListData.activeSchemeId +
        //     "  leftNavSelectedName:" +
        //     systemPage.leftNavSelectedName
        // );
        selectOne();
      } else {
        let activeList = schemeList.filter(
          (item) => item.id === schemeListData.activeSchemeId
        );
        if (activeList.length === 0 && systemPage.leftNavSelectedName === "") {
          //默认选第一条 已计算
          // alert("默认选第一条 进入逻辑判断二");
          selectOne();
        }
      }
    } else {
      schemeListData.toggleSchemeActive("");
      if (systemPage.systemKind === "CDM") {
        systemPage.setLeftNavSelectedName("all");
      } else {
        flightTableData.updateFlightsList([], "", "");
      }
      executeKPIData.updateExecuteKPIData({}, "");
    }
  }, [
    schemeList,
    schemeListData.activeSchemeId,
    systemPage.leftNavSelectedName
  ]);

  // useEffect(() => {
  //   // console.log(schemeListData.searchVal);
  // }, [schemeListData.searchVal]);

  return (
    <div className="list_container">
      {schemeList.length > 0 ? (
        schemeList.map((item, index) => (
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
    "todoList",
    "exchangeSlot",
    "myApplicationList",
    "prohibitedData"
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
