blockInfo();
getVolue();
getListdata();


var block_height = 0;
var seed_url;

seed_url = "http://seed2.neo.org:10332";

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
    $.ajax({
        type: 'POST',
        url: "http://seed2.neo.org:10332",
        data: str,
        success: function (data) {
            if (block_height != data.result - 1) {
                block_height = data.result - 1;
                blockTime(block_height);
                $("#blohei").html(block_height);
            } else {
                console.log("倒计时计算函数");
            }
        },
        fail: function () {
            alert("fail");
        }
    });
}

//获取时间
function blockTime(height) {
    var json = { 'jsonrpc': '2.0', 'method': 'getblock', 'params': [height,1], 'id': 1 };
    var str = JSON.stringify(json);
    $.ajax({
        type: 'POST',
        url: "http://seed2.neo.org:10332",
        data: str,
        success: function (data) {
            $("#lastime").html(data.result.time);
        },
        fail: function () {
            alert("fail");
        }
    });
}

//根据时间倒计时


//获取节点数据
function getListdata() {
    $.get("../../candidate/getvalidators", []).done(function (data) {
        var _list = JSON.parse(data);
        var flag = 0;
        $("#cannum").html(_list.length);
        for (var i = 0; i < _list.length; i++) {
            if (_list[i].Active) flag++;
        }
        $("#connum").html(flag);
        
        //竞选个数
        var html = $("#tableList").html();
        for (var j in _list) {
            html += template('test', _list[j]);
        }
        document.getElementById('tableList').innerHTML = html;
    });
}

//图表数据展示
function getVolue(){
    $.get("../../candidate/gettxcount", []).done(function (data) {
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
            data: data.IndexList
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
            data: data.TxCountList
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
            data: data.SizeList
        }]
    };
    myChart.setOption(option);
}