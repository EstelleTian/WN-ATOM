/*
 * @Author: your name
 * @Date: 2020-12-16 16:12:27
 * @LastEditTime: 2020-12-16 18:24:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\SimpleMap\SimpleMap.jsx
 */
/*
 * @Author: your name
 * @Date: 2020-12-16 16:12:27
 * @LastEditTime: 2020-12-16 17:45:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\SimpleMap\SimpleMap.jsx
 */
import React from 'react'
import L from 'leaflet'
import china from './china.js'
import sector from './sector.js'
import 'leaflet/dist/leaflet.css'
import './SimpleMap.scss'
class SimpleMap extends React.Component {
    
    setMap(){
        const ipHost = "http://192.168.210.112:7070/geoserver/gwc/service/wms";
        let mainMap = L.map("map", {
            minZoom: 3,//设置最小缩放等级
            // maxZoom: 10,//设置最小缩放等级
            maxBounds: [
                [82.69865866056999, 272.28515625000006],
                [-8.754794702435618, -65.21484375000001]
            ],//设置缩放范围
        });
        
        //设置地图中心视角
        mainMap.setView([40.072222, 116.597222], 3);

        //瓦片中国地图(加载wms瓦片)
        let openmap = L.tileLayer.wms(ipHost, {
            layers: 'ADCC_CDM:CHINA_STREET_MAP',
            format: 'image/jpeg',
        });
        
         //中国轮廓图
        let chinaBorder = L.geoJSON(china, {
            style: function (feature) {
                return {
                    color: "#c5c5c5",
                    fillColor: "transparent",
                    weight: 0.8
                    // fillOpacity:1
                };
            }
        });
        //定义图层对象
        let layersGroup = {};
        //扇区
        let secMap = L.geoJSON(sector, {
            style: function (feature) {
                let obj = {
                    color: "#3333ff",
                    fillColor: "transparent",
                    weight: 1
                };
                return obj;
            },
            onEachFeature: function (feature, layer) {
                let title =
                    feature.properties.name + " " + feature.properties["sub-name"];
                let opt = {
                    permanent: true,
                    className: "sector"
                };
                if (feature.properties["sub-name"].indexOf("以上") > -1) {
                    opt.offset = L.point(0, -20);
                }
                if (feature.properties["sub-name"].indexOf("以下") > -1) {
                    opt.offset = L.point(0, 20);
                }
                layer.bindTooltip(title, opt);
                layer.closeTooltip();
            }
        });
        // 更新图层id
        secMap['_leaflet_id'] = 'secMap';
        layersGroup['secMap'] = secMap;

        /**
     * 部分图层title显示规则
     * @param layer
     * @param zoomIndex
     */
    let layerShowRule = function(layer, zoomIndex) {
        //排除航路和航路点和经纬网图层
        if (layer['_leaflet_id'] !== 'airwayMap' && layer['_leaflet_id'] !== 'waypointMap' && layer['_leaflet_id'] !== 'gridLayer') {
            //管制区情报区显示规则
            if (layer['_leaflet_id'] === 'firMap' || layer['_leaflet_id'] === 'accMap') {
                if (zoomIndex * 1 <= 7) {
                    // 缩放层级小于7  显示文字
                    if (mainMap.hasLayer(layer)) {
                        layer.eachLayer(function (L) {
                            L.openTooltip();
                        });
                    }
                } else if (zoomIndex * 1 > 7) {
                    // 缩放层级大于7 隐藏文字
                    if (mainMap.hasLayer(layer)) {
                        layer.eachLayer(function (L) {
                            L.closeTooltip();
                        });
                    }
                }
            } else {
                // 缩放层级大于7 显示文字
                if (zoomIndex * 1 >= 7) {
                    if (mainMap.hasLayer(layer)) {
                        layer.eachLayer(function (L) {
                            L.openTooltip();
                        });
                    }
                } else if (zoomIndex * 1 < 7) {
                    // 缩放层级小于7 隐藏文字
                    if (mainMap.hasLayer(layer)) {
                        layer.eachLayer(function (L) {
                            L.closeTooltip();
                        });
                    }

                }
            }
        }
    }
    /**
     * 图层文字显示控制器
     * @param obj 图层对象
     */
    let controlMapsFunc = function( obj) {
        //获取当前缩放层级
        let zoomIndex = mainMap.getZoom();
        if (obj instanceof Array) {
            console.log(1);
            //遍历每个图层
            obj.map((item) => {
                layerShowRule(item, zoomIndex)
            });
        } else {
            console.log(2);
            // 单图层
            layerShowRule(obj, zoomIndex)
        }
    };

        let layers = layersGroup;
        let layersArr = [];
        //绑定到图层添加事件控制title显示
        for(let index in layers ){
            let aipLayer = layers[index]
            //显示事件
            aipLayer.on("add", function () {
                controlMapsFunc(aipLayer)
            });
            //缩放事件
            aipLayer.on("zoomend", function () {
                aipLayer(layersArr)
            })
            layersArr.push(aipLayer);
        };
        //绑定到缩放事件控制title显示
        mainMap.on("zoomend", function () {
            controlMapsFunc(layersArr)
        })
        
        openmap.addTo(mainMap);
        //定义图层
        let baseMapLaysers = {
            瓦片中国地图: openmap,
            中国轮廓图: chinaBorder,
            扇区: layersGroup.secMap
            
        };


        let layerControl = L.control.layers(baseMapLaysers);
        layerControl.addTo(mainMap);
    }
    
    componentDidMount() {
        this.setMap();
      }
      render(){
        return(
            <div id="map"></div>
        )
      }
}


export default SimpleMap 
