import React, { useEffect, useState, useRef } from "react";
import { Tabs, Tooltip, Modal } from "antd";
import _ from "lodash";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
} from "utils/basic-verify";
import { customNotice } from "utils/common-funcs";
// import FeHelper from "./FeHelper.js";
import "./WeatherPage.scss";

function WeatherPage(props) {
  const [isData, setIsData] = useState([]);
  const [generateTime, setGenerateTime] = useState("");
  let timer = useRef();
  const { TabPane } = Tabs;

  //更新数据
  const updateData = (res) => {
    const orderList = ["05L", "05R", "23R", "23L"];
    const generateTime = res.generateTime || "";

    const data = res.data || [];
    let arr = [];
    orderList.map((name) => {
      const index = _.findIndex(data, { rno: name });
      if (index !== -1) {
        arr.push(data[index]);
      }
    });

    setIsData(arr);
    setGenerateTime(generateTime);
  };

  //获取数据
  const getData = async () => {
    // updateData(FeHelper);
    try {
      const res = await requestGet2({
        url: ReqUrls.timeSlotSwitchingUrl + "ZLXY",
      });
      updateData(res);
      timer.current = setTimeout(function () {
        getData();
      }, 60 * 1000);
    } catch (e) {
      let message = `获取数据失败`;
      if (isValidVariable(e)) {
        message = message + ":" + e;
      }
      customNotice({
        type: "error",
        message: message,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="Weather">
      <div className="WeatherPageBox">
        {isData.map((item, index) => {
          return (
            <div className="WeatherPage_item" key={index}>
              <div className="WeatherPage_Title">{item.rno || ""}</div>
              <div className="WeatherPage_Angle">
                <div className="ring">
                  <div className={`runway r_${item.rno || ""}`}></div>
                </div>
              </div>
              <div className="WeatherPage_Information">
                <div className="InformationItem">
                  <span className="ItemLeft">RVR 1A</span>
                  <Tooltip title="RVR 1A">
                    <span className="ItemRight">P{item.tdzRvr1a || ""}m</span>
                  </Tooltip>
                </div>
                <div className="InformationItem">
                  <span className="ItemLeft">Wind 10A</span>
                  <Tooltip title="Wind 10A">
                    <span className="ItemRight">
                      {item.tdzWindF10}m/s {item.tdzWindD10 || ""}°
                    </span>
                  </Tooltip>
                </div>
                <div className="InformationItem">
                  <span className="ItemLeft">TEMP</span>
                  <Tooltip title="TEMP">
                    <span className="ItemRight">{item.tdzTemp || ""}℃</span>
                  </Tooltip>
                </div>
                <div className="InformationItem">
                  <span className="ItemLeft">Cloud HL</span>
                  <Tooltip title="Cloud HL">
                    <span className="ItemRight">
                      {item.tdzCloudBase || ""}m
                    </span>
                  </Tooltip>
                </div>
                <div className="InformationItem">
                  <span className="ItemLeft">RH</span>
                  <Tooltip title="RH">
                    <span className="ItemRight">{item.tdzHumid || ""}%</span>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="Weather_time" title={generateTime}>
        <span>数据更新时间：</span>
        {formatTimeString(generateTime, 1)}
      </div>
    </div>
  );
}

export default WeatherPage;
