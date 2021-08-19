import React, { useCallback } from "react";
import { inject, observer } from "mobx-react";
import "./SideStickBar.scss";
const SideStickBar = ({ systemPage }) => {
  const showLeftCanvas = useCallback(() => {
    systemPage.setLeftActiveName("kpi");
  }, []);

  return (
    <div className="side_stick_bar">
      <div className="bar_canvas" onClick={showLeftCanvas}>
        <div className="arrow">></div>
      </div>
    </div>
  );
};

export default inject("systemPage")(observer(SideStickBar));
