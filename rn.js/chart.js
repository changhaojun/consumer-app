export const lineCharts = (dataX, dataY, toolTip, fontcolor, grid) => {
    const lineColor = '#3892e8';
    const thatGrid = grid ? grid : {
        x: 45,
        y: 20,
    };
    const formatter=(value)=>{
        const format=value.split(" ")[0]+"\n"+value.split(" ")[1]
       return  format
    }
    const Fontcolor = fontcolor ? fontcolor : '#ccc';
    const lineOption = {
        grid: thatGrid,
        xAxis: {
            type: 'category',
            data: dataX, //横坐标值
            axisLine: { //坐标轴样式
                show: true,
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(0,0,0,0.5)',
                    width: '1'
                },
            },
            splitLine: { //标网格样式
                show: true,
            },
            axisTick: { //刻度样式
                show: false
            },
            axisLabel: {       
                //     rich:{
                //         a:{
                //             color: 'red',
                //             lineHeight: 10
                //         }           
                //     },
                    // formatter:['{a|3}','{a|4}'].join('\n'),
        
                // width:100,
                //     height:100
                // align: 'center',
                // formatter: function(value) {
                //     return value.slice(5, value.length);
                // },
                rotate: 45
            },
        },
        tooltip: {
            trigger: 'axis',
            formatter: `{b0}<br />${toolTip.name}{c0}${toolTip.unit}`,
            axisPointer: { //坐标指示器
                type: 'line',
                color:"#3892e8",
                lineStyle: {
                    color: '#3892e8'
                }
            },
            backgroundColor: '#3994ea',
            textStyle: {
                color: '#fff'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: `{value} ${toolTip.unit}`,
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(0,0,0,0.5)',
                    width: '1'
                }
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false
            }
        },
        // dataZoom: {
        //     type: 'inside',
        //     start: 30,
        //     end: 100,
        // },
        series: [{
            data: dataY,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
                normal: {
                    color: '#3892e8',
                    radius: 10,
                    lineStyle: {
                        color: 'rgba(58,146,230,0.8)',
                        width: 12
                    }
                }
            },
            lineStyle: {
                normal: {
                    width: 2,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowBlur: 50,
                    shadowOffsetY: 10
                }
            },
            // markPoint: {
            //     symbol: 'circle',
            //     symbolSize: "18",
            //     data: [{
            //             type: 'max',
            //             name: '最大值'
            //         },
            //         {
            //             type: 'min',
            //             name: '最小值'
            //         }
            //     ],
            //     label: {
            //         color: Fontcolor,
            //         fontSize: 8
            //     }
            // }
        }]
    }
    return lineOption;
}