import React, { useEffect, useState } from "react";
import { Tabs, Tooltip, Modal } from "antd";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidVariable, isValidObject } from "utils/basic-verify";
import { customNotice } from "utils/common-funcs";
// import FeHelper from './FeHelper.js';
import "./WeatherPage.scss";
function WeatherPage(props) {
  const [isData, getIsData] = useState([]);

  const { TabPane } = Tabs;

  const updateData = (data) => {
    let arr = [];
    FeHelper.data.map((item, index) => {
      if ((index + 1) % 2 === 0) {
        console.log(item.rno);
      }
      let obj = {};
      obj.rno = item.rno;
      obj.rvr1a = item.tdzRvr1a;
      obj.wd10a = item.tdzWindF10;
      obj.wd10as = item.tdzWindD10;
      obj.tains = item.tdzTemp;
      obj.cloud = item.tdzCloudBase;
      obj.rhins = item.tdzHumid;
      arr.push(obj);
    });
    getIsData(arr);
    // console.log(arr);
    console.log(FeHelper);
  };
  //获取配置数据
  const getData = async () => {
    try {
      const data = await requestGet2(ReqUrls.TimeslotSwitchingUrl + "ZLXY");
      console.log(data);
      updateData(data);
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
              <div className="WeatherPage_Title">{item.rno}</div>
              <div className="WeatherPage_Angle"></div>
              <div className="WeatherPage_Information">
                <div className="InformationItem">
                  <span className="ItemLeft">RVR 1A</span>
                  <Tooltip title="RVR 1A">
                    <span className="ItemRight">P{item.tdzRvr1a}m</span>
                  </Tooltip>
                </div>
                <div className="InformationItem">
                  <span className="ItemLeft">Wind 10A</span>
                  <Tooltip title="Wind 10A">
                    <span className="ItemRight">
                      {item.tdzWindF10}m/s {item.tdzWindD10}°
                    </span>
                  </Tooltip>
                </div>
                <div className="InformationItem">
                  <span className="ItemLeft">TEMP</span>
                  <Tooltip title="TEMP">
                    <span className="ItemRight">{item.tdzTemp}℃</span>
                  </Tooltip>
                </div>
                <div className="InformationItem">
                  <span className="ItemLeft">Cloud HL</span>
                  <Tooltip title="Cloud HL">
                    <span className="ItemRight">{item.tdzCloudBase}m</span>
                  </Tooltip>
                </div>
                <div className="InformationItem">
                  <span className="ItemLeft">RH</span>
                  <Tooltip title="RH">
                    <span className="ItemRight">{item.tdzHumid}%</span>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherPage;
