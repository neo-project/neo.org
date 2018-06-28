//点击展开

//每秒获取区块高度、出块时间计算

//点击刷新页面

//页面响应式

//echart数据模拟
var myChart = echarts.init(document.getElementById('main'));
option = {
    backgroundColor: '#F9FBF2',
    title: {
        text: '请求数',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
        },
        left: '6%'
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,1)',
        borderRadius:'2',
        axisPointer: {
            lineStyle: {
                color: '#999999'
            }
        },
        textStyle: {
            fontWeight: 'normal',
            color: '#666666'
        }
    },
    legend: {
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 14,
        data: ['交易量', '区块大小'],
        right: '4%',
        textStyle: {
            fontSize: 12,
            color: '#666666'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: {
            lineStyle: {
                color: '#CCC',
                opcity:'0.8'
            }
        },
        data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
    }],
    yAxis: [{
        type: 'value',
        name: '单位（%）',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#CCC'
            }
        },
        axisLabel: {
            margin: 10,
            textStyle: {
                fontSize: 14
            }
        },
        splitLine: {
            lineStyle: {
                color: '#ECECEC'
            }
        }
    }],
    series: [{
        name: '交易量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(190,220,25, 0.8)'
                }, {
                    offset: 0.8,
                    color: 'rgba(210, 220, 25, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: 'rgb(200,220,25)'
            }
        },
        data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
    }, {
        name: '区块大小',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(148,207,134, 0.8)'
                }, {
                    offset: 0.8,
                    color: 'rgba(158,217,144, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: 'rgb(170,203,162)'
            }
        },
        data: [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
    }]
};
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

$('#main').resize(function () {
    myChart.resize();
});
