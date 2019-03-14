import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image, FlatList, TouchableOpacity,AsyncStorage,StatusBar, Alert} from 'react-native';
import { Button } from 'react-native-material-ui';
import { PullView } from 'react-native-pull';
import { Echarts,echarts } from 'react-native-secharts';
import { lineCharts } from './../chart';
import moment from 'moment';
const { width, height } = Dimensions.get('window');
// import $http from './../Axios';
import Devices from './devices/devices';
import Main from '../main'
import Url from '../apiurl'
export default class Lanyue extends Component{
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            username: '',
            heat_user_id:'',
            temperature: '--',  //温度
            temperature_unit: '',
            humidity: '--',  // 湿度
            humidity_unit: '',
            airDatas: [],
            buttons: [],
            pullTxt: '刷新中...',
            tabIndex: 0,
            timeIndex: 0,
            lineOptions: {},
            times: [
                {name: '今天',start: new Date(new Date().toLocaleDateString()).getTime(), end: Date.now().toString()},
                {name: '一周',start: moment(Date.now()).subtract(1, 'weeks') + '', end: Date.now().toString()}
            ],

            textContent: ''
        }
        this.onPullRelease = this.onPullRelease.bind(this);
        this.topIndicatorRender = this.topIndicatorRender.bind(this);
        AsyncStorage.getItem("heatUserId", async (errs, result) => {
            this.state.heat_user_id=result
            this.getDevices();
            
        })
        AsyncStorage.getItem("userName", (errs, result) => {
            this.setState({
                username:result
            })

         })
    }

    topIndicatorRender(pulling, pullok, pullrelease) {
        const hide = {position: 'absolute', left: 10000};
        const show = {position: 'relative', left: 0};
        setTimeout(() => {
            if (pulling) {
                this.txtPulling && this.txtPulling.setNativeProps({style: show});
                this.txtPullok && this.txtPullok.setNativeProps({style: hide});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: hide});
            } else if (pullok) {
                this.txtPulling && this.txtPulling.setNativeProps({style: hide});
                this.txtPullok && this.txtPullok.setNativeProps({style: show});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: hide});
            } else if (pullrelease) {
                this.txtPulling && this.txtPulling.setNativeProps({style: hide});
                this.txtPullok && this.txtPullok.setNativeProps({style: hide});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: show});
            }
        }, 1);
		    return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 100, backgroundColor: '#3A8FE9'}}>
                <ActivityIndicator size="small" color="#cccccc" style={{marginTop:50}}/>
                <Image source={require('./../image/LOGO_s.png')} style={{resizeMode:"contain",width:60,height:60,position:"absolute",bottom:10,left:20}}/>
                <Image source={require('./../image/tip_bg.png')} style={{width: 220, height: 24,position:"absolute",top:25,left:70,resizeMode:"contain"}}/>
                <Text style={{color: '#c1d4f4',position:"absolute",top:25,left:75,fontSize:12,lineHeight:22}}>tips:左右滑动图表可查看更多数据哦~</Text>
                <Text ref={(c) => {this.txtPulling = c;}} style={{lineHeight:180,marginTop:50, color:'#cccccc'}}>下拉刷新</Text>
                <Text ref={(c) => {this.txtPullok = c; }} style={{lineHeight:180,marginTop:50, color:'#cccccc'}}>松开即可刷新</Text>
                <Text ref={(c) => {this.txtPullrelease = c;}} style={{lineHeight:180,marginTop:50, color:'#cccccc'}}>{this.state.pullTxt}</Text>
    		</View>
        );
    }

    onPullRelease(resolve) {
        this.getDevices();
        this.getHistoryData();
        this.setState({
            pullTxt: '刷新成功'
        })
        setTimeout(() => {
            resolve();
        }, 1000);
    }

    render() {
        const {airDatas, buttons,times} = this.state;
        return(
            <View style={{flex:1,width:width,backgroundColor: "#fff",}}>
                <StatusBar barStyle="light-content" backgroundColor={'#3994ea'}/>
                <PullView style={{width: width}} onPullRelease={this.onPullRelease} topIndicatorRender={this.topIndicatorRender} topIndicatorHeight={100}>
                    <View style={styles.dataView}>
                        <Image source={require('./../image/home_bg.png')} style={{resizeMode:"stretch",width:width,height:360,position:"absolute",top:-50}} />
                        <View style={{height:70}}>
                            <Text style={{color:'#fff',fontSize:24}}>{this.state.username}的家</Text>
                            <Text style={{color:'#c1d4f4',fontSize:16}}>
                                欢迎回来~
                                {/* <Text style={{fontFamily:'iconfont'}}>&#xea2f;</Text> */}
                            </Text>
                        </View>
                        <View style={{height:120,flexDirection:'row'}}>
                            <View style={{flex:1}}>
                                <View style={{flexDirection:'row',marginLeft:30}}>
                                    <Text style={{fontSize:50,fontWeight:'bold',color:'#fff'}}>{this.state.temperature}</Text>
                                    <Text style={{color:'#ccc',fontSize:15,marginTop:10}}>{this.state.temperature_unit}</Text>
                                </View>
                                <View style={{flexDirection:'row',marginLeft:10}}>
                                    <Text style={{fontFamily:'iconfont',color:'#fff',fontSize:16}}>&#xe88c;</Text>
                                    <Text style={{marginLeft:10,fontSize:16,color:'#fff',lineHeight:20}}>室内温度</Text>
                                </View>
                            </View>
                            <View style={{flex:1}}>
                                <View style={{flexDirection:'row',marginLeft:30}}>
                                    <Text style={{fontSize:50,fontWeight:'bold',color:'#fff'}}>{this.state.humidity}</Text>
                                    <Text style={{color:'#ccc',marginTop:10}}>{this.state.humidity_unit}</Text>
                                </View>
                                <View style={{flexDirection:'row',marginLeft:10}}>
                                    <Text style={{fontFamily:'iconfont',color:'#fff',fontSize:20}}>&#xea2f;</Text>
                                    <Text style={{marginLeft:10,fontSize:16,color:'#fff',lineHeight:20}}>空气湿度</Text>
                                </View>
                                <View style={{width:100,height:4,backgroundColor:'#0e57af',borderRadius:2,marginLeft:30,marginTop:10,position:'relative'}}>
                                    <View style={{position:'absolute',height:4,width:100 * this.state.humidity / 100,backgroundColor:'#fbc701',borderRadius:2}}></View>
                                </View>
                            </View>
                        </View>
                        {/* <View style={{height:100,flexDirection:'row',marginTop:0}}>
                            {
                                airDatas.map((item) => {
                                    return (<View style={styles.assistData} key={item.tag_name}>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{color:'#fff',fontSize: 24}}>{item.data_value === null ? '--' : item.data_value}</Text>
                                            <Text style={{color:'#ccc',fontSize: 10}}>{item.tag_unit}</Text>
                                        </View>
                                        <Text style={{color:'#fff'}}>{item.tag_name}</Text>
                                        <View style={styles.rightLine}></View>
                                    </View>)
                                })
                            }
                        </View> */}
                    </View>
                    <View>
                        {
                            (buttons.length>0 && times.length>0) ?
                                <View style={styles.charView}>
                                    <View style={{height:100,flexDirection:'row'}}>
                                        {
                                            buttons.map((item, index) => {
                                                return(
                                                    <TouchableOpacity activeOpacity={0.9} style={{flex:1, alignItems:'center'}} key={item.tag_name} onPress={() => this.onTabBtnPress(index)}>
                                                        <View>
                                                            <View style={index === this.state.tabIndex ? styles.tabButtonSelect : styles.tabButton}>
                                                                <Text style={index === this.state.tabIndex ? styles.tabBtnIconSelect : styles.tabBtnIcon}>{item.icon}</Text>
                                                            </View>
                                                            <Text style={index === this.state.tabIndex ? styles.tabBtnTxtSelect : styles.tabBtnTxt}>{item.tag_name}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                    <View style={{height:50,flexDirection:'row-reverse'}}>
                                        {
                                            times.map((item, index) => {
                                                return(
                                                    <Button
                                                        key={'key'+index}
                                                        text={item.name}
                                                        style={{
                                                            container:{borderRadius:18,height:36,width:70,backgroundColor:index === this.state.timeIndex ? "#3994ea" : '#FFF',marginRight:20,borderColor:index === this.state.timeIndex ? "#3994ea" : '#ccc',borderWidth:1},
                                                            text:{color:this.state.timeIndex === index ? '#fff' : '#3994ea'}
                                                        }}
                                                        onPress={()=>this.setDataTime(index)}
                                                    />
                                                )
                                            })
                                        }
                                    </View>
                                    <View style={{height:230,width:width,paddingLeft:10}}>
                                        <Echarts option={this.state.lineOptions} height={220} width={width} />
                                    </View>
                                </View> : <Text>暂无数据</Text>
                        }
                    </View>
                </PullView>
            </View>
        )
    }

    async componentWillMount() {
        
    }
    async getDevices() {
        var uri =  `${Url.uri}/device?heat_user_id=${this.state.heat_user_id}&device_type=1` 
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
                if(responseJson.result.rows.length === 0) {
                    this.setState({textContent: '暂无数据'});
                    Alert.alert(
                        '提示',
                        '暂无数据',
                        [
                            {text: '确定'}
                        ]
                    )
                    // Alert.alert(
                    //     '温馨提示',
                    //     '您暂未绑定设备，是否前去绑定？',
                    //     [
                    //         { text: '取消', onPress: () => { } },
                    //         { text: '确定', onPress: () => { 
                    //             this.props.navigator.push({
                    //                 name: 'Main',
                    //                 component: Main,
                    //                 passProps:{
                    //                     active :"devices",
                    //                     centerComponent:Devices
                    //                 }
                    //             })
                    //         } }
                    //     ]
                    // );
                }else {
                    AsyncStorage.setItem("deviceSn", `${responseJson.result.rows[0].device_sn}`, function (errs) { });
                    const temperature = responseJson.result.rows[0].dataList.find(item => item.tag_name === '室内温度');
                    const humidity = responseJson.result.rows[0].dataList.find(item => item.tag_name === '湿度');
                    if(temperature) {
                        this.setState({
                            temperature: temperature.data_value === null ? '--' : temperature.data_value.toString(),
                            temperature_unit: temperature.tag_unit
                        })
                    }
                    if(humidity) {
                        this.setState({
                            humidity: humidity.data_value === null ? '--' : humidity.data_value.toString(),
                            humidity_unit: humidity.tag_unit
                        })
                    }
                    for (const data of responseJson.result.rows[0].dataList) {
                        switch (data.tag_name) {
                            case '室内温度':
                                data.icon = <Text style={{fontFamily:'iconfont'}}>&#xe88c;</Text>;
                                break;
                            case '湿度':
                                data.icon = <Text style={{fontFamily:'iconfont'}}>&#xea2f;</Text>;
                                break;
                            case '甲醛':
                                data.icon = <Text style={{fontFamily:'iconfont'}}>&#xe605;</Text>;
                                break;
                            case '总挥发性有机物':
                                data.icon = <Text style={{fontFamily:'iconfont'}}>&#xe609;</Text>;
                                break;
                            case 'PM25':
                                data.icon = <Text style={{fontFamily:'iconfont'}}>&#xe60a;</Text>;
                                break;
                            default:
                                break;
                        }
                    }
                    console.log( responseJson.result.rows[0].dataList)
                    this.setState({
                        buttons: responseJson.result.rows[0].dataList
                    },()=>{
                        this.getHistoryData();
                    })
                }
          })
          .catch((error) => {
            console.error(error);
          });
    }
    onTabBtnPress(index) {
        this.setState({
            tabIndex: index
        })
        setTimeout(() => {
            this.getHistoryData()
        },10);
    }
    async setDataTime(index) {
        this.setState({
            timeIndex: index
        })
        setTimeout(() => {
            this.getHistoryData()
        },10);
    }
    async getHistoryData() {
        const {times, buttons, timeIndex, tabIndex} = this.state;
        const { start, end } = times[timeIndex];
        console.log(this.state.buttons)
        const { data_id } = this.state.buttons[tabIndex];
        var uri =  `${Url.uri}/datas/history?data_id=${data_id}&start_time=${moment(Number(start)).format('YYYY-MM-DD HH:mm:ss')}&end_time=${moment(Number(end)).format('YYYY-MM-DD HH:mm:ss')}` 
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.result) {
                const dataX = responseJson.result.times;
                const dataY = responseJson.result.datas;
                const tootip = {
                    name: buttons[tabIndex].tag_name,
                    unit:''
                }
                let opt = lineCharts(dataX,dataY,tootip, '#ccc');
                this.setState({
                    lineOptions : opt,
                })
            }
            else {
              Alert.alert(
                '提示',
                '暂无数据'
              )
            }
          })
          .catch((error) => {
            console.error(error);
          });
    }
}

