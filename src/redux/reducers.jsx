import { combineReducers } from 'redux';
import { flowControlPublishData } from 'components/PublishAirportFlow/Redux.jsx';
import { totalSetting, duplicatedData } from 'components/TotalSetting/Redux.jsx';
import { KPIDatas } from 'components/KPI/Redux.jsx';
import { airportList  } from 'components/ArrivalHome/Redux.jsx';
import { airportPredictionList  } from 'components/Statistics/Redux.jsx';
import { flightsTableList  } from 'components/Flights/Redux.jsx';
import { flightInfoDatas  } from 'components/FlightInfo/Redux.jsx';
import { detailModalDatas } from "components/DetailModule/Redux";
import { operationDatas } from "components/OperationDialog/Redux";
import { projectList } from 'components/ProjectList/Redux';
import { generateTime, predictionMap } from 'components/AirportFlowPrediction/Redux';
import { monitorMapDatas } from 'components/MonitorMap/Redux';
import { messageCenterDatas } from 'components/messageCenter/Redux';
// import { bgData } from '../views/BackgroundRedux';



const appReducer = combineReducers({
    generateTime, predictionMap, airportList, projectList, flowControlPublishData, totalSetting, duplicatedData,
    KPIDatas, airportPredictionList, detailModalDatas, flightsTableList,operationDatas,
    flightInfoDatas, monitorMapDatas, messageCenterDatas
});

const reducer = (state, action) => {
    if( action.type === 'userLogout'){
        state = undefined;
    }
    return appReducer(state, action)
}

export default reducer;