getListdata();

//点击展开
function showDetail(ele) {
    ele.parents(".tr-con").next(".can-detail").toggle("fast");
}

//获取区块高度、出块时间计算
function blockInfo() {
    var json = { 'jsonrpc': '2.0', 'method': 'getblockcount', 'params': [], 'id': 1 };
    var str = JSON.stringify(json);
    $.ajax({
        type: 'POST',
        url: "http://seed2.neo.org:10332",
        data: str,
        success: function () {
            var html = template(document.getElementById('tableContent').innerHTML, dae);
            document.getElementById('tableList').innerHTML = html;
        },
        fail: function () {
            alert("fail");
        }
    });
}

//获取节点数据
function getListdata() {
    $.get("candidate/getvalidators", []).done(function (data) {
        var _list = JSON.parse(data);
        console.log(_list[3]);
        //共识个数
        $("#cannum").html(_list.length);
        
        //竞选个数
        var html = $("#tableList").html();
        for (var j in _list) {
            html += template('test', _list[j]);
        }
        document.getElementById('tableList').innerHTML = html;
    });
}

//图表数据展示
function showCharts(data) {
    var myChart = echarts.init(document.getElementById('main'));
    option = {
        backgroundColor: '#F9FBF2',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,1)',
            borderRadius: '2',
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
            right: '0',
            textStyle: {
                fontSize: 12,
                color: '#666666'
            }
        },
        grid: {
            left: '0',
            right: '0',
            bottom: '0',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#CCC',
                    opcity: '0.8'
                }
            },
            data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
        }],
        yAxis: [{
            type: 'value',
            name: '数量',
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
        }, {
            type: 'value',
            scale: true,
            name: 'KB',
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
            showSymbol: false,
            yAxisIndex: 0,
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
            data: [220, 182, 191, 134, 500, 120, 110, 125, 145, 122, 165, 122]
        }, {
            name: '区块大小',
            type: 'line',
            smooth: true,
            showSymbol: false,
            yAxisIndex: 1,
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
            data: [120, 110, 15, 120, 122, 165, 122, 220, 182, 191, 134, 150]
        }]
    };
    myChart.setOption(option);
}