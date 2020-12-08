var block_height = 0;
var send_url = "https://seed1.cityofzion.io:443";
var lastt = new Date(),conNum = 0;

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
            if (block_height !== data.result - 1) {
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
        if (conNum !== _list.length) {
            var flag = 0;
            $("#cannum").html(_list.length);
            for (var i = 0; i < _list.length; i++) {
                if (_list[i].Active) flag++;
            }
            $("#connum").html(flag);

            //竞选个数
            var html = "", html2 = "";

            for (var j in _list) {
                if (_list[j].Info !== null && _list[j].Info.Logo !== null)
                    _list[j].Info.Logo = _list[j].Info.Logo.replace("~", "");

                _list[j].Social = [];

                if (_list[j].Info !== null && _list[j].Info.SocialAccount !== null) {
                    var accountList = _list[j].Info.SocialAccount.split(';');
                    for (var k = 0; k < accountList.length-1; k++) {
                        var account = accountList[k].split(':');
                        var accountName = account[0].toLowerCase();

                        var socialDetail = {
                            name: accountName,
                            link: "https://" + accountName + ".com/" + account[1]
                        };

                        _list[j].Social.push(socialDetail);
                    }
                }

                console.log(_list[j])
                if (_list[j].Active) {
                    html += template('consensus', _list[j]);
                } else {
                    html2 += template('candidate', _list[j]);
                }
            }

            document.getElementById('conList').innerHTML = html;
            document.getElementById('canList').innerHTML = html2;
            conNum = _list.length;
        }
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
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,1)',
            borderRadius: '2',
            axisPointer: {
                lineStyle: {
                    color: '#00af92'
                }
            },
            textStyle: {
                fontWeight: '300',
                fontSize:'12',
                color: '#505050'
            }
        },
        legend: {
            icon: 'diamond',
            itemWidth: 14,
            itemHeight: 14,
            itemGap: 14,
            data: [tx_v, block_s],
            right:0,
            textStyle: {
                fontSize: 12,
                fontWeight: 100,
                color: ['#02e49b', '00af92']
            }
        },
        grid: {
            left: '0',
            right: '2',
            bottom: '0',
            top: '55',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                inside: false,
                textStyle: {
                    color: '#505050',
                    fontWeight: '300',
                    fontSize: '12',
                    lineHeight: '40'
                }
            },
            data: data.IndexList
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                margin: 30,
                textStyle: {
                    color: '#505050',
                    fontWeight: '300',
                    fontSize: '12',
                    lineHeight: '40'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#FFFFFF'
                }
            }
        }, {
            type: 'value',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                margin: 30,
                textStyle: {
                    color: '#505050',
                    fontWeight: '300',
                    fontSize: '12',
                    lineHeight: '40'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#FFFFFF'
                }
            }
        }],
        series: [{
            name: tx_v,
            type: 'line',
            showSymbol: false,
            yAxisIndex: 0,
            lineStyle: {
                normal: {
                    width: 1,
                    shadowColor: 'rgba(80,80,80,0.1)',
                    shadowBlur: 15,
                    shadowOffsetY: 30
                }
            },
            itemStyle: {
                normal: {
                    color: '#02e49b'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(2, 228, 155, 0.1)'
                    }, {
                        offset: 0.3,
                        color: '#fff'
                    }])
                }
            },
            data: data.TxCountList
        }, {
            name: block_s,
            type: 'line',
            showSymbol: false,
            yAxisIndex: 1,
            lineStyle: {
                normal: {
                    width: 1,
                    shadowColor: 'rgba(80,80,80,0.1)',
                    shadowBlur: 15,
                    shadowOffsetY: 30
                }
            },
            itemStyle: {
                normal: {
                    color: '#00af92'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(0, 175, 146, 0.1)'
                    }, {
                        offset: 0.3,
                        color: '#fff'
                    }])
                }
            },
            data: data.SizeList
        }]
    };
    window.onresize = myChart.resize;
    myChart.setOption(option);
}

