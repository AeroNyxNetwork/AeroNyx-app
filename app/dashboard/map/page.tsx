

"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts-extension-gmap';
import axios from "axios"
import { size } from 'lodash';
const _ = require('lodash');

const GoogleMapChart = () => {
    const [randomPoints, setRandomPoints] = useState([])
    const [connections, setConnections] = useState([]);
    const chartRef = useRef(null);
    const darkThemeStyles = [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }],
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }],
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }],
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#07080A' }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#07080A' }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#000000' }],
        },
        {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#999999' }, { weight: 0.5 }],
        },
    ];



    useEffect(() => {
        axios.get("https://nodev2.aeronyx.network/v2/citys")
            .then((res: any) => {
                console.log('res', res)
                let arr: any = []
                let arr1: any = []
                res.data.forEach((item: any, index: number) => {
                    if (item?.langitude && item?.latitude && item?.city) {
                        arr.push([item.langitude, item.latitude, item?.city])

                    }
                })
                arr.forEach((item: any, index: number) => {
                    console.log('first', item)
                    const sampleArr = _.sample(arr);
                    arr1.push(
                        {
                            coords: [
                                [item[0], item[1]],
                                sampleArr
                            ],
                            label: item[2]
                        }
                    )
                })
                setConnections(arr)
                setRandomPoints(arr1)

            })
    }, [])





    useEffect(() => {
        const chart = echarts.init(document.getElementById("map"));
        if (size(randomPoints) > 0 || size(randomPoints) > 0) {

            const option = {
                gmap: {
                    center: { lng: 35, lat: 20 },
                    zoom: 3,
                    roam: true,
                    renderOnMoving: true,
                    echartsLayerZIndex: 2019,
                    styles: darkThemeStyles,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params: any) {
                        return params.data.label;
                    },
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'transparent',
                    textStyle: {
                        color: '#fff'
                    }
                },

                series: [
                    {
                        type: 'scatter',

                        coordinateSystem: 'gmap',

                        data: [[120, 30, "shanghai"], ...connections],
                        encode: {
                            lng: 0,
                            lat: 1,
                            value: 2
                        },
                        symbolSize: 5,
                        itemStyle: {
                            color: '#FFD700',
                            size: "1"
                        }
                    },
                    {
                        type: 'lines',
                        coordinateSystem: 'gmap',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 5,
                            trailLength: 0.5,
                            symbol: 'arrow',
                            symbolSize: 2,
                        },
                        lineStyle: {
                            color: '#7EC0EE',
                            width: 1,
                            opacity: 0,
                            curveness: 0.3
                        },
                        data: randomPoints
                    }
                ]
            };


            chart.setOption(option);
            const gmapComponent = (chart as any).getModel().getComponent('gmap');
            const gmapInstance = gmapComponent.getGoogleMap();
            gmapInstance.setOptions({
                disableDefaultUI: true,
                gestureHandling: 'none',
                zoomControl: false,
                scrollwheel: false,
                disableDoubleClickZoom: true,
            });

        }

        return () => {
            // chart.dispose();
        };

    }, [randomPoints, connections]);

    return <div id="map" style={{ width: "100%", height: '99vh' }} ></div>;
};

export default GoogleMapChart;

