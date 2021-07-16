import React, { Fragment } from "react";
import { Radio, Badge, Button, Avatar } from "antd";

// import RefreshBtn from "components/SchemeList/RefreshBtn";
// import DateRange from "./DateRangeBar";
import DirectionBar from "./DirectionBar";

import "./RightNav.scss";

function LeftNav() {
  return (
    <div className="layout-nav-right layout-row nav_left">
      <div className="nav_bar">
          <span>
            <DirectionBar />
          </span>
      </div>
    </div>
  );
}

export default LeftNav;
