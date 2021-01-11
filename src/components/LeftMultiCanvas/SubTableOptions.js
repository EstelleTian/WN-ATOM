/**
 * 表格列模式模板（通用效果）
 */
import { isValidVariable } from 'utils/basic-verify.js'
import { FlightCoordination } from 'utils/flightcoordination.js'

const SubNames = {
    "exempt": "",
    "pool": "",
    "special": "",
    "expired": "",
    "todo": "",
}
const SubTableConvertData = {
    "exempt":  ( flights ) => {
        let resArr = [];// 全局豁免航班
        // 判断是否为全局豁免航班
        if( flights.length > 0 ){
            flights.map( flight => {
                if( isValidVariable(flight.priority) && flight.priority === FlightCoordination.PRIORITY_EXEMPT ){
                    resArr.push(flight);
                }
            })

        }
        return resArr;
    },
    "pool": "",
    "special": "",
    "expired": "",
    "todo": "",
}

export { SubNames, SubTableConvertData }

