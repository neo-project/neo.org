var block_height = 0;
var send_url = "https://pyrpc2.narrative.org:443";
var lastt = new Date();

blockInfo();
getVolue();
getListdata();

setInterval(function () {
    blockInfo();
}, 1000);

//点击展开
function showDetail(ele) {
    ele.parents(".tr-con").next(".can-detail").toggle("fast");
}

//获取区块高度、出块时间计算
function blockInfo() {
    var json = { 'jsonrpc': '2.0', 'method': 'getblockcount', 'params': [], 'id': 1 };
    var str = JSON.stringify(json);
    countDown(lastt);
    $.ajax({
        type: 'POST',
        url: send_url,
        data: str,
        success: function (data) {
            if (block_height != data.result - 1) {
                lastt = new Date();
                block_height = data.result - 1;
                getListdata();
                $("#blohei").html(block_height);
            }
        },
        fail: function () {
            getSeed();
        }
    });
}

//倒计时函数
function countDown(time) {
    var _left = new Date() - time;
    if (_left >= 0) {
        var hh = parseInt(_left / 1000 / 60 / 60 % 24, 10);
        var mm = parseInt(_left / 1000 / 60 % 60, 10);
        var ss = parseInt(_left / 1000 % 60, 10);
    }
    if (_left < 600000) { $("#lastime").html(ss + "s"); }
    else if (_left < 3600000) { $("#lastime").html(mm + "m" + ss + "s"); }
    else { $("#lastime").html(hh + "h" + mm + "m" + ss + "s"); }
}


//获取节点数据
function getListdata() {
    $.get("../../consensus/getvalidators", []).done(function (data) {
        var _list = JSON.parse(data);
        var flag = 0;
        $("#cannum").html(_list.length);
        for (var i = 0; i < _list.length; i++) {
            if (_list[i].Active) flag++;
        }
        $("#connum").html(flag);

        //竞选个数
        var html = "";
        for (var j in _list) {
            html += template('test', _list[j]);
        }
        document.getElementById('tableList').innerHTML = html;
    });
}

//图表数据展示
function getVolue() {
    $.get("../../consensus/gettxcount", []).done(function (data) {
        var _list = JSON.parse(data);
        showCharts(_list);
    });
}
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
            data: [tx_v, block_s],
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
            data: data.IndexList
        }],
        yAxis: [{
            type: 'value',
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
            name: 'Byte',
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
            name: tx_v,
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
            data: data.TxCountList
        }, {
            name: block_s,
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
            data: data.SizeList
        }]
    };
    window.onresize = myChart.resize;
    myChart.setOption(option);
}

