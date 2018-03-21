statistic();
function statistic() {
    $.ajax({
        type: "GET",
        url: "js/statistic.json" + "?v=" + Math.random(),
        dataType: "json",
        success: function (data) {
            $("#total").text(data.Total);
            $("#deadline").text(data.Deadline);

            var myChart = echarts.init(document.getElementById('histogram'));
            var option = {
                tooltip: { trigger: 'axis' },
                xAxis: {
                    data: [data.List[0].name,
                    data.List[1].name,
                    data.List[2].name,
                    data.List[3].name,
                    data.List[4].name]
                },
                yAxis: {},
                series: [{
                    type: 'bar',
                    barCategoryGap: '60%',
                    itemStyle: {
                        normal: {
                            color: '#30b900'
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: '#30b900' },
                                    { offset: 1, color: '#cbff10' }
                                ]
                            )
                        }
                    },
                    data: [data.List[0].value,
                    data.List[1].value,
                    data.List[2].value,
                    data.List[3].value,
                    data.List[4].value]
                }]
            };
            myChart.setOption(option);

            var dom = document.getElementById("map");
            var myChar = echarts.init(dom);
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return params.value ? params.name + " : " + params.value : params.name + " : 0";
                    }
                },
                dataRange: {
                    min: 0,
                    max: data.List[0].value,
                    x: 'left',
                    y: 'bottom',
                    text: [data.List[0].value, '0'],
                    calculable: false,
                    splitNumber: 0,
                    color: ['#30b900', '#abd703']
                },
                series: [{
                    type: 'map',
                    mapType: 'world',
                    roam: true,
                    itemStyle: {
                        normal: {
                            borderColor: '#999'
                        },
                        emphasis: {
                            areaColor: '#30b900'
                        }
                    },
                    grid: {
                        right: 40,
                        top: 100,
                        bottom: 40,
                        width: '30%'
                    },
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    data: data.List
                }
                ]
            };
            if (option && typeof option === "object") {
                myChar.setOption(option, true);
            }
        }
    });
}