const styles = StyleSheet.create({
    dataView: {
        width:width,
        height:300,
        paddingLeft: 20,
        paddingTop: 20,
        backgroundColor: "#fff",
    },
    assistData: {
        flex:1,
        paddingLeft: 10,
        position:'relative'
    },
    rightLine:{
        position: 'absolute',
        width:1,
        height: 30,
        backgroundColor: '#5c8ce0',
        right:0,
        top: 10
    },
    charView: {
        width:width,
      
    },
    tabButton:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        shadowOffset: {width: 0, height: 5},
        elevation: 4,
        alignSelf: 'center',
    },
    tabButtonSelect: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#3a94ea',
        shadowOffset: {width: 0, height: 5},
        elevation: 4,
        alignSelf: 'center',
    },
    tabBtnIcon: {
        color: '#808080',
        fontSize: 22,
        alignSelf: 'center',
        lineHeight: 50
    },
    tabBtnIconSelect: {
        color: '#fff',
        fontSize: 24,
        alignSelf: 'center',
        lineHeight: 50
    },
    tabBtnTxt:{
        marginTop: 3,
        color: '#8f9094',
        alignSelf: 'center',
    },
    tabBtnTxtSelect: {
        marginTop: 3,
        color: '#3a94ea',
        alignSelf: 'center',
    }
})